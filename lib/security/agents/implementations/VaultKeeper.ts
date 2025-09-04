import { BaseSecurityAgent } from '../core/BaseSecurityAgent';
import {
  AgentObservation,
  AgentAction,
  AgentVerification
} from '../types';

interface Secret {
  id: string;
  name: string;
  type: 'api-key' | 'database' | 'jwt-secret' | 'encryption-key' | 'certificate' | 'private-key';
  version: number;
  createdAt: Date;
  lastRotated: Date;
  expiresAt?: Date;
  status: 'active' | 'rotating' | 'deprecated' | 'compromised';
  metadata: {
    environment: string;
    service: string;
    algorithm?: string;
    keyLength?: number;
  };
}

interface SecretPolicy {
  type: string;
  rotationInterval: number; // days
  expirationPeriod?: number; // days
  complexity?: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
  };
  accessControl: {
    allowedServices: string[];
    allowedEnvironments: string[];
  };
}

interface AccessLog {
  secretId: string;
  accessor: string;
  timestamp: Date;
  action: 'read' | 'write' | 'rotate' | 'delete';
  success: boolean;
  metadata?: Record<string, any>;
}

interface RotationSchedule {
  secretId: string;
  scheduledFor: Date;
  priority: 'emergency' | 'high' | 'normal' | 'low';
  reason: string;
}

export class VaultKeeper extends BaseSecurityAgent {
  private secrets: Map<string, Secret> = new Map();
  private policies: Map<string, SecretPolicy> = new Map();
  private accessLogs: AccessLog[] = [];
  private rotationQueue: RotationSchedule[] = [];
  private encryptionKey: string = ''; // In production, use HSM

  constructor() {
    super({
      id: 'vault-keeper',
      role: 'secrets-lifecycle',
      datasources: ['vault.api', 'aws.kms', 'supabase.db', 'github.repo'],
      schedule: 'hourly',
      escalationRules: [
        {
          condition: 'context.exposedSecrets > 0',
          priority: 'P1',
          targets: ['incident-commander', 'girm-sentinel'],
          timeoutMinutes: 5
        },
        {
          condition: 'context.failedRotations > 2',
          priority: 'P2',
          targets: ['incident-commander'],
          timeoutMinutes: 30
        }
      ]
    });

    // Initialize policies
    this.initializePolicies();
  }

  async observe(): Promise<AgentObservation[]> {
    const observations: AgentObservation[] = [];

    try {
      // 1. Check for expired secrets
      const expirationCheck = await this.checkSecretExpiration();
      observations.push({
        timestamp: new Date(),
        source: 'vault.api',
        data: expirationCheck,
        anomalyScore: expirationCheck.expiredCount > 0 ? 0.9 : 0.2
      });

      // 2. Audit secret access patterns
      const accessAudit = await this.auditSecretAccess();
      observations.push({
        timestamp: new Date(),
        source: 'vault.api',
        data: accessAudit,
        anomalyScore: accessAudit.anomalousAccess ? 0.8 : 0
      });

      // 3. Check rotation compliance
      const rotationCompliance = await this.checkRotationCompliance();
      observations.push({
        timestamp: new Date(),
        source: 'vault.api',
        data: rotationCompliance,
        anomalyScore: rotationCompliance.overdue > 5 ? 0.7 : 0.3
      });

      // 4. Scan for hardcoded secrets
      const hardcodedSecrets = await this.scanForHardcodedSecrets();
      observations.push({
        timestamp: new Date(),
        source: 'github.repo',
        data: hardcodedSecrets,
        anomalyScore: hardcodedSecrets.found > 0 ? 1.0 : 0
      });

      // 5. Verify encryption at rest
      const encryptionStatus = await this.verifyEncryptionAtRest();
      observations.push({
        timestamp: new Date(),
        source: 'aws.kms',
        data: encryptionStatus,
        anomalyScore: encryptionStatus.unencrypted > 0 ? 0.8 : 0
      });

    } catch (error) {
      this.handleError(error as Error, 'observe');
    }

    return observations;
  }

  async act(observations: AgentObservation[]): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];

    for (const obs of observations) {
      // Critical - exposed secrets
      if (obs.anomalyScore && obs.anomalyScore >= 0.9) {
        if (obs.data.exposedSecrets || obs.data.found > 0) {
          // Emergency rotation
          const exposedSecrets = obs.data.exposedSecrets || obs.data.secrets || [];
          for (const secret of exposedSecrets) {
            actions.push({
              id: `emergency-rotate-${secret.id || secret.name}-${Date.now()}`,
              type: 'emergency-rotation',
              description: `Emergency rotation of exposed secret: ${secret.name}`,
              params: {
                secretId: secret.id,
                secretName: secret.name,
                reason: 'exposed',
                priority: 'emergency'
              },
              status: 'pending'
            });

            // Notify other agents
            this.sendMessage('sigil-scanner', 'alert', {
              type: 'exposed-secret-rotation',
              secret: secret.name
            });
          }

          // Revoke old versions
          actions.push({
            id: `revoke-old-versions-${Date.now()}`,
            type: 'revoke-versions',
            description: 'Revoking old secret versions',
            params: {
              secrets: exposedSecrets,
              keepVersions: 0
            },
            status: 'pending'
          });
        }

        if (obs.data.expiredCount > 0) {
          // Rotate expired secrets
          for (const secret of obs.data.expiredSecrets) {
            actions.push({
              id: `rotate-expired-${secret.id}-${Date.now()}`,
              type: 'rotate-secret',
              description: `Rotating expired secret: ${secret.name}`,
              params: {
                secretId: secret.id,
                reason: 'expired',
                priority: 'high'
              },
              status: 'pending'
            });
          }
        }
      }

      // High risk - anomalous access
      if (obs.anomalyScore && obs.anomalyScore >= 0.7) {
        if (obs.data.anomalousAccess) {
          // Investigate anomalous access
          actions.push({
            id: `investigate-access-${Date.now()}`,
            type: 'investigate-access',
            description: 'Investigating anomalous secret access patterns',
            params: {
              accessLogs: obs.data.suspiciousLogs,
              timeframe: '24h'
            },
            status: 'pending'
          });

          // Temporarily restrict access
          for (const log of obs.data.suspiciousLogs || []) {
            actions.push({
              id: `restrict-access-${log.accessor}-${Date.now()}`,
              type: 'restrict-access',
              description: `Temporarily restricting access for: ${log.accessor}`,
              params: {
                accessor: log.accessor,
                secretId: log.secretId,
                duration: '1h',
                reason: 'anomalous-access-pattern'
              },
              status: 'pending'
            });
          }
        }

        if (obs.data.overdue > 0) {
          // Schedule overdue rotations
          for (const secret of obs.data.overdueSecrets) {
            actions.push({
              id: `schedule-rotation-${secret.id}-${Date.now()}`,
              type: 'schedule-rotation',
              description: `Scheduling rotation for: ${secret.name}`,
              params: {
                secretId: secret.id,
                priority: secret.daysOverdue > 30 ? 'high' : 'normal',
                scheduledFor: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
              },
              status: 'pending'
            });
          }
        }
      }

      // Medium risk - maintenance tasks
      if (obs.anomalyScore && obs.anomalyScore >= 0.5) {
        // Clean up deprecated versions
        actions.push({
          id: `cleanup-versions-${Date.now()}`,
          type: 'cleanup-versions',
          description: 'Cleaning up deprecated secret versions',
          params: {
            olderThan: 90, // days
            status: 'deprecated'
          },
          status: 'pending'
        });

        // Update access policies
        if (obs.data.policyViolations > 0) {
          actions.push({
            id: `update-policies-${Date.now()}`,
            type: 'update-policies',
            description: 'Updating secret access policies',
            params: {
              violations: obs.data.violations,
              action: 'enforce'
            },
            status: 'pending'
          });
        }
      }
    }

    // Periodic backup
    const lastBackup = this.getLastBackupTime();
    if (Date.now() - lastBackup > 24 * 60 * 60 * 1000) {
      actions.push({
        id: `backup-secrets-${Date.now()}`,
        type: 'backup-secrets',
        description: 'Performing scheduled secrets backup',
        params: {
          encryptionKey: 'kms-backup-key',
          destination: 's3://reloop-backups/secrets'
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
        case 'emergency-rotation':
        case 'rotate-secret':
          // Verify secret was rotated
          const rotationStatus = await this.verifyRotation(action.params.secretId);
          verification.verified = rotationStatus.success;
          verification.confidence = rotationStatus.newVersionActive ? 1.0 : 0.5;
          verification.evidence.push(`Secret rotated: ${rotationStatus.newVersion}`);
          verification.evidence.push(`Old version revoked: ${rotationStatus.oldVersionRevoked}`);
          break;

        case 'revoke-versions':
          // Verify versions were revoked
          const revokeStatus = await this.verifyRevocation(action.params.secrets);
          verification.verified = revokeStatus.allRevoked;
          verification.confidence = revokeStatus.successRate;
          verification.evidence.push(`Revoked ${revokeStatus.revokedCount} versions`);
          break;

        case 'restrict-access':
          // Verify access was restricted
          const restrictStatus = await this.verifyAccessRestriction(action.params);
          verification.verified = restrictStatus.restricted;
          verification.confidence = 0.95;
          verification.evidence.push(`Access restricted for ${action.params.accessor}`);
          break;

        case 'backup-secrets':
          // Verify backup completed
          const backupStatus = await this.verifyBackup();
          verification.verified = backupStatus.success;
          verification.confidence = backupStatus.verified ? 1.0 : 0.8;
          verification.evidence.push(`Backup completed: ${backupStatus.size} secrets`);
          break;
      }
    } catch (error) {
      verification.evidence.push(`Verification failed: ${error}`);
    }

    return verification;
  }

  private async checkSecretExpiration(): Promise<any> {
    const now = new Date();
    const expiredSecrets: Secret[] = [];
    const expiringSecrets: Secret[] = [];
    
    for (const secret of this.secrets.values()) {
      if (secret.expiresAt && secret.expiresAt < now) {
        expiredSecrets.push(secret);
      } else if (secret.expiresAt && secret.expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
        expiringSecrets.push(secret);
      }
    }

    return {
      expiredCount: expiredSecrets.length,
      expiringCount: expiringSecrets.length,
      expiredSecrets,
      expiringSecrets,
      exposedSecrets: expiredSecrets.filter(s => s.status === 'compromised')
    };
  }

  private async auditSecretAccess(): Promise<any> {
    const recentLogs = this.accessLogs.filter(log => 
      Date.now() - log.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    // Analyze access patterns
    const accessByService = new Map<string, number>();
    const failedAccess: AccessLog[] = [];
    const unusualTiming: AccessLog[] = [];
    
    for (const log of recentLogs) {
      const count = accessByService.get(log.accessor) || 0;
      accessByService.set(log.accessor, count + 1);
      
      if (!log.success) {
        failedAccess.push(log);
      }
      
      // Check for unusual timing (e.g., access at 3 AM)
      const hour = log.timestamp.getHours();
      if (hour >= 0 && hour <= 6) {
        unusualTiming.push(log);
      }
    }

    // Detect anomalies
    const avgAccess = Array.from(accessByService.values()).reduce((a, b) => a + b, 0) / accessByService.size;
    const suspiciousLogs = recentLogs.filter(log => {
      const serviceAccess = accessByService.get(log.accessor) || 0;
      return serviceAccess > avgAccess * 3; // 3x normal access
    });

    return {
      totalAccess: recentLogs.length,
      uniqueAccessors: accessByService.size,
      failedAttempts: failedAccess.length,
      anomalousAccess: suspiciousLogs.length > 0 || failedAccess.length > 10,
      suspiciousLogs,
      unusualTiming
    };
  }

  private async checkRotationCompliance(): Promise<any> {
    const overdueSecrets: any[] = [];
    const now = new Date();

    for (const secret of this.secrets.values()) {
      const policy = this.policies.get(secret.type);
      if (!policy) continue;

      const daysSinceRotation = (now.getTime() - secret.lastRotated.getTime()) / (24 * 60 * 60 * 1000);
      
      if (daysSinceRotation > policy.rotationInterval) {
        overdueSecrets.push({
          ...secret,
          daysOverdue: daysSinceRotation - policy.rotationInterval,
          policy: policy.type
        });
      }
    }

    return {
      totalSecrets: this.secrets.size,
      compliant: this.secrets.size - overdueSecrets.length,
      overdue: overdueSecrets.length,
      overdueSecrets,
      complianceRate: (this.secrets.size - overdueSecrets.length) / this.secrets.size
    };
  }

  private async scanForHardcodedSecrets(): Promise<any> {
    // Simulate scanning codebase for hardcoded secrets
    const patterns = [
      /api[_-]?key\s*=\s*['"][^'"]{20,}/gi,
      /secret\s*=\s*['"][^'"]{20,}/gi,
      /password\s*=\s*['"][^'"]{8,}/gi,
      /token\s*=\s*['"][^'"]{20,}/gi,
      /-----BEGIN\s+PRIVATE\s+KEY-----/g
    ];

    const foundSecrets = [];
    
    // Simulate finding secrets (rare occurrence)
    if (Math.random() > 0.95) {
      foundSecrets.push({
        type: 'api-key',
        location: 'src/config/api.ts:42',
        pattern: 'API_KEY hardcoded',
        severity: 'critical'
      });
    }

    return {
      scanned: true,
      patterns: patterns.length,
      found: foundSecrets.length,
      secrets: foundSecrets
    };
  }

  private async verifyEncryptionAtRest(): Promise<any> {
    // Check encryption status of secrets
    let encryptedCount = 0;
    let unencrypted = 0;
    
    for (const secret of this.secrets.values()) {
      // In production, actually verify encryption
      if (Math.random() > 0.05) {
        encryptedCount++;
      } else {
        unencrypted++;
      }
    }

    return {
      total: this.secrets.size,
      encrypted: encryptedCount,
      unencrypted,
      encryptionRate: encryptedCount / this.secrets.size,
      algorithm: 'AES-256-GCM'
    };
  }

  private initializePolicies(): void {
    // API Keys
    this.policies.set('api-key', {
      type: 'api-key',
      rotationInterval: 90, // days
      expirationPeriod: 365,
      complexity: {
        minLength: 32,
        requireSpecialChars: false,
        requireNumbers: true
      },
      accessControl: {
        allowedServices: ['api', 'webapp'],
        allowedEnvironments: ['production', 'staging']
      }
    });

    // Database credentials
    this.policies.set('database', {
      type: 'database',
      rotationInterval: 30,
      complexity: {
        minLength: 24,
        requireSpecialChars: true,
        requireNumbers: true
      },
      accessControl: {
        allowedServices: ['api', 'migration'],
        allowedEnvironments: ['production']
      }
    });

    // JWT Secrets
    this.policies.set('jwt-secret', {
      type: 'jwt-secret',
      rotationInterval: 180,
      complexity: {
        minLength: 64,
        requireSpecialChars: true,
        requireNumbers: true
      },
      accessControl: {
        allowedServices: ['api', 'auth'],
        allowedEnvironments: ['production', 'staging']
      }
    });

    // Encryption keys
    this.policies.set('encryption-key', {
      type: 'encryption-key',
      rotationInterval: 365,
      complexity: {
        minLength: 32,
        requireSpecialChars: false,
        requireNumbers: false
      },
      accessControl: {
        allowedServices: ['api', 'worker'],
        allowedEnvironments: ['production']
      }
    });
  }

  private async verifyRotation(secretId: string): Promise<any> {
    // Simulate rotation verification
    const secret = this.secrets.get(secretId);
    if (!secret) return { success: false };

    const newVersion = secret.version + 1;
    const success = Math.random() > 0.05;
    
    if (success) {
      secret.version = newVersion;
      secret.lastRotated = new Date();
      secret.status = 'active';
    }

    return {
      success,
      oldVersion: secret.version - 1,
      newVersion: success ? newVersion : secret.version,
      newVersionActive: success,
      oldVersionRevoked: success
    };
  }

  private async verifyRevocation(secrets: any[]): Promise<any> {
    let revokedCount = 0;
    
    for (const secret of secrets) {
      if (Math.random() > 0.1) {
        revokedCount++;
      }
    }

    return {
      allRevoked: revokedCount === secrets.length,
      revokedCount,
      successRate: revokedCount / secrets.length
    };
  }

  private async verifyAccessRestriction(params: any): Promise<any> {
    // Add to access control list
    return {
      restricted: true,
      accessor: params.accessor,
      duration: params.duration,
      expiresAt: new Date(Date.now() + this.parseDuration(params.duration))
    };
  }

  private async verifyBackup(): Promise<any> {
    const backupSize = this.secrets.size;
    const success = Math.random() > 0.05;

    return {
      success,
      size: backupSize,
      timestamp: new Date(),
      verified: success && Math.random() > 0.1,
      location: 's3://reloop-backups/secrets'
    };
  }

  private getLastBackupTime(): number {
    // In production, check actual backup timestamp
    return Date.now() - (Math.random() * 48 * 60 * 60 * 1000); // Random time in last 48h
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([hmd])$/);
    if (!match) return 60 * 60 * 1000; // Default 1 hour
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      default: return 60 * 60 * 1000;
    }
  }

  protected async onStart(): Promise<void> {
    // Initialize with some mock secrets
    const mockSecrets: Secret[] = [
      {
        id: 'sec-1',
        name: 'SUPABASE_API_KEY',
        type: 'api-key',
        version: 1,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lastRotated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
        status: 'active',
        metadata: {
          environment: 'production',
          service: 'api'
        }
      },
      {
        id: 'sec-2',
        name: 'JWT_SECRET',
        type: 'jwt-secret',
        version: 3,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        lastRotated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        metadata: {
          environment: 'production',
          service: 'auth',
          algorithm: 'HS256'
        }
      },
      {
        id: 'sec-3',
        name: 'DATABASE_PASSWORD',
        type: 'database',
        version: 5,
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        lastRotated: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        status: 'active',
        metadata: {
          environment: 'production',
          service: 'api'
        }
      }
    ];

    mockSecrets.forEach(secret => this.secrets.set(secret.id, secret));

    this.createAlert('P5', 'vault-initialized',
      'VaultKeeper secrets management initialized',
      { secrets: this.secrets.size, policies: this.policies.size }
    );
  }
}
