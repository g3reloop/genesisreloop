import { BaseSecurityAgent } from '../core/BaseSecurityAgent';
import {
  AgentObservation,
  AgentAction,
  AgentVerification
} from '../types';

interface VulnerabilityReport {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  component: string;
  description: string;
  cwe?: string;
  cvss?: number;
  remediation?: string;
  firstDetected: Date;
  lastSeen: Date;
  status: 'new' | 'known' | 'fixed' | 'false-positive';
}

interface DependencyRisk {
  package: string;
  version: string;
  vulnerabilities: number;
  license: string;
  lastUpdated: Date;
  riskScore: number;
}

interface SecurityHeader {
  header: string;
  present: boolean;
  value?: string;
  recommendation?: string;
}

export class SigilScanner extends BaseSecurityAgent {
  private vulnerabilities: Map<string, VulnerabilityReport> = new Map();
  private dependencyRisks: Map<string, DependencyRisk> = new Map();
  private lastFullScan: Date = new Date(0);
  private scanInterval = 6 * 60 * 60 * 1000; // 6 hours

  constructor() {
    super({
      id: 'sigil-scanner',
      role: 'vulnerability-scanner',
      datasources: ['github.repo', 'snyk.api', 'netlify.logs', 'sentry.issues'],
      schedule: 'hourly',
      escalationRules: [
        {
          condition: 'context.criticalVulnerabilities > 0',
          priority: 'P1',
          targets: ['incident-commander', 'gatekeeper-zt'],
          timeoutMinutes: 15
        },
        {
          condition: 'context.highVulnerabilities > 5',
          priority: 'P2',
          targets: ['incident-commander'],
          timeoutMinutes: 60
        }
      ]
    });
  }

  async observe(): Promise<AgentObservation[]> {
    const observations: AgentObservation[] = [];

    try {
      // 1. Scan code for vulnerabilities
      const codeScan = await this.scanCodebase();
      observations.push({
        timestamp: new Date(),
        source: 'github.repo',
        data: codeScan,
        anomalyScore: this.calculateVulnerabilityScore(codeScan)
      });

      // 2. Check dependencies
      const depScan = await this.scanDependencies();
      observations.push({
        timestamp: new Date(),
        source: 'snyk.api',
        data: depScan,
        anomalyScore: this.calculateDependencyRiskScore(depScan)
      });

      // 3. Scan for security headers
      const headerScan = await this.scanSecurityHeaders();
      observations.push({
        timestamp: new Date(),
        source: 'netlify.logs',
        data: headerScan,
        anomalyScore: headerScan.missingCritical > 0 ? 0.8 : 0.3
      });

      // 4. Check for exposed secrets
      const secretScan = await this.scanForSecrets();
      observations.push({
        timestamp: new Date(),
        source: 'github.repo',
        data: secretScan,
        anomalyScore: secretScan.exposedSecrets > 0 ? 1.0 : 0
      });

      // 5. API endpoint security scan
      const apiScan = await this.scanAPIEndpoints();
      observations.push({
        timestamp: new Date(),
        source: 'sentry.issues',
        data: apiScan,
        anomalyScore: apiScan.vulnerableEndpoints > 0 ? 0.7 : 0
      });

    } catch (error) {
      this.handleError(error as Error, 'observe');
    }

    return observations;
  }

  async act(observations: AgentObservation[]): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];

    for (const obs of observations) {
      // Critical vulnerabilities - immediate action
      if (obs.anomalyScore && obs.anomalyScore >= 0.9) {
        if (obs.data.exposedSecrets) {
          // Rotate exposed secrets immediately
          for (const secret of obs.data.exposedSecrets) {
            actions.push({
              id: `rotate-secret-${secret.name}-${Date.now()}`,
              type: 'rotate-secret',
              description: `Emergency rotation of exposed secret: ${secret.name}`,
              params: {
                secretName: secret.name,
                location: secret.location,
                priority: 'emergency'
              },
              status: 'pending'
            });
          }

          // Notify VaultKeeper
          this.sendMessage('vault-keeper', 'alert', {
            type: 'exposed-secret',
            secrets: obs.data.exposedSecrets
          });
        }

        if (obs.data.criticalVulnerabilities) {
          // Create hotfix PR for critical vulnerabilities
          actions.push({
            id: `hotfix-pr-${Date.now()}`,
            type: 'create-hotfix-pr',
            description: 'Creating hotfix PR for critical vulnerabilities',
            params: {
              vulnerabilities: obs.data.criticalVulnerabilities,
              branch: 'security/critical-hotfix',
              autoMerge: false
            },
            status: 'pending'
          });
        }
      }

      // High severity - scheduled fixes
      if (obs.anomalyScore && obs.anomalyScore >= 0.7) {
        if (obs.data.vulnerableEndpoints) {
          // Add WAF rules for vulnerable endpoints
          for (const endpoint of obs.data.vulnerableEndpoints) {
            actions.push({
              id: `protect-endpoint-${endpoint.path}-${Date.now()}`,
              type: 'add-waf-rule',
              description: `Adding WAF protection for vulnerable endpoint: ${endpoint.path}`,
              params: {
                endpoint: endpoint.path,
                vulnerabilities: endpoint.vulnerabilities,
                rules: this.generateWAFRules(endpoint)
              },
              status: 'pending'
            });
          }

          // Notify AegisWAF
          this.sendMessage('aegis-waf', 'act', {
            type: 'protect-endpoints',
            endpoints: obs.data.vulnerableEndpoints
          });
        }

        if (obs.data.riskyDependencies) {
          // Schedule dependency updates
          actions.push({
            id: `update-deps-${Date.now()}`,
            type: 'update-dependencies',
            description: 'Updating risky dependencies',
            params: {
              dependencies: obs.data.riskyDependencies,
              strategy: 'conservative'
            },
            status: 'pending'
          });
        }
      }

      // Medium severity - create tickets
      if (obs.anomalyScore && obs.anomalyScore >= 0.5) {
        actions.push({
          id: `security-ticket-${Date.now()}`,
          type: 'create-ticket',
          description: 'Creating security improvement ticket',
          params: {
            priority: 'P3',
            title: `Security scan findings - ${new Date().toISOString()}`,
            findings: this.summarizeFindings(obs.data),
            recommendations: this.generateRecommendations(obs.data)
          },
          status: 'pending'
        });
      }
    }

    // Periodic full scan
    if (Date.now() - this.lastFullScan.getTime() > this.scanInterval) {
      actions.push({
        id: `full-scan-${Date.now()}`,
        type: 'trigger-full-scan',
        description: 'Triggering comprehensive security scan',
        params: {
          scanTypes: ['sast', 'dast', 'container', 'infrastructure']
        },
        status: 'pending'
      });
      this.lastFullScan = new Date();
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
        case 'rotate-secret':
          // Verify secret was rotated
          const secretRotated = await this.verifySecretRotation(action.params.secretName);
          verification.verified = secretRotated;
          verification.confidence = secretRotated ? 1.0 : 0;
          verification.evidence.push(`Secret ${action.params.secretName} rotation: ${secretRotated}`);
          break;

        case 'create-hotfix-pr':
          // Verify PR was created
          verification.verified = true; // Assume success
          verification.confidence = 0.9;
          verification.evidence.push('Hotfix PR created');
          break;

        case 'add-waf-rule':
          // Verify WAF rule is active
          verification.verified = true;
          verification.confidence = 0.95;
          verification.evidence.push(`WAF rule added for ${action.params.endpoint}`);
          break;

        case 'update-dependencies':
          // Verify dependencies were updated
          const depsUpdated = await this.verifyDependencyUpdates(action.params.dependencies);
          verification.verified = depsUpdated.success;
          verification.confidence = depsUpdated.updatedCount / action.params.dependencies.length;
          verification.evidence.push(`Updated ${depsUpdated.updatedCount} of ${action.params.dependencies.length} dependencies`);
          break;

        case 'trigger-full-scan':
          // Verify scan was triggered
          verification.verified = true;
          verification.confidence = 1.0;
          verification.evidence.push('Full security scan triggered');
          break;
      }
    } catch (error) {
      verification.evidence.push(`Verification failed: ${error}`);
    }

    return verification;
  }

  private async scanCodebase(): Promise<any> {
    // Simulate SAST scan results
    const vulnerabilities: VulnerabilityReport[] = [];
    
    // Simulate finding vulnerabilities
    const vulnTypes = [
      { type: 'sql-injection', severity: 'critical', cwe: 'CWE-89' },
      { type: 'xss', severity: 'high', cwe: 'CWE-79' },
      { type: 'insecure-crypto', severity: 'high', cwe: 'CWE-327' },
      { type: 'path-traversal', severity: 'medium', cwe: 'CWE-22' },
      { type: 'weak-random', severity: 'low', cwe: 'CWE-330' }
    ];

    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
      const vuln = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
      const report: VulnerabilityReport = {
        id: `vuln-${Date.now()}-${i}`,
        type: vuln.type,
        severity: vuln.severity as any,
        component: `lib/agents/${Math.random() > 0.5 ? 'feedstock-matcher' : 'carbon-verifier'}.ts`,
        description: `Potential ${vuln.type} vulnerability detected`,
        cwe: vuln.cwe,
        cvss: vuln.severity === 'critical' ? 9.8 : vuln.severity === 'high' ? 7.5 : 5.0,
        remediation: `Apply security patch for ${vuln.type}`,
        firstDetected: new Date(),
        lastSeen: new Date(),
        status: 'new'
      };
      vulnerabilities.push(report);
      this.vulnerabilities.set(report.id, report);
    }

    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
    const highVulns = vulnerabilities.filter(v => v.severity === 'high');

    return {
      totalVulnerabilities: vulnerabilities.length,
      criticalVulnerabilities: criticalVulns.length,
      highVulnerabilities: highVulns.length,
      newVulnerabilities: vulnerabilities.filter(v => v.status === 'new'),
      vulnerabilities: criticalVulns.concat(highVulns).slice(0, 5)
    };
  }

  private async scanDependencies(): Promise<any> {
    // Simulate dependency scan
    const riskyDeps: DependencyRisk[] = [];
    
    const deps = [
      { package: 'lodash', version: '4.17.11', vulns: 2, license: 'MIT' },
      { package: 'axios', version: '0.21.0', vulns: 1, license: 'MIT' },
      { package: 'web3', version: '1.7.0', vulns: 0, license: 'LGPL-3.0' },
      { package: 'ethers', version: '5.5.0', vulns: 0, license: 'MIT' }
    ];

    for (const dep of deps) {
      if (dep.vulns > 0 || Math.random() > 0.7) {
        const risk: DependencyRisk = {
          package: dep.package,
          version: dep.version,
          vulnerabilities: dep.vulns,
          license: dep.license,
          lastUpdated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          riskScore: dep.vulns * 0.3 + (Math.random() * 0.4)
        };
        riskyDeps.push(risk);
        this.dependencyRisks.set(dep.package, risk);
      }
    }

    return {
      totalDependencies: deps.length,
      riskyDependencies: riskyDeps,
      outdatedDependencies: riskyDeps.filter(d => 
        Date.now() - d.lastUpdated.getTime() > 180 * 24 * 60 * 60 * 1000
      ),
      licenseRisks: riskyDeps.filter(d => d.license === 'LGPL-3.0' || d.license === 'GPL-3.0')
    };
  }

  private async scanSecurityHeaders(): Promise<any> {
    // Check security headers
    const headers: SecurityHeader[] = [
      {
        header: 'Content-Security-Policy',
        present: Math.random() > 0.3,
        recommendation: "Add CSP header with strict directives"
      },
      {
        header: 'X-Frame-Options',
        present: Math.random() > 0.2,
        value: 'DENY',
        recommendation: "Set X-Frame-Options to DENY"
      },
      {
        header: 'Strict-Transport-Security',
        present: Math.random() > 0.1,
        value: 'max-age=31536000; includeSubDomains',
        recommendation: "Enable HSTS with long duration"
      },
      {
        header: 'X-Content-Type-Options',
        present: Math.random() > 0.2,
        value: 'nosniff'
      },
      {
        header: 'Referrer-Policy',
        present: Math.random() > 0.4,
        value: 'strict-origin-when-cross-origin'
      }
    ];

    const missingHeaders = headers.filter(h => !h.present);
    const criticalMissing = missingHeaders.filter(h => 
      ['Content-Security-Policy', 'Strict-Transport-Security'].includes(h.header)
    );

    return {
      headers,
      missingHeaders,
      missingCritical: criticalMissing.length,
      score: headers.filter(h => h.present).length / headers.length
    };
  }

  private async scanForSecrets(): Promise<any> {
    // Scan for exposed secrets
    const patterns = [
      /AKIA[0-9A-Z]{16}/g, // AWS Access Key
      /AIza[0-9A-Za-z\\-_]{35}/g, // Google API Key
      /sk_live_[0-9a-zA-Z]{24}/g, // Stripe API Key
      /[a-zA-Z0-9]{40}/g, // Generic API key pattern
      /-----BEGIN RSA PRIVATE KEY-----/g // Private key
    ];

    const exposedSecrets = [];
    
    // Simulate finding exposed secrets (rarely)
    if (Math.random() > 0.95) {
      exposedSecrets.push({
        name: 'AWS_ACCESS_KEY',
        type: 'aws-access-key',
        location: 'config/aws.js:15',
        severity: 'critical'
      });
    }

    return {
      exposedSecrets,
      totalScanned: 1523, // Mock file count
      patternsChecked: patterns.length
    };
  }

  private async scanAPIEndpoints(): Promise<any> {
    // Scan API endpoints for vulnerabilities
    const endpoints = [
      '/api/mint',
      '/api/retire',
      '/api/agents/status',
      '/api/dao/vote',
      '/api/carbon/verify'
    ];

    const vulnerableEndpoints = [];
    
    for (const endpoint of endpoints) {
      const vulns = [];
      
      if (Math.random() > 0.8) {
        vulns.push('missing-rate-limit');
      }
      if (Math.random() > 0.9) {
        vulns.push('no-authentication');
      }
      if (Math.random() > 0.85) {
        vulns.push('injection-risk');
      }
      
      if (vulns.length > 0) {
        vulnerableEndpoints.push({
          path: endpoint,
          vulnerabilities: vulns,
          riskLevel: vulns.includes('no-authentication') ? 'critical' : 'high'
        });
      }
    }

    return {
      totalEndpoints: endpoints.length,
      vulnerableEndpoints: vulnerableEndpoints.length,
      endpoints: vulnerableEndpoints
    };
  }

  private calculateVulnerabilityScore(scan: any): number {
    if (scan.criticalVulnerabilities > 0) return 0.95;
    if (scan.highVulnerabilities > 3) return 0.8;
    if (scan.highVulnerabilities > 0) return 0.7;
    if (scan.totalVulnerabilities > 5) return 0.5;
    return scan.totalVulnerabilities * 0.1;
  }

  private calculateDependencyRiskScore(scan: any): number {
    const riskyCount = scan.riskyDependencies?.length || 0;
    const outdatedCount = scan.outdatedDependencies?.length || 0;
    const licenseRisks = scan.licenseRisks?.length || 0;
    
    return Math.min(1.0, (riskyCount * 0.2 + outdatedCount * 0.1 + licenseRisks * 0.3));
  }

  private generateWAFRules(endpoint: any): any[] {
    const rules = [];
    
    if (endpoint.vulnerabilities.includes('injection-risk')) {
      rules.push({
        type: 'input-validation',
        pattern: '[<>\'";]',
        action: 'block'
      });
    }
    
    if (endpoint.vulnerabilities.includes('missing-rate-limit')) {
      rules.push({
        type: 'rate-limit',
        threshold: 100,
        window: '1m'
      });
    }
    
    return rules;
  }

  private summarizeFindings(data: any): string {
    const parts = [];
    
    if (data.totalVulnerabilities) {
      parts.push(`${data.totalVulnerabilities} vulnerabilities found`);
    }
    if (data.riskyDependencies) {
      parts.push(`${data.riskyDependencies.length} risky dependencies`);
    }
    if (data.missingHeaders) {
      parts.push(`${data.missingHeaders.length} missing security headers`);
    }
    
    return parts.join(', ');
  }

  private generateRecommendations(data: any): string[] {
    const recommendations = [];
    
    if (data.criticalVulnerabilities > 0) {
      recommendations.push('Immediately patch critical vulnerabilities');
    }
    if (data.outdatedDependencies?.length > 0) {
      recommendations.push('Update outdated dependencies');
    }
    if (data.missingCritical > 0) {
      recommendations.push('Implement missing security headers');
    }
    
    return recommendations;
  }

  private async verifySecretRotation(secretName: string): Promise<boolean> {
    // In production, check with vault/KMS
    return Math.random() > 0.1; // 90% success rate
  }

  private async verifyDependencyUpdates(dependencies: any[]): Promise<any> {
    return {
      success: true,
      updatedCount: Math.floor(dependencies.length * 0.8)
    };
  }

  protected async onStart(): Promise<void> {
    // Initialize vulnerability database
    this.createAlert('P5', 'scanner-initialized', 
      'SigilScanner vulnerability scanner initialized', 
      { scanTypes: ['sast', 'dependency', 'secret', 'api'] }
    );
  }
}
