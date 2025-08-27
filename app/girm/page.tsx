'use client'

import { motion } from 'framer-motion'
import { Shield, Activity, BarChart3, Globe, CheckCircle2, TrendingUp, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function GIRMCreditLedger() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'ledger' | 'marketplace'>('overview')

  const recentBatches = [
    { id: 'BATCH-2024-001', type: 'FW', mass: 2500, co2e: 1.85, status: 'minted', verifier: 'TraceBot-v1.2' },
    { id: 'BATCH-2024-002', type: 'UCO', mass: 1200, co2e: 3.42, status: 'listed', verifier: 'TraceBot-v1.2' },
    { id: 'BATCH-2024-003', type: 'FW', mass: 3200, co2e: 2.37, status: 'sold', verifier: 'TraceBot-v1.2' },
    { id: 'BATCH-2024-004', type: 'UCO', mass: 850, co2e: 2.42, status: 'minted', verifier: 'TraceBot-v1.2' },
  ]

  const marketListings = [
    { id: 'GIRM-001', co2e: 10.5, price: 45, seller: 'Node-Brighton', age: '2 days' },
    { id: 'GIRM-002', co2e: 25.0, price: 42, seller: 'Node-Manchester', age: '5 days' },
    { id: 'GIRM-003', co2e: 15.3, price: 48, seller: 'Node-Bristol', age: '1 day' },
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 border border-mythic-primary-500/20 mb-6">
            <Shield className="h-4 w-4 text-mythic-primary-500" />
            <span className="text-sm text-mythic-primary-500 font-semibold">Genesis Infinite Recursion Mathematics</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              GIRM Credits
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Credits are minted from verified physical batches. They lower local energy prices and fund new loops.
            Every credit carries cryptographic proof of real waste diverted.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-mythic-dark-900 rounded-lg p-1 border border-mythic-primary-500/20">
            {(['overview', 'ledger', 'marketplace'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  selectedTab === tab
                    ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                    : 'text-mythic-text-muted hover:text-mythic-text-primary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Methodology */}
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">How GIRM Credits Work</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-mythic-primary-500/20 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-mythic-primary-500" />
                    </div>
                    <h3 className="font-semibold text-mythic-primary-500">1. TraceBot Logs</h3>
                  </div>
                  <p className="text-sm text-mythic-text-muted">
                    Mass, time, geo, quality data captured at collection. Batch photos and 
                    contamination flags ensure integrity.
                  </p>
                </div>
                
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-accent-300/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-mythic-accent-300/20 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-mythic-accent-300" />
                    </div>
                    <h3 className="font-semibold text-mythic-accent-300">2. CarbonVerifier</h3>
                  </div>
                  <p className="text-sm text-mythic-text-muted">
                    Computes CO₂e avoided per batch using verified emission factors. 
                    No estimates—only measured inputs.
                  </p>
                </div>
                
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-flow-credits/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-flow-credits/20 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-flow-credits" />
                    </div>
                    <h3 className="font-semibold text-flow-credits">3. LoopAuditBot</h3>
                  </div>
                  <p className="text-sm text-mythic-text-muted">
                    Anchors proofs on-chain. Marketplace lists credits. 
                    Sales lower local energy prices directly.
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-primary-500 mb-1">No Greenwashing</p>
                    <p className="text-sm text-mythic-text-muted">
                      Every GIRM credit represents real, measured waste diverted from landfill or 
                      improper disposal. Cryptographic proofs prevent double-counting or fraud.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <div className="text-3xl font-bold text-mythic-primary-500">15,234</div>
                <div className="text-sm text-mythic-text-muted mt-1">Total Credits Minted</div>
                <div className="text-xs text-mythic-accent-300 mt-2">+18% this month</div>
              </div>
              <div className="glass rounded-xl p-6 border border-mythic-accent-300/10">
                <div className="text-3xl font-bold text-mythic-accent-300">£43.50</div>
                <div className="text-sm text-mythic-text-muted mt-1">Average Price</div>
                <div className="text-xs text-mythic-accent-300 mt-2">-£2.30 vs diesel</div>
              </div>
              <div className="glass rounded-xl p-6 border border-flow-credits/10">
                <div className="text-3xl font-bold text-flow-credits">8,432</div>
                <div className="text-sm text-mythic-text-muted mt-1">tCO₂e Verified</div>
                <div className="text-xs text-mythic-accent-300 mt-2">Real emissions avoided</div>
              </div>
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <div className="text-3xl font-bold text-mythic-primary-500">£127k</div>
                <div className="text-sm text-mythic-text-muted mt-1">To DAO Treasury</div>
                <div className="text-xs text-mythic-accent-300 mt-2">Funding next loops</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ledger Tab */}
        {selectedTab === 'ledger' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">Recent Verified Batches</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-mythic-primary-500/10">
                      <th className="text-left py-4 px-2 text-sm font-semibold text-mythic-text-muted">Batch ID</th>
                      <th className="text-left py-4 px-2 text-sm font-semibold text-mythic-text-muted">Type</th>
                      <th className="text-right py-4 px-2 text-sm font-semibold text-mythic-text-muted">Mass (kg)</th>
                      <th className="text-right py-4 px-2 text-sm font-semibold text-mythic-text-muted">tCO₂e</th>
                      <th className="text-center py-4 px-2 text-sm font-semibold text-mythic-text-muted">Status</th>
                      <th className="text-left py-4 px-2 text-sm font-semibold text-mythic-text-muted">Verifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBatches.map((batch) => (
                      <tr key={batch.id} className="border-b border-mythic-primary-500/5 hover:bg-mythic-primary-500/5 transition-colors">
                        <td className="py-4 px-2 font-mono text-sm text-mythic-primary-500">{batch.id}</td>
                        <td className="py-4 px-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            batch.type === 'FW' 
                              ? 'bg-mythic-primary-500/20 text-mythic-primary-500' 
                              : 'bg-mythic-accent-300/20 text-mythic-accent-300'
                          }`}>
                            {batch.type === 'FW' ? 'Food Waste' : 'UCO'}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right text-mythic-text-primary">{batch.mass.toLocaleString()}</td>
                        <td className="py-4 px-2 text-right text-mythic-text-primary">{batch.co2e}</td>
                        <td className="py-4 px-2 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                            batch.status === 'minted' 
                              ? 'bg-blue-500/20 text-blue-400'
                              : batch.status === 'listed'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            <CheckCircle2 className="h-3 w-3" />
                            {batch.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-mono text-xs text-mythic-text-muted">{batch.verifier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <button 
                  disabled
                  className="text-sm text-mythic-primary-500/50 cursor-not-allowed"
                >
                  View Full Ledger → (Coming Soon)
                </button>
                <div className="text-sm text-mythic-text-muted">
                  Showing 4 of 15,234 total batches
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Marketplace Tab */}
        {selectedTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">Active Credit Listings</h2>
              
              <div className="grid gap-4">
                {marketListings.map((listing) => (
                  <div key={listing.id} className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-mono text-sm text-mythic-primary-500 mb-1">{listing.id}</div>
                          <div className="text-2xl font-bold text-mythic-text-primary">{listing.co2e} tCO₂e</div>
                          <div className="text-sm text-mythic-text-muted mt-1">by {listing.seller}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-mythic-accent-300">£{listing.price}</div>
                        <div className="text-sm text-mythic-text-muted">/tCO₂e</div>
                        <div className="text-xs text-mythic-text-muted mt-2">Listed {listing.age} ago</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-3">
                      <button 
                        disabled
                        className="flex-1 px-4 py-2 bg-mythic-primary-500/10 text-mythic-primary-500/50 rounded-lg cursor-not-allowed font-semibold relative"
                      >
                        Buy Credits
                        <span className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <span className="text-xs">Coming Soon</span>
                        </span>
                      </button>
                      <button 
                        disabled
                        className="px-4 py-2 text-mythic-text-muted/50 cursor-not-allowed"
                      >
                        View Proof
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
                <h3 className="font-semibold text-mythic-primary-500 mb-2">How Credit Sales Work</h3>
                <p className="text-sm text-mythic-text-muted mb-3">
                  When you buy GIRM credits, the funds flow directly to reduce local energy prices. 
                  The DAO takes a small fee to fund new loop development.
                </p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-mythic-text-muted">To energy discount:</span>
                    <span className="text-mythic-primary-500 font-semibold ml-2">85%</span>
                  </div>
                  <div>
                    <span className="text-mythic-text-muted">To DAO treasury:</span>
                    <span className="text-mythic-accent-300 font-semibold ml-2">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-mythic-text-primary mb-6">
            Ready to participate in the credit economy?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              disabled
              className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500/50 to-mythic-accent-300/50 text-mythic-dark-900/50 font-semibold rounded-lg cursor-not-allowed relative"
            >
              Buy Credits
              <span className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                <span className="text-mythic-primary-500">Coming Soon</span>
              </span>
            </button>
            <Link
              href="/docs#girm"
              className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
            >
              Learn Methodology
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
