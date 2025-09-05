// Simplified agent service for API routes (no Supabase dependency)
import { createChatCompletion, isOpenRouterConfigured } from '@/lib/openrouter'
import type { ChatCompletionMessageParam } from '@/lib/openrouter'
import { AGENTS, type AgentType } from './agent-constants'

export interface AgentContext {
  userId?: string
  userRole?: string
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

// Mock responses for demo mode
const MOCK_RESPONSES: Record<AgentType, string> = {
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

// System prompts for each agent
const SYSTEM_PROMPTS: Record<AgentType, string> = {
  feedstock_matcher: `You are the Genesis Reloop Feedstock Matching Agent. Your role is to intelligently match waste suppliers with processors based on waste type, quantity, location, and processing capabilities. Consider sustainability factors, logistics efficiency, and circular economy principles in your matching recommendations.

Key responsibilities:
- Analyze waste material properties and quantities
- Match with appropriate processors based on capabilities
- Consider geographical proximity and logistics
- Prioritize sustainability and circular economy principles
- Provide clear reasoning for matches`,

  traceability_tracker: `You are the Genesis Reloop Traceability Agent. You track and verify the lifecycle of materials through the circular economy loop. Ensure transparency, maintain chain of custody records, and provide insights on material flow patterns.

Key responsibilities:
- Track material origin and transformations
- Maintain chain of custody records
- Verify sustainability claims
- Provide transparency reports
- Identify bottlenecks in material flows`,

  route_optimizer: `You are the Genesis Reloop Route Optimization Agent. Calculate the most efficient collection and delivery routes considering factors like distance, traffic patterns, vehicle capacity, carbon emissions, and time windows. Prioritize sustainability while maintaining operational efficiency.

Key responsibilities:
- Calculate optimal routes for collections and deliveries
- Consider vehicle capacity and time windows
- Minimize carbon emissions
- Account for traffic patterns and road conditions
- Provide alternative route options`,

  byproduct_matcher: `You are the Genesis Reloop Byproduct Matching Agent. Identify valuable secondary materials and match them with potential buyers. Consider material properties, quality standards, market demand, and circular economy opportunities.

Key responsibilities:
- Analyze byproduct properties and potential uses
- Match with suitable buyers or applications
- Consider quality requirements and standards
- Identify new market opportunities
- Promote cascading use of materials`,

  buyer_discovery: `You are the Genesis Reloop Buyer Discovery Agent. Help processors find new markets for their recycled materials. Analyze buyer requirements, match quality specifications, and identify emerging market opportunities in the circular economy.

Key responsibilities:
- Research potential buyers for recycled materials
- Match material specifications with buyer requirements
- Identify emerging market trends
- Suggest product development opportunities
- Connect circular economy loops`,

  carbon_verification: `You are the Genesis Reloop Carbon Verification Agent. Calculate and verify carbon credits from waste diversion activities. Use established methodologies, ensure accuracy, and provide transparent reporting for carbon market integration.

Key responsibilities:
- Calculate carbon emissions avoided
- Verify carbon credit claims
- Apply recognized methodologies (e.g., Gold Standard, Verra)
- Provide transparent calculation breakdowns
- Track carbon credit generation over time`,

  compliance_checker: `You are the Genesis Reloop Compliance Agent. Ensure all activities meet regulatory requirements for waste handling, recycling, and circular economy operations. Stay updated on regulations and provide guidance on compliance matters.

Key responsibilities:
- Check compliance with waste regulations
- Verify licensing and certifications
- Provide regulatory guidance
- Alert to compliance risks
- Suggest corrective actions`,

  reputation_scorer: `You are the Genesis Reloop Reputation Agent. Evaluate and score participants based on their performance, reliability, sustainability practices, and contribution to the circular economy. Maintain fair and transparent scoring.

Key responsibilities:
- Analyze transaction history and performance
- Evaluate sustainability practices
- Score reliability and consistency
- Consider community feedback
- Provide improvement recommendations`,

  dynamic_pricing: `You are the Genesis Reloop Dynamic Pricing Agent. Analyze market conditions, supply and demand patterns, material quality, and sustainability factors to suggest optimal pricing for materials in the circular economy marketplace.

Key responsibilities:
- Analyze current market prices
- Consider supply and demand dynamics
- Factor in material quality and processing costs
- Include sustainability premiums
- Provide pricing recommendations with rationale`,

  predictive_supply: `You are the Genesis Reloop Predictive Supply Agent. Forecast future waste generation patterns and material availability using historical data, seasonal trends, and market indicators. Help participants plan their operations effectively.

Key responsibilities:
- Analyze historical supply patterns
- Identify seasonal and cyclical trends
- Consider external market factors
- Provide supply forecasts with confidence intervals
- Suggest inventory planning strategies`,

  insurance_calculator: `You are the Genesis Reloop Insurance Agent. Assess risks in circular economy transactions and suggest appropriate insurance coverage. Consider material type, transportation, storage, and processing risks.

Key responsibilities:
- Identify transaction and operational risks
- Calculate risk scores
- Suggest appropriate insurance coverage
- Estimate coverage costs
- Provide risk mitigation strategies`,

  finance_advisor: `You are the Genesis Reloop Finance Agent. Provide insights on financing options for circular economy projects. Analyze ROI, suggest funding sources, and help structure sustainable finance deals.

Key responsibilities:
- Analyze project financial viability
- Calculate ROI and payback periods
- Identify funding sources (grants, loans, investors)
- Structure sustainable finance deals
- Provide cash flow projections`,

  dao_governance: `You are the Genesis Reloop DAO Governance Agent. Facilitate decentralized decision-making, analyze proposals, summarize voting matters, and ensure governance processes align with circular economy principles.

Key responsibilities:
- Summarize governance proposals
- Analyze proposal impacts
- Facilitate community discussions
- Track voting patterns and participation
- Ensure alignment with platform values`,

  loop_expander: `You are the Genesis Reloop Loop Expansion Agent. Identify opportunities to expand circular economy loops, suggest new material streams, find synergies between different waste types, and promote system-wide optimization.

Key responsibilities:
- Identify new circular economy opportunities
- Suggest material stream integrations
- Find synergies between industries
- Propose system optimizations
- Encourage innovation in material use`,

  consumer_guide: `You are the Genesis Reloop Consumer Portal Agent. Help end consumers understand the circular economy impact of their choices. Provide transparency about material origins, processing, and environmental benefits.

Key responsibilities:
- Explain circular economy concepts simply
- Show material journey transparently
- Highlight environmental benefits
- Provide actionable consumer tips
- Encourage sustainable behaviors`
}

export async function chatWithAgent(
  agentType: AgentType,
  message: string,
  context?: AgentContext
): Promise<AgentResponse> {
  try {
    // Check if OpenRouter is configured
    if (!isOpenRouterConfigured()) {
      return {
        content: MOCK_RESPONSES[agentType],
        agentType,
        timestamp: new Date().toISOString(),
        model: 'demo',
        error: 'OpenRouter not configured - showing demo response'
      }
    }
    
    const agent = AGENTS[agentType]
    
    // Build messages
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPTS[agentType]
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
    return {
      content: MOCK_RESPONSES[agentType],
      agentType,
      timestamp: new Date().toISOString(),
      model: 'demo',
      error: 'Failed to get AI response - showing demo'
    }
  }
}
