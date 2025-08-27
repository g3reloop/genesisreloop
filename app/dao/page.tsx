'use client'

import { motion } from 'framer-motion'
import { Shield, Users, PieChart, Vote, TrendingUp, Lock, AlertTriangle, FileText, Timer } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function DAOGovernance() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'proposals' | 'treasury'>('overview')

  const activeProposals = [
    {
      id: 'PROP-2024-017',
      title: 'Fund Brighton Biogas Module (2tpd)',
      board: 'Finance',
      status: 'active',
      votes: { for: 8432, against: 1234 },
      ends: '2 days',
      capex: '£180k',
      type: 'major'
    },
    {
      id: 'PROP-2024-018',
      title: 'Purchase UCO collection tanker',
      board: 'Ops',
      status: 'active',
      votes: { for: 5621, against: 892 },
      ends: '12 hours',
      capex: '£15k',
      type: 'micro'
    },
    {
      id: 'PROP-2024-019',
      title: 'Update fair-pay driver rates (+15%)',
      board: 'Community',
      status: 'active',
      votes: { for: 12893, against: 342 },
      ends: '3 days',
      capex: '£0',
      type: 'policy'
    }
  ]

  const treasuryStats = {
    total: '£487,320',
    allocated: {
      reinvest: '£292,392',
      ops: '£97,464',
      reserves: '£97,464'
    },
    pending: '£45,200',
    nextLoop: 'Manchester UCO'
  }

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
            <span className="text-sm text-mythic-primary-500 font-semibold">Anti-Capture Guardrails Active</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              DAO Governance
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Community treasury. Transparent proposals. Anti-capture guardrails.
            Every decision strengthens the loops and protects against corporate extraction.
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
            {(['overview', 'proposals', 'treasury'] as const).map((tab) => (
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
            {/* Core Principles */}
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">How the DAO Works</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <PieChart className="h-6 w-6 text-mythic-primary-500" />
                    <h3 className="font-semibold text-mythic-primary-500">Dialocation Policy</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Reinvest:</span>
                      <span className="text-mythic-primary-500 font-semibold">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Operations:</span>
                      <span className="text-mythic-accent-300 font-semibold">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Reserves:</span>
                      <span className="text-flow-credits font-semibold">20%</span>
                    </div>
                  </div>
                  <p className="text-xs text-mythic-text-muted mt-3">
                    Fixed allocation prevents capture attempts
                  </p>
                </div>
                
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-accent-300/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-6 w-6 text-mythic-accent-300" />
                    <h3 className="font-semibold text-mythic-accent-300">Three Boards</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-mythic-text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-mythic-accent-300">•</span>
                      <span><strong>Ops:</strong> Daily operations, suppliers, logistics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mythic-accent-300">•</span>
                      <span><strong>Finance:</strong> Treasury, new loops, CAPEX</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mythic-accent-300">•</span>
                      <span><strong>Community:</strong> Fair-pay, governance, culture</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-flow-reputation/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-6 w-6 text-flow-reputation" />
                    <h3 className="font-semibold text-flow-reputation">Anti-Capture</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-mythic-text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-flow-reputation">•</span>
                      <span>15% max draw per loop</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-flow-reputation">•</span>
                      <span>Small actors get priority</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-flow-reputation">•</span>
                      <span>No single entity {'>'}10% vote</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-flow-reputation">•</span>
                      <span>Slash rules for bad actors</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Proposal Templates */}
              <div className="p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
                <h3 className="font-semibold text-mythic-primary-500 mb-3">Proposal Templates</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Timer className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <div>
                        <span className="font-semibold text-mythic-text-primary">Micro (≤£2k):</span>
                        <span className="text-mythic-text-muted ml-2">pump, hose, sensor—24h vote</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Timer className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                      <div>
                        <span className="font-semibold text-mythic-text-primary">Major (CAPEX):</span>
                        <span className="text-mythic-text-muted ml-2">modular plant—5 days, 2/3 pass</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-flow-credits mt-0.5" />
                      <div>
                        <span className="font-semibold text-mythic-text-primary">Policy:</span>
                        <span className="text-mythic-text-muted ml-2">rates, rules—3 days, simple majority</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-flow-reputation mt-0.5" />
                      <div>
                        <span className="font-semibold text-mythic-text-primary">Emergency:</span>
                        <span className="text-mythic-text-muted ml-2">security, halt—6h, 3 signatures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DAO Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <div className="text-3xl font-bold text-mythic-primary-500">2,456</div>
                <div className="text-sm text-mythic-text-muted mt-1">Active Members</div>
              </div>
              <div className="glass rounded-xl p-6 border border-mythic-accent-300/10">
                <div className="text-3xl font-bold text-mythic-accent-300">342</div>
                <div className="text-sm text-mythic-text-muted mt-1">Proposals Passed</div>
              </div>
              <div className="glass rounded-xl p-6 border border-flow-credits/10">
                <div className="text-3xl font-bold text-flow-credits">94.2%</div>
                <div className="text-sm text-mythic-text-muted mt-1">Participation Rate</div>
              </div>
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <div className="text-3xl font-bold text-mythic-primary-500">12</div>
                <div className="text-sm text-mythic-text-muted mt-1">Loops Funded</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Proposals Tab */}
        {selectedTab === 'proposals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">Active Proposals</h2>
              
              <div className="space-y-4">
                {activeProposals.map((proposal) => (
                  <div key={proposal.id} className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-mythic-primary-500">{proposal.id}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            proposal.board === 'Finance' 
                              ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                              : proposal.board === 'Ops'
                              ? 'bg-mythic-accent-300/20 text-mythic-accent-300'
                              : 'bg-flow-reputation/20 text-flow-reputation'
                          }`}>
                            {proposal.board}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            proposal.type === 'major' 
                              ? 'bg-flow-credits/20 text-flow-credits'
                              : proposal.type === 'micro'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {proposal.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-mythic-text-primary mb-1">{proposal.title}</h3>
                        {proposal.capex !== '£0' && (
                          <p className="text-sm text-mythic-text-muted">CAPEX: {proposal.capex}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-mythic-text-muted mb-1">Ends in</p>
                        <p className="font-semibold text-mythic-accent-300">{proposal.ends}</p>
                      </div>
                    </div>
                    
                    {/* Voting Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-400">For: {proposal.votes.for.toLocaleString()}</span>
                        <span className="text-red-400">Against: {proposal.votes.against.toLocaleString()}</span>
                      </div>
                      <div className="relative h-3 bg-mythic-dark-800 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${(proposal.votes.for / (proposal.votes.for + proposal.votes.against)) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all font-semibold">
                        Vote For
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold">
                        Vote Against
                      </button>
                      <button className="px-4 py-2 text-mythic-text-muted hover:text-mythic-text-primary transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link
                  href="/dao/propose"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
                >
                  <FileText className="h-5 w-5" />
                  Create New Proposal
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Treasury Tab */}
        {selectedTab === 'treasury' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">Treasury Overview</h2>
              
              {/* Treasury Balance */}
              <div className="text-center mb-8">
                <p className="text-mythic-text-muted mb-2">Total Treasury Balance</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                  {treasuryStats.total}
                </p>
                <p className="text-sm text-mythic-accent-300 mt-2">+£45,200 pending from credits</p>
              </div>
              
              {/* Allocation Breakdown */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-mythic-primary-500">Reinvestment</h3>
                    <span className="text-2xl font-bold text-mythic-primary-500">60%</span>
                  </div>
                  <p className="text-3xl font-bold text-mythic-text-primary mb-2">{treasuryStats.allocated.reinvest}</p>
                  <p className="text-sm text-mythic-text-muted">Next: {treasuryStats.nextLoop}</p>
                </div>
                
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-accent-300/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-mythic-accent-300">Operations</h3>
                    <span className="text-2xl font-bold text-mythic-accent-300">20%</span>
                  </div>
                  <p className="text-3xl font-bold text-mythic-text-primary mb-2">{treasuryStats.allocated.ops}</p>
                  <p className="text-sm text-mythic-text-muted">Driver pay, maintenance</p>
                </div>
                
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-flow-credits/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-flow-credits">Reserves</h3>
                    <span className="text-2xl font-bold text-flow-credits">20%</span>
                  </div>
                  <p className="text-3xl font-bold text-mythic-text-primary mb-2">{treasuryStats.allocated.reserves}</p>
                  <p className="text-sm text-mythic-text-muted">Emergency fund</p>
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div>
                <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">Recent Treasury Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <div>
                        <p className="text-sm font-semibold text-mythic-text-primary">GIRM Credit Sales</p>
                        <p className="text-xs text-mythic-text-muted">Batch GIRM-2024-089</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">+£12,450</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div>
                        <p className="text-sm font-semibold text-mythic-text-primary">Bristol Module Payment</p>
                        <p className="text-xs text-mythic-text-muted">PROP-2024-014 executed</p>
                      </div>
                    </div>
                    <span className="text-red-400 font-semibold">-£45,000</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <div>
                        <p className="text-sm font-semibold text-mythic-text-primary">Marketplace Fees</p>
                        <p className="text-xs text-mythic-text-muted">Weekly collection</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-semibold">+£3,892</span>
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
            Ready to shape the future of community energy?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dao/join"
              className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
            >
              Join the DAO
            </Link>
            <Link
              href="/docs#dao"
              className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
            >
              Read Guardrails
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
