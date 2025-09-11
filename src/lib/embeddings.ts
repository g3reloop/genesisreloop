import { createChatCompletion, isOpenRouterConfigured } from '@/lib/openrouter'

export class EmbeddingsService {
  private cache = new Map<string, number[]>()
  
  async generate(text: string): Promise<number[]> {
    // Check cache first
    const cacheKey = this.getCacheKey(text)
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Generate embedding
    let embedding: number[]
    
    if (isOpenRouterConfigured()) {
      // Use OpenAI-compatible embedding model via OpenRouter
      embedding = await this.generateViaOpenRouter(text)
    } else {
      // Fallback to simple TF-IDF-like embedding for demo
      embedding = this.generateFallbackEmbedding(text)
    }
    
    // Cache the result
    this.cache.set(cacheKey, embedding)
    
    return embedding
  }

  private async generateViaOpenRouter(text: string): Promise<number[]> {
    try {
      // OpenRouter supports embedding models
      const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/text-embedding-ada-002',
          input: text,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate embedding')
      }

      const data = await response.json()
      return data.data[0].embedding
    } catch (error) {
      console.error('OpenRouter embedding error:', error)
      // Fallback to simple embedding
      return this.generateFallbackEmbedding(text)
    }
  }

  private generateFallbackEmbedding(text: string): number[] {
    // Simple 384-dimensional embedding based on character and word features
    const embedding = new Array(384).fill(0)
    const words = text.toLowerCase().split(/\s+/)
    
    // Simple features
    for (let i = 0; i < words.length && i < 100; i++) {
      const word = words[i]
      const hash = this.hashString(word)
      
      // Distribute word features across embedding
      for (let j = 0; j < 10; j++) {
        const idx = (hash + j * 37) % 384
        embedding[idx] += 1 / (i + 1) // Weight by position
      }
      
      // Character n-grams
      for (let k = 0; k < word.length - 2; k++) {
        const trigram = word.substring(k, k + 3)
        const trigramHash = this.hashString(trigram)
        const idx = trigramHash % 384
        embedding[idx] += 0.5
      }
    }
    
    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map(val => val / (norm || 1))
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private getCacheKey(text: string): string {
    return text.substring(0, 200) // Cache by first 200 chars
  }

  // Cosine similarity for vector comparison
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}

export const embeddings = new EmbeddingsService()
