import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export const handler: Handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Verify webhook signature if secret is configured
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = event.headers['x-webhook-signature'];
    if (!signature || !verifySignature(event.body || '', signature, webhookSecret)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { type, data } = payload;

    // Handle different webhook types
    switch (type) {
      case 'iot.reading':
        // Store IoT reading
        const { error: iotError } = await supabase
          .from('IoTReading')
          .insert({
            batchId: data.batchId,
            sensorId: data.sensorId,
            readingType: data.type,
            value: data.value,
            unit: data.unit,
          });
        
        if (iotError) throw iotError;
        
        // Update batch data if temperature or fat content
        if (data.type === 'TEMPERATURE' || data.type === 'FAT_PERCENTAGE') {
          const updateData: any = {};
          if (data.type === 'TEMPERATURE') updateData.temperature = data.value;
          if (data.type === 'FAT_PERCENTAGE') updateData.fatContent = data.value;
          
          await supabase
            .from('FeedstockBatch')
            .update(updateData)
            .eq('id', data.batchId);
        }
        break;

      case 'payment.completed':
        // Handle payment completion
        const { error: subError } = await supabase
          .from('Subscription')
          .update({ 
            status: 'ACTIVE',
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', data.subscriptionId);
        
        if (subError) throw subError;
        
        // Send notification
        await supabase.from('Notification').insert({
          userId: data.userId,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Received',
          message: 'Your subscription has been activated.',
          data: { subscriptionId: data.subscriptionId },
        });
        break;

      case 'compliance.update':
        // Update compliance document
        const { error: compError } = await supabase
          .from('ComplianceDocument')
          .insert({
            processedBatchId: data.batchId,
            documentType: data.documentType,
            documentUrl: data.url,
            isValid: data.isValid,
            expiryDate: data.expiryDate,
          });
        
        if (compError) throw compError;
        break;

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Unknown webhook type' }),
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
