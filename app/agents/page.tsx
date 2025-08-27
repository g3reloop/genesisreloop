'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Activity, AlertTriangle, CheckCircle, Clock, Database, 
  RefreshCw, PlayCircle, Pause, Settings, Eye, Filter,
  Zap, TrendingUp, AlertCircle
} from 'lucide-react'
import { Agent, AgentJob, AgentStatus } from '@/types/agents'

interface AgentMetrics {
  name: string
  status: AgentStatus
  queueDepth: number
  avgLatency: number
  lastHeartbeat: Date
  processed: number
  failed: number
  errorRate: number
  recentJobs?: AgentJob[]
}

export default function AgentsRegistry() {
  const [agents, setAgents] = useState<AgentMetrics[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<AgentStatus | 'all'>('all')
  const [eventStream, setEventStream] = useState<any[]>([])

  useEffect(() => {
    // Initial load
    fetchAgentStatus()
    
    // Poll for updates
    const interval = setInterval(fetchAgentStatus, 5000)
    
    // Connect to event stream (WebSocket in production)
    // connectEventStream()
    
    return () => clearInterval(interval)
  }, [])

  const fetchAgentStatus = async () => {
    try {
      // In production, fetch from API
      // const response = await fetch('/api/agents/status')
      // const data = await response.json()
      
      // Mock data
      const mockAgents: AgentMetrics[] = [
        {
          name: 'FeedstockMatcher',
          status: 'healthy',
          queueDepth: 12,
          avgLatency: 245,
          lastHeartbeat: new Date(),
          processed: 1543,
          failed: 2,
          errorRate: 0.001,
          recentJobs: []
        },
        {
          name: 'TraceBot',
          status: 'healthy',
          queueDepth: 8,
          avgLatency: 180,
          lastHeartbeat: new Date(),
          processed: 2341,
          failed: 5,
          errorRate: 0.002,
          recentJobs: []
        },
        {
          name: 'RouteGen',
          status: 'healthy',
          queueDepth: 3,
          avgLatency: 520,
          lastHeartbeat: new Date(),
          processed: 432,
          failed: 0,
          errorRate: 0,
          recentJobs: []
        },
        {
          name: 'BuyerDiscoveryBot',
          status: 'healthy',
          queueDepth: 0,
          avgLatency: 380,
          lastHeartbeat: new Date(),
          processed: 89,
          failed: 1,
          errorRate: 0.011,
          recentJobs: []
        },
        {
          name: 'CarbonVerifier',
          status: 'degraded',
          queueDepth: 45,
          avgLatency: 1200,
          lastHeartbeat: new Date(Date.now() - 60000),
          processed: 234,
          failed: 12,
          errorRate: 0.049,
          recentJobs: []
        },
        {
          name: 'ComplianceClerk',
          status: 'healthy',
          queueDepth: 2,
          avgLatency: 950,
          lastHeartbeat: new Date(),
          processed: 156,
          failed: 0,
          errorRate: 0,
          recentJobs: []
        },
        {
          name: 'ReputationBot',
          status: 'healthy',
          queueDepth: 0,
          avgLatency: 320,
          lastHeartbeat: new Date(),
          processed: 45,
          failed: 0,
          errorRate: 0,
          recentJobs: []
        },
        {
          name: 'ByproductMatcher',
          status: 'offline',
          queueDepth: 0,
          avgLatency: 0,
          lastHeartbeat: new Date(Date.now() - 300000),
          processed: 0,
          failed: 0,
          errorRate: 0,
          recentJobs: []
        }
      ]

      setAgents(mockAgents)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch agent status:', error)
    }
  }

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'healthy': return 'text-green-500'
      case 'degraded': return 'text-yellow-500'
      case 'offline': return 'text-red-500'
    }
  }

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />
      case 'degraded': return <AlertTriangle className="h-5 w-5" />
      case 'offline': return <AlertCircle className="h-5 w-5" />
    }
  }

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const filteredAgents = filterStatus === 'all' 
    ? agents 
    : agents.filter(a => a.status === filterStatus)

  const overallHealth = agents.length === 0 ? 'offline' : 
    agents.every(a => a.status === 'healthy') ? 'healthy' :
    agents.some(a => a.status === 'offline') ? 'degraded' : 'degraded'

  const totalQueueDepth = agents.reduce((sum, a) => sum + a.queueDepth, 0)
  const totalProcessed = agents.reduce((sum, a) => sum + a.processed, 0)
  const totalFailed = agents.reduce((sum, a) => sum + a.failed, 0)

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                  Agent Registry
                </span>
              </h1>
              <p className="text-xl text-mythic-text-muted">
                Monitor and manage operational AI agents
              </p>
            </div>
            
            <button
              onClick={fetchAgentStatus}
              className="p-3 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-mythic-primary-500" />
            </button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-6 w-6 text-mythic-primary-500" />
                <span className={`text-sm font-semibold ${getStatusColor(overallHealth)}`}>
                  {overallHealth.toUpperCase()}
                </span>
              </div>
              <div className="text-3xl font-bold text-mythic-text-primary">{agents.length}</div>
              <div className="text-sm text-mythic-text-muted mt-1">Active Agents</div>
            </div>

            <div className="glass rounded-xl p-6 border border-mythic-accent-300/10">
              <div className="flex items-center justify-between mb-2">
                <Database className="h-6 w-6 text-mythic-accent-300" />
              </div>
              <div className="text-3xl font-bold text-mythic-text-primary">{totalQueueDepth}</div>
              <div className="text-sm text-mythic-text-muted mt-1">Queue Depth</div>
            </div>

            <div className="glass rounded-xl p-6 border border-flow-credits/10">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-6 w-6 text-flow-credits" />
              </div>
              <div className="text-3xl font-bold text-mythic-text-primary">{totalProcessed.toLocaleString()}</div>
              <div className="text-sm text-mythic-text-muted mt-1">Jobs Processed</div>
            </div>

            <div className="glass rounded-xl p-6 border border-red-500/10">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-mythic-text-primary">{totalFailed}</div>
              <div className="text-sm text-mythic-text-muted mt-1">Failed Jobs</div>
              <div className="text-xs text-red-400 mt-1">
                {totalProcessed > 0 ? `${((totalFailed / totalProcessed) * 100).toFixed(2)}% error rate` : '0% error rate'}
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-4 w-4 text-mythic-text-muted" />
            <div className="flex gap-2">
              {(['all', 'healthy', 'degraded', 'offline'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                      : 'text-mythic-text-muted hover:text-mythic-text-primary'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Agent Grid */}
        <div className="grid gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`glass rounded-xl p-6 border ${
                agent.status === 'healthy' ? 'border-green-500/20' :
                agent.status === 'degraded' ? 'border-yellow-500/20' :
                'border-red-500/20'
              } hover:border-mythic-primary-500/40 transition-all cursor-pointer`}
              onClick={() => setSelectedAgent(agent.name === selectedAgent ? null : agent.name)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={getStatusColor(agent.status)}>
                      {getStatusIcon(agent.status)}
                    </span>
                    <h3 className="text-xl font-semibold text-mythic-text-primary">
                      {agent.name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      agent.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
                      agent.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-mythic-text-muted">Queue</span>
                      <p className="font-semibold text-mythic-text-primary">{agent.queueDepth}</p>
                    </div>
                    <div>
                      <span className="text-mythic-text-muted">Avg Latency</span>
                      <p className="font-semibold text-mythic-text-primary">{formatLatency(agent.avgLatency)}</p>
                    </div>
                    <div>
                      <span className="text-mythic-text-muted">Processed</span>
                      <p className="font-semibold text-mythic-text-primary">{agent.processed.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-mythic-text-muted">Failed</span>
                      <p className="font-semibold text-mythic-text-primary">{agent.failed}</p>
                    </div>
                    <div>
                      <span className="text-mythic-text-muted">Last Heartbeat</span>
                      <p className="font-semibold text-mythic-text-primary">
                        {new Date(agent.lastHeartbeat).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded View */}
              {selectedAgent === agent.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-mythic-primary-500/10"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-mythic-text-primary mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-mythic-text-muted">Success Rate</span>
                            <span className="text-mythic-text-primary">
                              {((1 - agent.errorRate) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-mythic-dark-900 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300"
                              style={{ width: `${(1 - agent.errorRate) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-mythic-text-muted">Queue Utilization</span>
                            <span className="text-mythic-text-primary">
                              {Math.min((agent.queueDepth / 50) * 100, 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-mythic-dark-900 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                agent.queueDepth > 30 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((agent.queueDepth / 50) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-mythic-text-primary mb-3">Agent Controls</h4>
                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all font-semibold">
                          <PlayCircle className="h-4 w-4 inline mr-2" />
                          Restart
                        </button>
                        <button className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold">
                          <Pause className="h-4 w-4 inline mr-2" />
                          Pause
                        </button>
                      </div>
                      
                      <div className="mt-3">
                        <button className="w-full px-4 py-2 text-mythic-text-muted border border-mythic-primary-500/20 rounded-lg hover:bg-mythic-dark-900 transition-all">
                          Replay Failed Jobs
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Event Stream */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 glass rounded-xl p-6 border border-mythic-primary-500/20"
        >
          <h2 className="text-xl font-bold text-mythic-text-primary mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-mythic-accent-300" />
            Live Event Stream
          </h2>
          <div className="bg-mythic-dark-900 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs">
            {eventStream.length === 0 ? (
              <p className="text-mythic-text-muted">Waiting for events...</p>
            ) : (
              eventStream.map((event, index) => (
                <div key={index} className="mb-1 text-mythic-text-muted">
                  <span className="text-mythic-accent-300">{event.timestamp}</span> 
                  <span className="text-mythic-primary-500 ml-2">[{event.agent}]</span> 
                  <span className="ml-2">{event.message}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
