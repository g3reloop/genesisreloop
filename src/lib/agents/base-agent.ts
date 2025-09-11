import { AgentJob, AgentStatus } from '@/types/agents'
import { EventEmitter } from 'events'

export interface AgentConfig {
  name: string
  queueName: string
  maxRetries?: number
  retryDelay?: number // ms
  batchSize?: number
  concurrency?: number
}

export abstract class BaseAgent extends EventEmitter {
  protected config: AgentConfig
  protected status: AgentStatus = 'healthy'
  protected isRunning: boolean = false
  protected metrics: {
    processed: number
    failed: number
    totalLatency: number
    lastHeartbeat: Date
  }

  constructor(config: AgentConfig) {
    super()
    this.config = {
      maxRetries: 3,
      retryDelay: 5000,
      batchSize: 10,
      concurrency: 1,
      ...config
    }
    this.metrics = {
      processed: 0,
      failed: 0,
      totalLatency: 0,
      lastHeartbeat: new Date()
    }
  }

  abstract process(job: AgentJob): Promise<any>

  async start(): Promise<void> {
    if (this.isRunning) return
    
    this.isRunning = true
    this.status = 'healthy'
    this.emit('started')
    
    // Start heartbeat
    const heartbeatInterval = setInterval(() => {
      this.heartbeat()
    }, 30000) // 30s

    // Main processing loop
    while (this.isRunning) {
      try {
        await this.processNextBatch()
        await this.sleep(100) // Small delay between batches
      } catch (error) {
        console.error(`[${this.config.name}] Error in main loop:`, error)
        this.status = 'degraded'
        await this.sleep(5000) // Back off on error
      }
    }

    clearInterval(heartbeatInterval)
  }

  async stop(): Promise<void> {
    this.isRunning = false
    this.emit('stopped')
  }

  protected async processNextBatch(): Promise<void> {
    // This would be implemented with actual queue (NATS, Redis, etc)
    // For now, it's a placeholder
    const jobs = await this.fetchJobs(this.config.batchSize || 10)
    
    if (jobs.length === 0) {
      await this.sleep(1000) // No jobs, wait a bit
      return
    }

    // Process jobs with concurrency control
    const promises = jobs.map(job => this.processJob(job))
    await Promise.all(promises)
  }

  protected async processJob(job: AgentJob): Promise<void> {
    const startTime = Date.now()
    
    try {
      job.status = 'processing'
      job.updatedAt = new Date()
      await this.updateJob(job)

      const result = await this.process(job)
      
      job.status = 'completed'
      job.updatedAt = new Date()
      await this.updateJob(job)

      const latency = Date.now() - startTime
      this.metrics.processed++
      this.metrics.totalLatency += latency
      
      this.emit('job:completed', { job, result, latency })
    } catch (error) {
      job.attempts++
      
      if (job.attempts < (this.config.maxRetries || 3)) {
        job.status = 'pending'
        await this.sleep(this.config.retryDelay || 5000)
      } else {
        job.status = 'failed'
        job.error = error instanceof Error ? error.message : String(error)
        this.metrics.failed++
      }
      
      job.updatedAt = new Date()
      await this.updateJob(job)
      
      this.emit('job:failed', { job, error })
    }
  }

  protected heartbeat(): void {
    this.metrics.lastHeartbeat = new Date()
    
    const avgLatency = this.metrics.processed > 0
      ? this.metrics.totalLatency / this.metrics.processed
      : 0

    this.emit('heartbeat', {
      name: this.config.name,
      status: this.status,
      metrics: {
        ...this.metrics,
        avgLatency
      }
    })
  }

  protected async fetchJobs(limit: number): Promise<AgentJob[]> {
    // Placeholder - would fetch from actual queue
    return []
  }

  protected async updateJob(job: AgentJob): Promise<void> {
    // Placeholder - would update in actual database
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getStatus(): {
    name: string
    status: AgentStatus
    queueDepth: number
    avgLatency: number
    lastHeartbeat: Date
    processed: number
    failed: number
    errorRate: number
  } {
    const avgLatency = this.metrics.processed > 0
      ? this.metrics.totalLatency / this.metrics.processed
      : 0

    const errorRate = this.metrics.processed + this.metrics.failed > 0
      ? this.metrics.failed / (this.metrics.processed + this.metrics.failed)
      : 0

    return {
      name: this.config.name,
      status: this.status,
      queueDepth: 0, // Would be fetched from queue
      avgLatency,
      lastHeartbeat: this.metrics.lastHeartbeat,
      processed: this.metrics.processed,
      failed: this.metrics.failed,
      errorRate
    }
  }
}
