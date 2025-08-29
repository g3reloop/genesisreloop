import { SecurityOrchestrator } from '../agents/orchestration/SecurityOrchestrator';
import { GirmSentinel } from '../agents/implementations/GirmSentinel';
import { AegisWAF } from '../agents/implementations/AegisWAF';
// Import other agents as they are implemented

interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  requiredEnvVars: string[];
  agents: string[];
  orchestratorConfig: {
    alertRouting: {
      primary: string[];
      p1: string[];
    };
    ticketSystem: {
      system: string;
      team: string;
      labels: string[];
    };
  };
}

const REQUIRED_ENV_VARS = [
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ZONE_ID',
  'CF_ACCESS_AUD_TAG',
  'SNYK_TOKEN',
  'ZAP_API_KEY',
  'PUBLIC_BASE_URL',
  'WAZUH_API_URL',
  'WAZUH_API_USER',
  'WAZUH_API_PASS',
  'VAULT_ADDR',
  'VAULT_TOKEN',
  'AWS_REGION',
  'AWS_KMS_KEY_ID',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'IPFS_PIN_URL',
  'IPFS_PIN_TOKEN',
  'POLYGON_RPC_URL',
  'SAFE_TX_SERVICE_URL',
  'SENTRY_DSN'
];

export class SecurityDeployment {
  private orchestrator: SecurityOrchestrator;
  private config: DeploymentConfig;
  private deploymentStatus: 'initialized' | 'validated' | 'deployed' | 'failed' = 'initialized';

  constructor(environment: DeploymentConfig['environment'] = 'development') {
    this.orchestrator = new SecurityOrchestrator();
    this.config = this.loadConfig(environment);
  }

  private loadConfig(environment: DeploymentConfig['environment']): DeploymentConfig {
    return {
      environment,
      requiredEnvVars: REQUIRED_ENV_VARS,
      agents: [
        'girm-sentinel',
        'aegis-waf',
        // 'sigil-scanner',
        // 'basilisk-zap',
        // 'watchtower-siem',
        // 'vault-keeper',
        // 'gatekeeper-zt',
        // 'canary-signal',
        // 'registry-sentinel',
        // 'mrv-prover',
        // 'incident-commander'
      ],
      orchestratorConfig: {
        alertRouting: {
          primary: ['matrix://#sec-ops', 'email://sec-ops@reloop.genesis', 'webhook://sentry/alerts'],
          p1: ['pager://incident-commander', 'matrix://#dao-guard']
        },
        ticketSystem: {
          system: 'linear',
          team: 'Security',
          labels: ['secops', 'girm', 'dao']
        }
      }
    };
  }

  async validateEnvironment(): Promise<boolean> {
    console.log('[SecurityDeployment] Validating environment...');
    
    const missingVars: string[] = [];
    
    for (const envVar of this.config.requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0) {
      console.error('[SecurityDeployment] Missing required environment variables:', missingVars);
      
      if (this.config.environment === 'production') {
        this.deploymentStatus = 'failed';
        throw new Error(`Cannot deploy to production with missing env vars: ${missingVars.join(', ')}`);
      } else {
        console.warn('[SecurityDeployment] Running in development mode with missing env vars');
      }
    }

    // Validate specific services
    const validationResults = await Promise.allSettled([
      this.validateCloudflare(),
      this.validateVault(),
      this.validateBlockchain(),
      this.validateMonitoring()
    ]);

    const failedValidations = validationResults.filter(r => r.status === 'rejected');
    if (failedValidations.length > 0) {
      console.error('[SecurityDeployment] Validation failures:', failedValidations);
      
      if (this.config.environment === 'production') {
        this.deploymentStatus = 'failed';
        return false;
      }
    }

    this.deploymentStatus = 'validated';
    return true;
  }

  private async validateCloudflare(): Promise<void> {
    if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ZONE_ID) {
      throw new Error('Cloudflare credentials missing');
    }
    
    // In production, actually test the API connection
    if (this.config.environment === 'production') {
      const { listFirewallRules } = await import('../cloudflare');
      await listFirewallRules(); // Will throw if invalid
    }
  }

  private async validateVault(): Promise<void> {
    if (!process.env.VAULT_ADDR || !process.env.VAULT_TOKEN) {
      throw new Error('Vault credentials missing');
    }
    
    // Test vault connection in production
    if (this.config.environment === 'production') {
      const { getVaultSecret } = await import('../../secrets');
      await getVaultSecret('sys/health'); // Health check
    }
  }

  private async validateBlockchain(): Promise<void> {
    if (!process.env.POLYGON_RPC_URL) {
      throw new Error('Polygon RPC URL missing');
    }
    
    // Test RPC connection
    // In production, verify we can connect to the RPC
  }

  private async validateMonitoring(): Promise<void> {
    if (!process.env.SENTRY_DSN) {
      console.warn('[SecurityDeployment] Sentry DSN not configured');
    }
  }

  async deployAgents(): Promise<void> {
    if (this.deploymentStatus !== 'validated') {
      await this.validateEnvironment();
    }

    console.log('[SecurityDeployment] Deploying security agents...');

    try {
      // Create and register agents based on config
      for (const agentId of this.config.agents) {
        const agent = await this.createAgent(agentId);
        if (agent) {
          await this.orchestrator.registerAgent(agent);
        }
      }

      // Start the orchestrator
      await this.orchestrator.start();

      this.deploymentStatus = 'deployed';
      console.log('[SecurityDeployment] Security system deployed successfully');

      // Set up graceful shutdown
      this.setupShutdownHandlers();

    } catch (error) {
      console.error('[SecurityDeployment] Deployment failed:', error);
      this.deploymentStatus = 'failed';
      throw error;
    }
  }

  private async createAgent(agentId: string): Promise<any> {
    switch (agentId) {
      case 'girm-sentinel':
        return new GirmSentinel();
      case 'aegis-waf':
        return new AegisWAF();
      // Add other agents as they are implemented
      default:
        console.warn(`[SecurityDeployment] Agent not implemented: ${agentId}`);
        return null;
    }
  }

  private setupShutdownHandlers(): void {
    const shutdown = async (signal: string) => {
      console.log(`[SecurityDeployment] Received ${signal}, shutting down gracefully...`);
      
      try {
        await this.orchestrator.stop();
        process.exit(0);
      } catch (error) {
        console.error('[SecurityDeployment] Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('[SecurityDeployment] Uncaught exception:', error);
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[SecurityDeployment] Unhandled rejection:', reason);
      shutdown('unhandledRejection');
    });
  }

  getOrchestrator(): SecurityOrchestrator {
    return this.orchestrator;
  }

  getStatus(): string {
    return this.deploymentStatus;
  }

  async healthCheck(): Promise<{
    status: string;
    agents: Record<string, string>;
    incidents: number;
    uptime: number;
  }> {
    const agentStatuses = this.orchestrator.getAgentStatuses();
    const incidents = this.orchestrator.getActiveIncidents();

    return {
      status: this.deploymentStatus,
      agents: agentStatuses,
      incidents: incidents.length,
      uptime: process.uptime()
    };
  }
}

// Export singleton instance
export const securityDeployment = new SecurityDeployment(
  (process.env.NODE_ENV === 'production' ? 'production' : 'development') as DeploymentConfig['environment']
);
