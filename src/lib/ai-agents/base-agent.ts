import { AgentActivity } from '@/lib/types'

export interface AgentInput {
  [key: string]: any
}

export interface AgentOutput {
  [key: string]: any
}

export interface AgentConfig {
  name: string
  description: string
  dependencies: string[]
  status: 'live' | 'planned'
}

export abstract class BaseAgent {
  protected config: AgentConfig
  
  constructor(config: AgentConfig) {
    this.config = config
  }
  
  abstract process(input: AgentInput): Promise<AgentOutput>
  
  async execute(input: AgentInput): Promise<AgentActivity> {
    const startTime = Date.now()
    let success = true
    let error: string | undefined
    let output: AgentOutput = {}
    
    try {
      output = await this.process(input)
    } catch (e) {
      success = false
      error = e instanceof Error ? e.message : 'Unknown error'
    }
    
    const duration = Date.now() - startTime
    
    const activity: AgentActivity = {
      id: crypto.randomUUID(),
      agentName: this.config.name,
      action: 'process',
      inputData: input,
      outputData: output,
      success,
      error,
      duration,
      createdAt: new Date()
    }
    
    // Log activity (in production, this would save to database)
    await this.logActivity(activity)
    
    return activity
  }
  
  protected async logActivity(activity: AgentActivity): Promise<void> {
    // In production, save to database
    console.log(`[${this.config.name}] Activity:`, activity)
  }
  
  getName(): string {
    return this.config.name
  }
  
  getStatus(): 'live' | 'planned' {
    return this.config.status
  }
  
  getDependencies(): string[] {
    return this.config.dependencies
  }
}
