import { NextRequest, NextResponse } from 'next/server'
import { chatWithAgent } from '@/lib/agents/agent-service-api'
import type { AgentType } from '@/lib/agents/agent-constants'

export async function POST(request: NextRequest) {
  try {
    const { agentType, message, context } = await request.json()

    if (!agentType || !message) {
      return NextResponse.json(
        { error: 'Agent type and message are required' },
        { status: 400 }
      )
    }

    // Call the simplified agent service (server-side only, no Supabase)
    const response = await chatWithAgent(
      agentType as AgentType,
      message,
      context
    )

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error in agent chat:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to chat with agent' },
      { status: 500 }
    )
  }
}
