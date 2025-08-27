'use client'

import { motion } from 'framer-motion'
import { Coins, ExternalLink, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import Link from 'next/link'

export default function TreasuryPage() {
  const treasuryStats = {
    totalBalance: '£287,543',
    monthlyInflow: '£45,231',
    monthlyOutflow: '£38,192',
    activeProjects: 12
  }

  const recentTransactions = [
    { id: '0x1234...5678', type: 'inflow', amount: '£5,420', description: 'GIRM Credit Sales', time: '2 hours ago' },
    { id: '0x2345...6789', type: 'outflow', amount: '£12,000', description: 'Node Equipment Purchase', time: '5 hours ago' },
    { id: '0x3456...7890', type: 'inflow', amount: '£8,900', description: 'Marketplace Fees', time: '1 day ago' },
    { id: '0x4567...8901', type: 'outflow', amount: '£15,000', description: 'Developer Grants', time: '2 days ago' },
    { id: '0x5678...9012', type: 'inflow', amount: '£3,200', description: 'DAO Membership Fees', time: '3 days ago' }
  ]

  const allocations = [
    { category: 'Infrastructure', percentage: 35, amount: '£100,640' },
    { category: 'R&D Grants', percentage: 25, amount: '£71,886' },
    { category: 'Operations', percentage: 20, amount: '£57,509' },
    { category: 'Marketing', percentage: 10, amount: '£28,754' },
    { category: 'Reserve Fund', percentage: 10, amount: '£28,754' }
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
            <Coins className="h-4 w-4 text-mythic-primary-500" />
            <span className="text-sm text-mythic-primary-500 font-semibold">DAO Treasury</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Treasury Overview
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto mb-8">
            Transparent financial management for the Genesis Reloop ecosystem. 
            All transactions are recorded on-chain and auditable by the community.
          </p>
          
          {/* View on Chain Button */}
          <Link
            href="https://etherscan.io/address/0x0000000000000000000000000000000000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all font-semibold"
          >
            View on Chain
            <ExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
            <div className="flex items-center justify-between mb-4">
              <Coins className="h-6 w-6 text-mythic-primary-500" />
              <span className="text-xs text-mythic-text-muted">Total Balance</span>
            </div>
            <div className="text-3xl font-bold text-mythic-text-primary">{treasuryStats.totalBalance}</div>
            <div className="text-sm text-mythic-accent-300 mt-2">+12.5% this month</div>
          </div>

          <div className="glass rounded-xl p-6 border border-mythic-accent-300/10">
            <div className="flex items-center justify-between mb-4">
              <ArrowUpRight className="h-6 w-6 text-mythic-accent-300" />
              <span className="text-xs text-mythic-text-muted">Monthly Inflow</span>
            </div>
            <div className="text-3xl font-bold text-mythic-text-primary">{treasuryStats.monthlyInflow}</div>
            <div className="text-sm text-mythic-accent-300 mt-2">From all revenue streams</div>
          </div>

          <div className="glass rounded-xl p-6 border border-flow-credits/10">
            <div className="flex items-center justify-between mb-4">
              <ArrowDownRight className="h-6 w-6 text-flow-credits" />
              <span className="text-xs text-mythic-text-muted">Monthly Outflow</span>
            </div>
            <div className="text-3xl font-bold text-mythic-text-primary">{treasuryStats.monthlyOutflow}</div>
            <div className="text-sm text-mythic-accent-300 mt-2">To funded projects</div>
          </div>

          <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-6 w-6 text-mythic-primary-500" />
              <span className="text-xs text-mythic-text-muted">Active Projects</span>
            </div>
            <div className="text-3xl font-bold text-mythic-text-primary">{treasuryStats.activeProjects}</div>
            <div className="text-sm text-mythic-accent-300 mt-2">Currently funded</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Budget Allocation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-8 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">Budget Allocation</h2>
            <div className="space-y-4">
              {allocations.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-mythic-text-primary font-medium">{item.category}</span>
                    <span className="text-mythic-text-muted">{item.amount} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-mythic-dark-900 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
              <p className="text-sm text-mythic-text-muted">
                Budget allocations are determined by DAO governance proposals and 
                can be adjusted through the voting process.
              </p>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-8 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'inflow' 
                        ? 'bg-mythic-accent-300/20' 
                        : 'bg-flow-credits/20'
                    }`}>
                      {tx.type === 'inflow' 
                        ? <ArrowUpRight className="h-5 w-5 text-mythic-accent-300" />
                        : <ArrowDownRight className="h-5 w-5 text-flow-credits" />
                      }
                    </div>
                    <div>
                      <div className="font-medium text-mythic-text-primary">{tx.description}</div>
                      <div className="text-xs text-mythic-text-muted">{tx.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      tx.type === 'inflow' 
                        ? 'text-mythic-accent-300' 
                        : 'text-flow-credits'
                    }`}>
                      {tx.type === 'inflow' ? '+' : '-'}{tx.amount}
                    </div>
                    <div className="text-xs text-mythic-text-muted">{tx.time}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 px-4 py-2 text-mythic-primary-500 hover:text-mythic-primary-400 transition-colors text-sm font-medium">
              View All Transactions →
            </button>
          </motion.div>
        </div>

        {/* Treasury Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 glass rounded-2xl p-8 border border-mythic-primary-500/20"
        >
          <h2 className="text-2xl font-bold text-mythic-text-primary mb-4">About the Treasury</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-mythic-text-muted mb-4">
              The Genesis Reloop DAO Treasury is a decentralized fund managed by token holders through 
              on-chain governance. All financial decisions are transparent, auditable, and executed 
              through smart contracts.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10">
                <h3 className="font-semibold text-mythic-primary-500 mb-2">Revenue Sources</h3>
                <ul className="text-sm text-mythic-text-muted space-y-1">
                  <li>• GIRM credit sales (15% fee)</li>
                  <li>• Marketplace transaction fees</li>
                  <li>• DAO membership contributions</li>
                  <li>• Grant funding</li>
                </ul>
              </div>
              <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-accent-300/10">
                <h3 className="font-semibold text-mythic-accent-300 mb-2">Fund Usage</h3>
                <ul className="text-sm text-mythic-text-muted space-y-1">
                  <li>• New loop development</li>
                  <li>• Technology infrastructure</li>
                  <li>• Community incentives</li>
                  <li>• Research & development</li>
                </ul>
              </div>
              <div className="bg-mythic-dark-900 rounded-lg p-6 border border-flow-credits/10">
                <h3 className="font-semibold text-flow-credits mb-2">Governance</h3>
                <ul className="text-sm text-mythic-text-muted space-y-1">
                  <li>• Token holder voting</li>
                  <li>• Quarterly budget reviews</li>
                  <li>• Multi-sig security</li>
                  <li>• Public audit reports</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
