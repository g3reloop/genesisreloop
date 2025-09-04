// Agent system types for Genesis Reloop

export type AgentStatus = 'healthy' | 'degraded' | 'offline'
export type FeedstockType = 'FW' | 'UCO'
export type ProductType = 'FW' | 'UCO' | 'BIOGAS' | 'BIODIESEL' | 'GLYCEROL' | 'DIGESTATE'
export type LoopState = 'SRL' | 'CRL' // Stabilized Recursive Loop / Conventional Recovery Loop
export type UserRole = 'supplier' | 'collector' | 'processor' | 'buyer' | 'verifier' | 'admin'

// Core agent definition
export interface Agent {
  name: string
  status: AgentStatus
  queueDepth: number
  avgLatency: number // ms
  lastHeartbeat: Date
  config: Record<string, any>
}

// Feedstock lot for matching
export interface FeedstockLot {
  id: string
  type: FeedstockType
  volume: number
  unit: 'kg' | 'L' | 'tonnes'
  location: {
    lat: number
    lng: number
    address: string
    name?: string
  }
  windowStart: Date
  windowEnd: Date
  qualityMetrics?: {
    moisture?: number
    ffa?: number // Free fatty acid for UCO
    contamination?: number
  }
  supplierId: string
  srlHint?: boolean // Supplier indicates this could be part of SRL
  createdAt: Date
  collectionDate?: Date
}

// Match result from FeedstockMatcher
export interface ProcessorMatch {
  processorId: string
  processorName: string
  score: number
  distanceKm: number
  priceEstimate: number
  routeEta: Date
  srlScore: number // 0-1, how well this fits SRL pattern
  notes?: string
  aiRecommendations?: {
    carbonImpact: string
    recommendations: string[]
  }
}

// Batch for traceability
export interface TraceBatch {
  id: string
  type: ProductType
  weight?: number // kg
  volume?: number // L
  timestamps: {
    pickup?: Date
    delivery?: Date
    processing?: Date
    completion?: Date
  }
  geoChain: Array<{
    lat: number
    lng: number
    timestamp: Date
    event: string
  }>
  photos: string[] // S3 URLs
  labDocs: string[] // S3 URLs
  operatorId: string
  srlState?: LoopState
  hash?: string
  merkleRoot?: string
}

// Route planning
export interface CollectionJob {
  pickupId: string
  location: {
    lat: number
    lng: number
    address: string
  }
  volume: number
  timeWindow: {
    start: Date
    end: Date
  }
  serviceTime: number // minutes
  priority?: number
}

export interface Vehicle {
  id: string
  capacity: number
  currentLocation?: {
    lat: number
    lng: number
  }
  startDepot: {
    lat: number
    lng: number
    address: string
  }
  driverId: string
}

export interface PlannedRoute {
  vehicleId: string
  stopSequence: string[] // pickup IDs in order
  eta: Date[]
  distanceKm: number
  emissionsEstimate: number // kg CO2
  polyline?: string // Encoded route geometry
}

// Carbon calculation
export interface CarbonCredit {
  batchId: string
  tCO2eAvoided: number
  calculationMethod: string
  baselineFactor: number
  evidencePackId: string
  createdAt: Date
}

// Reputation scoring
export interface ReputationScore {
  entityId: string
  entityType: 'supplier' | 'collector' | 'processor' | 'buyer'
  score: number // 0-100
  components: {
    onTimeDelivery: number
    qualityConsistency: number
    srlRatio: number
    disputeRate: number
  }
  explanations: string[]
  updatedAt: Date
}

// Agent job for queue processing
export interface AgentJob {
  id: string
  agent: string
  payload: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  attempts: number
  createdAt: Date
  updatedAt: Date
}

// API responses
export interface AgentStatusResponse {
  agents: Array<Agent & {
    recentJobs: AgentJob[]
    errorRate: number
  }>
  overallHealth: AgentStatus
}

export interface MatchResponse {
  lotId: string
  matches: ProcessorMatch[]
  recommendedMatch?: ProcessorMatch
}

export interface RouteResponse {
  routes: PlannedRoute[]
  totalDistance: number
  totalEmissions: number
  unassignedJobs: string[]
}

// RBAC permissions
export interface Permission {
  resource: string
  action: string
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  supplier: [
    { resource: 'self', action: 'read' },
    { resource: 'rfq', action: 'create' },
    { resource: 'matches', action: 'read' },
    { resource: 'routes', action: 'read' }
  ],
  collector: [
    { resource: 'jobs', action: 'read' },
    { resource: 'jobs', action: 'update' },
    { resource: 'pof', action: 'upload' }
  ],
  processor: [
    { resource: 'rfq', action: 'read' },
    { resource: 'rfq', action: 'bid' },
    { resource: 'qa', action: 'upload' },
    { resource: 'batch', action: 'create' }
  ],
  buyer: [
    { resource: 'listings', action: 'read' },
    { resource: 'order', action: 'create' }
  ],
  verifier: [
    { resource: 'ledger', action: 'read' },
    { resource: 'mrv', action: 'attest' }
  ],
  admin: [
    { resource: '*', action: '*' }
  ]
}

// Feature flags
export interface FeatureFlag {
  key: string
  enabled: boolean
  description?: string
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  { key: 'tokenization', enabled: false, description: 'Enable GIRM token features' },
  { key: 'ml_ranking', enabled: false, description: 'Use ML model for matching' }
]
