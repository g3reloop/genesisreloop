'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Search,
  Book,
  ArrowRight
} from 'lucide-react'

interface GlossaryTerm {
  term: string
  definition: string
  category: string
  relatedTerms?: string[]
}

const glossaryData: GlossaryTerm[] = [
  // Blockchain & DAO Terms
  {
    term: "DAO",
    definition: "Decentralized Autonomous Organization - A community-governed entity with no central authority, where decisions are made through member voting using blockchain technology.",
    category: "Blockchain & DAO",
    relatedTerms: ["Governance", "Token", "Smart Contract"]
  },
  {
    term: "Smart Contract",
    definition: "Self-executing code on the blockchain that automatically enforces agreed-upon rules without intermediaries. Think of it as a digital vending machine - input triggers predetermined output.",
    category: "Blockchain & DAO",
    relatedTerms: ["Blockchain", "DeFi", "Gas Fees"]
  },
  {
    term: "Token",
    definition: "A digital asset representing ownership, voting rights, or utility within a blockchain ecosystem. Genesis Reloop tokens grant governance rights and staking rewards.",
    category: "Blockchain & DAO",
    relatedTerms: ["Staking", "Governance", "Liquidity"]
  },
  {
    term: "Staking",
    definition: "Locking tokens in a smart contract to support network operations and earn rewards. In Genesis Reloop, stakers receive 30% of protocol revenues.",
    category: "Blockchain & DAO",
    relatedTerms: ["APY", "Token", "Rewards"]
  },
  {
    term: "Gas Fees",
    definition: "Transaction costs on blockchain networks, paid to validators who process and secure transactions. Like postage stamps for blockchain mail.",
    category: "Blockchain & DAO",
    relatedTerms: ["Blockchain", "Transaction", "Smart Contract"]
  },
  {
    term: "Multi-sig",
    definition: "Multi-signature wallet requiring multiple approvals before executing transactions. Like a bank vault needing multiple keys to open.",
    category: "Blockchain & DAO",
    relatedTerms: ["Treasury", "Security", "DAO"]
  },
  {
    term: "Treasury",
    definition: "The DAO-controlled pool of funds used for operations, expansion, and community initiatives. Managed transparently through multi-sig wallets.",
    category: "Blockchain & DAO",
    relatedTerms: ["Multi-sig", "DAO", "Governance"]
  },
  {
    term: "Governance",
    definition: "The decision-making process where token holders vote on proposals affecting the protocol's future. One token equals one vote.",
    category: "Blockchain & DAO",
    relatedTerms: ["DAO", "Token", "Proposal"]
  },
  {
    term: "DeFi",
    definition: "Decentralized Finance - Financial services without traditional intermediaries, using smart contracts instead of banks or brokers.",
    category: "Blockchain & DAO",
    relatedTerms: ["Smart Contract", "Liquidity", "APY"]
  },
  {
    term: "Liquidity Pool",
    definition: "Funds locked in smart contracts that enable token trading. Providers earn fees from trades proportional to their contribution.",
    category: "Blockchain & DAO",
    relatedTerms: ["DeFi", "APY", "Token"]
  },
  
  // Environmental & Process Terms
  {
    term: "UCO",
    definition: "Used Cooking Oil - Waste oil from restaurants and food processing that can be converted into biodiesel instead of polluting waterways.",
    category: "Environmental",
    relatedTerms: ["Biodiesel", "Circular Economy", "Waste Diversion"]
  },
  {
    term: "Biodiesel",
    definition: "Renewable fuel made from organic materials like UCO. Burns cleaner than fossil diesel with 84% less CO₂ emissions.",
    category: "Environmental",
    relatedTerms: ["UCO", "B20", "B100", "Carbon Neutral"]
  },
  {
    term: "B20",
    definition: "A fuel blend containing 20% biodiesel and 80% petroleum diesel. Compatible with most diesel engines without modification.",
    category: "Environmental",
    relatedTerms: ["B100", "Biodiesel", "Blend"]
  },
  {
    term: "B100",
    definition: "Pure biodiesel with no petroleum content. The most environmentally friendly option but may require engine modifications.",
    category: "Environmental",
    relatedTerms: ["B20", "Biodiesel", "Carbon Neutral"]
  },
  {
    term: "Transesterification",
    definition: "The chemical process converting UCO into biodiesel by reacting oil with alcohol (usually methanol) and a catalyst.",
    category: "Environmental",
    relatedTerms: ["Biodiesel", "UCO", "Glycerin"]
  },
  {
    term: "Glycerin",
    definition: "Valuable by-product of biodiesel production, used in cosmetics, pharmaceuticals, and industrial applications.",
    category: "Environmental",
    relatedTerms: ["Transesterification", "By-product", "Revenue Stream"]
  },
  {
    term: "Carbon Credits",
    definition: "Tradeable certificates representing one metric ton of CO₂ emissions prevented or removed from the atmosphere.",
    category: "Environmental",
    relatedTerms: ["Carbon Neutral", "Emissions", "Revenue Stream"]
  },
  {
    term: "Circular Economy",
    definition: "Economic model where waste becomes resources, creating closed-loop systems that minimize waste and maximize value.",
    category: "Environmental",
    relatedTerms: ["Waste Diversion", "Sustainability", "UCO"]
  },
  {
    term: "Waste Diversion",
    definition: "Redirecting waste from landfills or drains to productive use. UCO diversion prevents water pollution and creates clean energy.",
    category: "Environmental",
    relatedTerms: ["Circular Economy", "UCO", "Sustainability"]
  },
  {
    term: "Carbon Neutral",
    definition: "Net zero carbon emissions achieved by balancing emissions with removal or using renewable sources that don't add new carbon.",
    category: "Environmental",
    relatedTerms: ["Biodiesel", "Carbon Credits", "Emissions"]
  },
  {
    term: "GHG",
    definition: "Greenhouse Gases - Atmospheric gases like CO₂ that trap heat and contribute to climate change. Biodiesel reduces GHG by 84%.",
    category: "Environmental",
    relatedTerms: ["Emissions", "Carbon Credits", "Climate Impact"]
  },
  
  // Business & Financial Terms
  {
    term: "APY",
    definition: "Annual Percentage Yield - The yearly return on staked tokens including compound interest. Varies based on protocol performance.",
    category: "Financial",
    relatedTerms: ["Staking", "Rewards", "ROI"]
  },
  {
    term: "ROI",
    definition: "Return on Investment - The profit or loss on an investment relative to its cost. Calculated as (gain - cost) / cost × 100%.",
    category: "Financial",
    relatedTerms: ["APY", "Investment", "Yield"]
  },
  {
    term: "Revenue Stream",
    definition: "Source of income for the protocol. Genesis Reloop has four: biodiesel sales, carbon credits, glycerin sales, and tipping fees.",
    category: "Financial",
    relatedTerms: ["Business Model", "Treasury", "Staking Rewards"]
  },
  {
    term: "Tipping Fee",
    definition: "Payment received for accepting and processing waste. Some waste generators pay Genesis Reloop to collect their UCO.",
    category: "Financial",
    relatedTerms: ["Revenue Stream", "UCO", "Collection"]
  },
  {
    term: "Economies of Scale",
    definition: "Cost advantages from increased production volume. As Genesis Reloop grows, per-liter processing costs decrease.",
    category: "Financial",
    relatedTerms: ["Efficiency", "Growth", "ROI"]
  },
  
  // Technical & Platform Terms
  {
    term: "On-chain",
    definition: "Data or transactions recorded directly on the blockchain, providing permanent, transparent, and verifiable records.",
    category: "Technical",
    relatedTerms: ["Blockchain", "Transparency", "Verification"]
  },
  {
    term: "Protocol",
    definition: "The complete set of rules and smart contracts governing Genesis Reloop's operations, from UCO collection to profit distribution.",
    category: "Technical",
    relatedTerms: ["Smart Contract", "DAO", "Platform"]
  },
  {
    term: "Wallet",
    definition: "Digital tool for storing, sending, and receiving tokens. Your gateway to interacting with Genesis Reloop and other Web3 applications.",
    category: "Technical",
    relatedTerms: ["Token", "Multi-sig", "Security"]
  },
  {
    term: "Whitelist",
    definition: "Pre-approved list of addresses eligible for certain privileges, like early access to token sales or special features.",
    category: "Technical",
    relatedTerms: ["Access", "Token Sale", "Priority"]
  },
  {
    term: "Audit",
    definition: "Third-party security review of smart contracts to identify vulnerabilities. Genesis Reloop undergoes regular audits for safety.",
    category: "Technical",
    relatedTerms: ["Security", "Smart Contract", "Trust"]
  },
  
  // Partnership Terms
  {
    term: "Green Certification",
    definition: "Official recognition of environmental sustainability practices. Restaurant partners receive certification for UCO recycling.",
    category: "Partnership",
    relatedTerms: ["Sustainability", "Partners", "Benefits"]
  },
  {
    term: "Collection Network",
    definition: "System of local collectors who gather UCO from restaurants and deliver to processing facilities.",
    category: "Partnership",
    relatedTerms: ["UCO", "Logistics", "Partners"]
  },
  {
    term: "Processing Facility",
    definition: "Industrial plant where UCO is converted to biodiesel through transesterification. Each facility can process 5-10 million liters annually.",
    category: "Partnership",
    relatedTerms: ["Biodiesel", "Transesterification", "Capacity"]
  }
]

const categories = ["All", "Blockchain & DAO", "Environmental", "Financial", "Technical", "Partnership"]

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Get unique first letters
  const letters = Array.from(new Set(glossaryData.map(item => item.term[0].toUpperCase()))).sort()

  // Filter terms
  const filteredTerms = glossaryData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    
    const matchesLetter = selectedLetter === null || item.term[0].toUpperCase() === selectedLetter
    
    return matchesSearch && matchesCategory && matchesLetter
  }).sort((a, b) => a.term.localeCompare(b.term))

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
              Glossary of Terms
            </span>
          </h1>
          
          <p className="text-xl text-mythic-text-muted text-center mb-12 max-w-3xl mx-auto">
            New to Web3 or circular economy concepts? This glossary explains key terms 
            in simple language to help you understand Genesis Reloop.
          </p>

          {/* Search Bar */}
          <div className="relative mb-8 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mythic-text-muted" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary placeholder-mythic-text-muted focus:outline-none focus:border-mythic-primary-500/50 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900'
                    : 'bg-mythic-dark-900 text-mythic-text-muted hover:text-mythic-text-primary border border-mythic-primary-500/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Alphabet Filter */}
          <div className="flex flex-wrap gap-1 mb-8 justify-center">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`w-10 h-10 rounded font-medium transition-all duration-200 ${
                selectedLetter === null
                  ? 'bg-mythic-primary-500 text-mythic-dark-900'
                  : 'bg-mythic-dark-900 text-mythic-text-muted hover:text-mythic-text-primary border border-mythic-primary-500/20'
              }`}
            >
              All
            </button>
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-10 h-10 rounded font-medium transition-all duration-200 ${
                  selectedLetter === letter
                    ? 'bg-mythic-primary-500 text-mythic-dark-900'
                    : 'bg-mythic-dark-900 text-mythic-text-muted hover:text-mythic-text-primary border border-mythic-primary-500/20'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Terms Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTerms.map((item, index) => (
              <motion.div
                key={item.term}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-lg p-6 border border-mythic-primary-500/20"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Book className="h-5 w-5 text-mythic-primary-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-mythic-text-primary mb-1">
                      {item.term}
                    </h3>
                    <p className="text-xs text-mythic-accent-300 mb-3">
                      {item.category}
                    </p>
                  </div>
                </div>
                
                <p className="text-mythic-text-muted text-sm leading-relaxed mb-3">
                  {item.definition}
                </p>
                
                {item.relatedTerms && item.relatedTerms.length > 0 && (
                  <div className="pt-3 border-t border-mythic-primary-500/10">
                    <p className="text-xs text-mythic-text-muted mb-2">Related terms:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.relatedTerms.map((related) => (
                        <button
                          key={related}
                          onClick={() => {
                            setSearchTerm(related)
                            setSelectedCategory('All')
                            setSelectedLetter(null)
                          }}
                          className="text-xs px-2 py-1 rounded bg-mythic-dark-900 text-mythic-primary-500 hover:bg-mythic-primary-500/10 transition-colors"
                        >
                          {related}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-mythic-text-muted text-lg">
                No terms found matching your search. Try different keywords or browse all categories.
              </p>
            </div>
          )}

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 glass rounded-2xl p-8 border border-mythic-primary-500/20"
          >
            <h3 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              Ready to dive deeper?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/learn/our-mission"
                className="glass rounded-lg p-4 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all duration-200 group"
              >
                <h4 className="font-semibold text-mythic-text-primary mb-2 group-hover:text-mythic-primary-500 transition-colors">
                  Learn Our Mission
                </h4>
                <p className="text-sm text-mythic-text-muted">
                  Understand the problem we're solving and our vision
                </p>
              </Link>
              
              <Link
                href="/learn/our-process"
                className="glass rounded-lg p-4 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all duration-200 group"
              >
                <h4 className="font-semibold text-mythic-text-primary mb-2 group-hover:text-mythic-primary-500 transition-colors">
                  Explore Our Process
                </h4>
                <p className="text-sm text-mythic-text-muted">
                  See how we convert waste oil into clean fuel
                </p>
              </Link>
              
              <Link
                href="/learn/faq"
                className="glass rounded-lg p-4 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all duration-200 group"
              >
                <h4 className="font-semibold text-mythic-text-primary mb-2 group-hover:text-mythic-primary-500 transition-colors">
                  Browse FAQs
                </h4>
                <p className="text-sm text-mythic-text-muted">
                  Get answers to frequently asked questions
                </p>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/dao"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
              >
                Join the DAO
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
