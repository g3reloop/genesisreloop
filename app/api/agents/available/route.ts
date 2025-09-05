import { NextRequest, NextResponse } from 'next/server'
import { AGENTS, type AgentType } from '@/lib/agents/agent-constants'

export async function GET(request: NextRequest) {
  try {
    // Get available agents based on user role (for now return all)
    const availableAgents = Object.entries(AGENTS).map(([type, agent]) => ({
      type: type as AgentType,
      agent: {
        name: agent.name,
        description: agent.description,
        requiredRoles: agent.requiredRoles,
      },
    }))

    return NextResponse.json(availableAgents)
  } catch (error: any) {
    console.error('Error fetching available agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available agents' },
      { status: 500 }
    )
  }
}
