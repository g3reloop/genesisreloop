import { BaseAgent } from './base-agent'
import { AgentJob, FeedstockLot, ProcessorMatch } from '@/types/agents'

interface MatcherConfig {
  maxDistanceKm: number
  srlBonus: number
  distanceWeight: number
  capacityWeight: number
  priceWeight: number
  reputationWeight: number
}

export class FeedstockMatcher extends BaseAgent {
  private matcherConfig: MatcherConfig

  constructor() {
    super({
      name: 'FeedstockMatcher',
      queueName: 'agents.feedstockMatcher.jobs',
      batchSize: 5,
      concurrency: 2
    })

    this.matcherConfig = {
      maxDistanceKm: 100,
      srlBonus: 0.2, // 20% boost for SRL matches
      distanceWeight: 0.3,
      capacityWeight: 0.25,
      priceWeight: 0.25,
      reputationWeight: 0.2
    }
  }

  async process(job: AgentJob): Promise<ProcessorMatch[]> {
    const lot: FeedstockLot = job.payload

    // Fetch nearby processors
    const processors = await this.findNearbyProcessors(lot)
    
    // Calculate matches
    const matches = await Promise.all(
      processors.map(processor => this.scoreProcessor(lot, processor))
    )

    // Sort by score
    const sortedMatches = matches
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Top 10 matches

    // Store matches in database
    await this.storeMatches(lot.id, sortedMatches)

    return sortedMatches
  }

  private async findNearbyProcessors(lot: FeedstockLot): Promise<any[]> {
    // In production, this would query PostGIS for processors within radius
    // For now, return mock data
    return [
      {
        id: 'proc-001',
        name: 'Brighton Community Biogas',
        type: lot.type === 'FW' ? 'biogas' : 'biodiesel',
        location: { lat: 50.8225, lng: -0.1372 },
        capacity: 5000, // kg/day
        currentUtilization: 0.7,
        pricePerKg: lot.type === 'FW' ? 0.08 : 0.45,
        reputation: 85,
        isSrlParticipant: true
      },
      {
        id: 'proc-002',
        name: 'Sussex UCO Processing',
        type: 'biodiesel',
        location: { lat: 50.8609, lng: -0.0837 },
        capacity: 3000,
        currentUtilization: 0.6,
        pricePerKg: 0.48,
        reputation: 92,
        isSrlParticipant: false
      }
    ]
  }

  private async scoreProcessor(lot: FeedstockLot, processor: any): Promise<ProcessorMatch> {
    // Calculate distance
    const distance = this.calculateDistance(
      lot.location.lat,
      lot.location.lng,
      processor.location.lat,
      processor.location.lng
    )

    if (distance > this.matcherConfig.maxDistanceKm) {
      return this.createMatch(processor, 0, distance, 0, 0)
    }

    // Calculate component scores (0-1)
    const distanceScore = 1 - (distance / this.matcherConfig.maxDistanceKm)
    const capacityScore = this.calculateCapacityScore(lot.volume, processor)
    const priceScore = this.calculatePriceScore(lot.type, processor.pricePerKg)
    const reputationScore = processor.reputation / 100

    // Calculate SRL score
    const srlScore = this.calculateSrlScore(lot, processor)

    // Weighted total
    let totalScore = 
      distanceScore * this.matcherConfig.distanceWeight +
      capacityScore * this.matcherConfig.capacityWeight +
      priceScore * this.matcherConfig.priceWeight +
      reputationScore * this.matcherConfig.reputationWeight

    // Apply SRL bonus
    if (srlScore > 0.5) {
      totalScore *= (1 + this.matcherConfig.srlBonus)
    }

    // Normalize to 0-100
    totalScore = Math.min(totalScore * 100, 100)

    // Calculate ETA based on distance and typical speed
    const routeEta = new Date(Date.now() + distance * 2 * 60 * 1000) // 2 min/km

    return this.createMatch(
      processor,
      totalScore,
      distance,
      processor.pricePerKg * lot.volume,
      srlScore,
      routeEta
    )
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    // Haversine formula
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1)
    const dLng = this.toRad(lng2 - lng1)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  private calculateCapacityScore(volume: number, processor: any): number {
    const availableCapacity = processor.capacity * (1 - processor.currentUtilization)
    if (volume > availableCapacity) return 0
    
    // Prefer processors with good capacity match
    const utilizationAfter = (processor.capacity * processor.currentUtilization + volume) / processor.capacity
    
    // Optimal utilization is 70-90%
    if (utilizationAfter >= 0.7 && utilizationAfter <= 0.9) return 1
    if (utilizationAfter > 0.9) return 0.7
    return utilizationAfter // Linear up to 70%
  }

  private calculatePriceScore(type: string, pricePerKg: number): number {
    // Compare to market baseline
    const baseline = type === 'FW' ? 0.10 : 0.50
    const ratio = pricePerKg / baseline
    
    if (ratio > 1.2) return 1 // 20% above baseline is great
    if (ratio > 1) return 0.8 + (ratio - 1) // Linear 0.8-1 for 0-20% above
    if (ratio > 0.8) return ratio // Linear 0.8-1 for 80-100% of baseline
    return ratio * 0.5 // Penalize heavily below 80%
  }

  private calculateSrlScore(lot: FeedstockLot, processor: any): number {
    let score = 0

    // Both participate in SRL
    if (lot.srlHint && processor.isSrlParticipant) {
      score += 0.5
    }

    // Same feedstock type preference for SRL
    if ((lot.type === 'FW' && processor.type === 'biogas') ||
        (lot.type === 'UCO' && processor.type === 'biodiesel')) {
      score += 0.3
    }

    // Local loop bonus (very close)
    const distance = this.calculateDistance(
      lot.location.lat,
      lot.location.lng,
      processor.location.lat,
      processor.location.lng
    )
    if (distance < 20) {
      score += 0.2
    }

    return score
  }

  private createMatch(
    processor: any,
    score: number,
    distance: number,
    price: number,
    srlScore: number,
    eta?: Date
  ): ProcessorMatch {
    return {
      processorId: processor.id,
      processorName: processor.name,
      score,
      distanceKm: distance,
      priceEstimate: price,
      routeEta: eta || new Date(),
      srlScore,
      notes: score === 0 ? 'Outside service area' : undefined
    }
  }

  private async storeMatches(lotId: string, matches: ProcessorMatch[]): Promise<void> {
    // In production, store in PostgreSQL
    console.log(`Storing ${matches.length} matches for lot ${lotId}`)
  }
}
