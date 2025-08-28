import { BaseAgent } from './base-agent'
import { AgentJob, ReputationScore } from '@/types/agents'

interface ReputationEvent {
  entityId: string
  eventType: 'delivery' | 'quality' | 'srl_batch' | 'dispute' | 'payment'
  timestamp: Date
  score: number // -1 to 1
  weight: number // Importance multiplier
  details?: any
}

interface EntityMetrics {
  totalDeliveries: number
  onTimeDeliveries: number
  qualityChecks: number
  qualityPasses: number
  srlBatches: number
  totalBatches: number
  disputes: number
  resolvedDisputes: number
  paymentDelays: number
  lastActive: Date
}

export class ReputationBot extends BaseAgent {
  constructor() {
    super({
      name: 'ReputationBot',
      queueName: 'agents.reputation.recompute',
      batchSize: 20,
      concurrency: 5
    })
  }

  async process(job: AgentJob): Promise<ReputationScore> {
    const { entityId, trigger }: { 
      entityId: string; 
      trigger: 'scheduled' | 'event' | 'manual' 
    } = job.payload

    console.log(`Computing reputation for ${entityId} (trigger: ${trigger})`)

    // Fetch entity type and metrics
    const entityType = await this.getEntityType(entityId)
    const metrics = await this.fetchEntityMetrics(entityId)
    const recentEvents = await this.fetchRecentEvents(entityId)

    // Calculate component scores
    const components = this.calculateComponents(metrics, entityType)
    
    // Apply event-based adjustments
    const adjustedComponents = this.applyEventAdjustments(components, recentEvents)
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(adjustedComponents, entityType)
    
    // Generate explanations
    const explanations = this.generateExplanations(adjustedComponents, metrics, recentEvents)

    // Create reputation score
    const score: ReputationScore = {
      entityId,
      entityType,
      score: overallScore,
      components: adjustedComponents,
      explanations,
      updatedAt: new Date()
    }

    // Store score
    await this.storeReputationScore(score)

    // Check for significant changes
    await this.checkReputationAlerts(entityId, score)

    return score
  }

  private async getEntityType(entityId: string): Promise<'supplier' | 'collector' | 'processor' | 'buyer'> {
    // In production, lookup from database
    if (entityId.startsWith('SUP')) return 'supplier'
    if (entityId.startsWith('COL')) return 'collector'
    if (entityId.startsWith('PROC')) return 'processor'
    if (entityId.startsWith('BUY')) return 'buyer'
    return 'supplier'
  }

  private async fetchEntityMetrics(entityId: string): Promise<EntityMetrics> {
    // In production, aggregate from transaction history
    return {
      totalDeliveries: Math.floor(Math.random() * 100) + 50,
      onTimeDeliveries: Math.floor(Math.random() * 90) + 40,
      qualityChecks: Math.floor(Math.random() * 80) + 30,
      qualityPasses: Math.floor(Math.random() * 70) + 25,
      srlBatches: Math.floor(Math.random() * 30) + 10,
      totalBatches: Math.floor(Math.random() * 100) + 50,
      disputes: Math.floor(Math.random() * 5),
      resolvedDisputes: Math.floor(Math.random() * 4),
      paymentDelays: Math.floor(Math.random() * 10),
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Within 30 days
    }
  }

  private async fetchRecentEvents(entityId: string): Promise<ReputationEvent[]> {
    // In production, fetch from events table
    const mockEvents: ReputationEvent[] = []
    
    // Generate some random events
    const eventTypes = ['delivery', 'quality', 'srl_batch', 'payment'] as const
    const numEvents = Math.floor(Math.random() * 10) + 5

    for (let i = 0; i < numEvents; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      mockEvents.push({
        entityId,
        eventType,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        score: Math.random() > 0.8 ? -0.5 : Math.random(), // 20% negative events
        weight: eventType === 'srl_batch' ? 2 : 1, // SRL batches worth double
        details: {}
      })
    }

    return mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  private calculateComponents(
    metrics: EntityMetrics, 
    entityType: string
  ): ReputationScore['components'] {
    const components = {
      onTimeDelivery: 0,
      qualityConsistency: 0,
      srlRatio: 0,
      disputeRate: 0
    }

    // On-time delivery (0-100)
    if (metrics.totalDeliveries > 0) {
      components.onTimeDelivery = Math.round(
        (metrics.onTimeDeliveries / metrics.totalDeliveries) * 100
      )
    } else {
      components.onTimeDelivery = 50 // No data, neutral score
    }

    // Quality consistency (0-100)
    if (metrics.qualityChecks > 0) {
      components.qualityConsistency = Math.round(
        (metrics.qualityPasses / metrics.qualityChecks) * 100
      )
    } else {
      components.qualityConsistency = 50
    }

    // SRL ratio (0-100) - bonus for participating in sustainable loops
    if (metrics.totalBatches > 0) {
      const srlRatio = metrics.srlBatches / metrics.totalBatches
      // Give bonus points for any SRL participation
      components.srlRatio = Math.round(Math.min(srlRatio * 150, 100))
    } else {
      components.srlRatio = 0
    }

    // Dispute rate (0-100, inverted - lower is better)
    const disputeScore = metrics.totalDeliveries > 0
      ? 1 - (metrics.disputes / metrics.totalDeliveries)
      : 1
    components.disputeRate = Math.round(disputeScore * 100)

    return components
  }

  private applyEventAdjustments(
    components: ReputationScore['components'],
    events: ReputationEvent[]
  ): ReputationScore['components'] {
    const adjusted = { ...components }

    // Apply recent event impacts
    events.forEach(event => {
      const impact = event.score * event.weight * this.getRecencyMultiplier(event.timestamp)
      
      switch (event.eventType) {
        case 'delivery':
          adjusted.onTimeDelivery = Math.max(0, Math.min(100, 
            adjusted.onTimeDelivery + impact * 10
          ))
          break
        case 'quality':
          adjusted.qualityConsistency = Math.max(0, Math.min(100,
            adjusted.qualityConsistency + impact * 15
          ))
          break
        case 'srl_batch':
          adjusted.srlRatio = Math.max(0, Math.min(100,
            adjusted.srlRatio + impact * 20
          ))
          break
        case 'dispute':
          adjusted.disputeRate = Math.max(0, Math.min(100,
            adjusted.disputeRate + impact * 25
          ))
          break
      }
    })

    return adjusted
  }

  private getRecencyMultiplier(timestamp: Date): number {
    // More recent events have higher impact
    const daysAgo = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24)
    if (daysAgo < 7) return 1.0
    if (daysAgo < 14) return 0.8
    if (daysAgo < 30) return 0.6
    if (daysAgo < 90) return 0.4
    return 0.2
  }

  private calculateOverallScore(
    components: ReputationScore['components'],
    entityType: string
  ): number {
    // Different weights for different entity types
    const weights = this.getWeightsByType(entityType)
    
    const weightedSum = 
      components.onTimeDelivery * weights.onTime +
      components.qualityConsistency * weights.quality +
      components.srlRatio * weights.srl +
      components.disputeRate * weights.dispute

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
    
    return Math.round(weightedSum / totalWeight)
  }

  private getWeightsByType(entityType: string): Record<string, number> {
    const weightProfiles = {
      supplier: {
        onTime: 0.25,
        quality: 0.35,
        srl: 0.25,
        dispute: 0.15
      },
      collector: {
        onTime: 0.40,
        quality: 0.20,
        srl: 0.25,
        dispute: 0.15
      },
      processor: {
        onTime: 0.20,
        quality: 0.40,
        srl: 0.30,
        dispute: 0.10
      },
      buyer: {
        onTime: 0.15,
        quality: 0.15,
        srl: 0.20,
        dispute: 0.50 // Payment reliability most important
      }
    }

    return weightProfiles[entityType as keyof typeof weightProfiles] || weightProfiles.supplier
  }

  private generateExplanations(
    components: ReputationScore['components'],
    metrics: EntityMetrics,
    events: ReputationEvent[]
  ): string[] {
    const explanations: string[] = []

    // Performance explanations
    if (components.onTimeDelivery >= 90) {
      explanations.push('Excellent delivery performance')
    } else if (components.onTimeDelivery < 70) {
      explanations.push('Delivery performance needs improvement')
    }

    if (components.qualityConsistency >= 95) {
      explanations.push('Outstanding quality consistency')
    } else if (components.qualityConsistency < 80) {
      explanations.push('Quality metrics below target')
    }

    // SRL participation
    if (components.srlRatio >= 50) {
      explanations.push('Strong commitment to sustainable loops')
    } else if (components.srlRatio >= 25) {
      explanations.push('Active in SRL participation')
    } else if (components.srlRatio > 0) {
      explanations.push('Limited SRL participation')
    }

    // Recent events
    const recentPositive = events.filter(e => e.score > 0.5 && 
      (Date.now() - e.timestamp.getTime()) < 7 * 24 * 60 * 60 * 1000
    ).length
    const recentNegative = events.filter(e => e.score < -0.3 && 
      (Date.now() - e.timestamp.getTime()) < 7 * 24 * 60 * 60 * 1000
    ).length

    if (recentPositive > 3) {
      explanations.push('Recent positive trend')
    }
    if (recentNegative > 0) {
      explanations.push(`${recentNegative} recent issues require attention`)
    }

    // Activity level
    const daysSinceActive = (Date.now() - metrics.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActive > 30) {
      explanations.push('Low recent activity')
    }

    return explanations
  }

  private async storeReputationScore(score: ReputationScore): Promise<void> {
    console.log(`Storing reputation score for ${score.entityId}: ${score.score}`)
    // In production, store in database
  }

  private async checkReputationAlerts(entityId: string, newScore: ReputationScore): Promise<void> {
    // In production, fetch previous score
    const previousScore = 75 // Mock

    const change = newScore.score - previousScore
    
    if (Math.abs(change) >= 10) {
      console.log(`Significant reputation change for ${entityId}: ${change > 0 ? '+' : ''}${change}`)
      
      // Trigger alerts
      if (change < -20) {
        await this.triggerAlert('reputation_drop', { entityId, change, newScore })
      } else if (change > 20) {
        await this.triggerAlert('reputation_boost', { entityId, change, newScore })
      }
    }

    // Check absolute thresholds
    if (newScore.score < 50) {
      await this.triggerAlert('low_reputation', { entityId, score: newScore.score })
    }
  }

  private async triggerAlert(type: string, data: any): Promise<void> {
    console.log(`Alert triggered: ${type}`, data)
    // In production, send to notification service
  }
}
