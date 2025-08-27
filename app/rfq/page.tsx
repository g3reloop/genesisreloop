'use client'

import { motion } from 'framer-motion'
import { FileText, Factory, Droplet, CheckCircle, Send, AlertCircle, Timer } from 'lucide-react'
import { useState } from 'react'

type RFQType = 'biogas' | 'biodiesel'

interface FormData {
  type: RFQType
  // Common fields
  companyName: string
  contactName: string
  email: string
  phone: string
  location: string
  timeline: string
  budget: string
  // Biogas specific
  throughputTpd?: string
  footprintM2?: string
  powerKwe?: string
  heatKwth?: string
  supportRequired?: string
  // Biodiesel specific
  lpdTarget?: string
  ucoQualityRange?: string
  automationLevel?: string
  utilitiesAvailable?: string
  complianceDocs?: string
}

export default function RFQCenter() {
  const [selectedType, setSelectedType] = useState<RFQType>('biogas')
  const [formData, setFormData] = useState<FormData>({
    type: 'biogas',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    timeline: '',
    budget: ''
  })

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('RFQ submitted:', formData)
  }

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
              RFQ — Modular Plants
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Request quotes for containerized biogas/biodiesel modules. 
            We standardize specs for apples-to-apples pricing.
          </p>
        </motion.div>

        {/* Module Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => {
                setSelectedType('biogas')
                setFormData(prev => ({ ...prev, type: 'biogas' }))
              }}
              className={`glass rounded-2xl p-8 border transition-all ${
                selectedType === 'biogas'
                  ? 'border-mythic-primary-500 bg-mythic-primary-500/10'
                  : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Factory className="h-10 w-10 text-mythic-primary-500" />
                {selectedType === 'biogas' && (
                  <CheckCircle className="h-6 w-6 text-mythic-primary-500" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-mythic-text-primary mb-2">
                Biogas AD Container
              </h3>
              <p className="text-mythic-text-muted mb-4">
                Anaerobic digestion units for food waste processing
              </p>
              <ul className="space-y-2 text-sm text-mythic-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-mythic-primary-500">•</span>
                  <span>1-5 tonnes/day capacity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mythic-primary-500">•</span>
                  <span>40ft container footprint</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mythic-primary-500">•</span>
                  <span>CHP ready with heat recovery</span>
                </li>
              </ul>
            </button>

            <button
              onClick={() => {
                setSelectedType('biodiesel')
                setFormData(prev => ({ ...prev, type: 'biodiesel' }))
              }}
              className={`glass rounded-2xl p-8 border transition-all ${
                selectedType === 'biodiesel'
                  ? 'border-mythic-accent-300 bg-mythic-accent-300/10'
                  : 'border-mythic-accent-300/20 hover:border-mythic-accent-300/40'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Droplet className="h-10 w-10 text-mythic-accent-300" />
                {selectedType === 'biodiesel' && (
                  <CheckCircle className="h-6 w-6 text-mythic-accent-300" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-mythic-text-primary mb-2">
                Biodiesel Modular
              </h3>
              <p className="text-mythic-text-muted mb-4">
                Containerized biodiesel production from UCO
              </p>
              <ul className="space-y-2 text-sm text-mythic-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-mythic-accent-300">•</span>
                  <span>500-2000 L/day capacity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mythic-accent-300">•</span>
                  <span>20ft container footprint</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mythic-accent-300">•</span>
                  <span>Full automation available</span>
                </li>
              </ul>
            </button>
          </div>
        </motion.div>

        {/* RFQ Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
              {selectedType === 'biogas' ? 'Biogas AD Container RFQ' : 'Biodiesel Modular RFQ'}
            </h2>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">Project Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Installation Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Target Timeline *
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => updateFormData('timeline', e.target.value)}
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate ({'<'} 3 months)</option>
                    <option value="short">3-6 months</option>
                    <option value="medium">6-12 months</option>
                    <option value="long">12+ months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Budget Range (GBP) *
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => updateFormData('budget', e.target.value)}
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    required
                  >
                    <option value="">Select budget</option>
                    <option value="<100k">{'<'} £100k</option>
                    <option value="100-250k">£100k - £250k</option>
                    <option value="250-500k">£250k - £500k</option>
                    <option value="500k+">£500k+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">Technical Specifications</h3>
              
              {selectedType === 'biogas' ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Throughput (tonnes/day) *
                    </label>
                    <input
                      type="text"
                      value={formData.throughputTpd}
                      onChange={(e) => updateFormData('throughputTpd', e.target.value)}
                      placeholder="e.g., 2-3"
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Available Footprint (m²)
                    </label>
                    <input
                      type="text"
                      value={formData.footprintM2}
                      onChange={(e) => updateFormData('footprintM2', e.target.value)}
                      placeholder="e.g., 200"
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Power Output Required (kWe)
                    </label>
                    <input
                      type="text"
                      value={formData.powerKwe}
                      onChange={(e) => updateFormData('powerKwe', e.target.value)}
                      placeholder="e.g., 100"
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Heat Output Required (kWth)
                    </label>
                    <input
                      type="text"
                      value={formData.heatKwth}
                      onChange={(e) => updateFormData('heatKwth', e.target.value)}
                      placeholder="e.g., 150"
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Support Required
                    </label>
                    <textarea
                      value={formData.supportRequired}
                      onChange={(e) => updateFormData('supportRequired', e.target.value)}
                      placeholder="Installation, commissioning, training, maintenance package..."
                      rows={3}
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Target Capacity (L/day) *
                    </label>
                    <input
                      type="text"
                      value={formData.lpdTarget}
                      onChange={(e) => updateFormData('lpdTarget', e.target.value)}
                      placeholder="e.g., 1000"
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      UCO Quality Range
                    </label>
                    <input
                      type="text"
                      value={formData.ucoQualityRange}
                      onChange={(e) => updateFormData('ucoQualityRange', e.target.value)}
                      placeholder="e.g., FFA 3-15%"
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Automation Level
                    </label>
                    <select
                      value={formData.automationLevel}
                      onChange={(e) => updateFormData('automationLevel', e.target.value)}
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    >
                      <option value="">Select level</option>
                      <option value="manual">Manual operation</option>
                      <option value="semi-auto">Semi-automated</option>
                      <option value="full-auto">Fully automated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Utilities Available
                    </label>
                    <input
                      type="text"
                      value={formData.utilitiesAvailable}
                      onChange={(e) => updateFormData('utilitiesAvailable', e.target.value)}
                      placeholder="3-phase power, water, steam..."
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-mythic-text-muted mb-2">
                      Compliance Requirements
                    </label>
                    <textarea
                      value={formData.complianceDocs}
                      onChange={(e) => updateFormData('complianceDocs', e.target.value)}
                      placeholder="EN 14214, local permits required, environmental standards..."
                      rows={3}
                      className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Important Notice */}
            <div className="mb-8 p-6 bg-mythic-primary-500/10 rounded-lg border border-mythic-primary-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-mythic-primary-500 mb-2">What Happens Next?</h4>
                  <ul className="space-y-1 text-sm text-mythic-text-muted">
                    <li>• Your RFQ will be shared with 3-5 pre-vetted modular suppliers</li>
                    <li>• You{`'`}ll receive standardized quotes within 5 business days</li>
                    <li>• All quotes include delivery, installation, and commissioning</li>
                    <li>• DAO members get preferential pricing and payment terms</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                Submit RFQ
              </button>
            </div>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
            <h3 className="font-semibold text-mythic-primary-500 mb-3">Why Modular?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-mythic-text-primary mb-1">Lower CAPEX</h4>
                <p className="text-mythic-text-muted">
                  40% less than fixed plants. Standard designs = volume pricing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-mythic-text-primary mb-1">Fast Deploy</h4>
                <p className="text-mythic-text-muted">
                  8-12 week lead times. Minimal site prep. Plug and play.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-mythic-text-primary mb-1">Scalable</h4>
                <p className="text-mythic-text-muted">
                  Start small, add modules. Move them if feedstock shifts.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
