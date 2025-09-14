import { createChatCompletion, isOpenRouterConfigured, MODEL_PRESETS, TEMPERATURE_PRESETS } from '@/lib/openrouter'
import type { ChatCompletionMessageParam } from '@/lib/openrouter'
import { createBrowserClient } from '@supabase/ssr'

export interface AgentContext {
  userId?: string
  userRole?: 'supplier' | 'processor' | 'buyer' | 'admin'
  businessType?: string
  location?: { lat: number; lng: number; address: string }
  additionalData?: Record<string, any>
}

export interface AgentResponse {
  content: string
  agentType: string
  timestamp: string
  model?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  error?: string
}

// Agent configurations
export const AGENTS = {
  feedstock_matcher: {
    name: 'Feedstock Matcher',
    description: 'Intelligently matches waste suppliers with processors',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.deterministic,
    requiredRoles: ['supplier', 'processor', 'admin'],
    systemPrompt: `You are the Genesis Reloop Feedstock Matching Agent. Your role is to intelligently match waste suppliers with processors based on waste type, quantity, location, and processing capabilities. Consider sustainability factors, logistics efficiency, and circular economy principles in your matching recommendations.

Key responsibilities:
- Analyze waste material properties and quantities
- Match with appropriate processors based on capabilities
- Consider geographical proximity and logistics
- Prioritize sustainability and circular economy principles
- Provide clear reasoning for matches`
  },
  
  traceability_tracker: {
    name: 'Traceability Tracker',
    description: 'Tracks materials through the circular economy loop',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.deterministic,
    requiredRoles: ['supplier', 'processor', 'buyer', 'admin'],
    systemPrompt: `You are the Genesis Reloop Traceability Agent. You track and verify the lifecycle of materials through the circular economy loop. Ensure transparency, maintain chain of custody records, and provide insights on material flow patterns.

Key responsibilities:
- Track material origin and transformations
- Maintain chain of custody records
- Verify sustainability claims
- Provide transparency reports
- Identify bottlenecks in material flows`
  },
  
  route_optimizer: {
    name: 'Route Optimizer',
    description: 'Optimizes collection and delivery routes',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.deterministic,
    requiredRoles: ['supplier', 'processor', 'admin'],
    systemPrompt: `You are the Genesis Reloop Route Optimization Agent. Calculate the most efficient collection and delivery routes considering factors like distance, traffic patterns, vehicle capacity, carbon emissions, and time windows. Prioritize sustainability while maintaining operational efficiency.

Key responsibilities:
- Calculate optimal routes for collections and deliveries
- Consider vehicle capacity and time windows
- Minimize carbon emissions
- Account for traffic patterns and road conditions
- Provide alternative route options`
  },
  
  byproduct_matcher: {
    name: 'Byproduct Matcher',
    description: 'Identifies valuable secondary materials and matches with buyers',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.balanced,
    requiredRoles: ['processor', 'buyer', 'admin'],
    systemPrompt: `You are the Genesis Reloop Byproduct Matching Agent. Identify valuable secondary materials and match them with potential buyers. Consider material properties, quality standards, market demand, and circular economy opportunities.

Key responsibilities:
- Analyze byproduct properties and potential uses
- Match with suitable buyers or applications
- Consider quality requirements and standards
- Identify new market opportunities
- Promote cascading use of materials`
  },
  
  buyer_discovery: {
    name: 'Buyer Discovery',
    description: 'Helps find new markets for recycled materials',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.creative,
    requiredRoles: ['processor', 'admin'],
    systemPrompt: `You are the Genesis Reloop Buyer Discovery Agent. Help processors find new markets for their recycled materials. Analyze buyer requirements, match quality specifications, and identify emerging market opportunities in the circular economy.

Key responsibilities:
- Research potential buyers for recycled materials
- Match material specifications with buyer requirements
- Identify emerging market trends
- Suggest product development opportunities
- Connect circular economy loops`
  },
  
  carbon_verification: {
    name: 'Carbon Verification',
    description: 'Calculates and verifies carbon credits',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.deterministic,
    requiredRoles: ['supplier', 'processor', 'buyer', 'admin'],
    systemPrompt: `You are the Genesis Reloop Carbon Verification Agent. Calculate and verify carbon credits from waste diversion activities. Use established methodologies, ensure accuracy, and provide transparent reporting for carbon market integration.

Key responsibilities:
- Calculate carbon emissions avoided
- Verify carbon credit claims
- Apply recognized methodologies (e.g., Gold Standard, Verra)
- Provide transparent calculation breakdowns
- Track carbon credit generation over time`
  },
  
  compliance_checker: {
    name: 'Compliance Checker',
    description: 'Ensures regulatory compliance',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.deterministic,
    requiredRoles: ['supplier', 'processor', 'admin'],
    systemPrompt: `You are the Genesis Reloop Compliance Agent. Ensure all activities meet regulatory requirements for waste handling, recycling, and circular economy operations. Stay updated on regulations and provide guidance on compliance matters.

Key responsibilities:
- Check compliance with waste regulations
- Verify licensing and certifications
- Provide regulatory guidance
- Alert to compliance risks
- Suggest corrective actions`
  },
  
  reputation_scorer: {
    name: 'Reputation Scorer',
    description: 'Evaluates participant performance and reliability',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.deterministic,
    requiredRoles: ['admin'],
    systemPrompt: `You are the Genesis Reloop Reputation Agent. Evaluate and score participants based on their performance, reliability, sustainability practices, and contribution to the circular economy. Maintain fair and transparent scoring.

Key responsibilities:
- Analyze transaction history and performance
- Evaluate sustainability practices
- Score reliability and consistency
- Consider community feedback
- Provide improvement recommendations`
  },
  
  dynamic_pricing: {
    name: 'Dynamic Pricing',
    description: 'Suggests optimal pricing based on market conditions',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.balanced,
    requiredRoles: ['supplier', 'processor', 'admin'],
    systemPrompt: `You are the Genesis Reloop Dynamic Pricing Agent. Analyze market conditions, supply and demand patterns, material quality, and sustainability factors to suggest optimal pricing for materials in the circular economy marketplace.

Key responsibilities:
- Analyze current market prices
- Consider supply and demand dynamics
- Factor in material quality and processing costs
- Include sustainability premiums
- Provide pricing recommendations with rationale`
  },
  
  predictive_supply: {
    name: 'Predictive Supply',
    description: 'Forecasts material availability',
    model: MODEL_PRESETS.advanced,
    temperature: TEMPERATURE_PRESETS.balanced,
    requiredRoles: ['processor', 'buyer', 'admin'],
    systemPrompt: `You are the Genesis Reloop Predictive Supply Agent. Forecast future waste generation patterns and material availability using historical data, seasonal trends, and market indicators. Help participants plan their operations effectively.

Key responsibilities:
- Analyze historical supply patterns
- Identify seasonal and cyclical trends
- Consider external market factors
- Provide supply forecasts with confidence intervals
- Suggest inventory planning strategies`
  },
  
  insurance_calculator: {
    name: 'Insurance Calculator',
    description: 'Assesses risks and suggests insurance coverage',
    model: MODEL_PRESETS.balanced,
    temperature: TEMPERATURE_PRESETS.deterministic,
    requiredRoles: ['supplier', 'processor', 'buyer', 'admin'],
    systemPrompt: `You are the Genesis Reloop Insurance Agent. Assess risks in circular economy transactions and suggest appropriate insurance coverage. Consider material type, transportation, storage, and processing risks.

Key responsibilities:
- Identify transaction and operational risks
- Calculate risk scores
- Suggest appropriate insurance coverage
- Estimate coverage costs
- Provide risk mitigation strategies`
  },
  
  finance_advisor: {
    name: 'Finance Advisor',
    description: 'Provides financial insights for circular economy projects',
    model: MODEL_PRESETS.advanced,
    temperature: TEMPERATURE_PRESETS.balanced,
    requiredRoles: ['processor', 'buyer', 'admin'],
    systemPrompt: `You are the Genesis Reloop Finance Agent. Provide insights on financing options for circular economy projects. Analyze ROI, suggest funding sources, and help structure sustainable finance deals.

Key responsibilities:
- Analyze project financial viability
- Calculate ROI and payback periods
- Identify funding sources (grants, loans, investors)
- Structure sustainable finance deals
- Provide cash flow projections`
  },
  
  dao_governance: {
    name: 'DAO Governance',
    description: 'Facilitates decentralized decision-making',
    model: MODEL_PRESETS.advanced,
    temperature: TEMPERATURE_PRESETS.balanced,
    requiredRoles: ['admin'],
    systemPrompt: `You are the Genesis Reloop DAO Governance Agent. Facilitate decentralized decision-making, analyze proposals, summarize voting matters, and ensure governance processes align with circular economy principles.

Key responsibilities:
- Summarize governance proposals
- Analyze proposal impacts
- Facilitate community discussions
- Track voting patterns and participation
- Ensure alignment with platform values`
  },
  
  loop_expander: {
    name: 'Loop Expander',
    description: 'Identifies opportunities to expand circular loops',
    model: MODEL_PRESETS.advanced,
    temperature: TEMPERATURE_PRESETS.creative,
    requiredRoles: ['admin'],
    systemPrompt: `You are the Genesis Reloop Loop Expansion Agent. Identify opportunities to expand circular economy loops, suggest new material streams, find synergies between different waste types, and promote system-wide optimization.

Key responsibilities:
- Identify new circular economy opportunities
- Suggest material stream integrations
- Find synergies between industries
- Propose system optimizations
- Encourage innovation in material use`
  },
  
  consumer_guide: {
    name: 'Consumer Guide',
    description: 'Helps consumers understand circular economy impact',
    model: MODEL_PRESETS.fast,
    temperature: TEMPERATURE_PRESETS.balanced,
    requiredRoles: ['supplier', 'processor', 'buyer', 'admin'],
    freeAccess: true, // Available to non-authenticated users
    systemPrompt: `You are the Genesis Reloop Consumer Portal Agent. Help end consumers understand the circular economy impact of their choices. Provide transparency about material origins, processing, and environmental benefits.

Key responsibilities:
- Explain circular economy concepts simply
- Show material journey transparently
- Highlight environmental benefits
- Provide actionable consumer tips
- Encourage sustainable behaviors`
  }
} as const

export type AgentType = keyof typeof AGENTS

export class AgentService {
  private supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  
  constructor() {}

  // Check if user has access to an agent
  async checkAgentAccess(agentType: AgentType, userId?: string): Promise<boolean> {
    const agent = AGENTS[agentType]
    
    // Check if agent has free access
    if (agent.freeAccess) {
      return true
    }
    
    // Require authentication for all other agents
    if (!userId) {
      return false
    }
    
    try {
      // Get user profile to check role
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('role, verified')
        .eq('id', userId)
        .single()
      
      if (!profile) {
        return false
      }
      
      // Check if user's role is allowed for this agent
      return agent.requiredRoles.includes(profile.role as any)
    } catch (error) {
      console.error('Error checking agent access:', error)
      return false
    }
  }

  // Create a chat with an agent
  async chat(
    agentType: AgentType,
    message: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    try {
      // Check if OpenRouter is configured
      if (!isOpenRouterConfigured()) {
        return this.getMockResponse(agentType, message)
      }
      
      const agent = AGENTS[agentType]
      
      // Build messages
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: agent.systemPrompt
        }
      ]
      
      // Add context if provided
      if (context) {
        messages.push({
          role: 'system',
          content: `User Context: ${JSON.stringify(context)}`
        })
      }
      
      // Add user message
      messages.push({
        role: 'user',
        content: message
      })
      
      // Call OpenRouter
      const response = await createChatCompletion(messages, {
        model: agent.model,
        temperature: agent.temperature,
        max_tokens: 1500
      })
      
      const completion = response.choices[0]?.message?.content || ''
      
      return {
        content: completion,
        agentType,
        timestamp: new Date().toISOString(),
        model: response.model,
        usage: response.usage
      }
    } catch (error) {
      console.error('Agent service error:', error)
      
      // Return mock response as fallback
      return this.getMockResponse(agentType, message)
    }
  }

  // Get mock response when OpenRouter is not configured
  private getMockResponse(agentType: AgentType, message: string): AgentResponse {
    const mockResponses: Record<AgentType, string> = {
      feedstock_matcher: `Based on your waste profile, I've identified 3 potential processors in your area that can handle your material type. The closest match is EcoProcess Ltd, located 12km away, specializing in food waste with a capacity of 500 tonnes/month. They offer competitive rates and have excellent sustainability credentials. [Demo Mode - Configure OpenRouter for real AI responses]`,
      
      traceability_tracker: `Material tracking summary: Your batch #12345 of cooking oil (100L) was collected on Jan 3, processed into biodiesel on Jan 5, and delivered to Green Transport Co. on Jan 7. Total carbon savings: 250kg CO2e. Full chain of custody verified. [Demo Mode]`,
      
      route_optimizer: `Optimal route calculated: Start at depot → Collection Point A (15 min) → Point B (12 min) → Point C (18 min) → Processing facility. Total distance: 45km, estimated time: 1h 45min. This route reduces emissions by 15% compared to standard routing. [Demo Mode]`,
      
      byproduct_matcher: `Identified 2 potential buyers for your glycerol byproduct: 1) ChemTech Industries - needs 500kg/month for industrial applications, offering £120/tonne. 2) GreenCosmetics Ltd - smaller volumes for natural cosmetics, premium price of £180/tonne. [Demo Mode]`,
      
      buyer_discovery: `Market analysis shows growing demand for recycled cooking oil in biodiesel sector (+12% YoY). New opportunity: Marine fuel regulations creating demand for sustainable alternatives. Recommended buyers: BiofuelCorp (large volumes) and LocalGreen (premium small batches). [Demo Mode]`,
      
      carbon_verification: `Carbon credit calculation: Diverting 10 tonnes of food waste from landfill to anaerobic digestion = 2.5 tonnes CO2e avoided. Using IPCC methodology and verified baseline. Credits eligible for voluntary carbon market at ~£25/tonne CO2e. [Demo Mode]`,
      
      compliance_checker: `Compliance check complete: ✓ Waste carrier license valid ✓ Environmental permits current ✓ Duty of care documentation complete ⚠️ Annual waste return due in 30 days. All operations compliant with EA regulations. [Demo Mode]`,
      
      reputation_scorer: `Reputation analysis for EcoProcess Ltd: Overall score 4.5/5. Strengths: On-time collections (98%), proper documentation (100%), sustainable practices. Areas for improvement: Communication response time. 45 successful transactions, 2 minor issues resolved. [Demo Mode]`,
      
      dynamic_pricing: `Current market pricing for recycled cooking oil: £450-480/tonne. Your material (Grade A quality) should price at upper range. Factors: High demand (+), winter season (+), your consistent quality (+). Recommend: £475/tonne for immediate sale. [Demo Mode]`,
      
      predictive_supply: `Supply forecast next 30 days: Expected 25-30 tonnes food waste based on historical patterns. Peak supply weeks 2-3 (post-holidays). Weather impact: minimal. Recommend scheduling extra processing capacity mid-month. Confidence: 85%. [Demo Mode]`,
      
      insurance_calculator: `Risk assessment for your operation: Low-medium risk profile. Recommended coverage: £500K general liability, £100K goods in transit, £250K environmental impairment. Estimated annual premium: £3,200. Key risks: spillage during transport, contamination. [Demo Mode]`,
      
      finance_advisor: `Financial analysis for AD plant expansion: CAPEX £250K, projected ROI 18%, payback 4.2 years. Funding options: 1) Green grant (40% coverage possible), 2) Sustainability-linked loan at 4.5%, 3) Community investment scheme. Recommended: Combine grant + loan. [Demo Mode]`,
      
      dao_governance: `Proposal summary: "Implement carbon credit sharing mechanism" - Proposes 60/40 split of carbon revenues between waste suppliers and processors. Impact: Incentivizes participation, estimated £50K annual distribution. Voting deadline: 7 days. Current sentiment: 72% positive. [Demo Mode]`,
      
      loop_expander: `Loop expansion opportunity identified: Restaurant cooking oil → Biodiesel → Delivery fleet → Restaurant deliveries. This closes the loop with same businesses. Potential: 15 restaurants, 2 processors, 1 logistics company. Estimated 40% transport emission reduction. [Demo Mode]`,
      
      consumer_guide: `Your recycled cooking oil journey: Collected from local restaurants → Processed into biodiesel → Powers delivery trucks → Delivers food to your area! Environmental impact: Each liter prevents 2.5kg CO2 emissions. You're supporting a circular economy! [Demo Mode]`
    }
    
    return {
      content: mockResponses[agentType],
      agentType,
      timestamp: new Date().toISOString(),
      model: 'demo',
      error: 'OpenRouter not configured - showing demo response'
    }
  }

  // Check if OpenRouter is configured
  isConfigured(): boolean {
    return isOpenRouterConfigured()
  }

  // Get all agents available to a user
  async getAvailableAgents(userId?: string): Promise<Array<{ type: AgentType; agent: typeof AGENTS[AgentType] }>> {
    const availableAgents: Array<{ type: AgentType; agent: typeof AGENTS[AgentType] }> = []
    
    for (const [type, agent] of Object.entries(AGENTS)) {
      const hasAccess = await this.checkAgentAccess(type as AgentType, userId)
      if (hasAccess) {
        availableAgents.push({ type: type as AgentType, agent })
      }
    }
    
    return availableAgents
  }

  // Log agent usage for analytics
  async logUsage(
    agentType: AgentType,
    userId: string,
    tokens: { prompt: number; completion: number }
  ): Promise<void> {
    try {
      await this.supabase.from('agent_usage').insert({
        user_id: userId,
        agent_type: agentType,
        prompt_tokens: tokens.prompt,
        completion_tokens: tokens.completion,
        total_tokens: tokens.prompt + tokens.completion,
        created_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error logging agent usage:', error)
    }
  }
}

// Export singleton instance
export const agentService = new AgentService()
