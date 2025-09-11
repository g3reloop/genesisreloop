'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowRight,
  Info,
  Coins,
  Factory,
  LineChart
} from 'lucide-react'

type InvestmentType = 'token' | 'facility' | 'both'

export default function ROICalculatorPage() {
  const [investmentAmount, setInvestmentAmount] = useState<string>('10000')
  const [investmentType, setInvestmentType] = useState<InvestmentType>('token')
  const [stakingDuration, setStakingDuration] = useState<string>('12')
  
  // Constants for calculations
  const TOKEN_APY = 0.15 // 15% APY (conservative estimate)
  const FACILITY_ROI = 0.25 // 25% annual ROI
  const FACILITY_PAYBACK = 4 // years
  const BIODIESEL_PRICE = 1.5 // USD per liter
  const PROCESSING_COST = 0.5 // USD per liter
  const FACILITY_CAPACITY = 5000000 // liters per year
  const CARBON_CREDIT_REVENUE = 0.05 // USD per liter
  
  // Calculate returns
  const investmentNum = parseFloat(investmentAmount) || 0
  const monthsNum = parseInt(stakingDuration) || 12
  
  // Token staking calculations
  const tokenMonthlyReturn = (investmentNum * TOKEN_APY) / 12
  const tokenTotalReturn = tokenMonthlyReturn * monthsNum
  const tokenFinalValue = investmentNum + tokenTotalReturn
  
  // Facility investment calculations
  const facilityShare = investmentNum / 1000000 // Share of $1M facility
  const facilityAnnualProduction = FACILITY_CAPACITY * facilityShare
  const facilityAnnualRevenue = facilityAnnualProduction * (BIODIESEL_PRICE - PROCESSING_COST + CARBON_CREDIT_REVENUE)
  const facilityMonthlyReturn = facilityAnnualRevenue / 12
  const facilityTotalReturn = facilityMonthlyReturn * monthsNum
  
  // Combined calculations
  const combinedTokenInvestment = investmentNum * 0.5
  const combinedFacilityInvestment = investmentNum * 0.5
  const combinedTokenReturn = (combinedTokenInvestment * TOKEN_APY * monthsNum) / 12
  const combinedFacilityReturn = (combinedFacilityInvestment / 1000000) * FACILITY_CAPACITY * (BIODIESEL_PRICE - PROCESSING_COST + CARBON_CREDIT_REVENUE) * (monthsNum / 12)
  const combinedTotalReturn = combinedTokenReturn + combinedFacilityReturn

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              ROI Calculator
            </span>
          </h1>
          
          <p className="text-xl text-mythic-text-muted text-center mb-12 max-w-3xl mx-auto">
            Calculate your potential returns from investing in Genesis Reloop through 
            token staking, facility funding, or a combination of both.
          </p>

          {/* Investment Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-8 w-8 text-mythic-primary-500" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Investment Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-mythic-text-primary font-semibold mb-3">
                  Investment Type
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setInvestmentType('token')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      investmentType === 'token'
                        ? 'border-mythic-primary-500 bg-mythic-primary-500/10'
                        : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                    }`}
                  >
                    <Coins className="h-8 w-8 text-mythic-primary-500 mx-auto mb-2" />
                    <p className="font-semibold text-mythic-text-primary">Token Staking</p>
                    <p className="text-xs text-mythic-text-muted mt-1">Earn staking rewards</p>
                    <p className="text-sm font-bold text-mythic-accent-300 mt-2">~15% APY</p>
                  </button>
                  
                  <button
                    onClick={() => setInvestmentType('facility')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      investmentType === 'facility'
                        ? 'border-mythic-primary-500 bg-mythic-primary-500/10'
                        : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                    }`}
                  >
                    <Factory className="h-8 w-8 text-mythic-accent-300 mx-auto mb-2" />
                    <p className="font-semibold text-mythic-text-primary">Facility Investment</p>
                    <p className="text-xs text-mythic-text-muted mt-1">Fund production</p>
                    <p className="text-sm font-bold text-mythic-accent-300 mt-2">~25% ROI</p>
                  </button>
                  
                  <button
                    onClick={() => setInvestmentType('both')}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      investmentType === 'both'
                        ? 'border-mythic-primary-500 bg-mythic-primary-500/10'
                        : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                    }`}
                  >
                    <PieChart className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="font-semibold text-mythic-text-primary">Balanced Portfolio</p>
                    <p className="text-xs text-mythic-text-muted mt-1">50/50 split</p>
                    <p className="text-sm font-bold text-mythic-accent-300 mt-2">Optimized</p>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="investment-amount" className="block text-mythic-text-primary font-semibold mb-3">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mythic-primary-500" />
                  <input
                    id="investment-amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary placeholder-mythic-text-muted focus:outline-none focus:border-mythic-primary-500/50 transition-colors text-lg"
                    placeholder="10000"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-mythic-text-primary font-semibold mb-3">
                  Investment Period (months)
                </label>
                <div className="relative">
                  <input
                    id="duration"
                    type="range"
                    value={stakingDuration}
                    onChange={(e) => setStakingDuration(e.target.value)}
                    className="w-full"
                    min="1"
                    max="60"
                  />
                  <div className="flex justify-between text-sm text-mythic-text-muted mt-2">
                    <span>1 month</span>
                    <span className="font-bold text-mythic-primary-500">{stakingDuration} months</span>
                    <span>5 years</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Returns Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-accent-300/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-mythic-accent-300" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Projected Returns</h2>
            </div>

            {investmentType === 'token' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center glass rounded-lg p-6">
                    <p className="text-sm text-mythic-text-muted mb-2">Monthly Returns</p>
                    <p className="text-3xl font-bold text-mythic-accent-300">
                      ${tokenMonthlyReturn.toFixed(2)}
                    </p>
                    <p className="text-sm text-mythic-text-muted mt-2">
                      {((tokenMonthlyReturn / investmentNum) * 100).toFixed(2)}% monthly
                    </p>
                  </div>
                  
                  <div className="text-center glass rounded-lg p-6">
                    <p className="text-sm text-mythic-text-muted mb-2">Total Value After {monthsNum} Months</p>
                    <p className="text-3xl font-bold text-green-400">
                      ${tokenFinalValue.toFixed(2)}
                    </p>
                    <p className="text-sm text-mythic-text-muted mt-2">
                      +{((tokenTotalReturn / investmentNum) * 100).toFixed(1)}% gain
                    </p>
                  </div>
                </div>

                <div className="bg-mythic-dark-900/50 rounded-lg p-4">
                  <h3 className="font-semibold text-mythic-text-primary mb-3">Staking Benefits:</h3>
                  <ul className="space-y-2 text-mythic-text-muted">
                    <li className="flex gap-2">
                      <span className="text-mythic-primary-500">•</span>
                      <span>Passive income from protocol revenues</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-mythic-primary-500">•</span>
                      <span>Governance rights in the DAO</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-mythic-primary-500">•</span>
                      <span>Priority access to new opportunities</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-mythic-primary-500">•</span>
                      <span>Compound growth potential</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {investmentType === 'facility' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center glass rounded-lg p-6">
                    <p className="text-sm text-mythic-text-muted mb-2">Your Production Capacity</p>
                    <p className="text-3xl font-bold text-mythic-primary-500">
                      {Math.floor(facilityAnnualProduction).toLocaleString()}L
                    </p>
                    <p className="text-sm text-mythic-text-muted mt-2">
                      Biodiesel per year
                    </p>
                  </div>
                  
                  <div className="text-center glass rounded-lg p-6">
                    <p className="text-sm text-mythic-text-muted mb-2">Annual Revenue Share</p>
                    <p className="text-3xl font-bold text-green-400">
                      ${facilityAnnualRevenue.toFixed(0)}
                    </p>
                    <p className="text-sm text-mythic-text-muted mt-2">
                      {((facilityAnnualRevenue / investmentNum) * 100).toFixed(1)}% ROI
                    </p>
                  </div>
                </div>

                <div className="bg-mythic-dark-900/50 rounded-lg p-6">
                  <h3 className="font-semibold text-mythic-text-primary mb-3">Revenue Breakdown:</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-mythic-text-muted">Biodiesel Sales</span>
                      <span className="font-semibold text-mythic-accent-300">
                        ${(facilityAnnualProduction * BIODIESEL_PRICE).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-mythic-text-muted">Carbon Credits</span>
                      <span className="font-semibold text-green-400">
                        ${(facilityAnnualProduction * CARBON_CREDIT_REVENUE).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-mythic-text-muted">Operating Costs</span>
                      <span className="font-semibold text-red-400">
                        -${(facilityAnnualProduction * PROCESSING_COST).toFixed(0)}
                      </span>
                    </div>
                    <div className="h-px bg-mythic-primary-500/20 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-mythic-text-primary">Net Revenue</span>
                      <span className="font-bold text-mythic-primary-500">
                        ${facilityAnnualRevenue.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {investmentType === 'both' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center glass rounded-lg p-4">
                    <p className="text-sm text-mythic-text-muted mb-2">Token Returns</p>
                    <p className="text-2xl font-bold text-mythic-primary-500">
                      ${combinedTokenReturn.toFixed(0)}
                    </p>
                  </div>
                  
                  <div className="text-center glass rounded-lg p-4">
                    <p className="text-sm text-mythic-text-muted mb-2">Facility Returns</p>
                    <p className="text-2xl font-bold text-mythic-accent-300">
                      ${combinedFacilityReturn.toFixed(0)}
                    </p>
                  </div>
                  
                  <div className="text-center glass rounded-lg p-4">
                    <p className="text-sm text-mythic-text-muted mb-2">Total Returns</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${combinedTotalReturn.toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="bg-mythic-dark-900/50 rounded-lg p-4">
                  <p className="text-mythic-text-muted text-center">
                    <span className="font-semibold text-mythic-text-primary">Balanced approach:</span> Combines 
                    stable staking rewards with higher facility returns while maintaining liquidity and 
                    diversifying risk across both investment types.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Risk & Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <div className="glass rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-lg font-bold text-mythic-text-primary mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-green-400" />
                Key Benefits
              </h3>
              <ul className="space-y-2 text-mythic-text-muted text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Real asset-backed returns</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Environmental impact ownership</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Growing market demand</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Multiple revenue streams</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Transparent operations</span>
                </li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-6 border border-yellow-500/20">
              <h3 className="text-lg font-bold text-mythic-text-primary mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-yellow-400" />
                Risk Considerations
              </h3>
              <ul className="space-y-2 text-mythic-text-muted text-sm">
                <li className="flex gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Market price fluctuations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Regulatory changes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Operational challenges</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Technology risks</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Competition factors</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-lg p-4 mb-8 border border-yellow-500/20 bg-yellow-500/5"
          >
            <p className="text-sm text-mythic-text-muted">
              <span className="font-semibold text-yellow-400">Disclaimer:</span> These calculations are estimates based 
              on current projections and market conditions. Actual returns may vary. This is not financial advice. 
              Always do your own research and consult with financial advisors before making investment decisions.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-xl text-mythic-text-primary font-semibold mb-8">
              Ready to invest in the circular economy?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/investors"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                View Investment Options
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/learn/our-model"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Learn About Our Model
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
