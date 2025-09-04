'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight,
  MessageSquare,
  Upload,
  Calculator,
  Lightbulb,
  Bot,
  Sparkles
} from 'lucide-react'

export default function LearnPage() {
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
              <Bot className="h-4 w-4 text-mythic-primary-500" />
              <span className="text-sm text-mythic-primary-500 font-semibold">AI-Powered Learning</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Learn Genesis by chatting with the AI
              </span>
            </h1>
            <p className="text-xl text-mythic-text-muted">
              Ask about loops, governance, and metrics. The model teaches recursion and routes you to action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Learning Sections */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {[
                {
                  title: "Start with your waste",
                  body: "Upload a spec and ask, 'What loop fits this?'",
                  icon: Upload,
                  example: "I have 500kg/week of restaurant food waste with 15% contamination. What processes work best?"
                },
                {
                  title: "Understand the metrics",
                  body: "See how SRL vs CRL is determined and how GIRM is computed.",
                  icon: Calculator,
                  example: "How do you calculate the CO₂e avoided when converting UCO to biodiesel?"
                },
                {
                  title: "Design a pilot",
                  body: "Generate a pilot plan, partner list, and escrow terms in minutes.",
                  icon: Lightbulb,
                  example: "Help me design a pilot loop for textile waste in Manchester with £2M budget."
                }
              ].map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="glass rounded-xl p-8 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all"
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-mythic-primary-500 to-mythic-accent-300 flex items-center justify-center">
                        <section.icon className="h-6 w-6 text-mythic-dark-900" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-mythic-text-primary mb-2">
                        {section.title}
                      </h3>
                      <p className="text-mythic-text-muted mb-4">
                        {section.body}
                      </p>
                      <div className="p-4 bg-mythic-dark-900/50 rounded-lg border border-mythic-primary-500/10">
                        <p className="text-sm text-mythic-accent-300 font-mono">
                          Example: "{section.example}"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative bg-mythic-dark-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                What Genesis AI can help with
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Match feedstocks to processes",
              "Calculate potential yields",
              "Find verified labs nearby",
              "Estimate CAPEX/OPEX",
              "Design material passports",
              "Generate escrow terms",
              "Simulate loop economics",
              "Draft DAO proposals",
              "Explain chain-of-custody"
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                className="glass rounded-lg p-4 border border-mythic-primary-500/10 flex items-center gap-3"
              >
                <Sparkles className="h-5 w-5 text-mythic-accent-300 flex-shrink-0" />
                <span className="text-mythic-text-primary">{feature}</span>
              </motion.div>
            ))}
          </div>
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
            <MessageSquare className="h-16 w-16 text-mythic-primary-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Start learning by doing
              </span>
            </h2>
            <p className="text-lg text-mythic-text-muted mb-8">
              The Genesis AI understands loops, logistics, and local constraints. Ask questions, get actionable answers.
            </p>
            
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
            >
              Open Genesis AI
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
