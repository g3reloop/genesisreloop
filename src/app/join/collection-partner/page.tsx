'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Truck, Users, MapPin, Award, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const benefits = [
  {
    icon: <Truck className="h-6 w-6 text-mythic-primary-500" />,
    title: "Fleet Management Support",
    description: "Access route optimization, fuel tracking, and maintenance scheduling tools"
  },
  {
    icon: <MapPin className="h-6 w-6 text-mythic-primary-500" />,
    title: "Territory Protection",
    description: "Exclusive collection zones with guaranteed minimum volumes"
  },
  {
    icon: <Award className="h-6 w-6 text-mythic-primary-500" />,
    title: "Performance Incentives",
    description: "Earn bonuses for on-time collections and quality standards"
  },
  {
    icon: <Users className="h-6 w-6 text-mythic-primary-500" />,
    title: "Community Standing",
    description: "Build trust scores and unlock premium contracts"
  }
]

export default function JoinCollectionPartnerPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    fleetSize: '',
    coverage: '',
    currentVolume: '',
    wasteTypes: [] as string[],
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // In production, this would call the API
      console.log('Form submission:', formData)
      
      toast.success('Application submitted successfully! We\'ll contact you within 24 hours.')
      
      // Reset form
      setFormData({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        fleetSize: '',
        coverage: '',
        currentVolume: '',
        wasteTypes: [],
        message: ''
      })
    } catch (error) {
      toast.error('Failed to submit application. Please try again.')
    }
  }

  const handleWasteTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(type)
        ? prev.wasteTypes.filter(t => t !== type)
        : [...prev.wasteTypes, type]
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
            Become a Collection Partner
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Join our decentralized waste collection network. Route smarter, earn more, and help build sustainable loops.
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
            Collection Partner Application
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="Your business name"
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
                  placeholder="contact@example.com"
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
                  Fleet Size *
                </label>
                <select
                  required
                  value={formData.fleetSize}
                  onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <option value="">Select fleet size</option>
                  <option value="1-3">1-3 vehicles</option>
                  <option value="4-10">4-10 vehicles</option>
                  <option value="11-25">11-25 vehicles</option>
                  <option value="26+">26+ vehicles</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                  Coverage Area *
                </label>
                <input
                  type="text"
                  required
                  value={formData.coverage}
                  onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                  placeholder="e.g., Brighton & Hove, East Sussex"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mythic-text-muted mb-2">
                Current Monthly Volume
              </label>
              <input
                type="text"
                value={formData.currentVolume}
                onChange={(e) => setFormData({ ...formData, currentVolume: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:outline-none focus:ring-2 focus:ring-mythic-primary-500 focus:ring-offset-2 focus:ring-offset-black"
                placeholder="e.g., 50 tonnes/month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mythic-text-muted mb-4">
                Waste Types You Collect *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Food Waste', 'UCO', 'Green Waste', 'Mixed Waste'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.wasteTypes.includes(type)}
                      onChange={() => handleWasteTypeToggle(type)}
                      className="w-4 h-4 rounded border-[var(--field-border)] bg-[var(--field-bg)] text-mythic-primary-500 focus:ring-mythic-primary-500 focus:ring-offset-black"
                    />
                    <span className="text-sm text-mythic-text-primary">{type}</span>
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
                placeholder="Tell us about your collection experience and why you want to join the network..."
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
            Basic Requirements
          </h3>
          <ul className="space-y-2 text-mythic-text-muted">
            <li>• Valid waste carrier license</li>
            <li>• Commercial vehicle insurance</li>
            <li>• Basic GPS tracking capability</li>
            <li>• Commitment to scheduled collections</li>
            <li>• Willingness to adopt digital tracking</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
