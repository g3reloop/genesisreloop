import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Users, 
  Coins, 
  Shield, 
  Vote, 
  TrendingUp,
  Lock,
  RefreshCw,
  Wallet
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Model: DAOs, Token Utility, and Decentralized Finance | Genesis Reloop',
  description: 'Learn about Genesis Reloop\'s decentralized autonomous organization (DAO), token utility for governance and staking, and how DeFi principles create sustainable value.',
}

export default function OurModelPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Our Model: DAOs, Token Utility, and Decentralized Finance
            </span>
          </h1>
          
          <p className="text-xl text-mythic-text-muted text-center mb-12 max-w-3xl mx-auto">
            Genesis Reloop operates on the cutting edge of Web3 technology. We combine DAOs, 
            token utility, and DeFi principles to create a truly community-owned circular economy.
          </p>

          {/* What is a DAO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-mythic-primary-500" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">What is a DAO?</h2>
            </div>
            
            <p className="text-mythic-text-muted mb-4">
              A <strong className="text-mythic-primary-500">Decentralized Autonomous Organization (DAO)</strong> is 
              a community-led entity with no central authority. It's governed entirely by its members through 
              transparent voting on proposals.
            </p>

            <div className="bg-mythic-dark-900/50 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-mythic-text-primary mb-3">Think of it like this:</h3>
              <ul className="space-y-2 text-mythic-text-muted">
                <li className="flex gap-2">
                  <span className="text-mythic-primary-500">•</span>
                  <span><strong>Traditional Company:</strong> Decisions made by executives behind closed doors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-mythic-primary-500">•</span>
                  <span><strong>DAO:</strong> Decisions made by token holders in full transparency</span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center glass rounded-lg p-4">
                <Vote className="h-8 w-8 text-mythic-primary-500 mx-auto mb-2" />
                <p className="font-semibold text-mythic-text-primary">Democratic</p>
                <p className="text-sm text-mythic-text-muted">One token, one vote</p>
              </div>
              <div className="text-center glass rounded-lg p-4">
                <Shield className="h-8 w-8 text-mythic-accent-300 mx-auto mb-2" />
                <p className="font-semibold text-mythic-text-primary">Transparent</p>
                <p className="text-sm text-mythic-text-muted">All decisions on-chain</p>
              </div>
              <div className="text-center glass rounded-lg p-4">
                <RefreshCw className="h-8 w-8 text-flow-credits mx-auto mb-2" />
                <p className="font-semibold text-mythic-text-primary">Autonomous</p>
                <p className="text-sm text-mythic-text-muted">Self-executing rules</p>
              </div>
            </div>
          </motion.div>

          {/* Genesis Reloop Token Utility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-accent-300/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Coins className="h-8 w-8 text-mythic-accent-300" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Genesis Reloop Token Utility</h2>
            </div>
            
            <p className="text-mythic-text-muted mb-6">
              The Genesis Reloop token isn't just a cryptocurrency—it's your key to participating 
              in the circular economy revolution. Here's what it enables:
            </p>

            <div className="space-y-4">
              <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-mythic-primary-500/10">
                <h3 className="font-semibold text-mythic-primary-500 mb-2">🗳️ Governance Rights</h3>
                <p className="text-mythic-text-muted">
                  Vote on key decisions: which projects to fund, treasury management, protocol upgrades, 
                  and community initiatives. Your voice shapes the future of Genesis Reloop.
                </p>
              </div>

              <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-mythic-accent-300/10">
                <h3 className="font-semibold text-mythic-accent-300 mb-2">💎 Staking Rewards</h3>
                <p className="text-mythic-text-muted">
                  Stake your tokens to earn rewards from protocol revenues. As more waste is processed 
                  and more biodiesel is sold, stakers benefit from the growing ecosystem.
                </p>
              </div>

              <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-flow-credits/10">
                <h3 className="font-semibold text-flow-credits mb-2">🎯 Priority Access</h3>
                <p className="text-mythic-text-muted">
                  Token holders get first access to new investment opportunities, preferential rates 
                  on biodiesel purchases, and exclusive partnership benefits.
                </p>
              </div>

              <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-green-500/10">
                <h3 className="font-semibold text-green-400 mb-2">🌱 Impact Multiplier</h3>
                <p className="text-mythic-text-muted">
                  Each token represents a stake in the environmental impact. Track your proportional 
                  contribution to CO₂ reduction and waste diversion.
                </p>
              </div>
            </div>
          </motion.div>

          {/* DeFi Concepts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-8 w-8 text-mythic-primary-500" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Core DeFi Concepts</h2>
            </div>
            
            <p className="text-mythic-text-muted mb-6">
              Decentralized Finance (DeFi) removes traditional intermediaries from financial services. 
              Here's how Genesis Reloop leverages these concepts:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-mythic-text-primary mb-2">
                  🔗 Smart Contracts
                </h3>
                <p className="text-mythic-text-muted mb-3">
                  Self-executing contracts with terms directly written into code. No lawyers, no delays, 
                  no ambiguity—just transparent, automatic execution.
                </p>
                <div className="bg-mythic-dark-900/50 rounded-lg p-4 font-mono text-sm">
                  <p className="text-green-400">// Example: Automatic profit distribution</p>
                  <p className="text-mythic-text-muted">if (monthlyRevenue {'>'} 0) {'{'}</p>
                  <p className="text-mythic-text-muted ml-4">distributeToStakers(monthlyRevenue * 0.3)</p>
                  <p className="text-mythic-text-muted ml-4">sendToTreasury(monthlyRevenue * 0.7)</p>
                  <p className="text-mythic-text-muted">{'}'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-mythic-text-primary mb-2">
                  💧 Liquidity Pools
                </h3>
                <p className="text-mythic-text-muted mb-3">
                  Community-funded pools that enable instant token swaps. Providers earn fees from every trade, 
                  creating passive income while supporting the ecosystem.
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm text-mythic-text-muted">You Provide</p>
                    <p className="font-semibold text-mythic-primary-500">Liquidity</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-mythic-text-muted" />
                  </div>
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm text-mythic-text-muted">You Earn</p>
                    <p className="font-semibold text-mythic-accent-300">Trading Fees</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-mythic-text-primary mb-2">
                  🏦 Decentralized Treasury
                </h3>
                <p className="text-mythic-text-muted">
                  All funds are held in smart contracts, not bank accounts. Multi-signature requirements 
                  and time-locks ensure no single person can access funds. Every transaction is visible 
                  on the blockchain.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Value Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <h3 className="text-xl font-semibold text-mythic-text-primary mb-6 text-center">
              How Value Flows Through the System
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Waste Collection</p>
                  <p className="text-sm text-mythic-text-muted">UCO collected from restaurants generates tipping fees</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-mythic-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-mythic-primary-500 font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Processing & Sales</p>
                  <p className="text-sm text-mythic-text-muted">Biodiesel sold at market rates, carbon credits generated</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-mythic-accent-300/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-mythic-accent-300 font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Revenue Distribution</p>
                  <p className="text-sm text-mythic-text-muted">30% to stakers, 70% to treasury for new projects</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Ecosystem Growth</p>
                  <p className="text-sm text-mythic-text-muted">More facilities funded, more waste diverted, cycle repeats</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-xl text-mythic-text-primary font-semibold mb-8">
              Ready to be part of the decentralized circular economy?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dao"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Explore the DAO
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/investors"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Investment Opportunities
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
