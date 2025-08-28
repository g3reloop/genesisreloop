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
  HelpCircle,
  ArrowRight,
  BarChart3,
  ShoppingCart,
  Truck
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

// Mock data for dashboard metrics
const mockMetrics = {
  totalWasteCollected: 3456.78,
  activeBatches: 12,
  totalEarnings: 2345.67,
  carbonOffset: 234.56,
  pendingTransactions: 5,
  verifiedSuppliers: 24,
  systemEfficiency: 87.5,
  monthlyGrowth: 23.4
}

interface MetricCard {
  title: string
  value: string | number
  change: string
  icon: React.ElementType
  color: string
  unit?: string
}

export default function DashboardPage() {
  const [realtimeMetrics, setRealtimeMetrics] = useState(mockMetrics)
  const { user } = useAuth()
  
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
        totalWasteCollected: prev.totalWasteCollected + (Math.random() * 10 - 5),
        carbonOffset: prev.carbonOffset + Math.random() * 0.5,
        pendingTransactions: Math.max(0, prev.pendingTransactions + Math.floor(Math.random() * 3 - 1))
      }))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const metricCards: MetricCard[] = [
    {
      title: 'Total Waste Collected',
      value: `${realtimeMetrics.totalWasteCollected.toFixed(2)}`,
      unit: 'kg',
      change: '+12.5%',
      icon: Recycle,
      color: 'text-mythic-primary-500'
    },
    {
      title: 'Active Batches',
      value: realtimeMetrics.activeBatches,
      change: '+3 this week',
      icon: Package,
      color: 'text-mythic-secondary-500'
    },
    {
      title: 'Total Earnings',
      value: `£${realtimeMetrics.totalEarnings.toFixed(2)}`,
      change: '+18.2%',
      icon: DollarSign,
      color: 'text-mythic-accent-500'
    },
    {
      title: 'Carbon Offset',
      value: `${realtimeMetrics.carbonOffset.toFixed(2)}`,
      unit: 'tCO₂',
      change: '+8.7%',
      icon: Leaf,
      color: 'text-mythic-flow-credits'
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-4">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-mythic-text-muted text-lg">
              Here's what's happening in your circular economy network today
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestartTour}
            className="flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500 mt-4 md:mt-0"
          >
            <HelpCircle className="h-4 w-4" />
            Restart Tour
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metricCards.map((metric, index) => (
            <Card key={index} className="bg-mythic-dark-800 border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all hover:shadow-lg hover:shadow-mythic-primary-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-mythic-text-muted">
                  {metric.title}
                </CardTitle>
                <metric.icon className={cn("h-5 w-5", metric.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-mythic-text-primary">
                  {metric.value}
                  {metric.unit && <span className="text-lg text-mythic-text-muted ml-1">{metric.unit}</span>}
                </div>
                <p className="text-xs text-mythic-secondary-500 flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest transactions and updates</CardDescription>
                </div>
                <Link href="/transactions" className="text-mythic-primary-500 hover:text-mythic-primary-400 text-sm font-medium flex items-center gap-1">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-mythic-dark-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-mythic-primary-500/20 rounded-lg">
                      <Truck className="h-5 w-5 text-mythic-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-mythic-text-primary">Batch #B2024-089 Collected</p>
                      <p className="text-xs text-mythic-text-muted">50kg cooking oil • 2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-mythic-primary-500 font-semibold">+£125.00</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-mythic-dark-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-mythic-secondary-500/20 rounded-lg">
                      <ShoppingCart className="h-5 w-5 text-mythic-secondary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-mythic-text-primary">Marketplace Sale Completed</p>
                      <p className="text-xs text-mythic-text-muted">Compost bags sold • 5 hours ago</p>
                    </div>
                  </div>
                  <span className="text-mythic-secondary-500 font-semibold">+£45.00</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-mythic-dark-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-mythic-accent-500/20 rounded-lg">
                      <Leaf className="h-5 w-5 text-mythic-accent-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-mythic-text-primary">Carbon Credits Earned</p>
                      <p className="text-xs text-mythic-text-muted">Monthly allocation • 1 day ago</p>
                    </div>
                  </div>
                  <span className="text-mythic-accent-500 font-semibold">+2.5 tCO₂</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/marketplace/create">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <Package className="h-4 w-4 mr-2" />
                  List New Batch
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/agents">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <Activity className="h-4 w-4 mr-2" />
                  View AI Agents
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" className="w-full justify-start" size="default">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Loop Visualization */}
        <Card className="bg-mythic-dark-800 border-mythic-primary-500/20 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Network Overview</CardTitle>
                <CardDescription>
                  Real-time visualization of the circular economy loops
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-mythic-secondary-500 animate-pulse" />
                <span className="text-sm font-medium text-mythic-text-muted">
                  System Efficiency: {realtimeMetrics.systemEfficiency}%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <LoopVisualization />
          </CardContent>
        </Card>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-mythic-accent-500">
                  {realtimeMetrics.pendingTransactions}
                </span>
                <Package className="h-8 w-8 text-mythic-accent-500/50" />
              </div>
              <p className="text-sm text-mythic-text-muted">
                Batches awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Network Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-mythic-primary-500">
                  +{realtimeMetrics.monthlyGrowth}%
                </span>
                <TrendingUp className="h-8 w-8 text-mythic-primary-500/50" />
              </div>
              <p className="text-sm text-mythic-text-muted">
                This month vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-mythic-dark-800 border-mythic-primary-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Verified Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-mythic-secondary-500">
                  {realtimeMetrics.verifiedSuppliers}
                </span>
                <Users className="h-8 w-8 text-mythic-secondary-500/50" />
              </div>
              <p className="text-sm text-mythic-text-muted">
                Active in your network
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
