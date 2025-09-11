// Agent type definitions and constants (client-safe)
export type AgentType = 
  | 'feedstock_matcher'
  | 'traceability_tracker'
  | 'route_optimizer'
  | 'byproduct_matcher'
  | 'buyer_discovery'
  | 'carbon_verification'
  | 'compliance_checker'
  | 'reputation_scorer'
  | 'dynamic_pricing'
  | 'predictive_supply'
  | 'insurance_calculator'
  | 'finance_advisor'
  | 'dao_governance'
  | 'loop_expander'
  | 'consumer_guide'

// Agent configurations (no server dependencies)
export const AGENTS = {
  feedstock_matcher: {
    name: 'Feedstock Matcher',
    description: 'Intelligently matches waste suppliers with processors',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.1,
    requiredRoles: ['admin', 'supplier', 'processor', 'buyer'],
  },
  traceability_tracker: {
    name: 'Chain-of-Custody Tracker',
    description: 'Tracks materials through the supply chain',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.1,
    requiredRoles: ['admin', 'processor', 'verifier'],
  },
  route_optimizer: {
    name: 'Collection Route Optimizer',
    description: 'Optimizes collection routes for efficiency',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.2,
    requiredRoles: ['admin', 'collector'],
  },
  byproduct_matcher: {
    name: 'Byproduct Value Matcher',
    description: 'Identifies valuable byproducts and matches with buyers',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.3,
    requiredRoles: ['admin', 'processor', 'buyer'],
  },
  buyer_discovery: {
    name: 'Buyer Discovery Engine',
    description: 'Connects processed materials with qualified buyers',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.3,
    requiredRoles: ['admin', 'processor', 'buyer'],
  },
  carbon_verification: {
    name: 'Carbon Credit Verifier',
    description: 'Calculates and verifies carbon credits',
    model: 'anthropic/claude-3-opus-20240229',
    temperature: 0.1,
    requiredRoles: ['admin', 'verifier'],
  },
  compliance_checker: {
    name: 'Compliance Checker',
    description: 'Ensures regulatory compliance across operations',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.1,
    requiredRoles: ['admin', 'processor', 'verifier'],
  },
  reputation_scorer: {
    name: 'Reputation Engine',
    description: 'Calculates and maintains actor reputation scores',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.2,
    requiredRoles: ['admin', 'verifier'],
  },
  dynamic_pricing: {
    name: 'Dynamic Pricing Agent',
    description: 'Optimizes pricing based on market conditions',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.2,
    requiredRoles: ['admin', 'supplier', 'processor'],
  },
  predictive_supply: {
    name: 'Supply Predictor',
    description: 'Predicts future supply patterns',
    model: 'anthropic/claude-3-opus-20240229',
    temperature: 0.3,
    requiredRoles: ['admin', 'processor', 'buyer'],
  },
  insurance_calculator: {
    name: 'Insurance Calculator',
    description: 'Calculates insurance premiums and coverage',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.1,
    requiredRoles: ['admin', 'processor'],
  },
  finance_advisor: {
    name: 'Finance Advisor',
    description: 'Provides financial guidance and modeling',
    model: 'anthropic/claude-3-opus-20240229',
    temperature: 0.2,
    requiredRoles: ['admin'],
  },
  dao_governance: {
    name: 'DAO Governance Assistant',
    description: 'Helps with DAO proposals and governance',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.3,
    requiredRoles: ['admin', 'supplier', 'processor', 'buyer', 'collector'],
  },
  loop_expander: {
    name: 'Loop Expansion Scout',
    description: 'Identifies opportunities to expand the circular loop',
    model: 'anthropic/claude-3-opus-20240229',
    temperature: 0.5,
    requiredRoles: ['admin'],
  },
  consumer_guide: {
    name: 'Consumer Portal Guide',
    description: 'Helps consumers understand and participate',
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.4,
    requiredRoles: ['admin', 'buyer'],
  },
} as const
