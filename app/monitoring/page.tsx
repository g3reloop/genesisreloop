'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Database,
  Server,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: {
    in: number
    out: number
  }
}

interface ServiceHealth {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: string
  lastCheck: string
  message?: string
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: { in: 1.2, out: 0.8 }
  })

  const [services, setServices] = useState<ServiceHealth[]>([
    {
      name: 'API Gateway',
      status: 'healthy',
      uptime: '99.99%',
      lastCheck: '30s ago'
    },
    {
      name: 'NATS Queue',
      status: 'healthy',
      uptime: '99.95%',
      lastCheck: '30s ago'
    },
    {
      name: 'PostgreSQL',
      status: 'healthy',
      uptime: '99.99%',
      lastCheck: '30s ago'
    },
    {
      name: 'Redis Cache',
      status: 'degraded',
      uptime: '99.80%',
      lastCheck: '30s ago',
      message: 'High memory usage detected'
    },
    {
      name: 'Agent Workers',
      status: 'healthy',
      uptime: '99.90%',
      lastCheck: '30s ago'
    },
    {
      name: 'Blockchain RPC',
      status: 'healthy',
      uptime: '99.85%',
      lastCheck: '30s ago'
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.min(100, Math.max(0, prev.disk + (Math.random() - 0.5) * 2)),
        network: {
          in: Math.max(0, prev.network.in + (Math.random() - 0.5) * 0.5),
          out: Math.max(0, prev.network.out + (Math.random() - 0.5) * 0.3)
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (value: number) => {
    if (value < 50) return 'text-green-500'
    if (value < 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">System Monitoring</h1>
          <p className="text-lg text-mythic-text-muted">
            Real-time monitoring and observability dashboard
          </p>
        </div>

        {/* System Metrics */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-mythic-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className={cn("text-2xl font-bold", getStatusColor(metrics.cpu))}>
                  {metrics.cpu.toFixed(1)}%
                </p>
                <TrendingUp className="h-4 w-4 text-mythic-text-muted" />
              </div>
              <Progress value={metrics.cpu} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory</CardTitle>
              <Server className="h-4 w-4 text-mythic-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className={cn("text-2xl font-bold", getStatusColor(metrics.memory))}>
                  {metrics.memory.toFixed(1)}%
                </p>
                <TrendingDown className="h-4 w-4 text-mythic-text-muted" />
              </div>
              <Progress value={metrics.memory} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-mythic-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className={cn("text-2xl font-bold", getStatusColor(metrics.disk))}>
                  {metrics.disk.toFixed(1)}%
                </p>
                <TrendingUp className="h-4 w-4 text-mythic-text-muted" />
              </div>
              <Progress value={metrics.disk} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
              <Network className="h-4 w-4 text-mythic-primary-500" />
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-mythic-text-muted">In</span>
                  <p className="text-sm font-bold">{metrics.network.in.toFixed(1)} MB/s</p>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-mythic-text-muted">Out</span>
                  <p className="text-sm font-bold">{metrics.network.out.toFixed(1)} MB/s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Health */}
        <Card className="bg-mythic-dark-900 border-mythic-primary-500/20 mb-8">
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Current status of all system services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div 
                  key={service.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-mythic-dark-800 border border-mythic-primary-500/10"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      {service.message && (
                        <p className="text-sm text-mythic-text-muted">{service.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="text-mythic-text-muted">Uptime</p>
                      <p className="font-semibold">{service.uptime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-mythic-text-muted">Last Check</p>
                      <p className="font-semibold">{service.lastCheck}</p>
                    </div>
                    <Badge 
                      variant={service.status === 'healthy' ? 'default' : 'destructive'}
                      className={cn(
                        service.status === 'healthy' && 'bg-green-500/20 text-green-500',
                        service.status === 'degraded' && 'bg-yellow-500/20 text-yellow-500'
                      )}
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-mythic-dark-900 border-mythic-primary-500/20">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-500">High Redis Memory Usage</p>
                  <p className="text-sm text-mythic-text-muted">Redis cache memory usage exceeded 85% threshold</p>
                  <p className="text-xs text-mythic-text-muted mt-1">5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-500">Database Backup Completed</p>
                  <p className="text-sm text-mythic-text-muted">Daily backup completed successfully</p>
                  <p className="text-xs text-mythic-text-muted mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-500">Agent Queue Spike</p>
                  <p className="text-sm text-mythic-text-muted">FeedstockMatcher queue depth increased by 200%</p>
                  <p className="text-xs text-mythic-text-muted mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
