// Agent Configuration - ReLoop SRL Core Feature Set v1.0

export interface AgentConfig {
  name: string
  status: 'live' | 'standby' | 'disabled'
  purpose: string
  activationRule?: string
}

export const AGENT_REGISTRY: AgentConfig[] = [
  // LIVE AGENTS (5)
  {
    name: 'LiquidityBot',
    status: 'live',
    purpose: 'Community liquidity + escrow settlement only (no yield farming)'
  },
  {
    name: 'LoopAuditBot',
    status: 'live',
    purpose: 'ZK + GIRM proofs; immutable audit anchors'
  },
  {
    name: 'LoopInsurer',
    status: 'live',
    purpose: 'Parametric micro-insurance; DAO-priced; SRL-incentivized'
  },
  {
    name: 'LoopRoute',
    status: 'live',
    purpose: 'Micro-collection route optimization for food waste & UCO'
  },
  {
    name: 'LoopCarbon',
    status: 'live',
    purpose: 'GIRM-verified tokenization + retirement of carbon credits'
  },
  
  // STANDBY AGENTS (7)
  {
    name: 'LoopAnomaly',
    status: 'standby',
    purpose: 'Fraud detection for CRL events',
    activationRule: 'DAO quorum >= 60% and LII delta >= +2%'
  },
  {
    name: 'LoopCompliance',
    status: 'standby',
    purpose: 'Cross-border regulatory compliance',
    activationRule: 'DAO quorum >= 60% and required for cross-border shipment'
  },
  {
    name: 'LoopReputation',
    status: 'standby',
    purpose: 'SRL/CRL loop score only (no general GNN social scoring)',
    activationRule: 'Reframed: SRL/CRL loop score only'
  },
  {
    name: 'PredictiveSupplyBot',
    status: 'standby',
    purpose: 'Supply forecasting for collection routes',
    activationRule: 'DAO quorum >= 60%'
  },
  {
    name: 'DynamicPricingBot',
    status: 'standby',
    purpose: 'Market-based pricing for byproducts',
    activationRule: 'DAO quorum >= 60%'
  },
  {
    name: 'BuyerDiscoveryBot',
    status: 'standby',
    purpose: 'Match community buyers with processors',
    activationRule: 'DAO quorum >= 60%'
  },
  {
    name: 'ByproductMatcher',
    status: 'standby',
    purpose: 'Optimize byproduct utilization paths',
    activationRule: 'DAO quorum >= 60%'
  },
  
  // DISABLED AGENTS (9)
  {
    name: 'LoopGrant',
    status: 'disabled',
    purpose: 'DEPRECATED - Grant matching'
  },
  {
    name: 'LoopReward',
    status: 'disabled',
    purpose: 'DEPRECATED - Gamification'
  },
  {
    name: 'LoopMaintain',
    status: 'disabled',
    purpose: 'DEPRECATED - Predictive maintenance'
  },
  {
    name: 'LoopAffinity',
    status: 'disabled',
    purpose: 'DEPRECATED - Community matching'
  },
  {
    name: 'LoopRegen',
    status: 'disabled',
    purpose: 'DEPRECATED - Soil health optimization'
  },
  {
    name: 'LoopGreen',
    status: 'disabled',
    purpose: 'DEPRECATED - Environmental calculator'
  },
  {
    name: 'LoopRisk',
    status: 'disabled',
    purpose: 'DEPRECATED - Portfolio risk'
  },
  {
    name: 'LoopDemand',
    status: 'disabled',
    purpose: 'DEPRECATED - Demand forecasting'
  },
  {
    name: 'LoopGov',
    status: 'disabled',
    purpose: 'DEPRECATED - DAO proposals'
  }
]

// Agent activation check
export async function canActivateAgent(
  agentName: string,
  daoQuorumPercent: number,
  liiDelta: number,
  requiresCrossBorder: boolean = false
): Promise<boolean> {
  const agent = AGENT_REGISTRY.find(a => a.name === agentName)
  
  if (!agent || agent.status !== 'standby') {
    return false
  }
  
  switch (agentName) {
    case 'LoopAnomaly':
      return daoQuorumPercent >= 60 && liiDelta >= 0.02
    
    case 'LoopCompliance':
      return daoQuorumPercent >= 60 && requiresCrossBorder
    
    case 'LoopReputation':
      // Always available but only for SRL/CRL scoring
      return daoQuorumPercent >= 60
    
    default:
      // Other standby agents
      return daoQuorumPercent >= 60
  }
}

// Get only live agents
export function getLiveAgents(): AgentConfig[] {
  return AGENT_REGISTRY.filter(agent => agent.status === 'live')
}

// Node rollout configuration
export const NODE_ROLLOUT = [
  {
    window: 'week_1_2',
    nodeId: 'Brighton_Community_Compost',
    city: 'Brighton',
    country: 'UK',
    processor: 'Brighton Community Composting Coop',
    expectedSRL: 15,
    agents: ['LiquidityBot', 'LoopAuditBot', 'LoopCarbon']
  },
  {
    window: 'week_3_4',
    nodeId: 'Manchester_Fairfield',
    city: 'Manchester', 
    country: 'UK',
    processor: 'Fairfield Materials',
    expectedSRL: 20,
    agents: ['LoopRoute', 'LiquidityBot', 'LoopCarbon']
  },
  {
    window: 'week_5_6',
    nodeId: 'SouthWales_Sundance',
    city: 'Ammanford',
    country: 'UK',
    processor: 'Sundance Renewables',
    expectedSRL: 15,
    agents: ['LiquidityBot', 'LoopAuditBot']
  },
  {
    window: 'week_7_8',
    nodeId: 'OpenHardware_Sprint',
    city: 'Multi-city',
    country: 'UK',
    processor: 'Community Fab Labs',
    expectedSRL: 0,
    agents: []
  }
]
