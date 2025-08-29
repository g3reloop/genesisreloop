'use client'

import { motion } from 'framer-motion'
import { 
  Activity, AlertCircle, TrendingUp, Thermometer, 
  Droplet, Factory, Zap, Package, BarChart3, 
  Clock, Shield, ArrowUp, ArrowDown, Gauge, ArrowRight
} from 'lucide-react'
import { useState } from 'react'

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: string
  processor: string
}

interface ProcessorMetric {
  id: string
  name: string
  type: 'biogas' | 'biodiesel'
  status: 'online' | 'maintenance' | 'offline'
  efficiency: number
  feedstock: number
  output: number
  temperature?: number
  pressure?: number
  uptime: number
}

export default function OperatorConsole() {
  const [selectedProcessor, setSelectedProcessor] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  const alerts: Alert[] = [
    {
      id: 'AL001',
      type: 'warning',
      message: 'Temperature rising in digester 2. Currently at 39°C',
      timestamp: '5 min ago',
      processor: 'Brighton AD'
    },
    {
      id: 'AL002',
      type: 'info',
      message: 'Scheduled maintenance starts in 2 hours',
      timestamp: '15 min ago',
      processor: 'Bristol Biodiesel'
    },
    {
      id: 'AL003',
      type: 'error',
      message: 'Low feedstock alert. Only 12% remaining',
      timestamp: '1 hour ago',
      processor: 'Manchester Loop'
    }
  ]

  const processors: ProcessorMetric[] = [
    {
      id: 'BIO-BRI-001',
      name: 'Brighton AD',
      type: 'biogas',
      status: 'online',
      efficiency: 92,
      feedstock: 2.4,
      output: 180,
      temperature: 37,
      pressure: 1.2,
      uptime: 98.5
    },
    {
      id: 'BIO-MAN-002',
      name: 'Manchester Loop',
      type: 'biogas',
      status: 'online',
      efficiency: 88,
      feedstock: 3.8,
      output: 290,
      temperature: 36,
      pressure: 1.1,
      uptime: 99.2
    },
    {
      id: 'BD-BRI-001',
      name: 'Bristol Biodiesel',
      type: 'biodiesel',
      status: 'maintenance',
      efficiency: 0,
      feedstock: 0,
      output: 0,
      uptime: 96.8
    },
    {
      id: 'BD-LEE-002',
      name: 'Leeds UCO',
      type: 'biodiesel',
      status: 'online',
      efficiency: 94,
      feedstock: 1.8,
      output: 1680,
      uptime: 97.5
    }
  ]

  const activeProcessors = processors.filter(p => selectedProcessor === 'all' || p.id === selectedProcessor)
  const totalOutput = processors.reduce((sum, p) => sum + (p.status === 'online' ? p.output : 0), 0)
  const avgEfficiency = processors.filter(p => p.status === 'online').reduce((sum, p, _, arr) => sum + p.efficiency / arr.length, 0)

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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Operator Console
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted">
            Real-time monitoring and control for all Genesis processors
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-xl p-4 border border-mythic-primary-500/20 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={selectedProcessor}
                onChange={(e) => setSelectedProcessor(e.target.value)}
                className="px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
              >
                <option value="all">All Processors</option>
                {processors.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                {(['1h', '24h', '7d', '30d'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                      timeRange === range
                        ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                        : 'text-mythic-text-muted hover:text-mythic-text-primary'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-mythic-text-muted">Live Data</span>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass rounded-lg p-4 border border-mythic-primary-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-mythic-text-muted">Total Output</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-mythic-text-primary">
              {totalOutput} <span className="text-sm font-normal">m³/L</span>
            </div>
            <p className="text-xs text-green-400">+12% from yesterday</p>
          </div>
          <div className="glass rounded-lg p-4 border border-mythic-accent-300/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-mythic-text-muted">Avg Efficiency</span>
              <Activity className="h-4 w-4 text-mythic-accent-300" />
            </div>
            <div className="text-2xl font-bold text-mythic-text-primary">
              {avgEfficiency.toFixed(1)}%
            </div>
            <p className="text-xs text-mythic-text-muted">Target: 90%</p>
          </div>
          <div className="glass rounded-lg p-4 border border-flow-credits/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-mythic-text-muted">GIRM Generated</span>
              <Shield className="h-4 w-4 text-flow-credits" />
            </div>
            <div className="text-2xl font-bold text-mythic-text-primary">
              142 <span className="text-sm font-normal">today</span>
            </div>
            <p className="text-xs text-flow-credits">£2,840 value</p>
          </div>
          <div className="glass rounded-lg p-4 border border-mythic-primary-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-mythic-text-muted">System Health</span>
              <BarChart3 className="h-4 w-4 text-mythic-primary-500" />
            </div>
            <div className="text-2xl font-bold text-mythic-text-primary">98.2%</div>
            <p className="text-xs text-mythic-text-muted">3 units online</p>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Processor Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="text-xl font-bold text-mythic-text-primary mb-4">Processor Status</h2>
            {activeProcessors.map(processor => (
              <div
                key={processor.id}
                className="glass rounded-xl p-6 border border-mythic-primary-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {processor.type === 'biogas' ? (
                      <Factory className="h-6 w-6 text-mythic-primary-500" />
                    ) : (
                      <Droplet className="h-6 w-6 text-mythic-accent-300" />
                    )}
                    <div>
                      <h3 className="font-semibold text-mythic-text-primary">{processor.name}</h3>
                      <p className="text-xs text-mythic-text-muted font-mono">{processor.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    processor.status === 'online' ? 'bg-green-400/20 text-green-400' :
                    processor.status === 'maintenance' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-red-400/20 text-red-400'
                  }`}>
                    {processor.status.toUpperCase()}
                  </span>
                </div>

                {processor.status === 'online' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-mythic-text-muted mb-1">Efficiency</p>
                        <p className="text-lg font-semibold text-mythic-text-primary">
                          {processor.efficiency}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-mythic-text-muted mb-1">Feedstock</p>
                        <p className="text-lg font-semibold text-mythic-text-primary">
                          {processor.feedstock} {processor.type === 'biogas' ? 't' : 'kL'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-mythic-text-muted mb-1">Output</p>
                        <p className="text-lg font-semibold text-mythic-primary-500">
                          {processor.output} {processor.type === 'biogas' ? 'm³' : 'L'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-mythic-text-muted mb-1">Uptime</p>
                        <p className="text-lg font-semibold text-mythic-text-primary">
                          {processor.uptime}%
                        </p>
                      </div>
                    </div>

                    {processor.type === 'biogas' && (
                      <div className="flex gap-4 pt-3 border-t border-mythic-primary-500/10">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-mythic-accent-300" />
                          <span className="text-sm text-mythic-text-muted">Temp:</span>
                          <span className="text-sm text-mythic-text-primary">{processor.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-mythic-primary-500" />
                          <span className="text-sm text-mythic-text-muted">Pressure:</span>
                          <span className="text-sm text-mythic-text-primary">{processor.pressure} bar</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {processor.status === 'maintenance' && (
                  <div className="py-4 text-center">
                    <p className="text-mythic-text-muted">Scheduled maintenance in progress</p>
                    <p className="text-sm text-yellow-400 mt-1">Expected completion: 2 hours</p>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Alerts & Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Alerts */}
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
              <h3 className="font-semibold text-mythic-text-primary mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                System Alerts
              </h3>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === 'error' ? 'bg-red-400/10 border-red-400/20' :
                      alert.type === 'warning' ? 'bg-yellow-400/10 border-yellow-400/20' :
                      'bg-blue-400/10 border-blue-400/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-sm ${
                        alert.type === 'error' ? 'text-red-400' :
                        alert.type === 'warning' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {alert.message}
                      </p>
                      <button className="text-mythic-text-muted hover:text-mythic-text-primary">
                        ×
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-mythic-text-muted">{alert.processor}</p>
                      <p className="text-xs text-mythic-text-muted">{alert.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
              <h3 className="font-semibold text-mythic-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all font-semibold text-sm text-left flex items-center justify-between">
                  Schedule Maintenance
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="w-full px-4 py-3 bg-mythic-dark-900 text-mythic-text-primary rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all text-sm text-left flex items-center justify-between">
                  Generate Report
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="w-full px-4 py-3 bg-mythic-dark-900 text-mythic-text-primary rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all text-sm text-left flex items-center justify-between">
                  View Heat Cascade
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="w-full px-4 py-3 bg-mythic-dark-900 text-mythic-text-primary rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all text-sm text-left flex items-center justify-between">
                  Check Collections
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Security Section */}
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
              <h3 className="font-semibold text-mythic-text-primary mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-mythic-accent-300" />
                Security
              </h3>
              <div className="space-y-2">
                <button 
                  id="btn-list-waf" 
                  className="w-full px-4 py-3 bg-mythic-dark-900 text-mythic-text-primary rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all text-sm text-left flex items-center justify-between"
                >
                  List WAF Rules
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="w-full px-4 py-3 bg-mythic-dark-900 text-mythic-text-primary rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all text-sm text-left flex items-center justify-between">
                  View Security Alerts
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="w-full px-4 py-3 bg-mythic-dark-900 text-mythic-text-primary rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all text-sm text-left flex items-center justify-between">
                  Run Security Scan
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
              <h3 className="font-semibold text-mythic-text-primary mb-4">Performance Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-mythic-text-muted">Efficiency</span>
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> +3.2%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-mythic-text-muted">Output Volume</span>
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> +12%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-mythic-text-muted">GIRM Credits</span>
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> +8%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-mythic-text-muted">Downtime</span>
                  <span className="text-sm text-red-400 flex items-center gap-1">
                    <ArrowDown className="h-3 w-3" /> -15%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
