import { BaseAgent } from './base-agent'
import { AgentJob, CarbonCredit, TraceBatch } from '@/types/agents'
import { createHash } from 'crypto'

interface CarbonCalculation {
  batchId: string
  tCO2eAvoided: number
  calculationMethod: string
  baselineFactor: number
  evidencePackId: string
  breakdown: {
    landfillAvoidance?: number
    transportEmissions?: number
    processingEmissions?: number
    energySubstitution?: number
    netAvoided: number
  }
  confidence: 'high' | 'medium' | 'low'
}

// Emission factors (tCO2e per unit)
const EMISSION_FACTORS = {
  FW_LANDFILL: 0.467, // tCO2e per tonne food waste to landfill
  UCO_DISPOSAL: 2.84, // tCO2e per tonne UCO improper disposal
  DIESEL_COMBUSTION: 2.68, // kgCO2e per liter
  NATURAL_GAS: 2.02, // kgCO2e per m³
  TRANSPORT: 0.00012, // tCO2e per tonne-km
  BIOGAS_YIELD: 100, // m³ per tonne FW
  BIODIESEL_YIELD: 0.9, // L per L UCO
}

export class CarbonVerifier extends BaseAgent {
  constructor() {
    super({
      name: 'CarbonVerifier',
      queueName: 'agents.carbon.compute',
      batchSize: 10,
      concurrency: 3
    })
  }

  async process(job: AgentJob): Promise<CarbonCredit> {
    const { batchId, traceRecord }: { batchId: string; traceRecord: TraceBatch } = job.payload

    // Verify feature flag
    const tokenizationEnabled = await this.checkFeatureFlag('tokenization')
    if (!tokenizationEnabled) {
      console.log('Carbon tokenization disabled - recording internally only')
    }

    // Calculate avoided emissions
    const calculation = await this.calculateCarbon(traceRecord)
    
    // Generate evidence pack
    const evidencePackId = await this.createEvidencePack(traceRecord, calculation)
    
    // Create carbon credit record
    const credit: CarbonCredit = {
      batchId,
      tCO2eAvoided: calculation.tCO2eAvoided,
      calculationMethod: calculation.calculationMethod,
      baselineFactor: calculation.baselineFactor,
      evidencePackId,
      createdAt: new Date()
    }

    // Store in internal ledger
    await this.storeCarbonCredit(credit)

    // If tokenization enabled, prepare for on-chain recording
    if (tokenizationEnabled) {
      await this.prepareForTokenization(credit)
    }

    return credit
  }

  private async calculateCarbon(batch: TraceBatch): Promise<CarbonCalculation> {
    const breakdown = {
      landfillAvoidance: 0,
      transportEmissions: 0,
      processingEmissions: 0,
      energySubstitution: 0,
      netAvoided: 0
    }

    let baselineFactor = 0
    let calculationMethod = ''
    let confidence: 'high' | 'medium' | 'low' = 'medium'

    // Calculate based on waste type
    if (batch.type === 'FW' && batch.weight) {
      // Food waste to biogas
      const tonnesFW = batch.weight / 1000
      
      // Avoided landfill emissions
      breakdown.landfillAvoidance = tonnesFW * EMISSION_FACTORS.FW_LANDFILL
      baselineFactor = EMISSION_FACTORS.FW_LANDFILL
      
      // Transport emissions (negative)
      const transportDistance = this.calculateTransportDistance(batch)
      breakdown.transportEmissions = -(tonnesFW * transportDistance * EMISSION_FACTORS.TRANSPORT)
      
      // Processing emissions (estimate)
      breakdown.processingEmissions = -(tonnesFW * 0.05) // 50kg CO2e per tonne
      
      // Energy substitution (biogas replacing natural gas)
      const biogasYield = tonnesFW * EMISSION_FACTORS.BIOGAS_YIELD
      breakdown.energySubstitution = (biogasYield * EMISSION_FACTORS.NATURAL_GAS) / 1000
      
      calculationMethod = 'IPCC 2006 Tier 2 - Food Waste Diversion'
      confidence = batch.srlState === 'SRL' ? 'high' : 'medium'
      
    } else if (batch.type === 'UCO' && batch.volume) {
      // UCO to biodiesel
      const litresUCO = batch.volume
      const tonnesUCO = litresUCO * 0.00092 // Density ~0.92 kg/L
      
      // Avoided improper disposal
      breakdown.landfillAvoidance = tonnesUCO * EMISSION_FACTORS.UCO_DISPOSAL
      baselineFactor = EMISSION_FACTORS.UCO_DISPOSAL
      
      // Transport emissions
      const transportDistance = this.calculateTransportDistance(batch)
      breakdown.transportEmissions = -(tonnesUCO * transportDistance * EMISSION_FACTORS.TRANSPORT)
      
      // Processing emissions
      breakdown.processingEmissions = -(litresUCO * 0.0003) // 0.3kg CO2e per liter
      
      // Energy substitution (biodiesel replacing diesel)
      const biodieselYield = litresUCO * EMISSION_FACTORS.BIODIESEL_YIELD
      breakdown.energySubstitution = (biodieselYield * EMISSION_FACTORS.DIESEL_COMBUSTION) / 1000
      
      calculationMethod = 'EU RED II - UCO to Biodiesel'
      confidence = batch.labDocs.length > 0 ? 'high' : 'medium'
    }

    // Calculate net avoided
    breakdown.netAvoided = 
      breakdown.landfillAvoidance +
      breakdown.transportEmissions +
      breakdown.processingEmissions +
      breakdown.energySubstitution

    // Reduce confidence if missing data
    if (!batch.timestamps.completion || batch.photos.length < 3) {
      confidence = 'low'
    }

    return {
      batchId: batch.id,
      tCO2eAvoided: Math.max(0, breakdown.netAvoided), // Never negative
      calculationMethod,
      baselineFactor,
      evidencePackId: '', // Will be set later
      breakdown,
      confidence
    }
  }

  private calculateTransportDistance(batch: TraceBatch): number {
    // Calculate total distance from geo chain
    if (batch.geoChain.length < 2) return 0

    let totalDistance = 0
    for (let i = 1; i < batch.geoChain.length; i++) {
      const prev = batch.geoChain[i - 1]
      const curr = batch.geoChain[i]
      totalDistance += this.haversineDistance(
        prev.lat, prev.lng,
        curr.lat, curr.lng
      )
    }

    return totalDistance
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private async createEvidencePack(batch: TraceBatch, calculation: CarbonCalculation): Promise<string> {
    const evidence = {
      batchData: {
        id: batch.id,
        type: batch.type,
        weight: batch.weight,
        volume: batch.volume,
        srlState: batch.srlState,
        hash: batch.hash,
        merkleRoot: batch.merkleRoot
      },
      calculation: {
        method: calculation.calculationMethod,
        breakdown: calculation.breakdown,
        confidence: calculation.confidence,
        timestamp: new Date().toISOString()
      },
      supporting: {
        photoCount: batch.photos.length,
        labDocCount: batch.labDocs.length,
        geoPoints: batch.geoChain.length,
        timeInChain: this.calculateChainTime(batch)
      }
    }

    // Generate evidence pack ID
    const packHash = createHash('sha256')
      .update(JSON.stringify(evidence))
      .digest('hex')

    const packId = `EVIDENCE-${batch.id}-${packHash.substring(0, 8)}`

    // In production, store evidence pack in S3/IPFS
    console.log(`Created evidence pack: ${packId}`)

    return packId
  }

  private calculateChainTime(batch: TraceBatch): number {
    if (!batch.timestamps.pickup || !batch.timestamps.completion) return 0
    
    return (
      batch.timestamps.completion.getTime() - 
      batch.timestamps.pickup.getTime()
    ) / 1000 / 60 / 60 // Hours
  }

  private async checkFeatureFlag(flag: string): Promise<boolean> {
    // In production, check from database/config service
    return false // Carbon tokenization off by default
  }

  private async storeCarbonCredit(credit: CarbonCredit): Promise<void> {
    console.log(`Storing carbon credit: ${credit.batchId} - ${credit.tCO2eAvoided} tCO2e`)
    // In production, store in PostgreSQL carbon_ledger table
  }

  private async prepareForTokenization(credit: CarbonCredit): Promise<void> {
    // Prepare for GIRM token minting when enabled
    console.log(`Preparing credit ${credit.batchId} for tokenization`)
    
    // Would include:
    // - Merkle proof generation
    // - Contract interaction prep
    // - Compliance checks
  }
}
