'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import {
  Star,
  Trophy,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react'

const mockReputationData = {
  overallScore: 8450,
  rank: 42,
  totalUsers: 1337,
  level: 'Gold',
  nextLevel: 'Platinum',
  pointsToNext: 1550,
  achievements: [
    { id: 1, name: 'Early Adopter', description: 'Joined in the first month', points: 500, unlocked: true, icon: Zap },
    { id: 2, name: 'Quality Champion', description: 'Maintained 90%+ SRL for 30 days', points: 750, unlocked: true, icon: Trophy },
    { id: 3, name: 'Volume Leader', description: 'Processed 1000L of UCO', points: 1000, unlocked: true, icon: Target },
    { id: 4, name: 'Zero Waste Hero', description: 'Achieved 100% waste diversion', points: 1500, unlocked: false, icon: Shield },
    { id: 5, name: 'Community Builder', description: 'Referred 10 active users', points: 2000, unlocked: false, icon: Users },
    { id: 6, name: 'Carbon Negative', description: 'Offset 10 tCO₂', points: 2500, unlocked: false, icon: Award }
  ],
  history: [
    { date: '2024-01-20', action: 'Quality Delivery', points: 150, type: 'positive' },
    { date: '2024-01-18', action: 'On-time Collection', points: 50, type: 'positive' },
    { date: '2024-01-15', action: 'Contamination Penalty', points: -200, type: 'negative' },
    { date: '2024-01-12', action: 'Volume Milestone', points: 500, type: 'positive' },
    { date: '2024-01-10', action: 'New Registration', points: 100, type: 'positive' }
  ],
  leaderboard: [
    { rank: 1, name: 'EcoChef Ltd', score: 15230, change: 'up' },
    { rank: 2, name: 'Green Kitchen Co', score: 14890, change: 'up' },
    { rank: 3, name: 'Sustainable Foods', score: 13450, change: 'down' },
    { rank: 41, name: 'City Bistro', score: 8520, change: 'up' },
    { rank: 42, name: 'You', score: 8450, change: 'up', isCurrentUser: true },
    { rank: 43, name: 'Local Café', score: 8380, change: 'down' }
  ]
}

const levelConfig = {
  Bronze: { min: 0, max: 2500, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  Silver: { min: 2501, max: 5000, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/20' },
  Gold: { min: 5001, max: 10000, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  Platinum: { min: 10001, max: 20000, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  Diamond: { min: 20001, max: Infinity, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' }
}

export default function ReputationPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview')
  
  const currentLevelConfig = levelConfig[mockReputationData.level as keyof typeof levelConfig]
  const progressPercentage = ((mockReputationData.overallScore - currentLevelConfig.min) / (currentLevelConfig.max - currentLevelConfig.min)) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Reputation</h1>
          <p className="text-mythic-dark-500 dark:text-mythic-dark-400">
            Track your standing in the ReLoop community
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-mythic-dark-500">Global Rank</p>
          <p className="text-3xl font-bold">#{mockReputationData.rank}</p>
          <p className="text-xs text-mythic-dark-400">of {mockReputationData.totalUsers.toLocaleString()} users</p>
        </div>
      </div>

      {/* Score Overview */}
      <Card className="border-mythic-primary-200 dark:border-mythic-primary-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-mythic-dark-500">Total Reputation Score</p>
                <p className="text-5xl font-bold text-gradient">{mockReputationData.overallScore.toLocaleString()}</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-sm font-medium", currentLevelConfig.color)}>
                    {mockReputationData.level} Level
                  </span>
                  <span className="text-sm text-mythic-dark-500">
                    {mockReputationData.pointsToNext.toLocaleString()} pts to {mockReputationData.nextLevel}
                  </span>
                </div>
                <div className="w-full bg-mythic-dark-100 dark:bg-mythic-dark-800 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-mythic-primary-500 to-mythic-secondary-500 transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Trophy className="h-8 w-8 mx-auto mb-2 text-mythic-accent-500" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-mythic-dark-500">Achievements</p>
              </div>
              <div>
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-mythic-secondary-500" />
                <p className="text-2xl font-bold">+12%</p>
                <p className="text-xs text-mythic-dark-500">This Month</p>
              </div>
              <div>
                <Calendar className="h-8 w-8 mx-auto mb-2 text-mythic-primary-500" />
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-mythic-dark-500">Days Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-mythic-dark-100 dark:bg-mythic-dark-900 p-1 rounded-lg w-fit">
        {(['overview', 'achievements', 'leaderboard'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "px-4 py-2 rounded-md transition-all duration-200 capitalize",
              selectedTab === tab
                ? "bg-white dark:bg-mythic-dark-800 shadow-sm"
                : "hover:bg-mythic-dark-50 dark:hover:bg-mythic-dark-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your reputation score changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockReputationData.history.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-mythic-dark-50 dark:bg-mythic-dark-900">
                    <div className="flex items-center space-x-3">
                      {item.type === 'positive' ? (
                        <CheckCircle2 className="h-5 w-5 text-mythic-secondary-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-mythic-dark-500">{item.date}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      item.type === 'positive' ? 'text-mythic-secondary-500' : 'text-red-500'
                    )}>
                      {item.type === 'positive' ? '+' : ''}{item.points}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reputation Breakdown</CardTitle>
              <CardDescription>How your score is calculated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality (SRL Ratio)</span>
                    <span className="font-medium">3,200 pts</span>
                  </div>
                  <div className="w-full bg-mythic-dark-100 dark:bg-mythic-dark-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-mythic-secondary-500" style={{ width: '38%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Volume Processed</span>
                    <span className="font-medium">2,850 pts</span>
                  </div>
                  <div className="w-full bg-mythic-dark-100 dark:bg-mythic-dark-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-mythic-primary-500" style={{ width: '34%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Achievements</span>
                    <span className="font-medium">1,500 pts</span>
                  </div>
                  <div className="w-full bg-mythic-dark-100 dark:bg-mythic-dark-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-mythic-accent-500" style={{ width: '18%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Community</span>
                    <span className="font-medium">900 pts</span>
                  </div>
                  <div className="w-full bg-mythic-dark-100 dark:bg-mythic-dark-800 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReputationData.achievements.map(achievement => {
            const Icon = achievement.icon
            
            return (
              <Card 
                key={achievement.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-200",
                  !achievement.unlocked && "opacity-60"
                )}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Unlock className="h-4 w-4 text-mythic-secondary-500" />
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
                    achievement.unlocked 
                      ? "bg-gradient-to-br from-mythic-primary-500 to-mythic-secondary-500" 
                      : "bg-mythic-dark-200 dark:bg-mythic-dark-800"
                  )}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{achievement.name}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-gradient">
                    {achievement.points.toLocaleString()} pts
                  </p>
                  {!achievement.unlocked && (
                    <div className="mt-3">
                      <Lock className="h-4 w-4 mx-auto text-mythic-dark-400" />
                      <p className="text-xs text-mythic-dark-500 mt-1">Locked</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Global Leaderboard</CardTitle>
              <Button variant="ghost" size="sm">
                View Full Rankings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockReputationData.leaderboard.map(user => (
                <div 
                  key={user.rank}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                    user.isCurrentUser 
                      ? "bg-mythic-primary-100 dark:bg-mythic-primary-900/20 border border-mythic-primary-500" 
                      : "bg-mythic-dark-50 dark:bg-mythic-dark-900"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                      user.rank === 1 ? "bg-yellow-500 text-white" :
                      user.rank === 2 ? "bg-gray-400 text-white" :
                      user.rank === 3 ? "bg-orange-600 text-white" :
                      "bg-mythic-dark-200 dark:bg-mythic-dark-800"
                    )}>
                      {user.rank}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-mythic-dark-500">{user.score.toLocaleString()} pts</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {user.change === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-mythic-secondary-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
