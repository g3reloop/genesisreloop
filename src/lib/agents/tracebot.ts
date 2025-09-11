import { BaseAgent } from './base-agent'
import { AgentJob, TraceBatch, LoopState } from '@/types/agents'
import { createHash } from 'crypto'

interface TraceEvent {
  type: 'pickup' | 'delivery' | 'processing' | 'quality_check' | 'completion'
  timestamp: Date
  location?: {
    lat: number
    lng: number
  }
  data: any
}

export class TraceBot extends BaseAgent {
  constructor() {
    super({
      name: 'TraceBot',
      queueName: 'agents.tracebot.ingest',
      batchSize: 10,
      concurrency: 3
    })
  }

  async process(job: AgentJob): Promise<any> {
    const event: TraceEvent = job.payload
    
    switch (event.type) {
      case 'pickup':
        return this.processPickup(event)
      case 'delivery':
        return this.processDelivery(event)
      case 'quality_check':
        return this.processQualityCheck(event)
      case 'completion':
        return this.processBatchCompletion(event)
      default:
        throw new Error(`Unknown event type: ${event.type}`)
    }
  }

  private async processPickup(event: TraceEvent): Promise<any> {
    const { batchId, weight, volume, photos, location, collectorId } = event.data

    // Create or update batch
    const batch: TraceBatch = {
      id: batchId,
      type: this.inferProductType(event.data),
      weight,
      volume,
      timestamps: {
        pickup: event.timestamp
      },
      geoChain: [{
        lat: location.lat,
        lng: location.lng,
        timestamp: event.timestamp,
        event: 'pickup'
      }],
      photos: photos || [],
      labDocs: [],
      operatorId: collectorId
    }

    // Store initial trace
    await this.storeBatch(batch)
    
    // Generate initial hash
    const hash = this.generateHash(batch)
    
    return { batchId, hash, event: 'pickup_recorded' }
  }

  private async processDelivery(event: TraceEvent): Promise<any> {
    const { batchId, location, processorId, photos } = event.data

    // Fetch existing batch
    const batch = await this.fetchBatch(batchId)
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`)
    }

    // Update batch
    batch.timestamps.delivery = event.timestamp
    batch.geoChain.push({
      lat: location.lat,
      lng: location.lng,
      timestamp: event.timestamp,
      event: 'delivery'
    })
    
    if (photos) {
      batch.photos.push(...photos)
    }

    // Verify chain integrity
    const isValid = await this.verifyChainIntegrity(batch)
    if (!isValid) {
      await this.flagBatchIssue(batchId, 'Chain integrity violation')
    }

    // Update stored batch
    await this.updateBatch(batch)
    
    return { batchId, event: 'delivery_recorded', chainValid: isValid }
  }

  private async processQualityCheck(event: TraceEvent): Promise<any> {
    const { batchId, labResults, documents } = event.data

    const batch = await this.fetchBatch(batchId)
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`)
    }

    // Add lab documents
    if (documents) {
      batch.labDocs.push(...documents)
    }

    // Analyze quality for SRL classification
    const qualityScore = this.analyzeQuality(labResults)
    const srlEligible = this.checkSrlEligibility(batch, qualityScore)

    // Update batch
    await this.updateBatch(batch)

    return { 
      batchId, 
      event: 'quality_recorded',
      qualityScore,
      srlEligible 
    }
  }

  private async processBatchCompletion(event: TraceEvent): Promise<any> {
    const { batchId, outputProducts, energyYield } = event.data

    const batch = await this.fetchBatch(batchId)
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`)
    }

    batch.timestamps.completion = event.timestamp

    // Determine final SRL state
    const srlState = await this.determineSrlState(batch)
    batch.srlState = srlState

    // Generate merkle tree for all events
    const merkleRoot = await this.generateMerkleRoot(batch)
    batch.merkleRoot = merkleRoot

    // Final hash with all data
    batch.hash = this.generateHash(batch)

    // Store completed batch
    await this.updateBatch(batch)

    // Emit completion event
    this.emit('batch:completed', {
      batchId,
      srlState,
      hash: batch.hash,
      merkleRoot
    })

    return {
      batchId,
      event: 'batch_completed',
      srlState,
      hash: batch.hash,
      merkleRoot
    }
  }

  private inferProductType(data: any): string {
    // Infer from context
    if (data.feedstockType) return data.feedstockType
    if (data.productType) return data.productType
    
    // Default based on processor type
    if (data.processorType === 'biogas') return 'FW'
    if (data.processorType === 'biodiesel') return 'UCO'
    
    return 'FW' // Default
  }

  private generateHash(batch: TraceBatch): string {
    const data = JSON.stringify({
      id: batch.id,
      type: batch.type,
      weight: batch.weight,
      volume: batch.volume,
      timestamps: batch.timestamps,
      geoChain: batch.geoChain,
      operatorId: batch.operatorId
    })

    return createHash('sha256').update(data).digest('hex')
  }

  private async verifyChainIntegrity(batch: TraceBatch): Promise<boolean> {
    // Check temporal sequence
    const events = batch.geoChain.map(e => e.timestamp.getTime())
    for (let i = 1; i < events.length; i++) {
      if (events[i] < events[i - 1]) {
        return false // Events out of order
      }
    }

    // Check geographic continuity (no teleportation)
    for (let i = 1; i < batch.geoChain.length; i++) {
      const prev = batch.geoChain[i - 1]
      const curr = batch.geoChain[i]
      const timeDiff = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000 / 60 // minutes
      const distance = this.calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng)
      
      // Max speed 120 km/h
      const maxDistance = (timeDiff / 60) * 120
      if (distance > maxDistance) {
        return false // Too far for time elapsed
      }
    }

    return true
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private analyzeQuality(labResults: any): number {
    // Simplified quality scoring
    let score = 100

    if (labResults.moisture > 15) score -= 10
    if (labResults.contamination > 5) score -= 20
    if (labResults.ffa > 10) score -= 15 // For UCO
    
    return Math.max(score, 0)
  }

  private checkSrlEligibility(batch: TraceBatch, qualityScore: number): boolean {
    // SRL requires high quality and short supply chain
    if (qualityScore < 80) return false
    
    // Check time from pickup to delivery
    if (batch.timestamps.pickup && batch.timestamps.delivery) {
      const transitTime = batch.timestamps.delivery.getTime() - batch.timestamps.pickup.getTime()
      const maxTransitTime = 24 * 60 * 60 * 1000 // 24 hours
      if (transitTime > maxTransitTime) return false
    }

    // Check distance
    if (batch.geoChain.length >= 2) {
      const start = batch.geoChain[0]
      const end = batch.geoChain[batch.geoChain.length - 1]
      const distance = this.calculateDistance(start.lat, start.lng, end.lat, end.lng)
      if (distance > 50) return false // Max 50km for SRL
    }

    return true
  }

  private async determineSrlState(batch: TraceBatch): Promise<LoopState> {
    // Check all SRL criteria
    const criteria = {
      qualityMet: false,
      distanceMet: false,
      timeMet: false,
      traceabilityMet: false
    }

    // Quality check
    if (batch.labDocs.length > 0) {
      // In production, parse lab docs
      criteria.qualityMet = true
    }

    // Distance check
    if (batch.geoChain.length >= 2) {
      const start = batch.geoChain[0]
      const end = batch.geoChain[batch.geoChain.length - 1]
      const distance = this.calculateDistance(start.lat, start.lng, end.lat, end.lng)
      criteria.distanceMet = distance <= 30 // Strict 30km for SRL
    }

    // Time check
    if (batch.timestamps.pickup && batch.timestamps.completion) {
      const totalTime = batch.timestamps.completion.getTime() - batch.timestamps.pickup.getTime()
      criteria.timeMet = totalTime <= 48 * 60 * 60 * 1000 // 48 hours max
    }

    // Traceability check
    criteria.traceabilityMet = 
      batch.photos.length >= 3 && // Min photos
      batch.geoChain.length >= 3 && // Min location points
      batch.labDocs.length >= 1 // Lab verification

    // All criteria must be met for SRL
    const allMet = Object.values(criteria).every(v => v)
    return allMet ? 'SRL' : 'CRL'
  }

  private async generateMerkleRoot(batch: TraceBatch): Promise<string> {
    // Simplified merkle tree - in production use proper implementation
    const leaves = [
      ...batch.geoChain.map(e => this.hashEvent(e)),
      ...batch.photos.map(p => this.hashString(p)),
      ...batch.labDocs.map(d => this.hashString(d))
    ]

    // Build tree
    while (leaves.length > 1) {
      const newLevel = []
      for (let i = 0; i < leaves.length; i += 2) {
        const left = leaves[i]
        const right = leaves[i + 1] || leaves[i]
        const combined = createHash('sha256')
          .update(left + right)
          .digest('hex')
        newLevel.push(combined)
      }
      leaves.splice(0, leaves.length, ...newLevel)
    }

    return leaves[0]
  }

  private hashEvent(event: any): string {
    return createHash('sha256')
      .update(JSON.stringify(event))
      .digest('hex')
  }

  private hashString(str: string): string {
    return createHash('sha256')
      .update(str)
      .digest('hex')
  }

  private async fetchBatch(batchId: string): Promise<TraceBatch | null> {
    // In production, fetch from database
    console.log(`Fetching batch ${batchId}`)
    return null
  }

  private async storeBatch(batch: TraceBatch): Promise<void> {
    // In production, store in database
    console.log(`Storing batch ${batch.id}`)
  }

  private async updateBatch(batch: TraceBatch): Promise<void> {
    // In production, update in database
    console.log(`Updating batch ${batch.id}`)
  }

  private async flagBatchIssue(batchId: string, issue: string): Promise<void> {
    // In production, create alert
    console.log(`Flagging issue for batch ${batchId}: ${issue}`)
    this.emit('batch:issue', { batchId, issue })
  }
}
