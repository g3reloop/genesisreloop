import { BaseAgent } from './base-agent'
import { AgentJob, ProductType } from '@/types/agents'

interface InventoryItem {
  productType: ProductType
  quantity: number
  specs: {
    quality?: string
    certifications?: string[]
    location: string
  }
  availableFrom: Date
}

interface BuyerLead {
  buyerId: string
  buyerName: string
  buyerType: 'genset' | 'transport' | 'agricultural' | 'industrial'
  fitScore: number
  targetPrice: number
  contractTemplateId: string
  requirements: {
    minQuantity: number
    maxQuantity: number
    qualitySpecs: string[]
    deliveryFrequency: 'daily' | 'weekly' | 'monthly'
  }
  notes?: string
}

export class BuyerDiscoveryBot extends BaseAgent {
  constructor() {
    super({
      name: 'BuyerDiscoveryBot',
      queueName: 'agents.buyerDiscovery.search',
      batchSize: 5,
      concurrency: 2
    })
  }

  async process(job: AgentJob): Promise<BuyerLead[]> {
    const { inventory, region }: { inventory: InventoryItem; region: string } = job.payload

    // Discover potential buyers based on product type
    const potentialBuyers = await this.findPotentialBuyers(inventory.productType, region)
    
    // Score and rank buyers
    const leads = await Promise.all(
      potentialBuyers.map(buyer => this.scoreBuyer(inventory, buyer))
    )

    // Sort by fit score
    const sortedLeads = leads
      .filter(lead => lead.fitScore > 0.3) // Min 30% fit
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 10)

    // Store leads
    await this.storeLeads(inventory, sortedLeads)

    return sortedLeads
  }

  private async findPotentialBuyers(productType: ProductType, region: string): Promise<any[]> {
    // Mock buyers - in production, query from database
    const buyerDatabase = {
      BIODIESEL: [
        {
          id: 'buyer-001',
          name: 'Brighton Bus Company',
          type: 'transport',
          location: { lat: 50.8274, lng: -0.1524 },
          requirements: {
            minQuantity: 1000,
            maxQuantity: 5000,
            qualitySpecs: ['EN 14214', 'FAME content >96%'],
            deliveryFrequency: 'weekly',
            preferredSuppliers: ['local']
          },
          historicalPrices: [0.95, 0.98, 0.93], // £/L
          active: true
        },
        {
          id: 'buyer-002',
          name: 'Sussex Freight Ltd',
          type: 'transport',
          location: { lat: 50.8609, lng: -0.0837 },
          requirements: {
            minQuantity: 2000,
            maxQuantity: 10000,
            qualitySpecs: ['EN 14214'],
            deliveryFrequency: 'weekly',
            preferredSuppliers: []
          },
          historicalPrices: [0.92, 0.94, 0.91],
          active: true
        }
      ],
      BIOGAS: [
        {
          id: 'buyer-003',
          name: 'Brighton CHP Station',
          type: 'genset',
          location: { lat: 50.8195, lng: -0.1357 },
          requirements: {
            minQuantity: 500,
            maxQuantity: 2000,
            qualitySpecs: ['CH4 >50%', 'H2S <200ppm'],
            deliveryFrequency: 'daily',
            preferredSuppliers: ['local', 'community']
          },
          historicalPrices: [0.65, 0.68, 0.62], // £/m³
          active: true
        }
      ],
      GLYCEROL: [
        {
          id: 'buyer-004',
          name: 'Sussex Chemicals Ltd',
          type: 'industrial',
          location: { lat: 50.8405, lng: -0.1372 },
          requirements: {
            minQuantity: 500,
            maxQuantity: 2000,
            qualitySpecs: ['Purity >80%', 'Water <15%'],
            deliveryFrequency: 'monthly',
            preferredSuppliers: []
          },
          historicalPrices: [0.45, 0.48, 0.42], // £/kg
          active: true
        }
      ],
      DIGESTATE: [
        {
          id: 'buyer-005',
          name: 'Green Fields Farm',
          type: 'agricultural',
          location: { lat: 50.7934, lng: -0.1098 },
          requirements: {
            minQuantity: 5000,
            maxQuantity: 20000,
            qualitySpecs: ['N >3%', 'P >1%', 'K >2%'],
            deliveryFrequency: 'monthly',
            preferredSuppliers: ['local']
          },
          historicalPrices: [25, 28, 23], // £/tonne
          active: true
        }
      ]
    }

    return buyerDatabase[productType] || []
  }

  private async scoreBuyer(inventory: InventoryItem, buyer: any): Promise<BuyerLead> {
    let fitScore = 0
    const scoreComponents = {
      quantity: 0,
      location: 0,
      quality: 0,
      price: 0,
      relationship: 0
    }

    // Quantity fit (0-1)
    if (inventory.quantity >= buyer.requirements.minQuantity &&
        inventory.quantity <= buyer.requirements.maxQuantity) {
      scoreComponents.quantity = 1
    } else if (inventory.quantity < buyer.requirements.minQuantity) {
      scoreComponents.quantity = inventory.quantity / buyer.requirements.minQuantity
    } else {
      scoreComponents.quantity = 0.5 // Can fulfill partial
    }

    // Location proximity (0-1)
    const distance = this.calculateDistance(
      inventory.specs.location,
      `${buyer.location.lat},${buyer.location.lng}`
    )
    scoreComponents.location = Math.max(0, 1 - distance / 100) // 100km max

    // Quality match (0-1)
    if (inventory.specs.certifications) {
      const matchedSpecs = buyer.requirements.qualitySpecs.filter((spec: string) =>
        inventory.specs.certifications?.includes(spec)
      )
      scoreComponents.quality = matchedSpecs.length / buyer.requirements.qualitySpecs.length
    } else {
      scoreComponents.quality = 0.5 // Unknown quality
    }

    // Price competitiveness (0-1)
    const avgHistoricalPrice = buyer.historicalPrices.reduce((a: number, b: number) => a + b) / buyer.historicalPrices.length
    const targetPrice = avgHistoricalPrice * 0.95 // 5% below average
    scoreComponents.price = 0.8 // Simplified - in production, compare to market

    // Relationship bonus
    if (buyer.requirements.preferredSuppliers.includes('local') && distance < 30) {
      scoreComponents.relationship = 0.2
    }
    if (buyer.requirements.preferredSuppliers.includes('community')) {
      scoreComponents.relationship += 0.1
    }

    // Weighted total
    fitScore = 
      scoreComponents.quantity * 0.3 +
      scoreComponents.location * 0.2 +
      scoreComponents.quality * 0.3 +
      scoreComponents.price * 0.15 +
      scoreComponents.relationship * 0.05

    return {
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerType: buyer.type,
      fitScore,
      targetPrice,
      contractTemplateId: this.selectContractTemplate(buyer.type, inventory.productType),
      requirements: buyer.requirements,
      notes: this.generateNotes(scoreComponents, buyer)
    }
  }

  private calculateDistance(loc1: string, loc2: string): number {
    // Simplified - in production use proper geocoding
    return Math.random() * 50 // Random 0-50km
  }

  private selectContractTemplate(buyerType: string, productType: ProductType): string {
    const templates: Record<string, string> = {
      'transport_BIODIESEL': 'TPL-BD-TRANSPORT-001',
      'genset_BIOGAS': 'TPL-BG-GENSET-001',
      'industrial_GLYCEROL': 'TPL-GL-INDUSTRIAL-001',
      'agricultural_DIGESTATE': 'TPL-DG-AGRI-001'
    }
    return templates[`${buyerType}_${productType}`] || 'TPL-STANDARD-001'
  }

  private generateNotes(scores: any, buyer: any): string {
    const notes = []
    
    if (scores.quantity === 1) {
      notes.push('Perfect quantity match')
    } else if (scores.quantity < 0.5) {
      notes.push('Below minimum quantity requirement')
    }

    if (scores.location > 0.8) {
      notes.push('Excellent location match')
    }

    if (buyer.requirements.preferredSuppliers.includes('community')) {
      notes.push('Prefers community suppliers')
    }

    return notes.join('. ')
  }

  private async storeLeads(inventory: InventoryItem, leads: BuyerLead[]): Promise<void> {
    console.log(`Storing ${leads.length} buyer leads for ${inventory.productType}`)
    // In production, store in database
  }
}
