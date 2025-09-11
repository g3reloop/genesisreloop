'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  PieChart,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">
            Real-time insights into your circular economy operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850,420 L</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbon Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,234 tCO₂</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£892,450</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +31% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Volume Trends</CardTitle>
            <CardDescription>UCO and Food Waste collection over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <BarChart3 className="h-16 w-16" />
              <p className="ml-4">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loop Distribution</CardTitle>
            <CardDescription>SRL vs CRL breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <PieChart className="h-16 w-16" />
              <p className="ml-4">Pie chart would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Collection efficiency by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <Activity className="h-16 w-16" />
              <p className="ml-4">Regional map would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Agent Activity</CardTitle>
            <CardDescription>Real-time agent performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">FeedstockMatcher</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-xs">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">RouteGen</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-xs">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CarbonVerifier</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <span className="text-xs">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
