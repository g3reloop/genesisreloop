'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight,
  Shield,
  TrendingUp,
  CheckCircle,
  Calculator,
  FileCheck,
  Database,
  AlertCircle,
  Coins
} from 'lucide-react'
import { pageContent, brandConfig } from '@/config/brand.config'

export default function GIRMPage() {
  const { girm } = pageContent

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 border border-mythic-primary-500/20 mb-6">
              <Coins className="h-4 w-4 text-mythic-primary-500" />
              <span className="text-sm text-mythic-primary-500 font-semibold">Impact Utility Credits</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                {girm.hero.title}
              </span>
            </h1>
            <p className="text-xl text-mythic-text-muted">
              {girm.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Explainer Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {girm.explainer.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="glass rounded-xl p-8 border border-mythic-primary-500/10"
              >
                <h3 className="text-2xl font-semibold text-mythic-text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-mythic-text-muted">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How GIRM Works */}
      <section className="py-24 relative bg-mythic-dark-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                The GIRM Credit Lifecycle
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Material Processing",
                  description: "Feedstock processed and outputs verified. Mass balance, energy use, and yields recorded.",
                  icon: Database
                },
                {
                  title: "Impact Calculation",
                  description: "Verified data feeds into standardized impact metrics. Material diversion, energy balance, emissions avoided.",
                  icon: Calculator
                },
                {
                  title: "Credit Issuance",
                  description: "Credits mint to the loop account with full audit trail. Transparent, traceable, and tied to specific projects.",
                  icon: FileCheck
                }
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mythic-primary-500 to-mythic-accent-300 flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-10 w-10 text-mythic-dark-900" />
                    </div>
                    <h3 className="text-xl font-semibold text-mythic-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-mythic-text-muted">
                      {step.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                What GIRM measures
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  metric: "Material Diversion",
                  description: "Tonnes of waste diverted from landfill/incineration to productive use"
                },
                {
                  metric: "Energy Balance",
                  description: "Net energy produced vs. consumed in the conversion process"
                },
                {
                  metric: "Yield Efficiency",
                  description: "Actual output vs. theoretical maximum for the process"
                },
                {
                  metric: "Local Impact",
                  description: "Jobs created, transport miles saved, local value retained"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex gap-4"
                >
                  <CheckCircle className="h-6 w-6 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-mythic-text-primary mb-1">
                      {item.metric}
                    </h4>
                    <p className="text-mythic-text-muted">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20 flex gap-4">
              <AlertCircle className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-mythic-text-muted">
                  {girm.disclaimer}
                </p>
              </div>
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
            <TrendingUp className="h-16 w-16 text-mythic-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Ready to measure real impact?
              </span>
            </h2>
            <p className="text-lg text-mythic-text-muted mb-8">
              GIRM Credits provide auditable proof of your circular economy contributions. No narratives, just data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs/girm-methodology"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
              >
                View Methodology
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/supply-chains"
                className="inline-flex items-center gap-2 px-6 py-3 bg-mythic-dark-900/80 backdrop-blur text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800/80 transition-all duration-200"
              >
                Start a Loop
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
