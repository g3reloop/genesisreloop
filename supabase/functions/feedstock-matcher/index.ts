// Supabase Edge Function: FeedstockMatcher Agent
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchRequest {
  batchId: string;
  urgency?: 'high' | 'normal' | 'low';
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { batchId, urgency = 'normal' } = await req.json() as MatchRequest;

    // Get batch details
    const { data: batch, error: batchError } = await supabaseClient
      .from('FeedstockBatch')
      .select(`
        *,
        supplier:Supplier(*)
      `)
      .eq('id', batchId)
      .single();

    if (batchError || !batch) {
      throw new Error('Batch not found');
    }

    // Find suitable processors based on:
    // 1. Processing capacity
    // 2. Location proximity
    // 3. Feedstock type compatibility
    // 4. Current queue status
    const { data: processors, error: procError } = await supabaseClient
      .from('Processor')
      .select('*')
      .eq('processorType', batch.feedstockType === 'UCO' ? 'BIODIESEL' : 'BIOGAS')
      .gte('capacity', batch.quantity / 1000); // Convert kg to tons

    if (procError || !processors || processors.length === 0) {
      throw new Error('No suitable processors found');
    }

    // Score and rank processors
    const scoredProcessors = processors.map(processor => {
      let score = 100;
      
      // Priority for SRL batches
      if (batch.loopType === 'SRL') {
        score += 50;
      }
      
      // Urgency modifier
      if (urgency === 'high') score += 30;
      if (urgency === 'low') score -= 20;
      
      // Random factor for load distribution
      score += Math.random() * 20;
      
      return { ...processor, score };
    });

    // Sort by score
    scoredProcessors.sort((a, b) => b.score - a.score);
    
    // Select top processor
    const selectedProcessor = scoredProcessors[0];

    // Create collection record
    const { data: collection, error: collError } = await supabaseClient
      .from('Collection')
      .insert({
        batchId: batchId,
        supplierId: batch.supplierId,
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Next day
        status: 'SCHEDULED',
      })
      .select()
      .single();

    if (collError) {
      throw collError;
    }

    // Update batch status
    await supabaseClient
      .from('FeedstockBatch')
      .update({ status: 'ASSIGNED' })
      .eq('id', batchId);

    // Log agent activity
    await supabaseClient
      .from('AgentActivity')
      .insert({
        agentName: 'FeedstockMatcher',
        action: 'match_batch',
        inputData: { batchId, urgency },
        outputData: { 
          processorId: selectedProcessor.id,
          collectionId: collection.id,
          score: selectedProcessor.score 
        },
        success: true,
        duration: Date.now() - new Date().getTime(),
      });

    return new Response(
      JSON.stringify({
        success: true,
        processorId: selectedProcessor.id,
        collectionId: collection.id,
        scheduledTime: collection.scheduledTime,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // Log error
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabaseClient
      .from('AgentActivity')
      .insert({
        agentName: 'FeedstockMatcher',
        action: 'match_batch',
        inputData: await req.json().catch(() => ({})),
        outputData: {},
        success: false,
        error: error.message,
        duration: 0,
      });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
