'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, AlertTriangle, Activity, Lock, Eye, Zap,
  CheckCircle, XCircle, AlertCircle, RefreshCw,
  TrendingUp, TrendingDown, BarChart3, Server
} from 'lucide-react'

interface AgentStatus {
  id: string
  name: string
  status: 'active' | 'degraded' | 'paused' | 'crashed'
  lastHeartbeat: string
  alertCount: number
  actionCount: number
}

interface SecurityMetric {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface SecurityAlert {
  id: string
  timestamp: string
  agentId: string
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5'
  message: string
  status: 'open' | 'acknowledged' | 'resolved'
}

interface SecurityIncident {
  id: string
  priority: string
  title: string
  status: 'open' | 'investigating' | 'contained' | 'resolved'
  affectedServices: string[]
  startTime: string
}

export default function SecurityDashboard() {
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [metrics, setMetrics] = useState<SecurityMetric[]>([])
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [incidents, setIncidents] = useState<SecurityIncident[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState<'operational' | 'degraded' | 'critical'>('operational')

  useEffect(() => {
    // Initialize with mock data
    loadSecurityData()
    const interval = setInterval(loadSecurityData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadSecurityData = () => {
    // Mock agent statuses
    setAgents([
      {
        id: 'girm-sentinel',
        name: 'GIRM Sentinel',
        status: 'active',
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000).toISOString(),
        alertCount: Math.floor(Math.random() * 5),
        actionCount: Math.floor(Math.random() * 10)
      },
      {
        id: 'aegis-waf',
        name: 'Aegis WAF',
        status: Math.random() > 0.1 ? 'active' : 'degraded',
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000).toISOString(),
        alertCount: Math.floor(Math.random() * 8),
        actionCount: Math.floor(Math.random() * 20)
      },
      {
        id: 'watchtower-siem',
        name: 'Watchtower SIEM',
        status: 'active',
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000).toISOString(),
        alertCount: Math.floor(Math.random() * 15),
        actionCount: Math.floor(Math.random() * 30)
      },
      {
        id: 'vault-keeper',
        name: 'Vault Keeper',
        status: 'active',
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000).toISOString(),
        alertCount: Math.floor(Math.random() * 2),
        actionCount: Math.floor(Math.random() * 5)
      },
      {
        id: 'registry-sentinel',
        name: 'Registry Sentinel',
        status: Math.random() > 0.05 ? 'active' : 'paused',
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000).toISOString(),
        alertCount: Math.floor(Math.random() * 3),
        actionCount: Math.floor(Math.random() * 8)
      },
      {
        id: 'mrv-prover',
        name: 'MRV Prover',
        status: 'active',
        lastHeartbeat: new Date(Date.now() - Math.random() * 60000).toISOString(),
        alertCount: Math.floor(Math.random() * 4),
        actionCount: Math.floor(Math.random() * 12)
      }
    ])

    // Mock security metrics
    setMetrics([
      {
        label: 'Threat Score',
        value: (Math.random() * 30 + 10).toFixed(1),
        change: Math.random() * 10 - 5,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      {
        label: 'Blocked IPs',
        value: Math.floor(Math.random() * 500 + 100),
        change: Math.floor(Math.random() * 50),
        trend: 'up'
      },
      {
        label: 'Active Incidents',
        value: Math.floor(Math.random() * 3),
        change: Math.floor(Math.random() * 2),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      {
        label: 'System Health',
        value: `${(Math.random() * 5 + 95).toFixed(1)}%`,
        change: Math.random() * 2,
        trend: 'stable'
      }
    ])

    // Mock alerts
    const mockAlerts: SecurityAlert[] = []
    const alertTypes = [
      'Suspicious mint activity detected',
      'High error rate on API endpoint',
      'Failed authentication attempts',
      'Unusual traffic pattern identified',
      'Certificate expiration warning'
    ]
    
    for (let i = 0; i < 5; i++) {
      mockAlerts.push({
        id: `ALERT-${Date.now()}-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        agentId: ['girm-sentinel', 'aegis-waf', 'watchtower-siem'][Math.floor(Math.random() * 3)],
        priority: ['P1', 'P2', 'P3', 'P4', 'P5'][Math.floor(Math.random() * 5)] as any,
        message: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        status: Math.random() > 0.3 ? 'open' : 'acknowledged'
      })
    }
    setAlerts(mockAlerts)

    // Update system status
    const degradedAgents = agents.filter(a => a.status !== 'active').length
    if (degradedAgents > 2) {
      setSystemStatus('critical')
    } else if (degradedAgents > 0) {
      setSystemStatus('degraded')
    } else {
      setSystemStatus('operational')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case 'paused':
        return <RefreshCw className="h-5 w-5 text-blue-400" />
      case 'crashed':
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'P2': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'P3': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'P4': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      case 'P5': return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'operational': return 'bg-green-400'
      case 'degraded': return 'bg-yellow-400'
      case 'critical': return 'bg-red-400'
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-4">
                Security Operations Center
              </h1>
              <p className="text-mythic-text-muted text-lg">
                Real-time security monitoring and threat detection
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getSystemStatusColor()} animate-pulse`} />
                <span className="text-sm font-medium text-mythic-text-primary">
                  System {systemStatus}
                </span>
              </div>
              <button className="px-4 py-2 bg-mythic-primary-500 text-white rounded-lg hover:bg-mythic-primary-600 transition-colors">
                Pause System
              </button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {metrics.map((metric, index) => (
            <div key={metric.label} className="bg-mythic-dark-800 rounded-xl border border-mythic-primary-500/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-mythic-text-muted">{metric.label}</span>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                ) : (
                  <BarChart3 className="h-4 w-4 text-mythic-accent-300" />
                )}
              </div>
              <div className="text-2xl font-bold text-mythic-text-primary mb-1">
                {metric.value}
              </div>
              <p className={`text-xs ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}% from last hour
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Agent Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-mythic-text-primary mb-4 flex items-center gap-2">
              <Server className="h-5 w-5 text-mythic-accent-300" />
              Security Agents
            </h2>
            <div className="space-y-4">
              {agents.map(agent => (
                <div
                  key={agent.id}
                  className={`bg-mythic-dark-800 rounded-xl border ${
                    selectedAgent === agent.id
                      ? 'border-mythic-primary-500'
                      : 'border-mythic-primary-500/20'
                  } p-6 cursor-pointer hover:border-mythic-primary-500/40 transition-all`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(agent.status)}
                      <div>
                        <h3 className="font-semibold text-mythic-text-primary">{agent.name}</h3>
                        <p className="text-xs text-mythic-text-muted">{agent.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-mythic-text-muted">Last heartbeat</p>
                      <p className="text-xs text-mythic-accent-300">
                        {new Date(agent.lastHeartbeat).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-mythic-text-muted">Status</p>
                      <p className="text-sm font-semibold text-mythic-text-primary capitalize">
                        {agent.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-mythic-text-muted">Alerts</p>
                      <p className="text-sm font-semibold text-mythic-primary-500">
                        {agent.alertCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-mythic-text-muted">Actions</p>
                      <p className="text-sm font-semibold text-mythic-accent-300">
                        {agent.actionCount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-mythic-text-primary mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Recent Alerts
            </h2>
            <div className="bg-mythic-dark-800 rounded-xl border border-mythic-primary-500/20 p-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold ${getPriorityColor(alert.priority).split(' ')[0]}`}>
                            {alert.priority}
                          </span>
                          <span className="text-xs text-mythic-text-muted">
                            {agents.find(a => a.id === alert.agentId)?.name}
                          </span>
                        </div>
                        <p className="text-sm text-mythic-text-primary">
                          {alert.message}
                        </p>
                        <p className="text-xs text-mythic-text-muted mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {alert.status === 'open' && (
                        <button className="text-xs px-2 py-1 bg-mythic-primary-500/20 text-mythic-primary-500 rounded hover:bg-mythic-primary-500/30 transition-colors">
                          Ack
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Incident Response */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-mythic-text-primary mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-mythic-primary-500" />
            Active Incidents
          </h2>
          <div className="bg-mythic-dark-800 rounded-xl border border-mythic-primary-500/20 p-6">
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents.map(incident => (
                  <div key={incident.id} className="flex items-center justify-between p-4 bg-mythic-dark-900 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-mythic-text-primary">{incident.title}</h3>
                      <p className="text-sm text-mythic-text-muted">
                        Affected: {incident.affectedServices.join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        incident.status === 'open' ? 'bg-red-500/20 text-red-500' :
                        incident.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-500' :
                        incident.status === 'contained' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {incident.status.toUpperCase()}
                      </span>
                      <p className="text-xs text-mythic-text-muted mt-1">
                        Started: {new Date(incident.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-mythic-text-primary font-medium">No active incidents</p>
                <p className="text-sm text-mythic-text-muted">System is operating normally</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
