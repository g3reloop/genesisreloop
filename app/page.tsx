'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Factory, 
  Shield, 
  Zap, 
  TrendingUp,
  Users,
  Flame,
  DollarSign,
  CheckCircle,
  Recycle,
  Timer,
  Coins,
  Thermometer
} from 'lucide-react'
import { AnimatedParticles } from '@/components/animated-particles'
import { GenesisLogoWatermark } from '@/components/ui/genesis-logo'
import { cn } from '@/lib/utils/cn'

const highlights = [
  {
    title: 'Modular Plants',
    text: 'Containerized biogas & biodiesel units—40% lower CAPEX, deploy in weeks.',
    icon: Factory,
    metric: '40%',
    metricLabel: 'Lower CAPEX'
  },
  {
    title: 'Heat Cascading',
    text: 'CHP with 3-stage heat reuse lifts utilization to ~80–85%.',
    icon: Thermometer,
    metric: '85%',
    metricLabel: 'Efficiency'
  },
  {
    title: 'Real Credits',
    text: 'GIRM credits from measured batches, lowering fuel price—not greenwash.',
    icon: Shield,
    metric: '£2.30',
    metricLabel: 'Below Diesel'
  },
  {
    title: 'DAO Ownership',
    text: 'Fees and credits flow to your treasury to fund the next loop.',
    icon: Users,
    metric: '60%',
    metricLabel: 'Reinvested'
  }
]

const proofs = [
  { metric: '850K kg', label: 'Waste Diverted', trend: '+25% MoM' },
  { metric: '15,234', label: 'GIRM Credits', trend: '+18% MoM' },
  { metric: '2,456', label: 'Community Nodes', trend: '+12% MoM' },
  { metric: '£487k', label: 'DAO Treasury', trend: '+42% MoM' }
]

export default function HomePage() {

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-mythic-primary-500/10 via-black to-mythic-accent-300/10" />
          <AnimatedParticles />
          {/* Logo Watermark */}
          <GenesisLogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96" />
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Turn waste into value with decentralized loops
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-mythic-text-muted mb-12 max-w-3xl mx-auto"
            >
              Genesis Reloop connects suppliers, processors, and buyers into verifiable circular supply chains. 
              Automate logistics, trace every kilogram, finance with GIRM credits, and prove real impact.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/join"
                className="group px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Join the network
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/tutorial"
                className="px-8 py-4 bg-mythic-dark-900/80 backdrop-blur text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800/80 transition-all duration-200 flex items-center justify-center gap-2"
              >
                How it works
              </Link>
            </motion.div>

            {/* Key Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon
                return (
                  <motion.div
                    key={highlight.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="glass rounded-xl p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8 text-mythic-primary-500" />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-mythic-accent-300">{highlight.metric}</div>
                        <div className="text-xs text-mythic-text-muted">{highlight.metricLabel}</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-mythic-text-primary mb-2">{highlight.title}</h3>
                    <p className="text-sm text-mythic-text-muted">{highlight.text}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-mythic-primary-500/30 flex justify-center"
          >
            <div className="w-1 h-3 bg-mythic-primary-500/50 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                How it works
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass rounded-2xl p-8 md:p-12 border border-mythic-primary-500/20">
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-mythic-primary-500 text-mythic-dark-900 rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong className="text-mythic-text-primary">List feedstock</strong>
                    <span className="text-mythic-text-muted"> (UCO, plastics, organics) with specs and volumes.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-mythic-primary-500 text-mythic-dark-900 rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong className="text-mythic-text-primary">Match to processors</strong>
                    <span className="text-mythic-text-muted"> via agents (technology, permits, capacity).</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-mythic-primary-500 text-mythic-dark-900 rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong className="text-mythic-text-primary">Automate routes & paperwork</strong>
                    <span className="text-mythic-text-muted"> (WTN, duty-of-care).</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-mythic-primary-500 text-mythic-dark-900 rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong className="text-mythic-text-primary">Sell outputs</strong>
                    <span className="text-mythic-text-muted"> (biodiesel, biogas, oils, digestate) to verified buyers.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-mythic-primary-500 text-mythic-dark-900 rounded-full flex items-center justify-center font-bold">5</span>
                  <div>
                    <strong className="text-mythic-text-primary">Finance</strong>
                    <span className="text-mythic-text-muted"> with GIRM credits and settle via Treasury.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-mythic-primary-500 text-mythic-dark-900 rounded-full flex items-center justify-center font-bold">6</span>
                  <div>
                    <strong className="text-mythic-text-primary">Audit</strong>
                    <span className="text-mythic-text-muted"> end-to-end with traceable, verifiable proof.</span>
                  </div>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Proof Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-mythic-dark-900/50 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-mythic-text-primary">Real Loops. Real Numbers.</h2>
            <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
              No greenwashing. Every metric is measured and verified.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {proofs.map((proof, index) => (
              <motion.div
                key={proof.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-mythic-primary-500/10 text-center"
              >
                <div className="text-3xl font-bold text-mythic-primary-500 mb-2">{proof.metric}</div>
                <div className="text-sm text-mythic-text-muted mb-2">{proof.label}</div>
                <div className="inline-flex items-center gap-1 text-xs text-mythic-accent-300">
                  <TrendingUp className="h-3 w-3" />
                  {proof.trend}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              href="/girm"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
            >
              View Live Credits
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass rounded-2xl p-8 md:p-12 border border-mythic-primary-500/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-mythic-text-primary mb-6">
                    Built for Communities, Not Corporations
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-mythic-text-primary">Fair-Pay Drivers</p>
                        <p className="text-sm text-mythic-text-muted">Local logistics stay local. No gig exploitation.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-mythic-accent-300 mt-0.5" />
                      <div>
                        <p className="font-semibold text-mythic-text-primary">Anti-Capture Guardrails</p>
                        <p className="text-sm text-mythic-text-muted">15% max draw per loop. Small actors get priority.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Coins className="h-5 w-5 text-flow-credits mt-0.5" />
                      <div>
                        <p className="font-semibold text-mythic-text-primary">Treasury Compounds</p>
                        <p className="text-sm text-mythic-text-muted">60% reinvested to fund the next loop. Always.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-mythic-primary-500 mb-2">Zero</div>
                  <p className="text-xl text-mythic-text-primary mb-4">ESG Theatre</p>
                  <p className="text-mythic-text-muted">
                    We show receipts. Physical batches, measured outputs, 
                    cryptographic proof. No corporate greenwash.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-teal-900/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Start stabilizing loops
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Deploy infrastructure that serves community first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/join"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
              >
                Join a community node
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                Open escrow
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
