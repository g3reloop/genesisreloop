import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  TrendingUp,
  Shield,
  Factory,
  Coins,
  LineChart,
  Globe,
  Users,
  BarChart3,
  Target,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Investment Opportunities - Genesis Reloop',
  description: 'Invest in the circular economy. Token staking, facility funding, and impact investments with real returns backed by tangible assets.',
}

export default function InvestorsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Invest in the Circular Economy
              </span>
            </h1>
            
            <p className="text-xl text-mythic-text-muted mb-8 max-w-3xl mx-auto">
              Real returns from real assets. Invest in biodiesel production facilities, 
              stake tokens for passive income, and own your share of the environmental impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dao"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Join the DAO
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Calculate Returns
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-primary-500 mb-2">15-25%</h3>
              <p className="text-mythic-text-muted">Target Annual Returns</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-accent-300 mb-2">$10M+</h3>
              <p className="text-mythic-text-muted">Revenue Potential</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-green-400 mb-2">100%</h3>
              <p className="text-mythic-text-muted">Asset-Backed</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-blue-400 mb-2">4</h3>
              <p className="text-mythic-text-muted">Revenue Streams</p>
            </div>
          </motion.div>

          {/* Investment Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-mythic-text-primary mb-12">
              Investment Options
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all duration-200">
                <Coins className="h-12 w-12 text-mythic-primary-500 mb-4" />
                <h3 className="text-xl font-bold text-mythic-text-primary mb-3">Token Staking</h3>
                <p className="text-mythic-text-muted mb-4">
                  Stake Genesis Reloop tokens to earn passive income from protocol revenues. 
                  30% of all revenues distributed to stakers monthly.
                </p>
                <ul className="space-y-2 text-sm text-mythic-text-muted mb-6">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>15% APY target returns</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Monthly distributions</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Governance rights</span>
                  </li>
                </ul>
                <Link
                  href="/dao/staking"
                  className="text-mythic-primary-500 hover:text-mythic-primary-400 font-semibold flex items-center gap-1"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="glass rounded-2xl p-8 border border-mythic-accent-300/20 hover:border-mythic-accent-300/40 transition-all duration-200">
                <Factory className="h-12 w-12 text-mythic-accent-300 mb-4" />
                <h3 className="text-xl font-bold text-mythic-text-primary mb-3">Facility Investment</h3>
                <p className="text-mythic-text-muted mb-4">
                  Fund biodiesel production facilities and earn revenue share from operations. 
                  Direct ownership of productive assets.
                </p>
                <ul className="space-y-2 text-sm text-mythic-text-muted mb-6">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>25% target ROI</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Real asset ownership</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>4-year payback</span>
                  </li>
                </ul>
                <Link
                  href="/investors/facilities"
                  className="text-mythic-accent-300 hover:text-mythic-accent-200 font-semibold flex items-center gap-1"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="glass rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-200">
                <BarChart3 className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-mythic-text-primary mb-3">Balanced Portfolio</h3>
                <p className="text-mythic-text-muted mb-4">
                  Diversify across token staking and facility investment for optimized 
                  risk-adjusted returns and impact.
                </p>
                <ul className="space-y-2 text-sm text-mythic-text-muted mb-6">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Diversified exposure</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Balanced liquidity</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Lower risk profile</span>
                  </li>
                </ul>
                <Link
                  href="/tools/roi-calculator?type=both"
                  className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-1"
                >
                  Calculate Mix
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Business Model */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              Revenue Model
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-mythic-text-primary mb-4">Revenue Streams</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-mythic-text-primary">Biodiesel Sales</p>
                      <p className="text-sm text-mythic-text-muted">B20/B100 to fleet operators</p>
                    </div>
                    <span className="font-semibold text-mythic-accent-300">65%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-mythic-text-primary">Carbon Credits</p>
                      <p className="text-sm text-mythic-text-muted">Verified emission reductions</p>
                    </div>
                    <span className="font-semibold text-green-400">20%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-mythic-text-primary">Glycerin Sales</p>
                      <p className="text-sm text-mythic-text-muted">Industrial by-product</p>
                    </div>
                    <span className="font-semibold text-blue-400">10%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-mythic-text-primary">Tipping Fees</p>
                      <p className="text-sm text-mythic-text-muted">Waste collection charges</p>
                    </div>
                    <span className="font-semibold text-yellow-400">5%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-mythic-text-primary mb-4">Profit Distribution</h3>
                <div className="space-y-4">
                  <div className="bg-mythic-dark-900/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-mythic-text-muted">Staker Rewards</span>
                      <span className="font-semibold text-mythic-primary-500">30%</span>
                    </div>
                    <div className="w-full bg-mythic-dark-800 rounded-full h-2">
                      <div className="bg-mythic-primary-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-mythic-dark-900/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-mythic-text-muted">Treasury Growth</span>
                      <span className="font-semibold text-mythic-accent-300">50%</span>
                    </div>
                    <div className="w-full bg-mythic-dark-800 rounded-full h-2">
                      <div className="bg-mythic-accent-300 h-2 rounded-full" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-mythic-dark-900/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-mythic-text-muted">Operations</span>
                      <span className="font-semibold text-green-400">20%</span>
                    </div>
                    <div className="w-full bg-mythic-dark-800 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Growth Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-accent-300/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <LineChart className="h-8 w-8 text-mythic-accent-300" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Growth Strategy</h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <Target className="h-10 w-10 text-mythic-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Phase 1</h3>
                <p className="text-sm text-mythic-text-muted">
                  Launch 5 facilities in major cities
                </p>
              </div>
              
              <div className="text-center">
                <Target className="h-10 w-10 text-mythic-accent-300 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Phase 2</h3>
                <p className="text-sm text-mythic-text-muted">
                  Scale to 25 facilities nationwide
                </p>
              </div>
              
              <div className="text-center">
                <Target className="h-10 w-10 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Phase 3</h3>
                <p className="text-sm text-mythic-text-muted">
                  International expansion
                </p>
              </div>
              
              <div className="text-center">
                <Target className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Phase 4</h3>
                <p className="text-sm text-mythic-text-muted">
                  Full circular economy platform
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why Invest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <div className="glass rounded-2xl p-8 border border-green-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
                Why Genesis Reloop?
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Real Asset Backing</p>
                    <p className="text-sm text-mythic-text-muted">
                      Every token backed by physical facilities and operations
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Globe className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Growing Market</p>
                    <p className="text-sm text-mythic-text-muted">
                      Biodiesel demand growing 5-7% annually worldwide
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Community Owned</p>
                    <p className="text-sm text-mythic-text-muted">
                      True DAO governance with transparent operations
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Multiple Revenue Streams</p>
                    <p className="text-sm text-mythic-text-muted">
                      Diversified income reduces investment risk
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
                Impact Metrics
              </h2>
              
              <p className="text-mythic-text-muted mb-4">
                Every $10,000 invested enables:
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-mythic-text-muted">CO₂ Reduction</span>
                  <span className="font-semibold text-green-400">25 tons/year</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-mythic-text-muted">Water Protected</span>
                  <span className="font-semibold text-blue-400">10M liters</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-mythic-text-muted">Biodiesel Produced</span>
                  <span className="font-semibold text-mythic-primary-500">10,000 liters</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-mythic-text-muted">Jobs Created</span>
                  <span className="font-semibold text-mythic-accent-300">0.5 FTE</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-mythic-dark-900/50 rounded-lg">
                <p className="text-sm text-mythic-text-muted text-center">
                  <span className="font-semibold text-mythic-text-primary">Own your impact:</span> Track 
                  your proportional environmental contribution in real-time
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center glass rounded-2xl p-12 border border-mythic-primary-500/20"
          >
            <h2 className="text-3xl font-bold text-mythic-text-primary mb-4">
              Ready to Invest in the Future?
            </h2>
            <p className="text-xl text-mythic-text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of investors building the circular economy while earning 
              sustainable returns backed by real assets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/dao"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Start Investing
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/docs/whitepaper"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Read Whitepaper
              </Link>
            </div>
            
            <p className="text-sm text-mythic-text-muted">
              Minimum investment: $1,000 • Available globally • Fully transparent
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
