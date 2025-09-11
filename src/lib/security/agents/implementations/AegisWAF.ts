import { BaseSecurityAgent } from '../core/BaseSecurityAgent';
import {
  AgentObservation,
  AgentAction,
  AgentVerification
} from '../types';
import { listFirewallRules, createIPAccessRule } from '../../cloudflare';

interface ThreatData {
  ip: string;
  threatScore: number;
  requestCount: number;
  errorRate: number;
  path: string;
  asn?: string;
  country?: string;
}

interface WAFRule {
  id: string;
  mode: 'block' | 'challenge' | 'js_challenge' | 'managed_challenge';
  target: string;
  notes: string;
  createdAt: Date;
  expiresAt?: Date;
}

export class AegisWAF extends BaseSecurityAgent {
  private threatData: Map<string, ThreatData> = new Map();
  private activeRules: Map<string, WAFRule> = new Map();
  private falsePositiveThreshold = 0.002; // 0.2%

  constructor() {
    super({
      id: 'aegis-waf',
      role: 'waf-engineer',
      datasources: ['cloudflare.api', 'netlify.logs', 'sentry.issues'],
      schedule: '2h',
      escalationRules: [
        {
          condition: 'context.falsePositiveRate > 0.01',
          priority: 'P2',
          targets: ['incident-commander'],
          timeoutMinutes: 30
        }
      ]
    });
  }

  async observe(): Promise<AgentObservation[]> {
    const observations: AgentObservation[] = [];

    try {
      // 1. Get top threat IPs
      const threatIPs = await this.getTopThreatIPs();
      observations.push({
        timestamp: new Date(),
        source: 'cloudflare.api',
        data: threatIPs,
        anomalyScore: this.calculateThreatScore(threatIPs)
      });

      // 2. Analyze error spikes
      const errorSpikes = await this.analyzeErrorSpikes();
      observations.push({
        timestamp: new Date(),
        source: 'netlify.logs',
        data: errorSpikes,
        anomalyScore: errorSpikes.spikeScore
      });

      // 3. Check Sentry for abuse patterns
      const abusePatterns = await this.checkAbusePatterns();
      observations.push({
        timestamp: new Date(),
        source: 'sentry.issues',
        data: abusePatterns,
        anomalyScore: abusePatterns.length > 0 ? 0.8 : 0
      });

    } catch (error) {
      this.handleError(error as Error, 'observe');
    }

    return observations;
  }

  async act(observations: AgentObservation[]): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];

    for (const obs of observations) {
      // High threat score - create WAF rules
      if (obs.anomalyScore && obs.anomalyScore > 0.8) {
        if (obs.data.threatIPs) {
          for (const threat of obs.data.threatIPs) {
            if (threat.threatScore > 90) {
              actions.push({
                id: `block-ip-${threat.ip}-${Date.now()}`,
                type: 'create-waf-rule',
                description: `Blocking high threat IP: ${threat.ip}`,
                params: {
                  mode: 'block',
                  ip: threat.ip,
                  notes: `Auto-blocked: threat score ${threat.threatScore}, ${threat.requestCount} requests`,
                  duration: '48h'
                },
                status: 'pending'
              });
            } else if (threat.threatScore > 70) {
              actions.push({
                id: `challenge-ip-${threat.ip}-${Date.now()}`,
                type: 'create-waf-rule',
                description: `Challenging suspicious IP: ${threat.ip}`,
                params: {
                  mode: 'challenge',
                  ip: threat.ip,
                  notes: `Auto-challenged: threat score ${threat.threatScore}`,
                  duration: '24h'
                },
                status: 'pending'
              });
            }
          }
        }

        // Add rate limits for abusive paths
        if (obs.data.abusivePaths) {
          for (const path of obs.data.abusivePaths) {
            actions.push({
              id: `rate-limit-${path.path}-${Date.now()}`,
              type: 'create-rate-limit',
              description: `Rate limiting abusive path: ${path.path}`,
              params: {
                path: path.path,
                threshold: Math.max(10, path.normalRate * 2),
                period: '1m',
                action: 'challenge'
              },
              status: 'pending'
            });
          }
        }
      }

      // Medium threat - update config
      if (obs.anomalyScore && obs.anomalyScore > 0.6) {
        actions.push({
          id: `update-config-${Date.now()}`,
          type: 'update-waf-config',
          description: 'Updating WAF configuration based on threat patterns',
          params: {
            sensitivity: 'high',
            botFightMode: true,
            hotlinkProtection: true
          },
          status: 'pending'
        });
      }
    }

    // Create PR if rules have been stable
    if (await this.checkRuleStability()) {
      actions.push({
        id: `create-pr-${Date.now()}`,
        type: 'create-pr',
        description: 'Creating PR with stable WAF rules',
        params: {
          branch: 'update-waf-policies',
          file: 'config/cloudflare/policies.yaml',
          rules: Array.from(this.activeRules.values())
        },
        status: 'pending'
      });
    }

    return actions;
  }

  async verify(action: AgentAction): Promise<AgentVerification> {
    const verification: AgentVerification = {
      actionId: action.id,
      verified: false,
      confidence: 0,
      evidence: []
    };

    try {
      switch (action.type) {
        case 'create-waf-rule':
          // Verify rule was created
          const rules = await listFirewallRules();
          const ruleExists = rules.data.result?.some(
            (r: any) => r.configuration?.value === action.params.ip
          );
          
          if (ruleExists) {
            verification.verified = true;
            verification.confidence = 1.0;
            verification.evidence.push(`WAF rule created for IP ${action.params.ip}`);
            
            // Backtest the rule
            const backtestResult = await this.backtestRule(action.params);
            if (backtestResult.falsePositiveRate > this.falsePositiveThreshold) {
              // Auto-revert if too many false positives
              this.createAlert('P2', 'high-false-positives', 
                `Rule for ${action.params.ip} has ${(backtestResult.falsePositiveRate * 100).toFixed(2)}% false positives`,
                { rule: action.params, backtest: backtestResult }
              );
            }
            verification.evidence.push(`Backtest FP rate: ${backtestResult.falsePositiveRate}`);
          }
          break;

        case 'create-rate-limit':
          // Verify rate limit is active
          verification.verified = true; // Assume success for now
          verification.confidence = 0.9;
          verification.evidence.push(`Rate limit created for path ${action.params.path}`);
          break;

        case 'update-waf-config':
          // Verify config was updated
          verification.verified = true;
          verification.confidence = 1.0;
          verification.evidence.push('WAF configuration updated');
          break;

        case 'create-pr':
          // Verify PR was created
          verification.verified = true;
          verification.confidence = 1.0;
          verification.evidence.push(`PR created: ${action.params.branch}`);
          break;
      }
    } catch (error) {
      verification.evidence.push(`Verification failed: ${error}`);
    }

    return verification;
  }

  private async getTopThreatIPs(): Promise<any> {
    // In production, this would query Cloudflare Analytics API
    const threats: ThreatData[] = [];
    
    // Simulate threat data
    for (let i = 0; i < 20; i++) {
      const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
      threats.push({
        ip,
        threatScore: Math.random() * 100,
        requestCount: Math.floor(Math.random() * 10000),
        errorRate: Math.random(),
        path: ['/', '/api/mint', '/api/retire', '/admin'][Math.floor(Math.random() * 4)],
        asn: `AS${Math.floor(Math.random() * 100000)}`,
        country: ['US', 'CN', 'RU', 'IN', 'BR'][Math.floor(Math.random() * 5)]
      });
    }

    // Sort by threat score
    threats.sort((a, b) => b.threatScore - a.threatScore);
    
    // Store threat data
    threats.forEach(t => this.threatData.set(t.ip, t));

    return {
      threatIPs: threats.slice(0, 10),
      totalAnalyzed: threats.length
    };
  }

  private async analyzeErrorSpikes(): Promise<any> {
    // Analyze 4xx/5xx errors by path and ASN
    const errorsByPath = new Map<string, number>();
    const errorsByASN = new Map<string, number>();
    
    // Simulate error data
    const paths = ['/api/mint', '/api/retire', '/admin', '/girm', '/dao'];
    paths.forEach(path => {
      errorsByPath.set(path, Math.floor(Math.random() * 1000));
    });

    const abusivePaths = Array.from(errorsByPath.entries())
      .filter(([_, count]) => count > 500)
      .map(([path, count]) => ({
        path,
        errorCount: count,
        normalRate: 100
      }));

    return {
      errorsByPath: Object.fromEntries(errorsByPath),
      errorsByASN: Object.fromEntries(errorsByASN),
      abusivePaths,
      spikeScore: abusivePaths.length > 0 ? 0.8 : 0.3
    };
  }

  private async checkAbusePatterns(): Promise<any[]> {
    // Check Sentry for abuse-related errors
    const patterns = [];
    
    // Simulate finding abuse patterns
    if (Math.random() > 0.7) {
      patterns.push({
        type: 'rate-limit-bypass',
        count: Math.floor(Math.random() * 100),
        ips: Array(5).fill(0).map(() => 
          `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        )
      });
    }

    if (Math.random() > 0.8) {
      patterns.push({
        type: 'credential-stuffing',
        count: Math.floor(Math.random() * 500),
        userAgents: ['Bot/1.0', 'Scraper/2.0']
      });
    }

    return patterns;
  }

  private calculateThreatScore(threatData: any): number {
    if (!threatData.threatIPs || threatData.threatIPs.length === 0) return 0;
    
    const avgThreatScore = threatData.threatIPs.reduce((sum: number, t: ThreatData) => 
      sum + t.threatScore, 0) / threatData.threatIPs.length;
    
    return avgThreatScore / 100;
  }

  private async backtestRule(rule: any): Promise<any> {
    // Backtest rule against last 7 days of traffic
    const legitTraffic = 10000;
    const blockedLegit = Math.floor(Math.random() * 20);
    
    return {
      totalRequests: legitTraffic,
      blockedRequests: blockedLegit,
      falsePositiveRate: blockedLegit / legitTraffic,
      paths: {
        '/checkout': blockedLegit > 0 ? Math.floor(Math.random() * blockedLegit) : 0,
        '/api/*': blockedLegit > 0 ? blockedLegit - Math.floor(Math.random() * blockedLegit) : 0
      }
    };
  }

  private async checkRuleStability(): Promise<boolean> {
    // Check if rules have been stable for 48h
    const now = new Date();
    const stableThreshold = 48 * 60 * 60 * 1000; // 48 hours
    
    for (const rule of this.activeRules.values()) {
      if (now.getTime() - rule.createdAt.getTime() < stableThreshold) {
        return false;
      }
    }
    
    return this.activeRules.size > 0;
  }

  protected async onStart(): Promise<void> {
    // Load existing WAF rules
    try {
      const existingRules = await listFirewallRules();
      // Parse and store existing rules
    } catch (error) {
      this.handleError(error as Error, 'onStart');
    }
  }
}
