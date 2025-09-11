'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight,
  Upload,
  Network,
  Lock,
  Microscope,
  Truck,
  CheckCircle
} from 'lucide-react'
import { pageContent } from '@/config/brand.config'

const stepIcons = [
  Upload,
  Network,
  Lock,
  Microscope,
  Truck
]

export default function HowItWorksPage() {
  const { howItWorks } = pageContent

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
                {howItWorks.hero.title}
              </span>
            </h1>
            <p className="text-xl text-mythic-text-muted">
              {howItWorks.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {howItWorks.steps.map((step, index) => {
              const Icon = stepIcons[index] || CheckCircle
              const isLast = index === howItWorks.steps.length - 1
              
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="relative"
                >
                  <div className={cn(
                    "flex gap-6 md:gap-12",
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  )}>
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mythic-primary-500 to-mythic-accent-300 flex items-center justify-center">
                          <Icon className="h-10 w-10 text-mythic-dark-900" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-mythic-dark-900 border-2 border-mythic-primary-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-mythic-primary-500">{step.step}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow glass rounded-xl p-6 border border-mythic-primary-500/10">
                      <h3 className="text-2xl font-semibold text-mythic-text-primary mb-3">
                        {step.title}
                      </h3>
                      <p className="text-mythic-text-muted">
                        {step.body}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {!isLast && (
                    <div className="absolute left-10 top-20 bottom-0 w-px bg-gradient-to-b from-mythic-primary-500/50 to-transparent h-24" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Callout Section */}
      <section className="py-24 relative bg-mythic-dark-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center glass rounded-2xl p-12 border border-mythic-primary-500/20"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                {howItWorks.callout.title}
              </span>
            </h2>
            <p className="text-lg text-mythic-text-muted mb-8">
              {howItWorks.callout.body}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/supply-chains"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
              >
                See Supply Chains
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/governance"
                className="inline-flex items-center gap-2 px-6 py-3 bg-mythic-dark-900/80 backdrop-blur text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800/80 transition-all duration-200"
              >
                Open Governance
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
