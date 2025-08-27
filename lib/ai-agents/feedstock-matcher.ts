import { BaseAgent, AgentInput, AgentOutput } from './base-agent'
import { FeedstockBatch, Supplier, LoopType } from '@/lib/types'

interface FeedstockMatcherInput extends AgentInput {
  batch: FeedstockBatch
  suppliers: Supplier[]
  processorCapacities: {
    processorId: string
    availableCapacity: number
    location: string
  }[]
  trustScores: {
    supplierId: string
    score: number
  }[]
}

interface FeedstockMatcherOutput extends AgentOutput {
  processorAssignment: {
    processorId: string
    priority: number
    estimatedPickupTime: Date
  }
  collectionOrder: {
    supplierId: string
    batchId: string
    urgency: 'high' | 'medium' | 'low'
  }
  notifications: {
    recipientId: string
    message: string
    type: 'sms' | 'email' | 'push'
  }[]
  srlPriority: boolean
}

export class FeedstockMatcher extends BaseAgent {
  constructor() {
    super({
      name: 'FeedstockMatcher',
      description: 'Matches suppliers to processors based on location, capacity, and SRL priority',
      dependencies: ['TraceBot', 'ReputationBot'],
      status: 'live'
    })
  }
  
  async process(input: FeedstockMatcherInput): Promise<FeedstockMatcherOutput> {
    const { batch, processorCapacities, trustScores } = input
    
    // Check if batch is SRL (prioritize SRL loops)
    const srlPriority = batch.loopType === LoopType.SRL
    
    // Find supplier trust score
    const supplierTrust = trustScores.find(ts => ts.supplierId === batch.supplierId)
    const trustMultiplier = supplierTrust ? supplierTrust.score / 10 : 0.5
    
    // Score processors based on multiple factors
    const scoredProcessors = processorCapacities.map(processor => {
      let score = 0
      
      // Capacity availability (higher available capacity = higher score)
      score += (processor.availableCapacity / 1000) * 30
      
      // SRL priority boost
      if (srlPriority) {
        score += 50
      }
      
      // Trust score multiplier
      score *= trustMultiplier
      
      // Random factor for simulation (in production, this would be distance-based)
      score += Math.random() * 20
      
      return {
        ...processor,
        score,
        processorAssignment: {
          processorId: processor.processorId,
          priority: score,
          estimatedPickupTime: this.calculatePickupTime(batch.quantity)
        }
      }
    })
    
    // Sort by score and select the best processor
    const bestProcessor = scoredProcessors.sort((a, b) => b.score - a.score)[0]
    
    // Determine urgency based on batch characteristics
    const urgency = this.determineUrgency(batch, srlPriority)
    
    // Generate notifications
    const notifications = [
      {
        recipientId: batch.supplierId,
        message: `Your batch ${batch.batchCode} has been assigned for collection. Estimated pickup: ${bestProcessor.processorAssignment.estimatedPickupTime.toLocaleString()}`,
        type: 'push' as const
      },
      {
        recipientId: bestProcessor.processorId,
        message: `New ${srlPriority ? 'SRL' : 'standard'} batch ${batch.batchCode} assigned. Quantity: ${batch.quantity}kg`,
        type: 'email' as const
      }
    ]
    
    return {
      processorAssignment: bestProcessor.processorAssignment,
      collectionOrder: {
        supplierId: batch.supplierId,
        batchId: batch.id,
        urgency
      },
      notifications,
      srlPriority
    }
  }
  
  private calculatePickupTime(quantity: number): Date {
    // Simple calculation: base time + time based on quantity
    const baseHours = 24
    const quantityHours = Math.floor(quantity / 100) * 2
    const totalHours = baseHours + quantityHours
    
    const pickupTime = new Date()
    pickupTime.setHours(pickupTime.getHours() + totalHours)
    
    return pickupTime
  }
  
  private determineUrgency(batch: FeedstockBatch, srlPriority: boolean): 'high' | 'medium' | 'low' {
    if (srlPriority) return 'high'
    
    if (batch.quantity > 500) return 'high'
    if (batch.quantity > 200) return 'medium'
    
    return 'low'
  }
}
