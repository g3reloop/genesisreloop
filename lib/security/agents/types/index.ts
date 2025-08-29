export type AgentRole = 
  | 'meta-guardian'
  | 'waf-engineer'
  | 'vulnerability-scanner'
  | 'pentest-automation'
  | 'siem-correlation'
  | 'secrets-lifecycle'
  | 'zero-trust-manager'
  | 'honeypot-orchestration'
  | 'chain-anomaly-detector'
  | 'evidence-integrity'
  | 'incident-commander';

export type DataSource = 
  | 'warp.agent.logs'
  | 'supabase.db'
  | 'polygon.rpc'
  | 'cloudflare.api'
  | 'sentry.issues'
  | 'wazuh.api'
  | 'zap.reports'
  | 'github.repo'
  | 'snyk.api'
  | 'vault.api'
  | 'aws.kms'
  | 'netlify.logs'
  | 'etherscan'
  | 'safe.tx.service'
  | 'ipfs.pin'
  | 'gps.trace'
  | 'lab.api';

export type AlertPriority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export type AgentStatus = 'active' | 'degraded' | 'paused' | 'crashed' | 'initializing';

export interface SecurityAlert {
  id: string;
  timestamp: Date;
  agentId: string;
  priority: AlertPriority;
  type: string;
  message: string;
  context: Record<string, any>;
  requiresAck: boolean;
}

export interface AgentConfig {
  id: string;
  role: AgentRole;
  datasources: DataSource[];
  schedule: string;
  escalationRules?: EscalationRule[];
}

export interface EscalationRule {
  condition: string;
  priority: AlertPriority;
  targets: string[];
  timeoutMinutes?: number;
}

export interface AgentObservation {
  timestamp: Date;
  source: DataSource;
  data: any;
  anomalyScore?: number;
}

export interface AgentAction {
  id: string;
  type: string;
  description: string;
  params: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface AgentVerification {
  actionId: string;
  verified: boolean;
  confidence: number;
  evidence: string[];
}

export interface SecurityIncident {
  id: string;
  priority: AlertPriority;
  title: string;
  description: string;
  timeline: IncidentEvent[];
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  commander?: string;
  affectedServices: string[];
  mitigation: string[];
}

export interface IncidentEvent {
  timestamp: Date;
  agentId: string;
  event: string;
  data?: any;
}

export interface AgentMessage {
  from: string;
  to: string;
  type: 'observe' | 'act' | 'verify' | 'alert' | 'status';
  payload: any;
  correlationId?: string;
}
