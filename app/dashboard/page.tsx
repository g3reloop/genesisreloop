'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoopVisualization } from '@/components/visualization/loop-visualization'
import { cn } from '@/lib/utils/cn'
import { 
  TrendingUp, 
  Package, 
  Users, 
  Leaf, 
  Activity,
  DollarSign,
  Recycle,
  Zap,
  HelpCircle
} from 'lucide-react'
import { toast } from 'sonner'

// Mock data for dashboard metrics
const mockMetrics = {
  totalSuppliers: 245,
  activeBatches: 89,
  srlCompliance: 78.5,
  carbonCreditsGenerated: 1234.56,
  secondaryProductsMatched: 456,
  totalRevenue: 89456.78,
  activeAgents: 8,
  systemHealth: 94.5
}

const metricCards = [
  {
    title: 'Total Suppliers',
    value: mockMetrics.totalSuppliers,
    change: '+12%',
    icon: Users,
    color: 'text-mythic-primary-500'
  },
  {
    title: 'Active Batches',
    value: mockMetrics.activeBatches,
    change: '+23%',
    icon: Package,
    color: 'text-mythic-secondary-500'
  },
  {
    title: 'SRL Compliance',
    value: `${mockMetrics.srlCompliance}%`,
    change: '+5.2%',
    icon: Recycle,
    color: 'text-mythic-loop-srl'
  },
  {
    title: 'Carbon Credits',
    value: `${mockMetrics.carbonCreditsGenerated.toFixed(2)} tCO₂`,
    change: '+18%',
    icon: Leaf,
    color: 'text-mythic-flow-credits'
  },
]

export default function DashboardPage() {
  const [realtimeMetrics, setRealtimeMetrics] = useState(mockMetrics)
  
  const handleRestartTour = () => {
    localStorage.removeItem('genesis-tour-completed')
    localStorage.removeItem('genesis-first-login')
    toast.success('Tutorial will start on your next page refresh')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeMetrics(prev => ({
        ...prev,
        activeBatches: prev.activeBatches + Math.floor(Math.random() * 3 - 1),
        carbonCreditsGenerated: prev.carbonCreditsGenerated + Math.random() * 0.5,
        secondaryProductsMatched: prev.secondaryProductsMatched + Math.floor(Math.random() * 2)
      }))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-mythic-text-muted">
            Real-time overview of your circular economy network
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestartTour}
          className="flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500"
        >
          <HelpCircle className="h-4 w-4" />
          Restart Tour
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={cn("h-4 w-4", metric.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-mythic-secondary-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loop Visualization */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Circular Economy Loop Network</CardTitle>
              <CardDescription>
                Real-time visualization of active loops and agent activities
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-mythic-secondary-500 animate-pulse" />
              <span className="text-sm font-medium">{realtimeMetrics.activeAgents}/15 Agents Active</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <LoopVisualization />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass>
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold">{mockMetrics.systemHealth}%</span>
              <Zap className="h-8 w-8 text-mythic-secondary-500" />
            </div>
            <div className="w-full bg-mythic-dark-200 dark:bg-mythic-dark-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-mythic-secondary-500 to-mythic-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${mockMetrics.systemHealth}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle className="text-lg">Revenue This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold">£{realtimeMetrics.totalRevenue.toLocaleString()}</span>
              <DollarSign className="h-8 w-8 text-mythic-accent-500" />
            </div>
            <p className="text-sm text-mythic-dark-500 dark:text-mythic-dark-400">
              Across all marketplace transactions
            </p>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Register New Batch
            </Button>
            <Button variant="secondary" className="w-full justify-start" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Invite Supplier
            </Button>
            <Button variant="secondary" className="w-full justify-start" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              View Agent Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
