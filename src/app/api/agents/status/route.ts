import { NextRequest, NextResponse } from 'next/server'
import { AgentStatusResponse } from '@/types/agents'

// Mock agent registry - in production this would be managed by a service
const AGENT_REGISTRY = [
  'FeedstockMatcher',
  'TraceBot', 
  'RouteGen',
  'BuyerDiscoveryBot',
  'ByproductMatcher',
  'CarbonVerifier',
  'ComplianceClerk',
  'ReputationBot'
]

export async function GET(request: NextRequest) {
  try {
    // In production, this would query actual agent status from database/queue
    const agents = await Promise.all(
      AGENT_REGISTRY.map(async (name) => {
        // Mock status - in production, fetch from agent heartbeat table
        const status = Math.random() > 0.9 ? 'degraded' : 'healthy'
        const queueDepth = Math.floor(Math.random() * 50)
        const avgLatency = Math.floor(Math.random() * 1000) + 100
        const processed = Math.floor(Math.random() * 5000)
        const failed = Math.floor(Math.random() * 50)
        
        return {
          name,
          status,
          queueDepth,
          avgLatency,
          lastHeartbeat: new Date(),
          processed,
          failed,
          errorRate: processed > 0 ? failed / processed : 0,
          recentJobs: [],
          config: {}
        }
      })
    )

    const overallHealth = agents.every(a => a.status === 'healthy') ? 'healthy' :
      agents.some(a => a.status === 'offline') ? 'offline' : 'degraded'

    const response: AgentStatusResponse = {
      agents,
      overallHealth: overallHealth as any
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching agent status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent status' },
      { status: 500 }
    )
  }
}

// Admin endpoint to control agents
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent, action } = body

    // Verify admin auth (simplified)
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production, validate token and check admin role
    
    switch (action) {
      case 'restart':
        // Trigger agent restart
        console.log(`Restarting agent: ${agent}`)
        break
      case 'pause':
        // Pause agent processing
        console.log(`Pausing agent: ${agent}`)
        break
      case 'resume':
        // Resume agent processing
        console.log(`Resuming agent: ${agent}`)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true, agent, action })
  } catch (error) {
    console.error('Error controlling agent:', error)
    return NextResponse.json(
      { error: 'Failed to control agent' },
      { status: 500 }
    )
  }
}
