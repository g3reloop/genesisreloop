'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const benefits = [
  {
    icon: <Zap className="h-6 w-6 text-mythic-primary-500" />,
    title: "Modular Technology",
    description: "Operate proven biogas digesters or biodiesel processors with full technical support"
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-mythic-primary-500" />,
    title: "Revenue Streams",
    description: "Multiple income sources: processing fees, product sales, GIRM credits, and performance bonuses"
  },
  {
    icon: <Shield className="h-6 w-6 text-mythic-primary-500" />,
    title: "Risk Protection",
    description: "Guaranteed feedstock supply, offtake agreements, and loop insurance coverage"
  },
  {
    icon: <Settings className="h-6 w-6 text-mythic-primary-500" />,
    title: "Operational Support",
    description: "24/7 monitoring, predictive maintenance, and expert troubleshooting"
  }
]

export default function JoinLoopOperatorPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    siteSize: '',
    experience: '',
    technologyInterest: [] as string[],
    investment: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // In production, this would call the API
      console.log('Form submission:', formData)
      
      toast.success('Application submitted! Our team will review and contact you within 48 hours.')
      
      // Reset form
      setFormData({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        location: '',
        siteSize: '',
        experience: '',
        technologyInterest: [],
        investment: '',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    }
  }

  const handleTechToggle = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologyInterest: prev.technologyInterest.includes(tech)
        ? prev.technologyInterest.filter(t => t !== tech)
        : [...prev.technologyInterest, tech]
    }))
  }

  return (
    <div className="min-h-screen bg-black text-mythic-text-primary py-24 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link 
          href="/join" 
          className="inline-flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Join Options
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-4">
            Become a Loop Operator
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Own and operate modular waste-to-energy assets. We provide the tech, feedstock, and support — you provide the site and operations.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-mythic-dark-900/50 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-mythic-primary-500/10">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-mythic-text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-mythic-text-muted">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="bg-mythic-dark-900/50 rounded-2xl border border-mythic-primary-500/20 p-8">
          <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
            Loop Operator Application
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Business/Individual Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="Your name or business name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="Primary contact name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="operator@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="+44 7XXX XXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Proposed Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="City/Region"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Available Site Size
                </label>
                <input
                  type="text"
                  value={formData.siteSize}
                  onChange={(e) => setFormData({ ...formData, siteSize: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="e.g., 2000 sqm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                Operational Experience *
              </label>
              <select
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                <option value="">Select experience level</option>
                <option value="none">No prior experience (training provided)</option>
                <option value="industrial">Industrial/manufacturing background</option>
                <option value="waste">Waste management experience</option>
                <option value="energy">Energy generation experience</option>
                <option value="biogas">Biogas/AD experience</option>
                <option value="biodiesel">Biodiesel production experience</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-mythic-text-muted mb-4">
                Technology Interest *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Biogas Digester', 'Biodiesel Processor', 'Pyrolysis Unit', 'HVO Processor', 'Heat Recovery', 'Vertical Farm'].map((tech) => (
                  <label key={tech} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.technologyInterest.includes(tech)}
                      onChange={() => handleTechToggle(tech)}
                      className="w-4 h-4 rounded border-[var(--field-border)] bg-[var(--field-bg)] text-mythic-primary-500 focus:ring-mythic-primary-500 focus:ring-offset-black"
                    />
                    <span className="text-sm text-mythic-text-primary">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                Investment Capacity *
              </label>
              <select
                required
                value={formData.investment}
                onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                <option value="">Select investment range</option>
                <option value="<50k">Under £50,000</option>
                <option value="50-100k">£50,000 - £100,000</option>
                <option value="100-250k">£100,000 - £250,000</option>
                <option value="250-500k">£250,000 - £500,000</option>
                <option value="500k+">Over £500,000</option>
                <option value="financing">Need financing options</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                Additional Information
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black resize-none"
                placeholder="Tell us about your site, local feedstock availability, and why you want to operate a loop..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
              <p className="text-sm text-mythic-text-muted">
                * Required fields
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black font-semibold px-8"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>

        {/* Requirements */}
        <div className="mt-12 p-6 rounded-xl bg-mythic-dark-900/30 border border-mythic-primary-500/10">
          <h3 className="text-lg font-semibold text-mythic-text-primary mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-mythic-primary-500" />
            What We Provide
          </h3>
          <ul className="space-y-2 text-mythic-text-muted">
            <li>• Modular processing equipment (lease or purchase)</li>
            <li>• Technical training and certification</li>
            <li>• Guaranteed feedstock supply contracts</li>
            <li>• Product offtake agreements</li>
            <li>• 24/7 remote monitoring and support</li>
            <li>• Insurance and compliance assistance</li>
            <li>• GIRM credit allocation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
