export interface ComplianceRule {
  id: string
  name: string
  ewcCodes: string[]
  jurisdiction: 'UK' | 'EU' | 'BOTH'
  conditions: RuleCondition[]
  requirements: ComplianceRequirement[]
  priority: number
}

export interface RuleCondition {
  field: string
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in'
  value: any
}

export interface ComplianceRequirement {
  type: 'permit' | 'document' | 'notification' | 'restriction'
  name: string
  description: string
  mandatory: boolean
  references: string[]
}

export interface LogisticsRule {
  id: string
  name: string
  materialTypes: string[]
  conditions: RuleCondition[]
  constraints: LogisticsConstraint[]
}

export interface LogisticsConstraint {
  type: 'mode' | 'temperature' | 'packaging' | 'routing' | 'timing'
  requirement: string
  params: Record<string, any>
}

export interface PricingRule {
  id: string
  name: string
  materialType: string
  conditions: RuleCondition[]
  pricing: PricingModel
}

export interface PricingModel {
  base: number
  currency: string
  adjustments: PriceAdjustment[]
  floor?: number
  ceiling?: number
  indexLink?: string
}

export interface PriceAdjustment {
  type: 'quality' | 'volume' | 'distance' | 'urgency' | 'market'
  factor: number
  condition?: RuleCondition
}

export class RulesEngine {
  private complianceRules: ComplianceRule[] = []
  private logisticsRules: LogisticsRule[] = []
  private pricingRules: PricingRule[] = []

  constructor() {
    this.loadRules()
  }

  private loadRules() {
    // Load compliance rules
    this.complianceRules = [
      {
        id: 'uk_haz_waste_consignment',
        name: 'UK Hazardous Waste Consignment',
        ewcCodes: ['13*', '14*', '15*', '16*', '17*', '18*', '19*'],
        jurisdiction: 'UK',
        conditions: [
          { field: 'quantity', operator: 'gt', value: 0 }
        ],
        requirements: [
          {
            type: 'document',
            name: 'Hazardous Waste Consignment Note',
            description: 'Required for all movements of hazardous waste',
            mandatory: true,
            references: ['Environmental Protection Act 1990', 'Hazardous Waste Regulations 2005']
          },
          {
            type: 'notification',
            name: 'EA Pre-notification',
            description: 'Notify Environment Agency 3 days before movement',
            mandatory: true,
            references: ['Hazardous Waste Regulations 2005']
          }
        ],
        priority: 1
      },
      {
        id: 'uk_waste_carrier_license',
        name: 'UK Waste Carrier License',
        ewcCodes: ['*'],
        jurisdiction: 'UK',
        conditions: [
          { field: 'transport_mode', operator: 'eq', value: 'road' }
        ],
        requirements: [
          {
            type: 'permit',
            name: 'Waste Carrier License',
            description: 'Required for transporting controlled waste',
            mandatory: true,
            references: ['Control of Pollution Act 1989']
          }
        ],
        priority: 2
      },
      {
        id: 'adr_dangerous_goods',
        name: 'ADR Dangerous Goods Transport',
        ewcCodes: ['13*', '14*', '16*'],
        jurisdiction: 'BOTH',
        conditions: [
          { field: 'transport_mode', operator: 'eq', value: 'road' }
        ],
        requirements: [
          {
            type: 'document',
            name: 'ADR Transport Document',
            description: 'Required for dangerous goods transport',
            mandatory: true,
            references: ['ADR 2023']
          },
          {
            type: 'restriction',
            name: 'ADR Trained Driver',
            description: 'Driver must have ADR certification',
            mandatory: true,
            references: ['ADR 2023 Chapter 8.2']
          }
        ],
        priority: 1
      },
      {
        id: 'abp_animal_byproducts',
        name: 'Animal By-Products Regulations',
        ewcCodes: ['02 02 01', '02 02 02', '02 02 03'],
        jurisdiction: 'UK',
        conditions: [
          { field: 'material_type', operator: 'contains', value: 'animal' }
        ],
        requirements: [
          {
            type: 'document',
            name: 'Commercial Document',
            description: 'ABP commercial document required',
            mandatory: true,
            references: ['EC 1069/2009', 'UK SI 2013/2952']
          },
          {
            type: 'permit',
            name: 'ABP Approved Premises',
            description: 'Destination must be approved for ABP',
            mandatory: true,
            references: ['EC 1069/2009']
          }
        ],
        priority: 1
      }
    ]

    // Load logistics rules
    this.logisticsRules = [
      {
        id: 'temperature_controlled_food_waste',
        name: 'Temperature Controlled Food Waste',
        materialTypes: ['food_waste', 'uco'],
        conditions: [
          { field: 'material_state', operator: 'eq', value: 'liquid' }
        ],
        constraints: [
          {
            type: 'temperature',
            requirement: 'Maintain below 25°C',
            params: { max_temp: 25, unit: 'celsius' }
          },
          {
            type: 'packaging',
            requirement: 'Sealed containers required',
            params: { container_type: 'IBC', seal_required: true }
          }
        ]
      },
      {
        id: 'hazardous_routing_restrictions',
        name: 'Hazardous Material Routing',
        materialTypes: ['hazardous'],
        conditions: [
          { field: 'adr_class', operator: 'in', value: ['3', '6.1', '8'] }
        ],
        constraints: [
          {
            type: 'routing',
            requirement: 'Avoid tunnels category D/E',
            params: { tunnel_restrictions: ['D', 'E'] }
          },
          {
            type: 'timing',
            requirement: 'No movements during school hours near schools',
            params: { 
              restricted_hours: ['08:00-09:00', '15:00-16:00'],
              restricted_areas: ['school_zones']
            }
          }
        ]
      },
      {
        id: 'bulk_transport_optimization',
        name: 'Bulk Transport Rules',
        materialTypes: ['bulk_solid', 'bulk_liquid'],
        conditions: [
          { field: 'quantity', operator: 'gt', value: 10000 }
        ],
        constraints: [
          {
            type: 'mode',
            requirement: 'Prefer rail/barge for >10t',
            params: { 
              preferred_modes: ['rail', 'barge'],
              threshold_kg: 10000
            }
          }
        ]
      }
    ]

    // Load pricing rules
    this.pricingRules = [
      {
        id: 'uco_market_pricing',
        name: 'UCO Market Pricing',
        materialType: 'uco',
        conditions: [
          { field: 'quality_grade', operator: 'in', value: ['A', 'B', 'C'] }
        ],
        pricing: {
          base: 450,
          currency: 'GBP',
          adjustments: [
            {
              type: 'quality',
              factor: 1.1,
              condition: { field: 'ffa', operator: 'lt', value: 3 }
            },
            {
              type: 'quality',
              factor: 0.9,
              condition: { field: 'ffa', operator: 'gt', value: 5 }
            },
            {
              type: 'volume',
              factor: 1.05,
              condition: { field: 'quantity', operator: 'gt', value: 20000 }
            },
            {
              type: 'market',
              factor: 1.0,
              condition: { field: 'index_link', operator: 'eq', value: 'argus_uco' }
            }
          ],
          floor: 350,
          ceiling: 600,
          indexLink: 'argus_uco_northwest_europe'
        }
      },
      {
        id: 'food_waste_gate_fee',
        name: 'Food Waste Gate Fee',
        materialType: 'food_waste',
        conditions: [
          { field: 'contamination', operator: 'lt', value: 5 }
        ],
        pricing: {
          base: -45, // Gate fee (negative = supplier pays)
          currency: 'GBP',
          adjustments: [
            {
              type: 'quality',
              factor: 0.8,
              condition: { field: 'contamination', operator: 'lt', value: 1 }
            },
            {
              type: 'distance',
              factor: 1.02,
              condition: { field: 'distance_km', operator: 'gt', value: 50 }
            }
          ],
          floor: -70,
          ceiling: -20
        }
      }
    ]
  }

  /**
   * Get compliance requirements for a waste movement
   */
  getComplianceRequirements(params: {
    ewcCode: string
    quantity: number
    unit: string
    jurisdiction: 'UK' | 'EU'
    transportMode: string
    materialType?: string
  }): ComplianceRequirement[] {
    const requirements: ComplianceRequirement[] = []
    const addedReqs = new Set<string>()

    // Always require basic documentation
    requirements.push({
      type: 'document',
      name: 'Waste Transfer Note',
      description: 'Required for all controlled waste movements',
      mandatory: true,
      references: ['Environmental Protection Act 1990 s34']
    })

    // Check each rule
    for (const rule of this.complianceRules) {
      // Check jurisdiction
      if (rule.jurisdiction !== 'BOTH' && rule.jurisdiction !== params.jurisdiction) {
        continue
      }

      // Check EWC code match
      const ewcMatches = rule.ewcCodes.some(pattern => {
        if (pattern === '*') return true
        if (pattern.endsWith('*')) {
          return params.ewcCode.startsWith(pattern.slice(0, -1))
        }
        return params.ewcCode === pattern
      })

      if (!ewcMatches) continue

      // Check conditions
      const conditionsMet = this.evaluateConditions(rule.conditions, params)
      if (!conditionsMet) continue

      // Add requirements
      for (const req of rule.requirements) {
        const key = `${req.type}:${req.name}`
        if (!addedReqs.has(key)) {
          requirements.push(req)
          addedReqs.add(key)
        }
      }
    }

    return requirements.sort((a, b) => {
      // Sort by type priority: permit > document > notification > restriction
      const typePriority = { permit: 0, document: 1, notification: 2, restriction: 3 }
      return typePriority[a.type] - typePriority[b.type]
    })
  }

  /**
   * Get logistics constraints for a material movement
   */
  getLogisticsConstraints(params: {
    materialType: string
    quantity: number
    adrClass?: string
    materialState?: string
  }): LogisticsConstraint[] {
    const constraints: LogisticsConstraint[] = []

    for (const rule of this.logisticsRules) {
      // Check material type
      if (!rule.materialTypes.includes(params.materialType) && 
          !rule.materialTypes.includes('*')) {
        continue
      }

      // Check conditions
      const conditionsMet = this.evaluateConditions(rule.conditions, params)
      if (!conditionsMet) continue

      // Add constraints
      constraints.push(...rule.constraints)
    }

    return constraints
  }

  /**
   * Calculate pricing for a material
   */
  calculatePricing(params: {
    materialType: string
    quantity: number
    qualityParams: Record<string, any>
    distance?: number
  }): {
    basePrice: number
    adjustedPrice: number
    currency: string
    breakdown: Array<{ type: string; factor: number; description: string }>
  } | null {
    const rule = this.pricingRules.find(r => r.materialType === params.materialType)
    if (!rule) return null

    // Check if conditions are met
    const conditionsMet = this.evaluateConditions(rule.conditions, {
      ...params,
      ...params.qualityParams
    })
    if (!conditionsMet) return null

    let adjustedPrice = rule.pricing.base
    const breakdown: Array<{ type: string; factor: number; description: string }> = []

    // Apply adjustments
    for (const adjustment of rule.pricing.adjustments) {
      const context = {
        ...params,
        ...params.qualityParams,
        distance_km: params.distance
      }

      if (!adjustment.condition || 
          this.evaluateConditions([adjustment.condition], context)) {
        adjustedPrice *= adjustment.factor
        breakdown.push({
          type: adjustment.type,
          factor: adjustment.factor,
          description: this.getAdjustmentDescription(adjustment)
        })
      }
    }

    // Apply floor and ceiling
    if (rule.pricing.floor !== undefined) {
      adjustedPrice = Math.max(adjustedPrice, rule.pricing.floor)
    }
    if (rule.pricing.ceiling !== undefined) {
      adjustedPrice = Math.min(adjustedPrice, rule.pricing.ceiling)
    }

    return {
      basePrice: rule.pricing.base,
      adjustedPrice: Math.round(adjustedPrice * 100) / 100,
      currency: rule.pricing.currency,
      breakdown
    }
  }

  /**
   * Evaluate rule conditions
   */
  private evaluateConditions(conditions: RuleCondition[], context: Record<string, any>): boolean {
    for (const condition of conditions) {
      const value = context[condition.field]
      
      switch (condition.operator) {
        case 'eq':
          if (value !== condition.value) return false
          break
        case 'gt':
          if (!(value > condition.value)) return false
          break
        case 'lt':
          if (!(value < condition.value)) return false
          break
        case 'gte':
          if (!(value >= condition.value)) return false
          break
        case 'lte':
          if (!(value <= condition.value)) return false
          break
        case 'contains':
          if (!value || !value.includes(condition.value)) return false
          break
        case 'in':
          if (!condition.value.includes(value)) return false
          break
      }
    }
    
    return true
  }

  /**
   * Get human-readable description for price adjustment
   */
  private getAdjustmentDescription(adjustment: PriceAdjustment): string {
    const descriptions: Record<string, string> = {
      quality: `Quality adjustment (${((adjustment.factor - 1) * 100).toFixed(0)}%)`,
      volume: `Volume discount (${((adjustment.factor - 1) * 100).toFixed(0)}%)`,
      distance: `Distance surcharge (${((adjustment.factor - 1) * 100).toFixed(0)}%)`,
      urgency: `Urgency premium (${((adjustment.factor - 1) * 100).toFixed(0)}%)`,
      market: `Market index adjustment (${((adjustment.factor - 1) * 100).toFixed(0)}%)`
    }
    
    return descriptions[adjustment.type] || `${adjustment.type} adjustment`
  }

  /**
   * Validate compliance documents
   */
  validateDocuments(
    documents: Array<{ type: string; name: string }>,
    requirements: ComplianceRequirement[]
  ): {
    valid: boolean
    missing: ComplianceRequirement[]
    extra: Array<{ type: string; name: string }>
  } {
    const requiredDocs = requirements.filter(r => r.mandatory)
    const missing: ComplianceRequirement[] = []
    const provided = new Set(documents.map(d => `${d.type}:${d.name}`))
    
    for (const req of requiredDocs) {
      const key = `${req.type}:${req.name}`
      if (!provided.has(key)) {
        missing.push(req)
      }
    }

    // Find extra documents (not in requirements)
    const required = new Set(requirements.map(r => `${r.type}:${r.name}`))
    const extra = documents.filter(d => !required.has(`${d.type}:${d.name}`))

    return {
      valid: missing.length === 0,
      missing,
      extra
    }
  }
}

// Export singleton instance
export const rulesEngine = new RulesEngine()
