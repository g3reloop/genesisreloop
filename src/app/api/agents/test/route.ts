import { NextRequest, NextResponse } from 'next/server';
import { FeedstockMatcher } from '@/lib/agents/feedstock-matcher';
import { isOpenRouterConfigured } from '@/lib/openrouter';
import type { FeedstockLot, AgentJob } from '@/types/agents';

export async function POST(req: NextRequest) {
  try {
    // Check if OpenRouter is configured
    if (!isOpenRouterConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'OpenRouter not configured. Please add your OPENROUTER_API_KEY to .env.local'
      }, { status: 500 });
    }

    // Get test parameters from request
    const body = await req.json();
    const { agent = 'feedstock-matcher', testData } = body;

    // Test data for feedstock matcher
    const defaultTestLot: FeedstockLot = {
      id: 'test-lot-001',
      type: 'UCO',
      volume: 500,
      unit: 'kg',
      location: {
        lat: 50.8275,
        lng: -0.1416,
        address: 'Brighton City Centre',
        name: 'Test Restaurant'
      },
      windowStart: new Date(),
      windowEnd: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      collectionDate: new Date(),
      supplierId: 'test-supplier-001',
      srlHint: true,
      createdAt: new Date(),
      qualityMetrics: {
        ffa: 2.5,
        moisture: 0.5,
        contamination: 0.1
      }
    };

    const lotData = testData || defaultTestLot;

    // Run the agent based on type
    let result;
    
    switch (agent) {
      case 'feedstock-matcher':
        const matcher = new FeedstockMatcher();
        const job: AgentJob = {
          id: 'test-job-001',
          agent: 'FeedstockMatcher',
          payload: lotData,
          status: 'pending',
          attempts: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        result = await matcher.process(job);
        break;
      
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown agent: ${agent}`
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      agent,
      result,
      message: 'Agent test completed successfully',
      aiEnabled: true
    });

  } catch (error: any) {
    console.error('Agent test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Agent test failed',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// GET endpoint to check agent status
export async function GET(req: NextRequest) {
  const configured = isOpenRouterConfigured();
  
  return NextResponse.json({
    openRouterConfigured: configured,
    availableAgents: [
      {
        name: 'feedstock-matcher',
        description: 'Matches waste feedstock with processors using AI-enhanced scoring',
        aiEnabled: configured
      },
      {
        name: 'carbon-verifier',
        description: 'Verifies carbon credits and impact calculations',
        aiEnabled: configured
      },
      {
        name: 'route-optimizer',
        description: 'Optimizes collection routes for efficiency',
        aiEnabled: configured
      },
      {
        name: 'compliance-clerk',
        description: 'Ensures regulatory compliance and documentation',
        aiEnabled: configured
      },
      {
        name: 'reputation-bot',
        description: 'Calculates and maintains reputation scores',
        aiEnabled: configured
      }
    ],
    testEndpoint: '/api/agents/test',
    exampleRequest: {
      method: 'POST',
      body: {
        agent: 'feedstock-matcher',
        testData: {
          // Optional - uses default test data if not provided
        }
      }
    }
  });
}
