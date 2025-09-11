'use client'

import { motion } from 'framer-motion'
import { Calculator, TrendingUp, Shield, Database, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function MethodologyPage() {
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
              Loop Methodology
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            How we calculate impact, verify loops, and ensure community value. 
            Every number is real. Every credit is backed by physical waste.
          </p>
        </motion.div>

        {/* Core Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-mythic-primary-500/10">
                <Shield className="h-6 w-6 text-mythic-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-mythic-text-primary">Physical First</h3>
            </div>
            <p className="text-mythic-text-muted">
              No estimates. No projections. Every credit represents real waste diverted and measured.
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-mythic-accent-300/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-mythic-accent-300/10">
                <Database className="h-6 w-6 text-mythic-accent-300" />
              </div>
              <h3 className="text-lg font-semibold text-mythic-text-primary">Full Traceability</h3>
            </div>
            <p className="text-mythic-text-muted">
              Every batch tracked from collection to processing. Cryptographic proofs anchor the chain.
            </p>
          </div>

          <div className="glass rounded-xl p-6 border border-flow-credits/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-flow-credits/10">
                <TrendingUp className="h-6 w-6 text-flow-credits" />
              </div>
              <h3 className="text-lg font-semibold text-mythic-text-primary">Local Value</h3>
            </div>
            <p className="text-mythic-text-muted">
              60% of revenue stays in the community. No extraction to distant shareholders.
            </p>
          </div>
        </motion.div>

        {/* Calculation Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-mythic-text-primary mb-8 flex items-center gap-3">
            <Calculator className="h-8 w-8 text-mythic-primary-500" />
            Carbon Calculation Methodology
          </h2>

          <div className="space-y-6">
            {/* Food Waste */}
            <div className="glass rounded-xl p-8 border border-mythic-primary-500/20">
              <h3 className="text-xl font-semibold text-mythic-primary-500 mb-4">
                Food Waste → Biogas Loop
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-mythic-text-primary mb-3">Avoided Emissions</h4>
                  <ul className="space-y-2 text-sm text-mythic-text-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                      <span>Landfill methane: 0.74 tCO₂e/tonne</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                      <span>Grid displacement: 0.233 kgCO₂/kWh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                      <span>Transport reduction: 0.12 kgCO₂/tonne-km</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-mythic-text-primary mb-3">Value Streams</h4>
                  <ul className="space-y-2 text-sm text-mythic-text-muted">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <span>Electricity: £0.15/kWh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <span>Heat: £0.04/kWh</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <span>Digestate: £15-25/tonne</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <span>GIRM credits: £45/tCO₂e</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* UCO */}
            <div className="glass rounded-xl p-8 border border-mythic-accent-300/20">
              <h3 className="text-xl font-semibold text-mythic-accent-300 mb-4">
                UCO → Biodiesel Loop
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-mythic-text-primary mb-3">Avoided Emissions</h4>
                  <ul className="space-y-2 text-sm text-mythic-text-muted">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <span>Fossil diesel: 3.16 kgCO₂e/L</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <span>UCO lifecycle: -2.89 kgCO₂e/L net</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-mythic-accent-300 mt-0.5" />
                      <span>91.5% GHG reduction vs diesel</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-mythic-text-primary mb-3">Value Streams</h4>
                  <ul className="space-y-2 text-sm text-mythic-text-muted">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-flow-credits mt-0.5" />
                      <span>Biodiesel: £1.20-1.40/L</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-flow-credits mt-0.5" />
                      <span>Glycerol: £200-400/tonne</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-flow-credits mt-0.5" />
                      <span>RTFO credits: £0.30-0.50/L</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-flow-credits mt-0.5" />
                      <span>GIRM credits: £45/tCO₂e</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verification Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-mythic-text-primary mb-8">
            Verification Process
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
              <div className="w-12 h-12 rounded-full bg-mythic-primary-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-mythic-primary-500">1</span>
              </div>
              <h4 className="font-semibold text-mythic-text-primary mb-2">Collection</h4>
              <p className="text-sm text-mythic-text-muted">
                Weight, photo, GPS, and time logged at pickup
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-mythic-accent-300/20">
              <div className="w-12 h-12 rounded-full bg-mythic-accent-300/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-mythic-accent-300">2</span>
              </div>
              <h4 className="font-semibold text-mythic-text-primary mb-2">Transport</h4>
              <p className="text-sm text-mythic-text-muted">
                Route tracked, chain of custody maintained
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-flow-credits/20">
              <div className="w-12 h-12 rounded-full bg-flow-credits/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-flow-credits">3</span>
              </div>
              <h4 className="font-semibold text-mythic-text-primary mb-2">Processing</h4>
              <p className="text-sm text-mythic-text-muted">
                Input/output mass balance verified
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-flow-reputation/20">
              <div className="w-12 h-12 rounded-full bg-flow-reputation/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-flow-reputation">4</span>
              </div>
              <h4 className="font-semibold text-mythic-text-primary mb-2">Credits</h4>
              <p className="text-sm text-mythic-text-muted">
                GIRM minted with cryptographic proof
              </p>
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/docs"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-mythic-dark-900/50 border border-mythic-primary-500/20 text-mythic-text-muted hover:text-mythic-text-primary hover:border-mythic-primary-500/40 transition-all"
          >
            <ArrowRight className="h-4 w-4" />
            Technical Docs
          </Link>
          <Link
            href="/docs/compliance"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-mythic-dark-900/50 border border-mythic-primary-500/20 text-mythic-text-muted hover:text-mythic-text-primary hover:border-mythic-primary-500/40 transition-all"
          >
            <Shield className="h-4 w-4" />
            Compliance Documents
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-mythic-primary-500/20 border border-mythic-primary-500 text-mythic-primary-500 hover:bg-mythic-primary-500/30 transition-all"
          >
            <Calculator className="h-4 w-4" />
            Impact Calculator
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
