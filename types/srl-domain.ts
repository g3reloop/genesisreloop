// Stabilized Regenerative Loop (SRL) Domain Types
// Waste→Energy/Materials Domain Specification

// Core Actors
export type SRLActor = 'Entrustor' | 'Custodian' | 'Broker' | 'Offtaker' | 'LogisticsProvider'

// Process States for Chain of Custody
export enum ProcessState {
  ENTRUSTED = 'entrusted',
  TRANSPORT_PICKUP = 'transport_pickup', 
  RECEIVED_AT_FACILITY = 'received_at_facility',
  QA_VERIFIED = 'qa_verified',
  SORTED = 'sorted',
  PROCESSING_START = 'processing_start',
  DIGESTED = 'digested',
  PROCESSED = 'processed',
  DISPOSED = 'disposed',
  OUTPUT_GENERATED = 'output_generated'
}

// Chain of Custody Log Entry
export interface CoCLogEntry {
  entryId: string // UUID
  assetId: string // UUID
  actorVOC: string // Verifiable Credential
  timestamp: string // ISO 8601
  geolocation?: {
    lat: number
    lon: number
  }
  processState: ProcessState
  notes?: string
  evidenceHash: string // SHA-256 hash
}

// Digital Twin Representation
export interface AssetDigitalTwin {
  assetId: string // UUID
  entrustmentAgreementId: string // UUID
  currentState: ProcessState
  currentCustodianId: string // VOC
  CoCHistory: string[] // Array of CoCLogEntry IDs
}

// Feedstock Types
export interface FeedstockDeclaration {
  feedstockType: 'UCO' | 'FoodWaste' | 'AgriculturalWaste' | 'Other'
  composition: string
  estimatedWeight: number // kg
  knownContaminants?: string
  photoEvidenceUrls?: string[]
  entrustorSignature: string // Digital signature
  timestamp: string
}

// QA Verification
export interface QAVerification {
  assetId: string
  declaredComposition: string
  actualComposition: string
  weight: number
  contaminantLevels: {
    type: string
    level: number
    unit: string
  }[]
  sensorReadings: {
    sensorType: string
    value: number
    unit: string
    timestamp: string
  }[]
  verifierVOC: string
  passed: boolean
  misrepresentationFlag?: boolean
}

// IoT Sensor Types
export interface SensorReading {
  sensorId: string
  sensorType: 'scale' | 'spectrometer' | 'chemical' | 'e-nose' | 'sound' | 'particulate' | 'temperature' | 'pressure' | 'methane'
  value: number
  unit: string
  timestamp: string
  signature: string // Cryptographic signature
  calibrationCertId?: string
}

// Nuisance Event
export interface NuisanceEvent {
  eventId: string // UUID
  facilityId: string
  sensorId: string
  timestamp: string
  dataType: 'odour_ppm' | 'noise_db' | 'particulate_pm25' | 'particulate_pm10'
  value: number
  threshold: number
  duration_seconds: number
}

// Breach Types
export enum BreachType {
  SPILL_CONTAMINATION = 'SPILL_CONTAMINATION',
  BROKEN_CHAIN_OF_CUSTODY = 'BROKEN_CHAIN_OF_CUSTODY',
  MATERIAL_MISREPRESENTATION = 'MATERIAL_MISREPRESENTATION',
  NUISANCE_VIOLATION = 'NUISANCE_VIOLATION'
}

// Remedy Process
export interface RemedyCase {
  caseId: string
  breachType: BreachType
  assetId?: string
  facilityId?: string
  reportedAt: string
  status: 'open' | 'investigation' | 'remedy_ordered' | 'completed' | 'escalated'
  breachedPrinciples: string[]
  evidenceItems: {
    type: string
    url: string
    hash: string
    submittedBy: string
  }[]
  remedyOrders?: {
    type: 'abatement' | 'restitution' | 'cleanup'
    description: string
    dueDate: string
    completionEvidence?: string
  }[]
  communicationLog: {
    timestamp: string
    from: string
    message: string
  }[]
}

// Offtake Agreement
export interface OfftakeAgreement {
  agreementId: string
  custodianId: string
  offtakerId: string
  productType: 'electricity_kwh' | 'digestate_tonnes' | 'recycled_material' | 'biogas_m3'
  quantity: number
  unit: string
  pricePerUnit: number
  currency: string
  deliverySchedule: {
    startDate: string
    endDate: string
    frequency: 'daily' | 'weekly' | 'monthly' | 'on_demand'
  }
  status: 'draft' | 'active' | 'fulfilled' | 'terminated'
}

// Transport Handover
export interface TransportHandover {
  handoverId: string
  assetId: string
  fromCustodianVOC: string
  toCustodianVOC: string
  timestamp: string
  geolocation: {
    lat: number
    lon: number
  }
  vehicleId?: string
  sealNumber?: string
  photoEvidence?: string
  signature: string
}

// Automated Alert Rules
export interface AlertRule {
  ruleId: string
  name: string
  description: string
  condition: {
    type: 'missing_entry' | 'threshold_breach' | 'time_limit'
    parameters: Record<string, any>
  }
  action: {
    type: 'notify' | 'escalate' | 'create_case'
    recipients: string[]
    message: string
  }
}

// Entrustment Agreement
export interface FeedstockEntrustmentAgreement {
  agreementId: string
  entrustorVOC: string
  custodianVOC: string
  feedstockDeclaration: FeedstockDeclaration
  acceptedTerms: {
    propertySewardship: boolean
    dutyOfCare: boolean
    truthAndHonour: boolean
    consentToProcess: boolean
  }
  createdAt: string
  expiresAt?: string
  status: 'active' | 'completed' | 'revoked'
}

// Service Definitions
export interface SRLService {
  serviceId: string
  title: string
  description: string
  actors: SRLActor[]
  requiredCapabilities: string[]
}

// Legal Principles
export interface LegalPrinciple {
  principleId: string
  title: string
  description: string
  enforcementMechanism: string
}

// Compliance Status
export interface ComplianceStatus {
  facilityId: string
  timestamp: string
  nuisanceLevels: {
    odour: { value: number; threshold: number; unit: 'ppm' }
    noise: { value: number; threshold: number; unit: 'dB' }
    particulates: { value: number; threshold: number; unit: 'mg/m3' }
  }
  activeAlerts: AlertRule[]
  openCases: string[] // RemedyCase IDs
  complianceScore: number // 0-100
}
