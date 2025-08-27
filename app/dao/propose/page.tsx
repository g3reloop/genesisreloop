'use client'

import { motion } from 'framer-motion'
import { FileText, AlertCircle, ArrowLeft, Send, Clock, Users, DollarSign, Info } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWeb3 } from '@/hooks/useWeb3'
import { toast } from 'sonner'

type ProposalType = 'micro' | 'major' | 'policy' | 'emergency'
type BoardType = 'Finance' | 'Ops' | 'Community'

export default function ProposePage() {
  const router = useRouter()
  const { account } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    board: 'Finance' as BoardType,
    type: 'major' as ProposalType,
    description: '',
    capex: '',
    justification: '',
    impact: '',
    timeline: '',
  })

  const proposalTypes = {
    micro: {
      name: 'Micro (≤£2k)',
      description: 'Small purchases like pumps, sensors, or tools',
      duration: '24 hours',
      threshold: 'Simple majority',
      color: 'text-blue-400 bg-blue-500/20'
    },
    major: {
      name: 'Major (CAPEX)',
      description: 'New loops, modules, or major equipment',
      duration: '5 days',
      threshold: '2/3 majority',
      color: 'text-flow-credits bg-flow-credits/20'
    },
    policy: {
      name: 'Policy',
      description: 'Changes to rates, rules, or governance',
      duration: '3 days',
      threshold: 'Simple majority',
      color: 'text-purple-400 bg-purple-500/20'
    },
    emergency: {
      name: 'Emergency',
      description: 'Security issues or urgent operational needs',
      duration: '6 hours',
      threshold: '3 board signatures',
      color: 'text-red-400 bg-red-500/20'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!account) {
      toast.error('Please connect your wallet to submit a proposal')
      return
    }

    setIsSubmitting(true)

    try {
      // In production, this would submit to your smart contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Proposal submitted successfully!')
      router.push('/dao?tab=proposals')
    } catch (error) {
      toast.error('Failed to submit proposal. Please try again.')
      console.error('Proposal submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass rounded-2xl p-12 border border-mythic-primary-500/20">
              <AlertCircle className="h-16 w-16 text-mythic-accent-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-mythic-text-primary mb-4">
                Wallet Connection Required
              </h1>
              <p className="text-mythic-text-muted mb-8">
                You need to connect your wallet to submit proposals to the DAO.
              </p>
              <button
                onClick={() => window.dispatchEvent(new Event('connect-wallet'))}
                className="px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/dao"
            className="inline-flex items-center gap-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to DAO
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Create New Proposal
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl">
            Submit a proposal to be voted on by the community. Make sure to provide clear 
            justification and expected impact.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto"
        >
          {/* Proposal Type */}
          <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20 mb-6">
            <h2 className="text-xl font-bold text-mythic-text-primary mb-6">Proposal Type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {(Object.entries(proposalTypes) as [ProposalType, typeof proposalTypes.micro][]).map(([key, type]) => (
                <label
                  key={key}
                  className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                    formData.type === key
                      ? 'border-mythic-primary-500 bg-mythic-primary-500/10'
                      : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={key}
                    checked={formData.type === key}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ProposalType })}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${type.color}`}>
                        {type.name}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-mythic-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {type.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {type.threshold}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-mythic-text-muted">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Proposal Details */}
          <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20 mb-6">
            <h2 className="text-xl font-bold text-mythic-text-primary mb-6">Proposal Details</h2>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-mythic-text-primary mb-2">
                  Title <span className="text-mythic-accent-300">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Fund Brighton Biogas Module (2tpd)"
                  className="w-full px-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary placeholder-mythic-text-muted/50"
                />
              </div>

              {/* Board */}
              <div>
                <label htmlFor="board" className="block text-sm font-medium text-mythic-text-primary mb-2">
                  Board <span className="text-mythic-accent-300">*</span>
                </label>
                <select
                  id="board"
                  required
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value as BoardType })}
                  className="w-full px-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary"
                >
                  <option value="Finance">Finance - Treasury & New Loops</option>
                  <option value="Ops">Operations - Daily Operations & Logistics</option>
                  <option value="Community">Community - Fair-pay & Governance</option>
                </select>
              </div>

              {/* CAPEX (conditional) */}
              {(formData.type === 'major' || formData.type === 'micro') && (
                <div>
                  <label htmlFor="capex" className="block text-sm font-medium text-mythic-text-primary mb-2">
                    CAPEX Required <span className="text-mythic-accent-300">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mythic-text-muted">£</span>
                    <input
                      id="capex"
                      type="number"
                      required
                      min="0"
                      step="100"
                      value={formData.capex}
                      onChange={(e) => setFormData({ ...formData, capex: e.target.value })}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary placeholder-mythic-text-muted/50"
                    />
                  </div>
                  {formData.type === 'micro' && formData.capex && parseInt(formData.capex) > 2000 && (
                    <p className="mt-2 text-sm text-mythic-accent-300 flex items-start gap-1">
                      <Info className="h-4 w-4 mt-0.5" />
                      Micro proposals are limited to £2,000. Consider changing to Major.
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-mythic-text-primary mb-2">
                  Description <span className="text-mythic-accent-300">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a clear description of what you're proposing..."
                  className="w-full px-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary placeholder-mythic-text-muted/50 resize-none"
                />
              </div>

              {/* Justification */}
              <div>
                <label htmlFor="justification" className="block text-sm font-medium text-mythic-text-primary mb-2">
                  Justification <span className="text-mythic-accent-300">*</span>
                </label>
                <textarea
                  id="justification"
                  required
                  rows={3}
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  placeholder="Explain why this proposal is necessary..."
                  className="w-full px-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary placeholder-mythic-text-muted/50 resize-none"
                />
              </div>

              {/* Expected Impact */}
              <div>
                <label htmlFor="impact" className="block text-sm font-medium text-mythic-text-primary mb-2">
                  Expected Impact <span className="text-mythic-accent-300">*</span>
                </label>
                <textarea
                  id="impact"
                  required
                  rows={3}
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="Describe the expected outcomes and benefits..."
                  className="w-full px-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary placeholder-mythic-text-muted/50 resize-none"
                />
              </div>

              {/* Timeline */}
              {(formData.type === 'major' || formData.type === 'micro') && (
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-mythic-text-primary mb-2">
                    Implementation Timeline
                  </label>
                  <input
                    id="timeline"
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    placeholder="e.g., 2-3 weeks from approval"
                    className="w-full px-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary placeholder-mythic-text-muted/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dao"
              className="px-6 py-3 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-mythic-dark-900/30 border-t-mythic-dark-900 rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Proposal
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
