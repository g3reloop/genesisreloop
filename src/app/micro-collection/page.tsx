'use client'

import { motion } from 'framer-motion'
import { Truck, MapPin, DollarSign, Shield, QrCode, Route, Users, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface Route {
  id: string
  name: string
  distance: string
  stops: number
  tonnage: string
  status: 'active' | 'planned' | 'available'
  nextCollection: string
  payRate: string
}

interface Collector {
  id: string
  name: string
  vehicle: string
  capacity: string
  rating: number
  completedRoutes: number
  earnings: string
}

export default function MicroCollectionHub() {
  const [activeTab, setActiveTab] = useState<'routes' | 'collectors' | 'proof'>('routes')

  const routes: Route[] = [
    {
      id: 'BR-FW-001',
      name: 'Brighton Restaurant Loop',
      distance: '18km',
      stops: 12,
      tonnage: '0.8t',
      status: 'active',
      nextCollection: '2h 15min',
      payRate: '£45/run'
    },
    {
      id: 'BR-UCO-002',
      name: 'Hove UCO Circuit',
      distance: '22km',
      stops: 8,
      tonnage: '320L',
      status: 'active',
      nextCollection: 'Tomorrow 8AM',
      payRate: '£38/run'
    },
    {
      id: 'BR-MIX-003',
      name: 'Central Mixed Route',
      distance: '25km',
      stops: 15,
      tonnage: '1.2t',
      status: 'planned',
      nextCollection: 'Bidding Open',
      payRate: '£52/run'
    },
    {
      id: 'BR-FW-004',
      name: 'Marina Food Waste',
      distance: '14km',
      stops: 10,
      tonnage: '0.6t',
      status: 'available',
      nextCollection: 'Available Now',
      payRate: '£40/run'
    }
  ]

  const collectors: Collector[] = [
    {
      id: 'COL-001',
      name: 'Green Loop Ltd',
      vehicle: 'Electric Van (3.5t)',
      capacity: '2t',
      rating: 4.8,
      completedRoutes: 342,
      earnings: '£18,420'
    },
    {
      id: 'COL-002',
      name: 'Sarah\'s Eco Haul',
      vehicle: 'Cargo Bike',
      capacity: '250kg',
      rating: 4.9,
      completedRoutes: 156,
      earnings: '£4,680'
    },
    {
      id: 'COL-003',
      name: 'Community Collect Co-op',
      vehicle: '2x Electric Vans',
      capacity: '4t combined',
      rating: 4.7,
      completedRoutes: 523,
      earnings: '£27,196'
    }
  ]

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Fair-Pay Collection Network
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Local collectors earn real money for essential work. No gig exploitation.
            Every pickup logged, every payment transparent, every route optimized.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="glass rounded-lg p-4 border border-mythic-primary-500/10 text-center">
            <div className="text-3xl font-bold text-mythic-primary-500">£32-52</div>
            <div className="text-sm text-mythic-text-muted">Per Route</div>
          </div>
          <div className="glass rounded-lg p-4 border border-mythic-accent-300/10 text-center">
            <div className="text-3xl font-bold text-mythic-accent-300">15 min</div>
            <div className="text-sm text-mythic-text-muted">Avg Stop Time</div>
          </div>
          <div className="glass rounded-lg p-4 border border-flow-credits/10 text-center">
            <div className="text-3xl font-bold text-flow-credits">98.4%</div>
            <div className="text-sm text-mythic-text-muted">On-Time Rate</div>
          </div>
          <div className="glass rounded-lg p-4 border border-mythic-primary-500/10 text-center">
            <div className="text-3xl font-bold text-mythic-primary-500">247</div>
            <div className="text-sm text-mythic-text-muted">Active Collectors</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 mb-8 border-b border-mythic-primary-500/20"
        >
          <button
            onClick={() => setActiveTab('routes')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'routes'
                ? 'text-mythic-primary-500'
                : 'text-mythic-text-muted hover:text-mythic-text-primary'
            }`}
          >
            Available Routes
            {activeTab === 'routes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mythic-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('collectors')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'collectors'
                ? 'text-mythic-primary-500'
                : 'text-mythic-text-muted hover:text-mythic-text-primary'
            }`}
          >
            Verified Collectors
            {activeTab === 'collectors' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mythic-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('proof')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'proof'
                ? 'text-mythic-primary-500'
                : 'text-mythic-text-muted hover:text-mythic-text-primary'
            }`}
          >
            Proof System
            {activeTab === 'proof' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mythic-primary-500" />
            )}
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Routes Tab */}
          {activeTab === 'routes' && (
            <div className="space-y-4 mb-12">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="glass rounded-xl p-6 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Route className="h-5 w-5 text-mythic-primary-500" />
                        <h3 className="font-semibold text-mythic-text-primary">{route.name}</h3>
                        <span className="text-xs text-mythic-text-muted font-mono">{route.id}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-mythic-text-muted">Distance:</span>
                          <span className="ml-2 text-mythic-text-primary">{route.distance}</span>
                        </div>
                        <div>
                          <span className="text-mythic-text-muted">Stops:</span>
                          <span className="ml-2 text-mythic-text-primary">{route.stops}</span>
                        </div>
                        <div>
                          <span className="text-mythic-text-muted">Tonnage:</span>
                          <span className="ml-2 text-mythic-text-primary">{route.tonnage}</span>
                        </div>
                        <div>
                          <span className="text-mythic-text-muted">Pay:</span>
                          <span className="ml-2 text-mythic-primary-500 font-semibold">{route.payRate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-sm ${
                        route.status === 'active' ? 'text-green-400' :
                        route.status === 'planned' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {route.nextCollection}
                      </span>
                      <button className="px-4 py-2 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all font-semibold text-sm">
                        {route.status === 'available' ? 'Claim Route' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Collectors Tab */}
          {activeTab === 'collectors' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {collectors.map((collector) => (
                <div
                  key={collector.id}
                  className="glass rounded-xl p-6 border border-mythic-primary-500/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-mythic-primary-500" />
                      <div>
                        <h3 className="font-semibold text-mythic-text-primary">{collector.name}</h3>
                        <p className="text-xs text-mythic-text-muted">{collector.vehicle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400">★ {collector.rating}</div>
                      <p className="text-xs text-mythic-text-muted">{collector.completedRoutes} routes</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-mythic-text-muted">Capacity</span>
                      <span className="text-mythic-text-primary">{collector.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mythic-text-muted">Total Earnings</span>
                      <span className="text-mythic-primary-500 font-semibold">{collector.earnings}</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 text-mythic-text-muted hover:text-mythic-text-primary transition-colors text-sm">
                    View Profile →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Proof System Tab */}
          {activeTab === 'proof' && (
            <div className="space-y-8 mb-12">
              {/* How It Works */}
              <div className="glass rounded-xl p-8 border border-mythic-primary-500/20">
                <h3 className="text-2xl font-bold text-mythic-text-primary mb-6">
                  Trustless Collection Proofs
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-mythic-primary-500/20 flex items-center justify-center text-mythic-primary-500 font-bold">
                        1
                      </div>
                      <h4 className="font-semibold text-mythic-text-primary">QR Scan at Pickup</h4>
                    </div>
                    <p className="text-sm text-mythic-text-muted">
                      Collector scans unique QR code at each stop. GPS location and timestamp 
                      automatically recorded. No manual entry needed.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-mythic-accent-300/20 flex items-center justify-center text-mythic-accent-300 font-bold">
                        2
                      </div>
                      <h4 className="font-semibold text-mythic-text-primary">Weight/Volume Log</h4>
                    </div>
                    <p className="text-sm text-mythic-text-muted">
                      Smart bins or manual entry record exact tonnage. Photo evidence required 
                      for manual logs. All data timestamped on-chain.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-flow-credits/20 flex items-center justify-center text-flow-credits font-bold">
                        3
                      </div>
                      <h4 className="font-semibold text-mythic-text-primary">Instant Payment</h4>
                    </div>
                    <p className="text-sm text-mythic-text-muted">
                      Route completion triggers automatic payment. No invoicing, no delays. 
                      Collectors paid within 1 hour of processor receipt confirmation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Proofs */}
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
                <h4 className="font-semibold text-mythic-text-primary mb-4">Recent Collection Proofs</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-mythic-primary-500/10">
                    <div className="flex items-center gap-3">
                      <QrCode className="h-4 w-4 text-mythic-primary-500" />
                      <div>
                        <p className="text-sm text-mythic-text-primary">Brighton Restaurant Loop</p>
                        <p className="text-xs text-mythic-text-muted">12 stops • 0.82t collected</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400">Verified</p>
                      <p className="text-xs text-mythic-text-muted">2h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-mythic-primary-500/10">
                    <div className="flex items-center gap-3">
                      <QrCode className="h-4 w-4 text-mythic-primary-500" />
                      <div>
                        <p className="text-sm text-mythic-text-primary">Hove UCO Circuit</p>
                        <p className="text-xs text-mythic-text-muted">8 stops • 315L collected</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400">Verified</p>
                      <p className="text-xs text-mythic-text-muted">5h ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <QrCode className="h-4 w-4 text-mythic-primary-500" />
                      <div>
                        <p className="text-sm text-mythic-text-primary">Central Mixed Route</p>
                        <p className="text-xs text-mythic-text-muted">15 stops • 1.18t collected</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-400">Processing</p>
                      <p className="text-xs text-mythic-text-muted">10min ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
                <h4 className="font-semibold text-mythic-text-primary mb-4">Anti-Fraud Measures</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-mythic-primary-500 mt-1" />
                    <div>
                      <h5 className="font-semibold text-mythic-text-primary mb-1">GPS Verification</h5>
                      <p className="text-sm text-mythic-text-muted">
                        Collection location must match registered stop coordinates within 50m radius.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-mythic-accent-300 mt-1" />
                    <div>
                      <h5 className="font-semibold text-mythic-text-primary mb-1">Time Windows</h5>
                      <p className="text-sm text-mythic-text-muted">
                        Collections must happen within scheduled windows. Early/late pickups flagged.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-flow-credits mt-1" />
                    <div>
                      <h5 className="font-semibold text-mythic-text-primary mb-1">Volume Validation</h5>
                      <p className="text-sm text-mythic-text-muted">
                        AI checks reported weights against historical averages for each stop.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-mythic-primary-500 mt-1" />
                    <div>
                      <h5 className="font-semibold text-mythic-text-primary mb-1">Reputation Stakes</h5>
                      <p className="text-sm text-mythic-text-muted">
                        Collectors stake GIRM credits. False reports = slashed stake + ban.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass rounded-xl p-8 border border-mythic-primary-500/20 text-center"
        >
          <h3 className="text-2xl font-bold text-mythic-text-primary mb-4">
            Join the Collection Network
          </h3>
          <p className="text-mythic-text-muted mb-6 max-w-2xl mx-auto">
            Fair wages for essential work. Own a van, cargo bike, or even just a car with space? 
            Start earning today. No gig economy exploitation—just honest pay for honest work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2">
              Apply as Collector
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              href="/docs"
              className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
