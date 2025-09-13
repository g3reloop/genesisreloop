'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  TrendingUp, 
  Package, 
  Clock, 
  DollarSign,
  CheckCircle,
  Navigation,
  Truck,
  ArrowLeft,
  Users
} from 'lucide-react'

export default function DriverDashboard() {
  // Mock data
  const stats = {
    totalCollections: 156,
    totalEarnings: '£3,420.50',
    activeRoutes: 1,
    averageRating: '4.8'
  }
  
  const availableJobs = [
    {
      id: '1',
      supplier: { name: 'The Green Kitchen', address: '123 High St, London' },
      volume: '50L',
      distance: '2.3 miles',
      rebate: '£12.50',
      window: '10:00 AM - 2:00 PM',
      urgent: false
    },
    {
      id: '2',
      supplier: { name: 'Pizza Palace', address: '456 Market Rd, London' },
      volume: '75L',
      distance: '3.8 miles',
      rebate: '£18.75',
      window: 'ASAP',
      urgent: true
    }
  ]
  
  const activeJob = {
    id: '3',
    supplier: { name: 'Burger Joint', address: '789 Queen St, London' },
    volume: '60L',
    rebate: '£15.00'
  }

  return (
    <div className="min-h-screen bg-earth-obsidian">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-txt-ash hover:text-acc-cyan transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-semibold text-txt-snow">Driver Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-acc-cyan" />
                <span className="text-2xl font-bold text-txt-snow">{stats.totalCollections}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Total Collections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-acc-cyan" />
                <span className="text-2xl font-bold text-txt-snow">{stats.totalEarnings}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Total Earnings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Truck className="h-8 w-8 text-acc-emerald" />
                <span className="text-2xl font-bold text-txt-snow">{stats.activeRoutes}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Active Routes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-acc-gold" />
                <span className="text-2xl font-bold text-txt-snow">{stats.averageRating} ⭐</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Collection */}
        {activeJob && (
          <Card className="bg-earth-midnight/50 border-acc-emerald/20 mb-8">
            <CardHeader>
              <CardTitle className="text-txt-snow">Active Collection</CardTitle>
              <CardDescription className="text-txt-ash">Currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-acc-emerald/20 rounded-lg bg-acc-emerald/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-txt-snow">{activeJob.supplier.name}</h3>
                    <p className="text-sm text-txt-ash">{activeJob.supplier.address}</p>
                    <p className="text-sm text-acc-emerald mt-2">
                      {activeJob.volume} • {activeJob.rebate}
                    </p>
                  </div>
                  <Button className="bg-acc-emerald text-earth-obsidian hover:shadow-electric-glow">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Jobs */}
        <Card className="bg-earth-midnight/50 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-txt-snow">Available Collections</CardTitle>
            <CardDescription className="text-txt-ash">Accept jobs to start earning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-acc-cyan/40 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-txt-snow">
                          {job.supplier.name}
                          {job.urgent && (
                            <span className="ml-2 px-2 py-1 bg-hi-coral/20 text-hi-coral text-xs rounded">
                              URGENT
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-txt-ash">{job.supplier.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-txt-ash flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        {job.volume}
                      </span>
                      <span className="text-sm text-txt-ash flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.distance}
                      </span>
                      <span className="text-sm text-txt-ash flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.window}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-acc-cyan text-lg">{job.rebate}</p>
                    </div>
                    <Button className="bg-acc-cyan text-earth-obsidian hover:shadow-electric-glow">
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DAO Section */}
        <Card className="bg-earth-midnight/50 border-hi-violet/20">
          <CardHeader>
            <CardTitle className="text-txt-snow">Driver DAO</CardTitle>
            <CardDescription className="text-txt-ash">
              Participate in governance and earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-hi-violet/20 rounded-lg">
                  <Users className="h-6 w-6 text-hi-violet" />
                </div>
                <div>
                  <p className="text-sm text-txt-ash">Your voting power</p>
                  <p className="text-lg font-semibold text-txt-snow">1,250 GIRM</p>
                </div>
              </div>
              <Button className="bg-hi-violet text-txt-snow hover:shadow-electric-glow">
                View Proposals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
