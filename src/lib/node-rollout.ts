// Node Rollout Configuration and Management System

export interface NodeConfig {
  nodeId: string
  city: string
  country: string
  processor: string
  type: 'compost' | 'uco' | 'biodiesel' | 'multi'
  coordinates: {
    lat: number
    lng: number
  }
  contacts: {
    primary: string
    email: string
    phone?: string
  }
  capacity: {
    monthlyTons: number
    currentUtilization: number
  }
  status: 'pending' | 'active' | 'paused'
  activationWindow: string
  agents: string[]
}

export interface NodeMetrics {
  nodeId: string
  srlTons: number
  crlEvents: number
  carbonAnchors: number
  lastUpdate: Date
  materialFlows: {
    input: string
    output: string
    quantity: number
    unit: string
  }[]
}

// Node configurations based on Garry's spec
export const NODE_REGISTRY: NodeConfig[] = [
  {
    nodeId: 'Brighton_Community_Compost',
    city: 'Brighton',
    country: 'UK',
    processor: 'Brighton Community Composting Coop',
    type: 'compost',
    coordinates: {
      lat: 50.8225,
      lng: -0.1372
    },
    contacts: {
      primary: 'Sarah Mitchell',
      email: 'sarah@brightoncompost.coop',
      phone: '+44 1273 555 0123'
    },
    capacity: {
      monthlyTons: 50,
      currentUtilization: 30
    },
    status: 'pending',
    activationWindow: 'week_1_2',
    agents: ['LiquidityBot', 'LoopAuditBot', 'LoopCarbon']
  },
  {
    nodeId: 'Manchester_Fairfield',
    city: 'Manchester',
    country: 'UK',
    processor: 'Fairfield Materials',
    type: 'uco',
    coordinates: {
      lat: 53.4808,
      lng: -2.2426
    },
    contacts: {
      primary: 'James Thompson',
      email: 'james@fairfieldmaterials.uk'
    },
    capacity: {
      monthlyTons: 75,
      currentUtilization: 40
    },
    status: 'pending',
    activationWindow: 'week_3_4',
    agents: ['LoopRoute', 'LiquidityBot', 'LoopCarbon']
  },
  {
    nodeId: 'SouthWales_Sundance',
    city: 'Ammanford',
    country: 'UK',
    processor: 'Sundance Renewables',
    type: 'biodiesel',
    coordinates: {
      lat: 51.7933,
      lng: -3.9861
    },
    contacts: {
      primary: 'Dylan Evans',
      email: 'dylan@sundancerenewables.wales'
    },
    capacity: {
      monthlyTons: 100,
      currentUtilization: 25
    },
    status: 'pending',
    activationWindow: 'week_5_6',
    agents: ['LiquidityBot', 'LoopAuditBot']
  }
]

// Hardware deployment schedule
export const HARDWARE_ROLLOUT = {
  week_7_8: {
    nodeId: 'OpenHardware_Sprint',
    city: 'Multi-city',
    country: 'UK',
    activities: [
      {
        location: 'BuildBrighton',
        date: '2024-02-19',
        workshop: 'Weight Sensor Assembly',
        participants: 15
      },
      {
        location: 'HacMan Manchester',
        date: '2024-02-21',
        workshop: 'GPS Tracker Build',
        participants: 20
      },
      {
        location: 'Cardiff Hackspace',
        date: '2024-02-23',
        workshop: 'Temperature Probe Integration',
        participants: 12
      }
    ]
  }
}

// Node activation checklist
export interface ActivationChecklist {
  nodeId: string
  requirements: {
    item: string
    status: 'pending' | 'complete'
    completedBy?: string
    completedAt?: Date
  }[]
}

export function createActivationChecklist(nodeId: string): ActivationChecklist {
  return {
    nodeId,
    requirements: [
      { item: 'Processor agreement signed', status: 'pending' },
      { item: 'Hardware sensors deployed', status: 'pending' },
      { item: 'Telemetry connection verified', status: 'pending' },
      { item: 'Agent integration tested', status: 'pending' },
      { item: 'Initial GIRM proof submitted', status: 'pending' },
      { item: 'Community training completed', status: 'pending' },
      { item: 'DAO approval received', status: 'pending' }
    ]
  }
}

// Get nodes by activation window
export function getNodesByWindow(window: string): NodeConfig[] {
  return NODE_REGISTRY.filter(node => node.activationWindow === window)
}

// Check if node is ready for activation
export function isNodeReady(checklist: ActivationChecklist): boolean {
  return checklist.requirements.every(req => req.status === 'complete')
}

// Calculate node contribution to LII
export function calculateNodeLIIContribution(metrics: NodeMetrics): number {
  // Using LII weights: 0.35*SRL + 0.25*anchors - 0.05*CRL
  const srlContribution = 0.35 * metrics.srlTons
  const anchorContribution = 0.25 * metrics.carbonAnchors
  const crlPenalty = 0.05 * metrics.crlEvents
  
  return srlContribution + anchorContribution - crlPenalty
}

// Generate node status report
export interface NodeStatusReport {
  nodeId: string
  status: 'pending' | 'active' | 'paused'
  metrics: {
    srlTons: number
    utilizationPercent: number
    liiContribution: number
  }
  issues: string[]
  nextActions: string[]
}

export function generateNodeStatus(
  config: NodeConfig,
  metrics?: NodeMetrics
): NodeStatusReport {
  const issues: string[] = []
  const nextActions: string[] = []
  
  if (config.status === 'pending') {
    nextActions.push('Complete activation checklist')
  }
  
  if (config.capacity.currentUtilization < 50) {
    issues.push('Underutilized capacity')
    nextActions.push('Increase collection routes')
  }
  
  const liiContribution = metrics ? calculateNodeLIIContribution(metrics) : 0
  
  return {
    nodeId: config.nodeId,
    status: config.status,
    metrics: {
      srlTons: metrics?.srlTons || 0,
      utilizationPercent: config.capacity.currentUtilization,
      liiContribution
    },
    issues,
    nextActions
  }
}

// Material flow tracking
export interface MaterialFlow {
  nodeId: string
  date: Date
  inputType: 'food_waste' | 'uco' | 'mixed'
  inputQuantity: number
  outputType: 'compost' | 'biodiesel' | 'biogas' | 'other'
  outputQuantity: number
  conversionRate: number
  girmProofId?: string
}

export function calculateConversionRate(flow: MaterialFlow): number {
  return flow.outputQuantity / flow.inputQuantity
}

// Community processor integration
export interface ProcessorIntegration {
  nodeId: string
  processor: string
  integrationSteps: {
    step: string
    completed: boolean
    notes?: string
  }[]
}

export function createProcessorIntegration(config: NodeConfig): ProcessorIntegration {
  return {
    nodeId: config.nodeId,
    processor: config.processor,
    integrationSteps: [
      { step: 'Initial contact established', completed: false },
      { step: 'Site visit completed', completed: false },
      { step: 'Technical requirements assessed', completed: false },
      { step: 'Hardware installation plan', completed: false },
      { step: 'Data sharing agreement', completed: false },
      { step: 'Training materials prepared', completed: false },
      { step: 'Go-live date confirmed', completed: false }
    ]
  }
}

// Export rollout timeline
export const ROLLOUT_TIMELINE = {
  week_1_2: {
    start: '2024-02-05',
    end: '2024-02-18',
    nodes: ['Brighton_Community_Compost'],
    milestones: [
      'Deploy weight sensors',
      'Activate LiquidityBot',
      'First GIRM credits issued'
    ]
  },
  week_3_4: {
    start: '2024-02-19',
    end: '2024-03-03',
    nodes: ['Manchester_Fairfield'],
    milestones: [
      'UCO collection routes mapped',
      'LoopRoute optimization live',
      'First biodiesel credits'
    ]
  },
  week_5_6: {
    start: '2024-03-04',
    end: '2024-03-17',
    nodes: ['SouthWales_Sundance'],
    milestones: [
      'P2P biodiesel trading enabled',
      'First local loop closed',
      'Loop Integrity Report v1'
    ]
  },
  week_7_8: {
    start: '2024-03-18',
    end: '2024-03-31',
    nodes: ['OpenHardware_Sprint'],
    milestones: [
      'Open hardware designs released',
      'Community workshops completed',
      '15+ IoT kits assembled'
    ]
  }
}
