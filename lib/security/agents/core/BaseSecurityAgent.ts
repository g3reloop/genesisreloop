import { EventEmitter } from 'events';
import {
  AgentConfig,
  AgentStatus,
  SecurityAlert,
  AgentObservation,
  AgentAction,
  AgentVerification,
  AlertPriority,
  AgentMessage,
  DataSource
} from '../types';

export abstract class BaseSecurityAgent extends EventEmitter {
  protected config: AgentConfig;
  protected status: AgentStatus = 'initializing';
  protected observations: AgentObservation[] = [];
  protected actions: AgentAction[] = [];
  protected lastHeartbeat: Date = new Date();
  protected intervalHandles: NodeJS.Timer[] = [];

  constructor(config: AgentConfig) {
    super();
    this.config = config;
  }

  // Abstract methods that each agent must implement
  abstract observe(): Promise<AgentObservation[]>;
  abstract act(observations: AgentObservation[]): Promise<AgentAction[]>;
  abstract verify(action: AgentAction): Promise<AgentVerification>;

  // Lifecycle methods
  async start(): Promise<void> {
    try {
      this.status = 'active';
      this.emit('status', { agent: this.config.id, status: 'active' });
      
      // Set up scheduled observations
      if (this.config.schedule && this.config.schedule !== 'realtime' && this.config.schedule !== 'event-driven') {
        const interval = this.parseSchedule(this.config.schedule);
        const handle = setInterval(() => this.runCycle(), interval);
        this.intervalHandles.push(handle);
      }
      
      // Start heartbeat
      const heartbeatHandle = setInterval(() => this.heartbeat(), 60000); // 1 minute
      this.intervalHandles.push(heartbeatHandle);
      
      await this.onStart();
    } catch (error) {
      this.handleError(error as Error, 'start');
    }
  }

  async stop(): Promise<void> {
    this.status = 'paused';
    this.intervalHandles.forEach(handle => clearInterval(handle));
    this.intervalHandles = [];
    await this.onStop();
    this.emit('status', { agent: this.config.id, status: 'paused' });
  }

  protected async runCycle(): Promise<void> {
    try {
      // Observe
      const observations = await this.observe();
      this.observations.push(...observations);
      
      // Act on significant observations
      const significantObs = observations.filter(o => (o.anomalyScore || 0) > 0.7);
      if (significantObs.length > 0) {
        const actions = await this.act(significantObs);
        this.actions.push(...actions);
        
        // Verify actions
        for (const action of actions) {
          const verification = await this.verify(action);
          this.emit('verification', { action, verification });
        }
      }
      
      // Clean up old data
      this.pruneHistory();
    } catch (error) {
      this.handleError(error as Error, 'runCycle');
    }
  }

  protected createAlert(
    priority: AlertPriority,
    type: string,
    message: string,
    context: Record<string, any> = {}
  ): SecurityAlert {
    const alert: SecurityAlert = {
      id: `${this.config.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      agentId: this.config.id,
      priority,
      type,
      message,
      context,
      requiresAck: priority === 'P1' || priority === 'P2'
    };
    
    this.emit('alert', alert);
    
    // Check escalation rules
    this.checkEscalation(alert);
    
    return alert;
  }

  protected checkEscalation(alert: SecurityAlert): void {
    if (!this.config.escalationRules) return;
    
    for (const rule of this.config.escalationRules) {
      if (this.evaluateCondition(rule.condition, alert)) {
        this.emit('escalate', {
          alert,
          rule,
          targets: rule.targets
        });
      }
    }
  }

  protected evaluateCondition(condition: string, context: any): boolean {
    // Simple condition evaluation - in production, use a proper expression evaluator
    try {
      // WARNING: This is simplified - use a safe expression evaluator in production
      const func = new Function('context', `return ${condition}`);
      return func(context);
    } catch {
      return false;
    }
  }

  protected async fetchFromDataSource(source: DataSource): Promise<any> {
    // This would be implemented to actually fetch from various data sources
    // For now, return mock data
    this.emit('datasource-fetch', { agent: this.config.id, source });
    return {};
  }

  protected sendMessage(to: string, type: AgentMessage['type'], payload: any): void {
    const message: AgentMessage = {
      from: this.config.id,
      to,
      type,
      payload,
      correlationId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.emit('message', message);
  }

  protected heartbeat(): void {
    this.lastHeartbeat = new Date();
    this.emit('heartbeat', {
      agent: this.config.id,
      status: this.status,
      timestamp: this.lastHeartbeat
    });
  }

  protected handleError(error: Error, context: string): void {
    console.error(`[${this.config.id}] Error in ${context}:`, error);
    
    if (this.status !== 'crashed') {
      this.status = 'degraded';
      this.createAlert('P3', 'agent-error', `Error in ${context}: ${error.message}`, {
        error: error.stack,
        context
      });
    }
  }

  protected parseSchedule(schedule: string): number {
    // Parse schedule strings like "5m", "2h", "daily", "hourly"
    const match = schedule.match(/^(\d+)([mhd])$/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      switch (unit) {
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
      }
    }
    
    switch (schedule) {
      case 'hourly': return 60 * 60 * 1000;
      case 'daily': return 24 * 60 * 60 * 1000;
      case 'weekly': return 7 * 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000; // Default to hourly
    }
  }

  protected pruneHistory(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.observations = this.observations.filter(o => o.timestamp > oneDayAgo);
    this.actions = this.actions.filter(a => 
      a.status === 'pending' || a.status === 'executing' || 
      (a.status === 'completed' && new Date() > oneDayAgo)
    );
  }

  // Hook methods that can be overridden
  protected async onStart(): Promise<void> {}
  protected async onStop(): Promise<void> {}

  // Getters
  getStatus(): AgentStatus {
    return this.status;
  }

  getConfig(): AgentConfig {
    return this.config;
  }

  getLastHeartbeat(): Date {
    return this.lastHeartbeat;
  }
}
