// User Types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  SUPPLIER = 'SUPPLIER',
  PROCESSOR = 'PROCESSOR',
  BUYER = 'BUYER',
  COLLECTOR = 'COLLECTOR',
  ADMIN = 'ADMIN'
}

// Supplier Types
export interface Supplier {
  id: string
  userId: string
  businessName: string
  address: string
  contactPhone: string
  supplierType: SupplierType
  trustScore: number
  srlCompliance: number
  createdAt: Date
  updatedAt: Date
}

export enum SupplierType {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

// Feedstock Types
export interface FeedstockBatch {
  id: string
  supplierId: string
  batchCode: string
  feedstockType: FeedstockType
  quantity: number
  fatContent?: number
  temperature?: number
  loopType: LoopType
  qualityScore?: number
  status: BatchStatus
  createdAt: Date
  updatedAt: Date
}

export enum FeedstockType {
  UCO = 'UCO',
  FOOD_WASTE = 'FOOD_WASTE',
  MIXED = 'MIXED'
}

export enum LoopType {
  SRL = 'SRL',
  CRL = 'CRL',
  UNKNOWN = 'UNKNOWN'
}

export enum BatchStatus {
  REGISTERED = 'REGISTERED',
  ASSIGNED = 'ASSIGNED',
  COLLECTED = 'COLLECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  PROCESSED = 'PROCESSED',
  REJECTED = 'REJECTED'
}

// Collection Types
export interface Collection {
  id: string
  batchId: string
  supplierId: string
  collectorId?: string
  routeId?: string
  scheduledTime: Date
  actualPickupTime?: Date
  status: CollectionStatus
  createdAt: Date
  updatedAt: Date
}

export enum CollectionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// AI Agent Types
export interface AIAgent {
  name: string
  status: 'live' | 'planned'
  dependencies: string[]
  tasks: string[]
  expectedLaunch?: string
}

export interface AgentActivity {
  id: string
  agentName: string
  action: string
  inputData: any
  outputData: any
  success: boolean
  error?: string
  duration: number
  createdAt: Date
}

// Secondary Product Types
export interface SecondaryProduct {
  id: string
  processedBatchId: string
  productType: SecondaryProductType
  quantity: number
  unit: string
  price?: number
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
}

export enum SecondaryProductType {
  BIODIESEL = 'BIODIESEL',
  GLYCERIN = 'GLYCERIN',
  DIGESTATE = 'DIGESTATE',
  BIOGAS = 'BIOGAS',
  OTHER = 'OTHER'
}

export enum ProductStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD'
}

// Carbon Credit Types
export interface CarbonCredit {
  id: string
  batchCode: string
  co2Avoided: number
  verificationId: string
  status: CreditStatus
  price?: number
  createdAt: Date
  updatedAt: Date
}

export enum CreditStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  TRADED = 'TRADED',
  RETIRED = 'RETIRED'
}

// Reputation Types
export interface ReputationScore {
  id: string
  supplierId: string
  metric: ReputationMetric
  score: number
  reason?: string
  createdAt: Date
}

export enum ReputationMetric {
  DELIVERY_TIMELINESS = 'DELIVERY_TIMELINESS',
  QUALITY_CONSISTENCY = 'QUALITY_CONSISTENCY',
  SRL_COMPLIANCE = 'SRL_COMPLIANCE',
  VOLUME_RELIABILITY = 'VOLUME_RELIABILITY',
  COMMUNICATION = 'COMMUNICATION'
}

// Subscription Types
export interface Subscription {
  id: string
  userId: string
  planType: SubscriptionPlan
  status: SubscriptionStatus
  startDate: Date
  endDate?: Date
  monthlyFee: number
  perBatchFee: number
  createdAt: Date
  updatedAt: Date
}

export enum SubscriptionPlan {
  SMALL_SUPPLIER = 'SMALL_SUPPLIER',
  MEDIUM_SUPPLIER = 'MEDIUM_SUPPLIER',
  LARGE_SUPPLIER = 'LARGE_SUPPLIER',
  MICRO_COLLECTOR = 'MICRO_COLLECTOR',
  BUYER_STANDARD = 'BUYER_STANDARD'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
}

export enum NotificationType {
  BATCH_ASSIGNED = 'BATCH_ASSIGNED',
  COLLECTION_SCHEDULED = 'COLLECTION_SCHEDULED',
  QUALITY_ALERT = 'QUALITY_ALERT',
  COMPLIANCE_UPDATE = 'COMPLIANCE_UPDATE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  REPUTATION_CHANGE = 'REPUTATION_CHANGE',
  CARBON_CREDIT_GENERATED = 'CARBON_CREDIT_GENERATED',
  ORDER_PLACED = 'ORDER_PLACED',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

// Loop Visualization Types
export interface LoopNode {
  id: string
  type: string
  agents: string[]
  loopState: string
  x?: number
  y?: number
}

export interface LoopFlow {
  from: string
  to: string
  description: string
  color?: string
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalSuppliers: number
  activeBatches: number
  srlCompliance: number
  carbonCreditsGenerated: number
  secondaryProductsMatched: number
  totalRevenue: number
  activeAgents: number
  systemHealth: number
}
