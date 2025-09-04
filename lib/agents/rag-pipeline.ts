import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { embeddings } from '@/lib/embeddings'

export interface RAGCollection {
  id: string
  name: string
  description: string
  version: string
  lastUpdated: string
}

export interface RAGDocument {
  id: string
  collectionId: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
  chunkIndex?: number
  sourceUrl?: string
}

export interface RAGSearchResult {
  document: RAGDocument
  score: number
  highlights: string[]
}

// Knowledge base collections as per spec
export const RAG_COLLECTIONS: Record<string, RAGCollection> = {
  ewc_codes_v2024: {
    id: 'ewc_codes_v2024',
    name: 'European Waste Codes 2024',
    description: 'Complete EWC classification with UK adaptations',
    version: '2024.1',
    lastUpdated: '2024-01-15'
  },
  adr_transport_un_numbers: {
    id: 'adr_transport_un_numbers',
    name: 'ADR Transport Classifications',
    description: 'UN numbers and dangerous goods transport regulations',
    version: '2023.2',
    lastUpdated: '2023-07-01'
  },
  uk_eu_waste_permits_registers: {
    id: 'uk_eu_waste_permits_registers',
    name: 'UK/EU Waste Permits Register',
    description: 'Environmental permits and exemptions database',
    version: '2024.1',
    lastUpdated: '2024-01-10'
  },
  duty_of_care_waste_transfer_notes: {
    id: 'duty_of_care_waste_transfer_notes',
    name: 'Duty of Care & WTN Templates',
    description: 'Compliant waste transfer note templates and guidance',
    version: '2023.4',
    lastUpdated: '2023-12-01'
  },
  contract_templates_supply_processing_offtake: {
    id: 'contract_templates_supply_processing_offtake',
    name: 'Contract Templates Library',
    description: 'Supply agreements, processing contracts, offtake agreements',
    version: '2024.1',
    lastUpdated: '2024-01-05'
  },
  defra_emission_factors: {
    id: 'defra_emission_factors',
    name: 'DEFRA Emission Factors',
    description: 'UK Government GHG conversion factors for company reporting',
    version: '2023.1',
    lastUpdated: '2023-06-01'
  },
  incoterms: {
    id: 'incoterms',
    name: 'Incoterms 2020',
    description: 'International commercial terms for logistics',
    version: '2020.1',
    lastUpdated: '2020-01-01'
  },
  uco_biodiesel_specs_en14214: {
    id: 'uco_biodiesel_specs_en14214',
    name: 'UCO & Biodiesel Specifications',
    description: 'EN 14214 and related quality standards',
    version: '2023.1',
    lastUpdated: '2023-03-15'
  },
  food_waste_biogas_specs_pas110: {
    id: 'food_waste_biogas_specs_pas110',
    name: 'Food Waste & Biogas Standards',
    description: 'PAS 110 digestate quality protocol',
    version: '2023.2',
    lastUpdated: '2023-09-01'
  },
  byproduct_catalogue_crosswalk: {
    id: 'byproduct_catalogue_crosswalk',
    name: 'Byproduct Valorization Catalogue',
    description: 'Cross-industry byproduct utilization mappings',
    version: '2024.1',
    lastUpdated: '2024-01-12'
  },
  logistics_providers_capabilities: {
    id: 'logistics_providers_capabilities',
    name: 'Logistics Provider Database',
    description: 'Carrier capabilities, certifications, and service areas',
    version: '2024.1',
    lastUpdated: '2024-01-08'
  },
  quality_assurance_testing_protocols: {
    id: 'quality_assurance_testing_protocols',
    name: 'QA Testing Protocols',
    description: 'Laboratory testing methods and quality standards',
    version: '2023.3',
    lastUpdated: '2023-11-15'
  },
  uk_community_asset_transfer_guides: {
    id: 'uk_community_asset_transfer_guides',
    name: 'Community Asset Transfer Guides',
    description: 'UK CAT regulations and best practices',
    version: '2023.1',
    lastUpdated: '2023-05-01'
  },
  iscc_certification_protocols: {
    id: 'iscc_certification_protocols',
    name: 'ISCC Certification Standards',
    description: 'International Sustainability & Carbon Certification',
    version: '2023.4',
    lastUpdated: '2023-12-15'
  },
  animal_by_products_abp_regulations: {
    id: 'animal_by_products_abp_regulations',
    name: 'ABP Regulations',
    description: 'Animal by-products handling and disposal rules',
    version: '2023.2',
    lastUpdated: '2023-08-01'
  }
}

// Supply chain valorization routes
export const VALORIZATION_ROUTES = {
  textiles: {
    cotton: ['Bioethanol', 'Glucose Syrup', 'Cellulose Nanocrystals', 'Aerogels'],
    polycotton: ['PEF monomers'],
    polyester: ['BHET', 'rPET pellets'],
    polyamide: ['Caprolactam']
  },
  plastics: {
    mixed_polyolefins: ['Pyrolysis oil', 'BTX aromatics', 'Industrial waxes'],
    ldpe: ['H₂ via reforming'],
    pet: ['food-grade rPET (enzymatic)']
  },
  e_waste: {
    pcb: ['Gold', 'Silver', 'Copper', 'Palladium (hydrometallurgy/electrowinning)'],
    hdd_magnets: ['Neodymium'],
    lcds: ['Indium'],
    tantalum_capacitors: ['Ta₂O₅']
  },
  biomass_ag: {
    manure_food_waste: ['Biogas', 'Digestate'],
    biomass: ['Bio-oil', 'Biochar', 'Levulinic Acid', 'Xylitol']
  },
  industrial_construction: {
    fly_ash_slag_red_mud: ['Geopolymers (concrete, mortar, bricks)'],
    steel_slag: ['Carbonated aggregates'],
    waste_gypsum: ['Ammonium sulfate']
  }
}

export class RAGPipeline {
  private supabase = createClientComponentClient()
  
  constructor() {}

  /**
   * Hybrid search combining BM25 keyword search and vector similarity
   */
  async search(
    query: string,
    collections: string[],
    options: {
      limit?: number
      minScore?: number
      rerank?: boolean
    } = {}
  ): Promise<RAGSearchResult[]> {
    const { limit = 10, minScore = 0.7, rerank = true } = options

    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query)

      // Perform hybrid search
      const results: RAGSearchResult[] = []

      for (const collectionId of collections) {
        // Vector search
        const { data: vectorResults } = await this.supabase
          .rpc('match_documents', {
            query_embedding: queryEmbedding,
            collection_id: collectionId,
            match_count: limit,
            match_threshold: minScore
          })

        // BM25 keyword search
        const { data: keywordResults } = await this.supabase
          .from('rag_documents')
          .select('*')
          .eq('collection_id', collectionId)
          .textSearch('content', query, { config: 'english' })
          .limit(limit)

        // Merge and deduplicate results
        const merged = this.mergeSearchResults(vectorResults || [], keywordResults || [])
        results.push(...merged)
      }

      // Re-rank if requested
      if (rerank) {
        return this.rerankResults(results, query, limit)
      }

      return results.slice(0, limit)
    } catch (error) {
      console.error('RAG search error:', error)
      return []
    }
  }

  /**
   * Retrieve specific documents by ID
   */
  async retrieve(documentIds: string[]): Promise<RAGDocument[]> {
    try {
      const { data, error } = await this.supabase
        .from('rag_documents')
        .select('*')
        .in('id', documentIds)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('RAG retrieve error:', error)
      return []
    }
  }

  /**
   * Extract and validate EWC codes from text
   */
  async extractEWCCodes(text: string): Promise<string[]> {
    const ewcPattern = /\b\d{2}\s?\d{2}\s?\d{2}\b/g
    const matches = text.match(ewcPattern) || []
    
    // Validate against EWC collection
    const validCodes: string[] = []
    for (const code of matches) {
      const normalized = code.replace(/\s/g, ' ')
      const results = await this.search(normalized, ['ewc_codes_v2024'], { limit: 1 })
      if (results.length > 0 && results[0].score > 0.9) {
        validCodes.push(normalized)
      }
    }
    
    return validCodes
  }

  /**
   * Get compliance requirements for a waste movement
   */
  async getComplianceRequirements(
    ewcCode: string,
    fromLocation: string,
    toLocation: string,
    quantity: number,
    unit: string
  ): Promise<{
    permits: string[]
    documents: string[]
    adrClass?: string
    temperatureControl?: boolean
    restrictions: string[]
  }> {
    // Search relevant collections
    const searchQuery = `${ewcCode} movement ${fromLocation} ${toLocation} ${quantity}${unit}`
    const results = await this.search(searchQuery, [
      'uk_eu_waste_permits_registers',
      'duty_of_care_waste_transfer_notes',
      'adr_transport_un_numbers'
    ])

    // Extract requirements from search results
    const requirements = {
      permits: [] as string[],
      documents: ['Waste Transfer Note'] as string[],
      restrictions: [] as string[]
    }

    // Process results to extract specific requirements
    for (const result of results) {
      const content = result.document.content.toLowerCase()
      
      // Extract permit requirements
      if (content.includes('permit required') || content.includes('environmental permit')) {
        requirements.permits.push(result.document.metadata.permitType || 'Environmental Permit')
      }
      
      // Extract document requirements
      if (content.includes('consignment note')) {
        requirements.documents.push('Hazardous Waste Consignment Note')
      }
      
      // Extract ADR classification
      if (result.document.collectionId === 'adr_transport_un_numbers') {
        requirements.adrClass = result.document.metadata.adrClass
      }
      
      // Extract restrictions
      if (content.includes('restriction') || content.includes('prohibited')) {
        requirements.restrictions.push(result.highlights[0] || 'Check specific restrictions')
      }
    }

    return requirements
  }

  /**
   * Generate embeddings for text
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      return await embeddings.generate(text)
    } catch (error) {
      console.error('Embedding generation error:', error)
      return []
    }
  }

  /**
   * Merge and deduplicate search results
   */
  private mergeSearchResults(
    vectorResults: any[],
    keywordResults: any[]
  ): RAGSearchResult[] {
    const resultMap = new Map<string, RAGSearchResult>()

    // Process vector results
    for (const result of vectorResults) {
      resultMap.set(result.id, {
        document: result,
        score: result.similarity || 0,
        highlights: []
      })
    }

    // Merge keyword results
    for (const result of keywordResults) {
      if (resultMap.has(result.id)) {
        // Boost score if found in both
        const existing = resultMap.get(result.id)!
        existing.score = Math.min(1, existing.score * 1.2)
      } else {
        resultMap.set(result.id, {
          document: result,
          score: 0.8, // Default score for keyword-only matches
          highlights: []
        })
      }
    }

    return Array.from(resultMap.values())
  }

  /**
   * Re-rank results using cross-encoder or additional signals
   */
  private async rerankResults(
    results: RAGSearchResult[],
    query: string,
    limit: number
  ): Promise<RAGSearchResult[]> {
    // Simple re-ranking based on metadata quality signals
    const reranked = results.map(result => {
      let score = result.score

      // Boost recent documents
      if (result.document.metadata.lastUpdated) {
        const age = Date.now() - new Date(result.document.metadata.lastUpdated).getTime()
        const ageMonths = age / (1000 * 60 * 60 * 24 * 30)
        if (ageMonths < 6) score *= 1.1
      }

      // Boost official sources
      if (result.document.metadata.source === 'official') {
        score *= 1.15
      }

      // Boost exact matches in title/metadata
      if (result.document.metadata.title?.toLowerCase().includes(query.toLowerCase())) {
        score *= 1.2
      }

      return { ...result, score: Math.min(1, score) }
    })

    // Sort by score and return top results
    return reranked
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Citation formatter - returns metadata only, not shown to user
   */
  formatCitations(results: RAGSearchResult[]): Record<string, any> {
    return {
      sources: results.map(r => ({
        id: r.document.id,
        collection: r.document.collectionId,
        title: r.document.metadata.title,
        url: r.document.sourceUrl,
        score: r.score,
        version: r.document.metadata.version
      })),
      retrievedAt: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const ragPipeline = new RAGPipeline()
