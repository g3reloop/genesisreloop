// Client-safe agent service that uses API routes instead of direct OpenAI calls
import type { AgentType } from './agent-constants'

export interface ChatResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface AgentInfo {
  type: AgentType
  agent: {
    name: string
    description: string
    requiredRoles: string[]
  }
}

export const agentServiceClient = {
  async getAvailableAgents(userId?: string): Promise<AgentInfo[]> {
    try {
      const response = await fetch('/api/agents/available', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch available agents')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching available agents:', error)
      return []
    }
  },

  async chat(
    agentType: AgentType,
    message: string,
    context?: {
      userId?: string
      userRole?: string
      businessType?: string
    }
  ): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentType,
          message,
          context,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to chat with agent')
      }

      return await response.json()
    } catch (error: any) {
      console.error('Error chatting with agent:', error)
      throw new Error(error.message || 'Failed to chat with agent')
    }
  },

  async logUsage(
    agentType: AgentType,
    userId: string,
    tokens: {
      prompt: number
      completion: number
      total: number
    }
  ): Promise<void> {
    try {
      await fetch('/api/agents/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentType,
          userId,
          tokens,
        }),
      })
    } catch (error) {
      console.error('Error logging usage:', error)
    }
  },
}

// Check if OpenRouter is configured (client-safe)
export function isConfigured(): boolean {
  // This will be determined by the API response
  return true // Placeholder
}
