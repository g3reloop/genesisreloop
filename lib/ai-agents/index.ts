export { BaseAgent } from './base-agent'
export { FeedstockMatcher } from './feedstock-matcher'
export { LiquidityBot } from './liquidity-bot'
export { LoopAuditBot } from './loop-audit-bot'

// Export types
export type { AgentInput, AgentOutput, AgentConfig } from './base-agent'

// Agent registry
export const LIVE_AGENTS = [
  'FeedstockMatcher',
  'TraceBot',
  'RouteGen',
  'ByproductMatcher',
  'BuyerDiscoveryBot',
  'CarbonVerifier',
  'ComplianceClerk',
  'ReputationBot',
  'LiquidityBot',
  'LoopAuditBot'
]

export const PLANNED_AGENTS = [
  'DynamicPricingBot',
  'PredictiveSupplyBot',
  'InsuranceRiskBot',
  'FinanceBot',
  'DAOGovernanceBot',
  'LoopExpansionBot',
  'ConsumerPortalBot',
  'LoopInsurer'
]

export const TOTAL_AGENTS = LIVE_AGENTS.length + PLANNED_AGENTS.length
