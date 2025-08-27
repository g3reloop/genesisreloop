'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Droplet, Leaf, CircleDollarSign, Factory, TrendingUp, Recycle } from 'lucide-react'
import Link from 'next/link'

export default function LoopsOverview() {
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
              The Two Core Loops
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            SRL = Stabilized Recursive Loop: a loop that pays for itself and strengthens the community.
            No biomethane upgrading. We run biogas on-site with CHP and heat cascading.
          </p>
        </motion.div>

        {/* Food Waste → Biogas Loop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-mythic-primary-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-mythic-primary-500" />
              </div>
              <h2 className="text-3xl font-bold text-mythic-text-primary">
                Food Waste → Biogas (On-Site CHP)
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-mythic-accent-300 mb-4">Technical Specs</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                    <span className="text-mythic-text-primary">
                      1 tonne food waste ≈ ~100 m³ biogas ≈ ~650 kWh energy equivalent
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                    <span className="text-mythic-text-primary">
                      Electricity + captured heat = ~80–85% total utilization
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                    <span className="text-mythic-text-primary">
                      Digestate → fertilizer for vertical farms & growers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                    <span className="text-mythic-text-primary">
                      <strong>No biomethane upgrading</strong>; we use energy locally
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-mythic-accent-300 mb-4">Container Module</h3>
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10">
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Footprint:</span>
                      <span className="text-mythic-primary-500">40ft container</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Capacity:</span>
                      <span className="text-mythic-primary-500">1-5 tpd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Power out:</span>
                      <span className="text-mythic-primary-500">30-150 kWe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Heat out:</span>
                      <span className="text-mythic-primary-500">40-200 kWth</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">CAPEX:</span>
                      <span className="text-mythic-primary-500">40% lower than fixed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* UCO → Biodiesel Loop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8 border border-mythic-accent-300/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-mythic-accent-300/20 flex items-center justify-center">
                <Droplet className="h-6 w-6 text-mythic-accent-300" />
              </div>
              <h2 className="text-3xl font-bold text-mythic-text-primary">
                UCO → Biodiesel (B100/B20)
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-mythic-accent-300 mb-4">Technical Specs</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-mythic-accent-300 mt-0.5" />
                    <span className="text-mythic-text-primary">
                      1 L UCO → ~0.9 L biodiesel
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-mythic-accent-300 mt-0.5" />
                    <span className="text-mythic-text-primary">
                      Parity with diesel in engines; immediate fleet use
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-mythic-accent-300 mt-0.5" />
                    <span className="text-mythic-text-primary">
                      Glycerol byproduct → cosmetics, feed, co-digestion
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-mythic-accent-300 mb-4">Container Module</h3>
                <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-accent-300/10">
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Footprint:</span>
                      <span className="text-mythic-accent-300">20ft container</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Capacity:</span>
                      <span className="text-mythic-accent-300">500-2000 L/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Automation:</span>
                      <span className="text-mythic-accent-300">Full PLC control</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Lead time:</span>
                      <span className="text-mythic-accent-300">8-12 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Quality:</span>
                      <span className="text-mythic-accent-300">EN 14214 compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flywheel Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="glass rounded-2xl p-8 border border-flow-credits/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-flow-credits/20 flex items-center justify-center">
                <Recycle className="h-6 w-6 text-flow-credits" />
              </div>
              <h2 className="text-3xl font-bold text-mythic-text-primary">
                The Flywheel Effect
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Factory className="h-5 w-5 text-mythic-primary-500" />
                  <h3 className="font-semibold text-mythic-primary-500">Energy Integration</h3>
                </div>
                <ul className="space-y-2 text-sm text-mythic-text-muted">
                  <li>• Biogas heat & CO₂ → greenhouses/vertical farms</li>
                  <li>• CHP electricity → local microgrid</li>
                  <li>• Heat cascade → 80-85% efficiency</li>
                </ul>
              </div>
              
              <div className="bg-mythic-dark-900 rounded-lg p-6 border border-mythic-accent-300/10">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-5 w-5 text-mythic-accent-300" />
                  <h3 className="font-semibold text-mythic-accent-300">Food Loop Closure</h3>
                </div>
                <ul className="space-y-2 text-sm text-mythic-text-muted">
                  <li>• Digestate fertilizer → local growers</li>
                  <li>• Reduced input costs → cheaper food</li>
                  <li>• Local supply chains → resilience</li>
                </ul>
              </div>
              
              <div className="bg-mythic-dark-900 rounded-lg p-6 border border-flow-credits/10">
                <div className="flex items-center gap-2 mb-3">
                  <CircleDollarSign className="h-5 w-5 text-flow-credits" />
                  <h3 className="font-semibold text-flow-credits">DAO Treasury</h3>
                </div>
                <ul className="space-y-2 text-sm text-mythic-text-muted">
                  <li>• Credits + marketplace fees → DAO</li>
                  <li>• 60% reinvest in new loops</li>
                  <li>• Community-owned expansion</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
              <p className="text-center text-lg">
                <span className="font-semibold text-mythic-primary-500">Result:</span>{' '}
                <span className="text-mythic-text-primary">
                  Each loop strengthens the next. Energy costs drop. Food costs drop. 
                  Communities capture value instead of corporations.
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-mythic-text-primary mb-6">
            Ready to start your community loop?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/processors"
              className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
            >
              Find Modular Processors
            </Link>
            <Link
              href="/rfq"
              className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
            >
              Request RFQ
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
