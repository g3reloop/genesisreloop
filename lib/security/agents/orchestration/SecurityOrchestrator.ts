import { EventEmitter } from 'events';
import {
  SecurityAlert,
  AgentMessage,
  SecurityIncident,
  AlertPriority,
  AgentStatus
} from '../types';
import { BaseSecurityAgent } from '../core/BaseSecurityAgent';

interface DAGEdge {
  from: string;
  to: string;
  messageType: string;
}

interface AgentRegistry {
  [agentId: string]: BaseSecurityAgent;
}

interface Runbook {
  name: string;
  steps: string[];
}

export class SecurityOrchestrator extends EventEmitter {
  private agents: AgentRegistry = {};
  private dag: DAGEdge[] = [];
  private incidents: Map<string, SecurityIncident> = new Map();
  private runbooks: Map<string, Runbook> = new Map();
  private messageQueue: AgentMessage[] = [];
  private processingInterval?: NodeJS.Timer;

  constructor() {
    super();
    this.initializeDAG();
    this.initializeRunbooks();
  }

  private initializeDAG(): void {
    // Define the agent communication DAG based on the specification
    this.dag = [
      { from: 'basilisk-zap', to: 'aegis-waf', messageType: 'recommend_rules' },
      { from: 'watchtower-siem', to: 'aegis-waf', messageType: 'request_blocks' },
      { from: 'canary-signal', to: 'aegis-waf', messageType: 'containment' },
      { from: 'mrv-prover', to: 'registry-sentinel', messageType: 'mint_gate' },
      { from: 'registry-sentinel', to: 'incident-commander', messageType: 'on_chain_anomaly' },
      { from: 'aegis-waf', to: 'watchtower-siem', messageType: 'policy_feedback' },
      { from: 'sigil-scanner', to: 'incident-commander', messageType: 'critical_cve' },
      { from: 'vault-keeper', to: 'incident-commander', messageType: 'key_rotation_required' },
      { from: 'girm-sentinel', to: 'incident-commander', messageType: 'crl_detected' },
      { from: 'girm-sentinel', to: 'aegis-waf', messageType: 'auto_tune' },
      { from: 'girm-sentinel', to: 'watchtower-siem', messageType: 'correlate_global' }
    ];
  }

  private initializeRunbooks(): void {
    // P1 Incident runbook
    this.runbooks.set('p1_incident', {
      name: 'P1 Incident Response',
      steps: [
        'incident-commander.declare',
        'aegis-waf.block_asn_if_needed',
        'vault-keeper.rotate_impacted_keys',
        'watchtower-siem.generate_timeline',
        'incident-commander.status_update',
        'postmortem.create_and_schedule_review'
      ]
    });

    // Mint pause runbook
    this.runbooks.set('mint_pause', {
      name: 'Mint Pipeline Pause',
      steps: [
        'girm-sentinel.pause_mint',
        'registry-sentinel.freeze_issuer_role',
        'mrv-prover.audit_latest_bundles',
        'dao.vote_to_reenable_after_fix'
      ]
    });
  }

  async registerAgent(agent: BaseSecurityAgent): Promise<void> {
    const agentId = agent.getConfig().id;
    this.agents[agentId] = agent;

    // Subscribe to agent events
    agent.on('alert', (alert: SecurityAlert) => this.handleAlert(alert));
    agent.on('message', (message: AgentMessage) => this.handleMessage(message));
    agent.on('escalate', (data: any) => this.handleEscalation(data));
    agent.on('status', (status: any) => this.handleStatusUpdate(status));
    agent.on('heartbeat', (heartbeat: any) => this.handleHeartbeat(heartbeat));

    console.log(`[Orchestrator] Registered agent: ${agentId}`);
  }

  async start(): Promise<void> {
    // Start all registered agents
    const startPromises = Object.values(this.agents).map(agent => agent.start());
    await Promise.all(startPromises);

    // Start message processing
    this.processingInterval = setInterval(() => this.processMessageQueue(), 100);

    console.log('[Orchestrator] All agents started');
    this.emit('started');
  }

  async stop(): Promise<void> {
    // Stop message processing
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    // Stop all agents
    const stopPromises = Object.values(this.agents).map(agent => agent.stop());
    await Promise.all(stopPromises);

    console.log('[Orchestrator] All agents stopped');
    this.emit('stopped');
  }

  private handleAlert(alert: SecurityAlert): void {
    console.log(`[Orchestrator] Alert from ${alert.agentId}: ${alert.message}`);
    
    // Route alert based on priority
    this.routeAlert(alert);
    
    // Check if this should trigger an incident
    if (alert.priority === 'P1' || alert.priority === 'P2') {
      this.createIncident(alert);
    }

    this.emit('alert', alert);
  }

  private handleMessage(message: AgentMessage): void {
    // Add to message queue for processing
    this.messageQueue.push(message);
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      
      // Check if this message follows DAG rules
      const isValidPath = this.dag.some(edge => 
        edge.from === message.from && 
        edge.to === message.to && 
        edge.messageType === message.type
      );

      if (isValidPath || message.type === 'status') {
        // Deliver message to target agent
        const targetAgent = this.agents[message.to];
        if (targetAgent) {
          targetAgent.emit('message-received', message);
        } else {
          console.warn(`[Orchestrator] Target agent not found: ${message.to}`);
        }
      } else {
        console.warn(`[Orchestrator] Invalid message path: ${message.from} -> ${message.to} (${message.type})`);
      }
    }
  }

  private handleEscalation(data: any): void {
    const { alert, rule, targets } = data;
    console.log(`[Orchestrator] Escalating alert ${alert.id} to ${targets.join(', ')}`);

    // Send escalation notifications
    for (const target of targets) {
      this.sendNotification(target, alert, rule.priority);
    }

    // Execute runbook if applicable
    if (rule.priority === 'P1') {
      this.executeRunbook('p1_incident', { alert, rule });
    }
  }

  private handleStatusUpdate(status: any): void {
    console.log(`[Orchestrator] Agent ${status.agent} status: ${status.status}`);
    
    // Check for degraded agents
    const degradedAgents = Object.entries(this.agents)
      .filter(([_, agent]) => agent.getStatus() === 'degraded')
      .length;

    const totalAgents = Object.keys(this.agents).length;
    const degradedRatio = degradedAgents / totalAgents;

    if (degradedRatio > 0.2) {
      // Alert GIRM Sentinel about high degradation
      const sentinel = this.agents['girm-sentinel'];
      if (sentinel) {
        sentinel.emit('high-degradation', { degradedRatio, degradedAgents });
      }
    }
  }

  private handleHeartbeat(heartbeat: any): void {
    // Track agent health
    this.emit('heartbeat', heartbeat);
  }

  private routeAlert(alert: SecurityAlert): void {
    const routing = {
      primary: ['matrix://#sec-ops', 'email://sec-ops@reloop.genesis', 'webhook://sentry/alerts'],
      p1: ['pager://incident-commander', 'matrix://#dao-guard']
    };

    const routes = alert.priority === 'P1' ? [...routing.primary, ...routing.p1] : routing.primary;
    
    for (const route of routes) {
      this.sendToRoute(route, alert);
    }
  }

  private sendToRoute(route: string, alert: SecurityAlert): void {
    // Parse route and send notification
    const [protocol, target] = route.split('://');
    
    console.log(`[Orchestrator] Routing alert to ${protocol}:${target}`);
    
    // In production, implement actual routing logic
    this.emit('route-alert', { protocol, target, alert });
  }

  private createIncident(alert: SecurityAlert): void {
    const incident: SecurityIncident = {
      id: `INC-${Date.now()}`,
      priority: alert.priority,
      title: alert.message,
      description: `Incident triggered by alert from ${alert.agentId}`,
      timeline: [{
        timestamp: new Date(),
        agentId: alert.agentId,
        event: 'incident-created',
        data: alert
      }],
      status: 'open',
      affectedServices: this.identifyAffectedServices(alert),
      mitigation: []
    };

    this.incidents.set(incident.id, incident);
    
    // Assign to incident commander
    const commander = this.agents['incident-commander'];
    if (commander) {
      commander.emit('incident-assigned', incident);
    }

    this.emit('incident-created', incident);
  }

  private identifyAffectedServices(alert: SecurityAlert): string[] {
    // Determine affected services based on alert context
    const services = [];
    
    if (alert.context.pipelines) {
      services.push(...alert.context.pipelines);
    }
    
    if (alert.type.includes('mrv') || alert.type.includes('mint')) {
      services.push('mint-pipeline', 'carbon-registry');
    }
    
    if (alert.type.includes('waf') || alert.type.includes('ddos')) {
      services.push('edge', 'api');
    }

    return [...new Set(services)];
  }

  private async executeRunbook(runbookName: string, context: any): Promise<void> {
    const runbook = this.runbooks.get(runbookName);
    if (!runbook) {
      console.error(`[Orchestrator] Runbook not found: ${runbookName}`);
      return;
    }

    console.log(`[Orchestrator] Executing runbook: ${runbookName}`);

    for (const step of runbook.steps) {
      const [agentId, action] = step.split('.');
      const agent = this.agents[agentId];
      
      if (agent) {
        agent.emit('runbook-action', { action, context });
      } else {
        console.warn(`[Orchestrator] Agent not found for runbook step: ${step}`);
      }
      
      // Wait a bit between steps
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private sendNotification(target: string, alert: SecurityAlert, priority: AlertPriority): void {
    console.log(`[Orchestrator] Sending ${priority} notification to ${target}`);
    
    this.emit('notification', {
      target,
      alert,
      priority,
      timestamp: new Date()
    });
  }

  // Public methods for external control
  getAgentStatuses(): Record<string, AgentStatus> {
    const statuses: Record<string, AgentStatus> = {};
    
    for (const [id, agent] of Object.entries(this.agents)) {
      statuses[id] = agent.getStatus();
    }
    
    return statuses;
  }

  getActiveIncidents(): SecurityIncident[] {
    return Array.from(this.incidents.values())
      .filter(incident => incident.status !== 'resolved');
  }

  async pauseSystem(reason: string): Promise<void> {
    console.log(`[Orchestrator] Pausing system: ${reason}`);
    
    // Pause critical agents
    const criticalAgents = ['mrv-prover', 'registry-sentinel'];
    for (const agentId of criticalAgents) {
      const agent = this.agents[agentId];
      if (agent) {
        await agent.stop();
      }
    }
    
    this.emit('system-paused', { reason, timestamp: new Date() });
  }

  async resumeSystem(): Promise<void> {
    console.log('[Orchestrator] Resuming system');
    
    // Resume all stopped agents
    const resumePromises = Object.entries(this.agents)
      .filter(([_, agent]) => agent.getStatus() === 'paused')
      .map(([_, agent]) => agent.start());
      
    await Promise.all(resumePromises);
    
    this.emit('system-resumed', { timestamp: new Date() });
  }
}
