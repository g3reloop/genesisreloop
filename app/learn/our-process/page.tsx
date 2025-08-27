'use client'

import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Filter, Flask, Sparkles, CheckCircle } from 'lucide-react'
import { useState } from 'react'

// export const metadata: Metadata = {
//   title: 'Our Process: From Used Cooking Oil to Biodiesel | Genesis Reloop',
//   description: 'Discover the scientific process of converting UCO to biodiesel through pre-treatment, transesterification, and purification. Learn how we create clean fuel from waste.',
// }

export default function OurProcessPage() {
  const [activeStep, setActiveStep] = useState<number>(1)

  const steps = [
    {
      number: 1,
      title: 'Pre-treatment',
      subtitle: 'Cleaning the Feedstock',
      icon: Filter,
      color: 'from-blue-500 to-cyan-500',
      content: {
        description: 'Used Cooking Oil (UCO) arrives with impurities from the kitchen. The first step is to prepare it for the main reaction.',
        processes: [
          {
            name: 'Filtering',
            description: 'We remove solid food particles and other debris.'
          },
          {
            name: 'Dehydration & Degumming',
            description: 'We heat the oil to remove residual water and gums. High levels of water and impurities (MIU) can disrupt the chemical reaction. Our target is an MIU of less than 2%.'
          },
          {
            name: 'FFA Reduction',
            description: 'Free Fatty Acids (FFA) are removed to ensure the oil is ready for conversion. A lower FFA content (≤ 5%) leads to a higher quality final product.'
          }
        ]
      }
    },
    {
      number: 2,
      title: 'Transesterification',
      subtitle: 'The Core Reaction',
      icon: Flask,
      color: 'from-mythic-primary-500 to-mythic-accent-300',
      content: {
        description: 'This is the heart of the biodiesel production process.',
        definition: 'Transesterification is a chemical reaction where we exchange the organic group of an ester (the oil) with the organic group of an alcohol.',
        processes: [
          {
            name: 'Mixing',
            description: 'The pre-treated oil is mixed with an alcohol (typically methanol).'
          },
          {
            name: 'Catalysis',
            description: 'A catalyst (like sodium hydroxide) is introduced to speed up the reaction.'
          },
          {
            name: 'Heating & Agitation',
            description: 'The mixture is heated and agitated to ensure complete reaction.'
          }
        ],
        outputs: [
          {
            name: 'Fatty Acid Methyl Esters (FAME)',
            description: 'This is the raw biodiesel.',
            type: 'primary'
          },
          {
            name: 'Glycerin (Glycerol)',
            description: 'A valuable by-product used in pharmaceuticals, cosmetics, and food production.',
            type: 'secondary'
          }
        ]
      }
    },
    {
      number: 3,
      title: 'Purification',
      subtitle: 'Polishing the Final Fuel',
      icon: Sparkles,
      color: 'from-emerald-500 to-green-500',
      content: {
        description: 'The raw biodiesel must be purified to meet strict international standards like EN 14214 and SNI 7182.',
        processes: [
          {
            name: 'Glycerin Separation',
            description: 'The heavier glycerin settles at the bottom and is drained off.'
          },
          {
            name: 'Washing & Drying',
            description: 'The biodiesel is "washed" with water to remove any remaining catalyst or soaps, and then dried to remove all traces of water.'
          }
        ],
        result: 'The result is a clean, stable, high-quality biodiesel ready for use, having completed its journey from a waste product to a valuable source of clean energy.'
      }
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Our Process: The Journey from UCO to Biodiesel
            </span>
          </h1>
          
          <p className="text-xl text-mythic-text-muted text-center mb-12 max-w-3xl mx-auto">
            Transforming waste oil into a clean, compliant fuel is a sophisticated scientific process. 
            At Genesis Reloop, we've refined this process for maximum efficiency and quality. Here's how it works.
          </p>

          {/* Process Steps Selector */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center mb-12">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`flex-1 glass rounded-xl p-6 border transition-all duration-300 ${
                    activeStep === step.number
                      ? 'border-mythic-primary-500 bg-mythic-primary-500/10'
                      : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${step.color}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-mythic-text-muted">Step {step.number}</div>
                      <h3 className="text-lg font-semibold text-mythic-text-primary">{step.title}</h3>
                      <p className="text-sm text-mythic-text-muted">{step.subtitle}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Step Content */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-8 border border-mythic-primary-500/20"
          >
            {steps.map((step) => {
              if (step.number !== activeStep) return null
              const Icon = step.icon
              
              return (
                <div key={step.number}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${step.color}`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-mythic-text-primary">
                        Step {step.number}: {step.title} - {step.subtitle}
                      </h2>
                    </div>
                  </div>

                  <p className="text-lg text-mythic-text-muted mb-6">
                    {step.content.description}
                  </p>

                  {step.content.definition && (
                    <blockquote className="border-l-4 border-mythic-primary-500 pl-4 italic text-mythic-text-muted mb-6">
                      <strong className="text-mythic-primary-500">Transesterification</strong> {step.content.definition}
                    </blockquote>
                  )}

                  {step.content.processes && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">Key Processes:</h3>
                      <div className="space-y-3">
                        {step.content.processes.map((process) => (
                          <div key={process.name} className="flex gap-3">
                            <CheckCircle className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-mythic-text-primary">{process.name}:</span>{' '}
                              <span className="text-mythic-text-muted">{process.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.content.outputs && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">
                        This reaction breaks the oil (triglycerides) down into two main products:
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {step.content.outputs.map((output) => (
                          <div
                            key={output.name}
                            className={`rounded-lg p-4 border ${
                              output.type === 'primary'
                                ? 'bg-mythic-primary-500/10 border-mythic-primary-500/30'
                                : 'bg-mythic-accent-300/10 border-mythic-accent-300/30'
                            }`}
                          >
                            <h4 className={`font-semibold mb-2 ${
                              output.type === 'primary' ? 'text-mythic-primary-500' : 'text-mythic-accent-300'
                            }`}>
                              {output.name}
                            </h4>
                            <p className="text-sm text-mythic-text-muted">{output.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.content.result && (
                    <div className="bg-green-900/20 rounded-lg p-6 border border-green-500/30">
                      <p className="text-mythic-text-primary">
                        {step.content.result}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>

          {/* Visual Process Flow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 glass rounded-2xl p-8 border border-mythic-primary-500/20"
          >
            <h3 className="text-xl font-semibold text-mythic-text-primary mb-6 text-center">
              Complete Process Flow
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
              <div className="glass rounded-lg p-4 border border-yellow-500/30 bg-yellow-900/20">
                <p className="text-yellow-400 font-semibold">UCO Input</p>
                <p className="text-xs text-mythic-text-muted">Waste Oil</p>
              </div>
              <ArrowRight className="h-6 w-6 text-mythic-text-muted rotate-90 md:rotate-0" />
              <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-900/20">
                <p className="text-blue-400 font-semibold">Pre-treatment</p>
                <p className="text-xs text-mythic-text-muted">Clean & Prepare</p>
              </div>
              <ArrowRight className="h-6 w-6 text-mythic-text-muted rotate-90 md:rotate-0" />
              <div className="glass rounded-lg p-4 border border-mythic-primary-500/30 bg-mythic-primary-500/10">
                <p className="text-mythic-primary-500 font-semibold">Transesterification</p>
                <p className="text-xs text-mythic-text-muted">Chemical Reaction</p>
              </div>
              <ArrowRight className="h-6 w-6 text-mythic-text-muted rotate-90 md:rotate-0" />
              <div className="glass rounded-lg p-4 border border-green-500/30 bg-green-900/20">
                <p className="text-green-400 font-semibold">Purification</p>
                <p className="text-xs text-mythic-text-muted">Polish & Refine</p>
              </div>
              <ArrowRight className="h-6 w-6 text-mythic-text-muted rotate-90 md:rotate-0" />
              <div className="glass rounded-lg p-4 border border-mythic-accent-300/30 bg-mythic-accent-300/10">
                <p className="text-mythic-accent-300 font-semibold">B100 Biodiesel</p>
                <p className="text-xs text-mythic-text-muted">Clean Fuel</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center"
          >
            <p className="text-lg text-mythic-text-muted mb-8">
              Ready to see how our business model creates value from this process?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn/our-model"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Learn Our Model
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/suppliers"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Become a Supplier
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
