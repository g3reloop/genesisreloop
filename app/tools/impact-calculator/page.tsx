'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Calculator,
  Droplets,
  Leaf,
  TrendingDown,
  Truck,
  Users,
  ArrowRight,
  Info
} from 'lucide-react'

export default function ImpactCalculatorPage() {
  const [monthlyOil, setMonthlyOil] = useState<string>('200')
  const [restaurantType, setRestaurantType] = useState<string>('medium')
  
  // Constants for calculations
  const CO2_REDUCTION_PER_LITER = 2.5 // kg CO2 per liter
  const WATER_PROTECTION_RATIO = 1000000 // 1 liter oil = 1M liters water
  const BIODIESEL_CONVERSION = 0.95 // 95% conversion efficiency
  const DIESEL_PRICE_PER_LITER = 1.5 // USD
  const CARBON_CREDIT_PER_TON = 25 // USD
  
  // Calculate impacts
  const monthlyOilNum = parseFloat(monthlyOil) || 0
  const yearlyOil = monthlyOilNum * 12
  
  const co2Reduced = yearlyOil * CO2_REDUCTION_PER_LITER / 1000 // tons
  const waterProtected = yearlyOil * WATER_PROTECTION_RATIO / 1000000 // millions of liters
  const biodieselProduced = yearlyOil * BIODIESEL_CONVERSION
  const carbonCredits = co2Reduced * CARBON_CREDIT_PER_TON
  const plumbingSavings = monthlyOilNum * 2.5 * 12 // estimated savings
  const busesRunning = Math.floor(yearlyOil / 5000) // buses that could run for a year

  const restaurantMultipliers: { [key: string]: number } = {
    small: 0.5,
    medium: 1,
    large: 2,
    fastfood: 3
  }

  const adjustedOil = monthlyOilNum * restaurantMultipliers[restaurantType]

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
              Impact Calculator
            </span>
          </h1>
          
          <p className="text-xl text-mythic-text-muted text-center mb-12 max-w-3xl mx-auto">
            Discover your restaurant's environmental impact potential by recycling 
            used cooking oil with Genesis Reloop.
          </p>

          {/* Calculator Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-8 w-8 text-mythic-primary-500" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Your Restaurant Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-mythic-text-primary font-semibold mb-3">
                  Restaurant Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'small', label: 'Small Café', desc: '< 50 seats' },
                    { value: 'medium', label: 'Medium Restaurant', desc: '50-150 seats' },
                    { value: 'large', label: 'Large Restaurant', desc: '> 150 seats' },
                    { value: 'fastfood', label: 'Fast Food', desc: 'High oil usage' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setRestaurantType(type.value)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        restaurantType === type.value
                          ? 'border-mythic-primary-500 bg-mythic-primary-500/10'
                          : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                      }`}
                    >
                      <p className="font-semibold text-mythic-text-primary">{type.label}</p>
                      <p className="text-xs text-mythic-text-muted">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="oil-amount" className="block text-mythic-text-primary font-semibold mb-3">
                  Monthly Used Cooking Oil (liters)
                </label>
                <div className="relative">
                  <Droplets className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mythic-primary-500" />
                  <input
                    id="oil-amount"
                    type="number"
                    value={monthlyOil}
                    onChange={(e) => setMonthlyOil(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary placeholder-mythic-text-muted focus:outline-none focus:border-mythic-primary-500/50 transition-colors text-lg"
                    placeholder="200"
                    min="0"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-mythic-text-muted">
                    liters/month
                  </span>
                </div>
                <p className="text-sm text-mythic-text-muted mt-2">
                  Average: Small café ~100L, Medium restaurant ~200L, Large/Fast food ~500L+
                </p>
              </div>
            </div>
          </motion.div>

          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8 border border-green-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="h-8 w-8 text-green-400" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Your Environmental Impact</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="text-center glass rounded-lg p-6">
                <TrendingDown className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-3xl font-bold text-green-400 mb-2">
                  {co2Reduced.toFixed(1)} tons
                </h3>
                <p className="font-semibold text-mythic-text-primary">CO₂ Reduced Yearly</p>
                <p className="text-sm text-mythic-text-muted mt-2">
                  Equivalent to planting {Math.floor(co2Reduced * 16)} trees
                </p>
              </div>

              <div className="text-center glass rounded-lg p-6">
                <Droplets className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-3xl font-bold text-blue-400 mb-2">
                  {waterProtected.toFixed(0)}M
                </h3>
                <p className="font-semibold text-mythic-text-primary">Liters of Water Protected</p>
                <p className="text-sm text-mythic-text-muted mt-2">
                  Enough drinking water for {Math.floor(waterProtected * 500)} people/year
                </p>
              </div>
            </div>

            <div className="bg-mythic-dark-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-mythic-primary-500" />
                <p className="font-semibold text-mythic-primary-500">Did you know?</p>
              </div>
              <p className="text-mythic-text-muted">
                Your {yearlyOil.toFixed(0)} liters of yearly UCO could power {busesRunning} city bus{busesRunning !== 1 ? 'es' : ''} for an entire year, 
                or produce enough biodiesel to drive {Math.floor(biodieselProduced * 15)} kilometers!
              </p>
            </div>
          </motion.div>

          {/* Economic Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-accent-300/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="h-8 w-8 text-mythic-accent-300" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Your Economic Benefits</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-mythic-dark-900/50 rounded-lg">
                <div>
                  <p className="font-semibold text-mythic-text-primary">Plumbing & Maintenance Savings</p>
                  <p className="text-sm text-mythic-text-muted">Prevented drain blockages</p>
                </div>
                <p className="text-xl font-bold text-mythic-accent-300">
                  ${plumbingSavings.toFixed(0)}/year
                </p>
              </div>

              <div className="flex justify-between items-center p-4 bg-mythic-dark-900/50 rounded-lg">
                <div>
                  <p className="font-semibold text-mythic-text-primary">Green Certification Value</p>
                  <p className="text-sm text-mythic-text-muted">Marketing & customer loyalty</p>
                </div>
                <p className="text-xl font-bold text-green-400">
                  Priceless
                </p>
              </div>

              <div className="flex justify-between items-center p-4 bg-mythic-dark-900/50 rounded-lg">
                <div>
                  <p className="font-semibold text-mythic-text-primary">Carbon Credits Generated</p>
                  <p className="text-sm text-mythic-text-muted">Tradeable environmental value</p>
                </div>
                <p className="text-xl font-bold text-mythic-primary-500">
                  ${carbonCredits.toFixed(0)}/year
                </p>
              </div>
            </div>
          </motion.div>

          {/* Social Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-mythic-primary-500" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Your Social Impact</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center glass rounded-lg p-4">
                <p className="text-2xl font-bold text-mythic-primary-500 mb-1">
                  {(yearlyOil / 10000).toFixed(1)}
                </p>
                <p className="text-sm text-mythic-text-muted">Green jobs supported</p>
              </div>
              
              <div className="text-center glass rounded-lg p-4">
                <p className="text-2xl font-bold text-mythic-accent-300 mb-1">
                  100%
                </p>
                <p className="text-sm text-mythic-text-muted">Local impact</p>
              </div>
              
              <div className="text-center glass rounded-lg p-4">
                <p className="text-2xl font-bold text-green-400 mb-1">
                  ∞
                </p>
                <p className="text-sm text-mythic-text-muted">Customer goodwill</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-mythic-dark-900/50 rounded-lg">
              <p className="text-mythic-text-muted text-center">
                <span className="font-semibold text-mythic-text-primary">Your participation</span> helps 
                build a circular economy that benefits your community, creates jobs, and protects the 
                environment for future generations.
              </p>
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
              Ready to make this impact a reality?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/partners/restaurants"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Join as Restaurant Partner
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Calculate Investment ROI
              </Link>
            </div>

            <div className="mt-8">
              <Link
                href="/learn/our-impact"
                className="text-mythic-accent-300 hover:text-mythic-accent-200 font-semibold"
              >
                Learn more about our total impact →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
