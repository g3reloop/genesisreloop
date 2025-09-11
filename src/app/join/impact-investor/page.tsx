'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Shield, Target, Globe, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const benefits = [
  {
    icon: <TrendingUp className="h-6 w-6 text-mythic-primary-500" />,
    title: "Attractive Returns",
    description: "8-12% target IRR with quarterly distributions from operational loops"
  },
  {
    icon: <Shield className="h-6 w-6 text-mythic-primary-500" />,
    title: "Asset-Backed Security",
    description: "Investments secured by physical processing assets and long-term contracts"
  },
  {
    icon: <Target className="h-6 w-6 text-mythic-primary-500" />,
    title: "Measurable Impact",
    description: "Real-time tracking of carbon savings, waste diverted, and community benefits"
  },
  {
    icon: <Globe className="h-6 w-6 text-mythic-primary-500" />,
    title: "Scalable Model",
    description: "Proven technology ready to deploy across multiple sites and regions"
  }
]

const investmentOptions = [
  {
    title: "Loop Infrastructure Fund",
    minInvestment: "£50,000",
    targetReturn: "8-10% IRR",
    description: "Diversified portfolio of operational waste-to-energy loops"
  },
  {
    title: "Single Asset Investment",
    minInvestment: "£250,000",
    targetReturn: "10-12% IRR",
    description: "Direct investment in specific biogas or biodiesel facilities"
  },
  {
    title: "GIRM Token Purchase",
    minInvestment: "£10,000",
    targetReturn: "Variable",
    description: "Governance token with revenue share from all network activity"
  }
]

export default function JoinImpactInvestorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investorType: '',
    investmentSize: '',
    timeframe: '',
    interests: [] as string[],
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // In production, this would call the API
      console.log('Form submission:', formData)
      
      toast.success('Thank you for your interest! Our investment team will contact you shortly.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        investorType: '',
        investmentSize: '',
        timeframe: '',
        interests: [],
        message: ''
      })
    } catch (error) {
      toast.error('Failed to submit form. Please try again.')
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
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
            Impact Investment Opportunities
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Invest in the circular economy infrastructure of tomorrow. Generate returns while transforming waste into renewable energy.
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

        {/* Investment Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-mythic-text-primary mb-8 text-center">
            Investment Options
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {investmentOptions.map((option, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-mythic-dark-900/50 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all"
              >
                <h3 className="text-lg font-semibold text-mythic-text-primary mb-2">
                  {option.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-mythic-text-muted">
                    Min Investment: <span className="text-mythic-primary-500 font-semibold">{option.minInvestment}</span>
                  </p>
                  <p className="text-sm text-mythic-text-muted">
                    Target Return: <span className="text-mythic-accent-300 font-semibold">{option.targetReturn}</span>
                  </p>
                </div>
                <p className="text-sm text-mythic-text-muted">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Inquiry Form */}
        <div className="bg-mythic-dark-900/50 rounded-2xl border border-mythic-primary-500/20 p-8">
          <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
            Investment Inquiry
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="Your full name"
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
                  placeholder="investor@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="+44 7XXX XXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Investor Type *
                </label>
                <select
                  required
                  value={formData.investorType}
                  onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <option value="">Select type</option>
                  <option value="individual">Individual/Family Office</option>
                  <option value="institutional">Institutional Investor</option>
                  <option value="fund">Investment Fund</option>
                  <option value="corporate">Corporate</option>
                  <option value="foundation">Foundation/Charity</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Investment Size *
                </label>
                <select
                  required
                  value={formData.investmentSize}
                  onChange={(e) => setFormData({ ...formData, investmentSize: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <option value="">Select range</option>
                  <option value="10-50k">£10,000 - £50,000</option>
                  <option value="50-250k">£50,000 - £250,000</option>
                  <option value="250k-1m">£250,000 - £1,000,000</option>
                  <option value="1m+">Over £1,000,000</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Investment Timeframe *
                </label>
                <select
                  required
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <option value="">Select timeframe</option>
                  <option value="immediate">Immediate (Ready now)</option>
                  <option value="3months">Within 3 months</option>
                  <option value="6months">Within 6 months</option>
                  <option value="1year">Within 1 year</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mythic-text-muted mb-4">
                Investment Interests
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Infrastructure Fund', 'Single Assets', 'GIRM Tokens', 'Green Bonds', 'Equity Stakes', 'Revenue Share'].map((interest) => (
                  <label key={interest} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                      className="w-4 h-4 rounded border-[var(--field-border)] bg-[var(--field-bg)] text-mythic-primary-500 focus:ring-mythic-primary-500 focus:ring-offset-black"
                    />
                    <span className="text-sm text-mythic-text-primary">{interest}</span>
                  </label>
                ))}
              </div>
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
                placeholder="Tell us about your investment goals and impact priorities..."
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
                Submit Inquiry
              </Button>
            </div>
          </form>
        </div>

        {/* Investment Highlights */}
        <div className="mt-12 p-6 rounded-xl bg-mythic-dark-900/30 border border-mythic-primary-500/10">
          <h3 className="text-lg font-semibold text-mythic-text-primary mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-mythic-primary-500" />
            Investment Highlights
          </h3>
          <ul className="space-y-2 text-mythic-text-muted">
            <li>• FCA-compliant investment structures</li>
            <li>• Quarterly distributions from operational revenue</li>
            <li>• Full transparency via blockchain tracking</li>
            <li>• Professional asset management team</li>
            <li>• Regular impact reports and investor updates</li>
            <li>• Exit options after 3-year minimum hold</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
