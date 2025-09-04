'use client'

import { motion } from 'framer-motion'
import { Book, Shield, Thermometer, Users, ArrowRight, Info, FileText, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Documentation() {
  const [activeSection, setActiveSection] = useState<string>('srl-crl')

  const sections = [
    { id: 'compliance', title: 'Compliance Docs', icon: Shield, isLink: true, href: '/docs/compliance' },
    { id: 'srl-crl', title: 'SRL vs CRL', icon: Shield },
    { id: 'girm', title: 'GIRM Methods', icon: FileText },
    { id: 'heat-cascade', title: 'Heat Cascading', icon: Thermometer },
    { id: 'dao', title: 'DAO Guardrails', icon: Users }
  ]

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
              Docs & Methodology
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Technical documentation for operators, developers, and community members.
            No fluff. Just operational truth.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20 sticky top-24">
              <h3 className="font-semibold text-mythic-text-primary mb-4 flex items-center gap-2">
                <Book className="h-5 w-5 text-mythic-primary-500" />
                Documentation
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  
                  if (section.isLink) {
                    return (
                      <Link
                        key={section.id}
                        href={section.href!}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-mythic-text-muted hover:bg-mythic-dark-800 hover:text-mythic-text-primary"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Link>
                    )
                  }
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                          : 'text-mythic-text-muted hover:bg-mythic-dark-800 hover:text-mythic-text-primary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                      {activeSection === section.id && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* SRL vs CRL Section */}
            {activeSection === 'srl-crl' && (
              <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
                <h2 className="text-3xl font-bold text-mythic-text-primary mb-6 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-mythic-primary-500" />
                  SRL vs CRL: How We Stabilize Loops
                </h2>

                <div className="space-y-8">
                  {/* Definition */}
                  <div>
                    <h3 className="text-xl font-semibold text-mythic-primary-500 mb-3">Core Definitions</h3>
                    <div className="space-y-4">
                      <div className="p-6 bg-mythic-primary-500/10 rounded-lg border border-mythic-primary-500/20">
                        <h4 className="font-semibold text-mythic-primary-500 mb-2">
                          SRL = Stabilized Recursive Loop
                        </h4>
                        <p className="text-mythic-text-muted">
                          A loop that pays for itself and strengthens the community. 
                          Value flows circulate locally, compound over time, and resist extraction.
                        </p>
                      </div>
                      <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/20">
                        <h4 className="font-semibold text-red-400 mb-2">
                          CRL = Corrupted Recursive Loop
                        </h4>
                        <p className="text-mythic-text-muted">
                          Extractive patterns that drain value and control from communities. 
                          Corporate capture, rent-seeking, and value extraction to distant shareholders.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* How to Identify */}
                  <div>
                    <h3 className="text-xl font-semibold text-mythic-accent-300 mb-3">How to Identify Loop Types</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-mythic-primary-500">SRL Indicators</h4>
                        <ul className="space-y-2 text-sm text-mythic-text-muted">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                            <span>Local ownership & decision-making</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                            <span>Value compounds in community</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                            <span>Transparent operations & accounting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                            <span>Resilient to external shocks</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-red-400">CRL Warning Signs</h4>
                        <ul className="space-y-2 text-sm text-mythic-text-muted">
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <span>External corporate control</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <span>Value extracted to shareholders</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <span>Opaque financials & governance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <span>Dependency on subsidies/grants</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Stabilization Methods */}
                  <div>
                    <h3 className="text-xl font-semibold text-flow-credits mb-3">Loop Stabilization Methods</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">1. DAO Ownership</h4>
                        <p className="text-sm text-mythic-text-muted">
                          Community treasury holds infrastructure. No external equity possible.
                        </p>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">2. Fixed Dialocation</h4>
                        <p className="text-sm text-mythic-text-muted">
                          60% reinvest, 20% ops, 20% reserves. Hardcoded, not negotiable.
                        </p>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">3. Anti-Capture Rules</h4>
                        <p className="text-sm text-mythic-text-muted">
                          15% max draw per loop, small actors priority, no entity {'>'}10% vote.
                        </p>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">4. Physical Proof</h4>
                        <p className="text-sm text-mythic-text-muted">
                          Every credit backed by measured waste. No estimates, no offsets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GIRM Methods Section */}
            {activeSection === 'girm' && (
              <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
                <h2 className="text-3xl font-bold text-mythic-text-primary mb-6 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-mythic-primary-500" />
                  GIRM Credit Methodology
                </h2>

                <div className="space-y-8">
                  {/* Overview */}
                  <div className="p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
                    <h3 className="font-semibold text-mythic-primary-500 mb-2">
                      Genesis Infinite Recursion Mathematics
                    </h3>
                    <p className="text-mythic-text-muted">
                      GIRM credits represent real, measured carbon avoidance from waste diversion. 
                      Each credit is cryptographically anchored to a physical batch with full traceability.
                    </p>
                  </div>

                  {/* Calculation Methods */}
                  <div>
                    <h3 className="text-xl font-semibold text-mythic-accent-300 mb-3">Emission Factors</h3>
                    <div className="space-y-6">
                      {/* Food Waste */}
                      <div>
                        <h4 className="font-semibold text-mythic-primary-500 mb-3">Food Waste → Biogas</h4>
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b border-mythic-primary-500/20">
                                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-semibold text-mythic-text-muted whitespace-nowrap">Parameter</th>
                                  <th className="text-right py-2 sm:py-3 px-4 text-xs sm:text-sm font-semibold text-mythic-text-muted whitespace-nowrap">Value</th>
                                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-semibold text-mythic-text-muted whitespace-nowrap">Unit</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-mythic-primary-500/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Landfill CH₄ emission factor</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono whitespace-nowrap">0.74</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">tCO₂e/tonne</td>
                                </tr>
                                <tr className="border-b border-mythic-primary-500/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Biogas utilization efficiency</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono whitespace-nowrap">85%</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">-</td>
                                </tr>
                                <tr className="border-b border-mythic-primary-500/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Grid displacement factor</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono whitespace-nowrap">0.233</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">kgCO₂/kWh</td>
                                </tr>
                                <tr className="border-b border-mythic-primary-500/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Net avoided per tonne</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono text-mythic-primary-500 whitespace-nowrap">0.92</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">tCO₂e</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* UCO */}
                      <div>
                        <h4 className="font-semibold text-mythic-accent-300 mb-3">UCO → Biodiesel</h4>
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b border-mythic-accent-300/20">
                                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-semibold text-mythic-text-muted whitespace-nowrap">Parameter</th>
                                  <th className="text-right py-2 sm:py-3 px-4 text-xs sm:text-sm font-semibold text-mythic-text-muted whitespace-nowrap">Value</th>
                                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-semibold text-mythic-text-muted whitespace-nowrap">Unit</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-mythic-accent-300/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Diesel emission factor</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono whitespace-nowrap">3.16</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">kgCO₂e/L</td>
                                </tr>
                                <tr className="border-b border-mythic-accent-300/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Biodiesel lifecycle emissions</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono whitespace-nowrap">0.27</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">kgCO₂e/L</td>
                                </tr>
                                <tr className="border-b border-mythic-accent-300/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Conversion efficiency</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono whitespace-nowrap">0.9</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">L biodiesel/L UCO</td>
                                </tr>
                                <tr className="border-b border-mythic-accent-300/10">
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary whitespace-nowrap">Net avoided per litre UCO</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-primary text-right font-mono text-mythic-accent-300 whitespace-nowrap">2.60</td>
                                  <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-mythic-text-muted whitespace-nowrap">kgCO₂e</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Process */}
                  <div>
                    <h3 className="text-xl font-semibold text-flow-credits mb-3">Verification Chain</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-mythic-primary-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-mythic-primary-500">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-mythic-text-primary">Physical Collection</h4>
                          <p className="text-sm text-mythic-text-muted">
                            TraceBot logs mass, time, location, photos at pickup point
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-mythic-accent-300/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-mythic-accent-300">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-mythic-text-primary">Processing Verification</h4>
                          <p className="text-sm text-mythic-text-muted">
                            Input/output mass balance confirmed at processor
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-flow-credits/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-flow-credits">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-mythic-text-primary">Credit Minting</h4>
                          <p className="text-sm text-mythic-text-muted">
                            CarbonVerifier calculates CO₂e, LoopAuditBot anchors proof
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Heat Cascading Section */}
            {activeSection === 'heat-cascade' && (
              <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
                <h2 className="text-3xl font-bold text-mythic-text-primary mb-6 flex items-center gap-3">
                  <Thermometer className="h-8 w-8 text-mythic-primary-500" />
                  Heat Cascading Design Patterns
                </h2>

                <div className="space-y-8">
                  {/* Three-Stage System */}
                  <div>
                    <h3 className="text-xl font-semibold text-mythic-primary-500 mb-3">Three-Stage Heat Recovery</h3>
                    <div className="space-y-4">
                      <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-red-500">1</span>
                          </div>
                          <h4 className="font-semibold text-red-400">Exhaust Heat Exchanger</h4>
                        </div>
                        <p className="text-mythic-text-muted mb-2">
                          Temperature range: 350-450°C → 80-120°C
                        </p>
                        <p className="text-sm text-mythic-text-muted">
                          <strong>Best uses:</strong> Industrial drying, sterilization, high-temp processes
                        </p>
                      </div>

                      <div className="p-6 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-orange-500">2</span>
                          </div>
                          <h4 className="font-semibold text-orange-400">Jacket Water HX</h4>
                        </div>
                        <p className="text-mythic-text-muted mb-2">
                          Temperature range: 80-90°C → 60-70°C
                        </p>
                        <p className="text-sm text-mythic-text-muted">
                          <strong>Best uses:</strong> Space heating, greenhouses, hot water systems
                        </p>
                      </div>

                      <div className="p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-500">3</span>
                          </div>
                          <h4 className="font-semibold text-blue-400">Plate HX (Low-grade)</h4>
                        </div>
                        <p className="text-mythic-text-muted mb-2">
                          Temperature range: 40-50°C → 30-40°C
                        </p>
                        <p className="text-sm text-mythic-text-muted">
                          <strong>Best uses:</strong> Floor heating, preheating, aquaculture
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Design Considerations */}
                  <div>
                    <h3 className="text-xl font-semibold text-mythic-accent-300 mb-3">Design Best Practices</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-mythic-text-primary">Load Matching</h4>
                        <ul className="space-y-2 text-sm text-mythic-text-muted">
                          <li className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                            <span>Profile heat demands hourly/seasonally</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                            <span>Size for baseload, not peak</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                            <span>Include thermal storage for mismatch</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-mythic-text-primary">Common Mistakes</h4>
                        <ul className="space-y-2 text-sm text-mythic-text-muted">
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <span>Oversizing heat exchangers</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <span>Ignoring fouling factors</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                            <span>No bypass for maintenance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Example Configurations */}
                  <div>
                    <h3 className="text-xl font-semibold text-flow-credits mb-3">Example Configurations</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">Urban Farm Complex</h4>
                        <p className="text-sm text-mythic-text-muted">
                          Exhaust → grain drying | Jacket → greenhouse heating | Plate → aquaponics
                        </p>
                        <p className="text-xs text-mythic-accent-300 mt-1">Efficiency: 83%</p>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">Food Processing Plant</h4>
                        <p className="text-sm text-mythic-text-muted">
                          Exhaust → sterilization | Jacket → wash water | Plate → space heating
                        </p>
                        <p className="text-xs text-mythic-accent-300 mt-1">Efficiency: 85%</p>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">Community Center</h4>
                        <p className="text-sm text-mythic-text-muted">
                          Exhaust → laundry | Jacket → pool heating | Plate → underfloor heating
                        </p>
                        <p className="text-xs text-mythic-accent-300 mt-1">Efficiency: 81%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DAO Guardrails Section */}
            {activeSection === 'dao' && (
              <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
                <h2 className="text-3xl font-bold text-mythic-text-primary mb-6 flex items-center gap-3">
                  <Users className="h-8 w-8 text-mythic-primary-500" />
                  DAO Anti-Capture Guardrails
                </h2>

                <div className="space-y-8">
                  {/* Core Principles */}
                  <div className="p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
                    <h3 className="font-semibold text-mythic-primary-500 mb-2">
                      First Principle: Community Sovereignty
                    </h3>
                    <p className="text-mythic-text-muted">
                      Every guardrail exists to prevent corporate capture and ensure value 
                      flows stay local. These rules are immutable—hardcoded into the protocol.
                    </p>
                  </div>

                  {/* Treasury Rules */}
                  <div>
                    <h3 className="text-xl font-semibold text-mythic-primary-500 mb-3">Treasury Management</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-mythic-text-primary">Fixed Dialocation</h4>
                          <span className="text-xs px-2 py-1 bg-mythic-primary-500/20 text-mythic-primary-500 rounded">IMMUTABLE</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-mythic-text-muted">Reinvestment</p>
                            <p className="text-2xl font-bold text-mythic-primary-500">60%</p>
                          </div>
                          <div>
                            <p className="text-mythic-text-muted">Operations</p>
                            <p className="text-2xl font-bold text-mythic-accent-300">20%</p>
                          </div>
                          <div>
                            <p className="text-mythic-text-muted">Reserves</p>
                            <p className="text-2xl font-bold text-flow-credits">20%</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-primary-500/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-2">Draw Limits</h4>
                        <ul className="space-y-1 text-sm text-mythic-text-muted">
                          <li>• Maximum 15% treasury draw per loop</li>
                          <li>• Small actors (&lt;£10k requests) get priority</li>
                          <li>• Emergency draws require 3/5 board signatures</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Voting Rules */}
                  <div>
                    <h3 className="text-xl font-semibold text-mythic-accent-300 mb-3">Voting & Governance</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-accent-300/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-2">Vote Weight Caps</h4>
                        <ul className="space-y-1 text-sm text-mythic-text-muted">
                          <li>• No entity {'>'}10% voting power</li>
                          <li>• Quadratic voting for major decisions</li>
                          <li>• 1 node = 1 base vote</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-mythic-accent-300/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-2">Proposal Types</h4>
                        <ul className="space-y-1 text-sm text-mythic-text-muted">
                          <li>• Micro (≤£2k): 24hr vote</li>
                          <li>• Major (CAPEX): 5 days, 2/3 pass</li>
                          <li>• Emergency: 6hr, 3 signatures</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Slash Conditions */}
                  <div>
                    <h3 className="text-xl font-semibold text-red-400 mb-3">Slash Rules</h3>
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-sm text-mythic-text-muted mb-3">
                        Bad actors face automatic penalties. No appeals, no exceptions.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-mythic-text-muted">False waste reporting</span>
                          <span className="text-red-400 font-semibold">100% stake slash</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-mythic-text-muted">Vote manipulation attempt</span>
                          <span className="text-red-400 font-semibold">50% stake slash + ban</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-mythic-text-muted">Monopoly behavior</span>
                          <span className="text-red-400 font-semibold">Graduated penalties</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Implementation */}
                  <div>
                    <h3 className="text-xl font-semibold text-flow-credits mb-3">Technical Implementation</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-flow-credits/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">Smart Contract Enforcement</h4>
                        <p className="text-sm text-mythic-text-muted">
                          All rules encoded in upgradeable proxy contracts with 30-day timelock
                        </p>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-flow-credits/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">Multi-Sig Security</h4>
                        <p className="text-sm text-mythic-text-muted">
                          Treasury requires 3/5 signatures from elected board members
                        </p>
                      </div>
                      <div className="p-4 bg-mythic-dark-900 rounded-lg border border-flow-credits/10">
                        <h4 className="font-semibold text-mythic-text-primary mb-1">Audit Trail</h4>
                        <p className="text-sm text-mythic-text-muted">
                          Every transaction logged on-chain with IPFS metadata backup
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
            <h3 className="font-semibold text-mythic-primary-500 mb-3">Need More Help?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/ops"
                className="flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Operator Console</span>
              </Link>
              <Link
                href="/dao/propose"
                className="flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Submit Proposal</span>
              </Link>
              <Link
                href="/discord"
                className="flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Join Discord</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
