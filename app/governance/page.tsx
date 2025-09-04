'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight,
  Shield,
  RefreshCw,
  Scale,
  FileText,
  Lock,
  Users,
  CheckCircle
} from 'lucide-react'
import { pageContent } from '@/config/brand.config'

const pillarIcons = {
  'Escrow & Collateral': Lock,
  'Quality & Disputes': Scale,
  'Routing & Redundancy': RefreshCw,
  'Open Accounting': FileText
}

export default function GovernancePage() {
  const { governance } = pageContent

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mythic-primary-500/10 to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                {governance.hero.title}
              </span>
            </h1>
            <p className="text-xl text-mythic-text-muted">
              {governance.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {governance.pillars.map((pillar, index) => {
              const Icon = pillarIcons[pillar.title as keyof typeof pillarIcons] || Shield
              
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="glass rounded-xl p-8 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-mythic-primary-500 to-mythic-accent-300 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-mythic-dark-900" />
                    </div>
                    <h3 className="text-xl font-semibold text-mythic-text-primary">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-mythic-text-muted">
                    {pillar.body}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 relative bg-mythic-dark-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                How the DAO keeps loops running
              </span>
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: "Automated Escrow Release",
                  description: "Funds release when QC passes and chain-of-custody is verified. No manual approvals."
                },
                {
                  title: "Rapid Dispute Resolution",
                  description: "48-hour binding arbitration with pre-agreed quality specs. Evidence on-chain."
                },
                {
                  title: "Node Redundancy",
                  description: "If a processor fails, the system auto-routes to backup nodes. No single point of failure."
                },
                {
                  title: "Transparent Treasury",
                  description: "Every fee, every GIRM credit, every payout—visible to all members. No black box."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex gap-4"
                >
                  <CheckCircle className="h-6 w-6 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-mythic-text-primary mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-mythic-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center glass rounded-2xl p-12 border border-mythic-primary-500/20"
          >
            <Users className="h-16 w-16 text-mythic-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Governed by operators, not speculators
              </span>
            </h2>
            <p className="text-lg text-mythic-text-muted mb-8">
              Voting power tied to actual throughput and quality metrics. Those who process more waste and maintain higher yields have more say.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs/charter"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
              >
                Read the Charter
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dao"
                className="inline-flex items-center gap-2 px-6 py-3 bg-mythic-dark-900/80 backdrop-blur text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800/80 transition-all duration-200"
              >
                View DAO Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
