// Loop Integrity Index (LII) Calculator
// Formula: 0.35*SRL_tons + 0.20*nodes_activated + 0.25*carbon_girm_anchors + 0.15*local_loops_closed - 0.05*crl_events

export interface LoopMetrics {
  srlTons: number
  nodesActivated: number
  carbonGirmAnchors: number
  localLoopsClosed: number
  crlEvents: number
}

export interface LIITargets {
  month1: LoopMetrics
  month2: LoopMetrics
}

export const LII_WEIGHTS = {
  srlTons: 0.35,
  nodesActivated: 0.20,
  carbonGirmAnchors: 0.25,
  localLoopsClosed: 0.15,
  crlEvents: -0.05
}

export const LII_TARGETS: LIITargets = {
  month1: {
    srlTons: 50,
    nodesActivated: 6,
    carbonGirmAnchors: 30,
    localLoopsClosed: 2,
    crlEvents: 0
  },
  month2: {
    srlTons: 150,
    nodesActivated: 10,
    carbonGirmAnchors: 100,
    localLoopsClosed: 4,
    crlEvents: 0
  }
}

export function calculateLII(metrics: LoopMetrics): number {
  const lii = 
    LII_WEIGHTS.srlTons * metrics.srlTons +
    LII_WEIGHTS.nodesActivated * metrics.nodesActivated +
    LII_WEIGHTS.carbonGirmAnchors * metrics.carbonGirmAnchors +
    LII_WEIGHTS.localLoopsClosed * metrics.localLoopsClosed +
    LII_WEIGHTS.crlEvents * metrics.crlEvents

  return Math.max(0, lii) // LII cannot be negative
}

export function calculateTargetLII(month: 1 | 2): number {
  const targets = month === 1 ? LII_TARGETS.month1 : LII_TARGETS.month2
  return calculateLII(targets)
}

export function calculateProgress(current: LoopMetrics, targetMonth: 1 | 2): {
  lii: number
  targetLII: number
  percentComplete: number
  metricBreakdown: Record<keyof LoopMetrics, { current: number, target: number, percentComplete: number }>
} {
  const currentLII = calculateLII(current)
  const targetLII = calculateTargetLII(targetMonth)
  const targets = targetMonth === 1 ? LII_TARGETS.month1 : LII_TARGETS.month2

  const metricBreakdown = {
    srlTons: {
      current: current.srlTons,
      target: targets.srlTons,
      percentComplete: (current.srlTons / targets.srlTons) * 100
    },
    nodesActivated: {
      current: current.nodesActivated,
      target: targets.nodesActivated,
      percentComplete: (current.nodesActivated / targets.nodesActivated) * 100
    },
    carbonGirmAnchors: {
      current: current.carbonGirmAnchors,
      target: targets.carbonGirmAnchors,
      percentComplete: (current.carbonGirmAnchors / targets.carbonGirmAnchors) * 100
    },
    localLoopsClosed: {
      current: current.localLoopsClosed,
      target: targets.localLoopsClosed,
      percentComplete: (current.localLoopsClosed / targets.localLoopsClosed) * 100
    },
    crlEvents: {
      current: current.crlEvents,
      target: targets.crlEvents,
      percentComplete: current.crlEvents === 0 ? 100 : 0 // 100% if no CRL events
    }
  }

  return {
    lii: currentLII,
    targetLII,
    percentComplete: (currentLII / targetLII) * 100,
    metricBreakdown
  }
}

// Calculate LII delta for agent activation decisions
export function calculateLIIDelta(before: LoopMetrics, after: LoopMetrics): number {
  const beforeLII = calculateLII(before)
  const afterLII = calculateLII(after)
  return afterLII - beforeLII
}

// Format LII for display
export function formatLII(lii: number): string {
  return lii.toFixed(2)
}

// Generate weekly report data
export interface WeeklyReport {
  week: number
  metrics: LoopMetrics
  lii: number
  nodes: {
    name: string
    srlTons: number
    status: 'active' | 'pending' | 'inactive'
  }[]
  materialFlows: {
    node: string
    input: string
    output: string
    quantity: string
  }[]
  challenges: string[]
  nextWeekActions: string[]
}

export function generateWeeklyReport(
  week: number,
  metrics: LoopMetrics,
  nodeData: any[]
): WeeklyReport {
  const lii = calculateLII(metrics)
  
  return {
    week,
    metrics,
    lii,
    nodes: nodeData.map(node => ({
      name: node.nodeId,
      srlTons: node.srlTons || 0,
      status: node.active ? 'active' : 'pending'
    })),
    materialFlows: nodeData
      .filter(node => node.active)
      .map(node => ({
        node: node.nodeId,
        input: node.input || 'N/A',
        output: node.output || 'N/A',
        quantity: node.quantity || 'N/A'
      })),
    challenges: metrics.crlEvents > 0 ? ['CRL events detected'] : ['none'],
    nextWeekActions: [] // To be filled based on roadmap
  }
}

// Check if LII delta meets threshold for agent activation
export function meetsActivationThreshold(delta: number, threshold: number = 0.02): boolean {
  return delta >= threshold
}
