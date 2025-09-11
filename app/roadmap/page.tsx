'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { 
  Activity,
  Brain,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Shield,
  Users,
  Globe,
  BarChart3
} from 'lucide-react'

const liveAgents = [
  { name: 'FeedstockMatcher', icon: Target, description: 'Matches suppliers to processors' },
  { name: 'TraceBot', icon: Activity, description: 'Quality verification & SRL classification' },
  { name: 'RouteGen', icon: Globe, description: 'Optimal micro-collection routes' },
  { name: 'ByproductMatcher', icon: Users, description: 'Secondary product matching' },
  { name: 'BuyerDiscoveryBot', icon: TrendingUp, description: 'Find buyers for products' },
  { name: 'CarbonVerifier', icon: CheckCircle, description: 'Calculate & verify carbon credits' },
  { name: 'ComplianceClerk', icon: Shield, description: 'UK/EU compliance documentation' },
  { name: 'ReputationBot', icon: BarChart3, description: 'Dynamic trust score tracking' }
]

const plannedAgents = [
  {
    name: 'DynamicPricingBot',
    icon: DollarSign,
    description: 'Real-time market pricing adjustments',
    launch: '12 months',
    dependencies: ['FeedstockMatcher', 'BuyerDiscoveryBot']
  },
  {
    name: 'PredictiveSupplyBot',
    icon: Brain,
    description: 'Forecast feedstock volumes using AI',
    launch: '12-18 months',
    dependencies: ['FeedstockMatcher', 'TraceBot']
  },
  {
    name: 'InsuranceRiskBot',
    icon: Shield,
    description: 'Assess risk and trigger micro-insurance',
    launch: '18 months',
    dependencies: ['TraceBot', 'ReputationBot']
  },
  {
    name: 'FinanceBot',
    icon: DollarSign,
    description: 'Micro-financing for suppliers',
    launch: '18-24 months',
    dependencies: ['FeedstockMatcher', 'BuyerDiscoveryBot']
  },
  {
    name: 'DAOGovernanceBot',
    icon: Users,
    description: 'Decentralized voting on network policies',
    launch: '24 months',
    dependencies: ['FinanceBot', 'ReputationBot']
  },
  {
    name: 'LoopExpansionBot',
    icon: TrendingUp,
    description: 'Suggest new SRL loops and products',
    launch: '24 months',
    dependencies: ['ByproductMatcher', 'PredictiveSupplyBot']
  },
  {
    name: 'ConsumerPortalBot',
    icon: Globe,
    description: 'Display impact metrics to consumers',
    launch: '24 months',
    dependencies: ['CarbonVerifier', 'ByproductMatcher']
  }
]

const upcomingFeatures = [
  {
    category: 'Market Expansion',
    features: [
      { name: 'Cross-Border Trade Hub', status: 'development', quarter: 'Q3 2024' },
      { name: 'Dynamic Pricing Engine', status: 'planning', quarter: 'Q4 2024' },
      { name: 'Global Buyer Networks', status: 'planning', quarter: 'Q1 2025' }
    ]
  },
  {
    category: 'Technology',
    features: [
      { name: 'AI Predictive Supply Modelling', status: 'development', quarter: 'Q3 2024' },
      { name: 'IoT Sensor Integration', status: 'testing', quarter: 'Q2 2024' },
      { name: 'Blockchain Smart Contracts', status: 'development', quarter: 'Q3 2024' }
    ]
  },
  {
    category: 'Compliance & Finance',
    features: [
      { name: 'Insurance & Risk Module', status: 'planning', quarter: 'Q4 2024' },
      { name: 'Embedded Finance Layer', status: 'planning', quarter: 'Q1 2025' },
      { name: 'Modular Certification Engine', status: 'development', quarter: 'Q3 2024' }
    ]
  },
  {
    category: 'Community',
    features: [
      { name: 'DAO Governance Layer', status: 'planning', quarter: 'Q2 2025' },
      { name: 'Consumer-Facing Portal', status: 'planning', quarter: 'Q1 2025' },
      { name: 'Local Loop Analytics', status: 'development', quarter: 'Q3 2024' }
    ]
  }
]

const statusColors = {
  testing: { bg: 'bg-mythic-primary-100 dark:bg-mythic-primary-900/20', text: 'text-mythic-primary-700 dark:text-mythic-primary-400' },
  development: { bg: 'bg-mythic-accent-100 dark:bg-mythic-accent-900/20', text: 'text-mythic-accent-700 dark:text-mythic-accent-400' },
  planning: { bg: 'bg-mythic-dark-100 dark:bg-mythic-dark-800', text: 'text-mythic-dark-700 dark:text-mythic-dark-400' }
}

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Platform Roadmap</h1>
        <p className="text-mythic-dark-500 dark:text-mythic-dark-400">
          Track our progress and upcoming features for the ReLoop ecosystem
        </p>
      </div>

      {/* AI Agents Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Agents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Live AI Agents</CardTitle>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-mythic-secondary-500 animate-pulse" />
                <span className="text-sm font-medium text-mythic-secondary-500">{liveAgents.length} Active</span>
              </div>
            </div>
            <CardDescription>Currently deployed and processing data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {liveAgents.map(agent => {
                const Icon = agent.icon
                return (
                  <div key={agent.name} className="flex items-start space-x-3 p-3 rounded-lg bg-mythic-secondary-50 dark:bg-mythic-secondary-900/10 border border-mythic-secondary-200 dark:border-mythic-secondary-800">
                    <Icon className="h-5 w-5 text-mythic-secondary-600 dark:text-mythic-secondary-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-mythic-dark-500 dark:text-mythic-dark-400">{agent.description}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-mythic-secondary-500" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Planned Agents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Planned AI Agents</CardTitle>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-mythic-accent-500" />
                <span className="text-sm font-medium text-mythic-accent-500">{plannedAgents.length} Upcoming</span>
              </div>
            </div>
            <CardDescription>In development or planning phase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plannedAgents.map(agent => {
                const Icon = agent.icon
                return (
                  <div key={agent.name} className="flex items-start space-x-3 p-3 rounded-lg bg-mythic-accent-50 dark:bg-mythic-accent-900/10 border border-mythic-accent-200 dark:border-mythic-accent-800">
                    <Icon className="h-5 w-5 text-mythic-accent-600 dark:text-mythic-accent-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-mythic-dark-500 dark:text-mythic-dark-400">{agent.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-3 w-3 text-mythic-dark-400" />
                        <span className="text-xs text-mythic-dark-500 dark:text-mythic-dark-400">{agent.launch}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Feature Development Timeline</CardTitle>
          <CardDescription>Upcoming platform features by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {upcomingFeatures.map(category => (
              <div key={category.category}>
                <h3 className="font-semibold text-lg mb-4">{category.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.features.map(feature => {
                    const status = statusColors[feature.status as keyof typeof statusColors]
                    return (
                      <div key={feature.name} className="p-4 rounded-lg border border-mythic-dark-200 dark:border-mythic-dark-800">
                        <h4 className="font-medium mb-2">{feature.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            status.bg,
                            status.text
                          )}>
                            {feature.status}
                          </span>
                          <span className="text-xs text-mythic-dark-500 dark:text-mythic-dark-400">
                            {feature.quarter}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card glass>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Platform development completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Core Features</span>
                <span className="text-sm text-mythic-dark-500">85%</span>
              </div>
              <div className="w-full bg-mythic-dark-200 dark:bg-mythic-dark-800 rounded-full h-2">
                <div className="bg-mythic-secondary-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">AI Agents</span>
                <span className="text-sm text-mythic-dark-500">53%</span>
              </div>
              <div className="w-full bg-mythic-dark-200 dark:bg-mythic-dark-800 rounded-full h-2">
                <div className="bg-mythic-primary-500 h-2 rounded-full" style={{ width: '53%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Integration & Testing</span>
                <span className="text-sm text-mythic-dark-500">40%</span>
              </div>
              <div className="w-full bg-mythic-dark-200 dark:bg-mythic-dark-800 rounded-full h-2">
                <div className="bg-mythic-accent-500 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
