'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronDown, 
  ChevronRight,
  Search,
  HelpCircle,
  Droplets,
  Coins,
  Users,
  Shield,
  TrendingUp,
  Leaf
} from 'lucide-react'

// export const metadata: Metadata = {
//   title: 'FAQ - Frequently Asked Questions | Genesis Reloop',
//   description: 'Find answers to common questions about Genesis Reloop, UCO recycling, biodiesel production, DAOs, and our circular economy model.',
// }

interface FAQItem {
  question: string
  answer: string
  category: string
  icon: React.ReactNode
}

const faqData: FAQItem[] = [
  // General Questions
  {
    question: "What is Genesis Reloop?",
    answer: "Genesis Reloop is a decentralized autonomous organization (DAO) that converts used cooking oil (UCO) into biodiesel. We're building a community-owned circular economy that tackles waste, creates green energy, and generates value for all participants.",
    category: "General",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    question: "How does Genesis Reloop work?",
    answer: "We collect used cooking oil from restaurants and food businesses, process it in our biodiesel facilities, and sell the clean fuel to transportation companies. The profits are distributed to token holders who stake their tokens, while the DAO votes on expanding operations.",
    category: "General",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    question: "Why blockchain and Web3?",
    answer: "Blockchain ensures complete transparency in our operations, from waste collection to profit distribution. Smart contracts automate payments and governance, while the DAO structure gives every token holder a voice in decisions. This creates trust and aligns incentives across all participants.",
    category: "General",
    icon: <HelpCircle className="h-5 w-5" />
  },
  
  // UCO & Biodiesel Questions
  {
    question: "What is used cooking oil (UCO)?",
    answer: "Used cooking oil is the waste oil from restaurants, cafeterias, and food processing facilities. Instead of being poured down drains (causing blockages) or thrown away (polluting soil), UCO can be converted into valuable biodiesel fuel.",
    category: "UCO & Biodiesel",
    icon: <Droplets className="h-5 w-5" />
  },
  {
    question: "How much oil does a typical restaurant produce?",
    answer: "A medium-sized restaurant typically produces 100-300 liters of used cooking oil per month. Fast food restaurants can produce 500+ liters. This varies based on menu type, with fried food establishments producing the most.",
    category: "UCO & Biodiesel",
    icon: <Droplets className="h-5 w-5" />
  },
  {
    question: "Is biodiesel really better for the environment?",
    answer: "Yes! Biodiesel from UCO reduces greenhouse gas emissions by 84% compared to fossil diesel. It's biodegradable, non-toxic, and prevents water contamination. Plus, it recycles carbon already in the atmosphere rather than releasing new carbon from underground.",
    category: "UCO & Biodiesel",
    icon: <Droplets className="h-5 w-5" />
  },
  {
    question: "Can any diesel engine use biodiesel?",
    answer: "Most modern diesel engines can use B20 (20% biodiesel blend) without modification. Many can use B100 (pure biodiesel) with minor adjustments. Always check manufacturer specifications, but biodiesel is widely compatible.",
    category: "UCO & Biodiesel",
    icon: <Droplets className="h-5 w-5" />
  },
  
  // Token & DAO Questions
  {
    question: "What is a DAO?",
    answer: "A Decentralized Autonomous Organization (DAO) is a community-led entity with no central authority. Members vote on all major decisions using tokens. Think of it as a company owned and operated by its community, with all decisions made transparently on the blockchain.",
    category: "Token & DAO",
    icon: <Coins className="h-5 w-5" />
  },
  {
    question: "What can I do with Genesis Reloop tokens?",
    answer: "Genesis Reloop tokens give you: 1) Voting rights on DAO decisions, 2) Staking rewards from protocol revenues, 3) Priority access to new opportunities, 4) Proportional claim on environmental impact. The more tokens you hold, the greater your influence and rewards.",
    category: "Token & DAO",
    icon: <Coins className="h-5 w-5" />
  },
  {
    question: "How are staking rewards calculated?",
    answer: "30% of all protocol revenues (from biodiesel sales, carbon credits, and glycerin) are distributed to stakers proportionally. If you stake 1% of all staked tokens, you receive 1% of the rewards. Rewards are distributed monthly.",
    category: "Token & DAO",
    icon: <Coins className="h-5 w-5" />
  },
  {
    question: "Is this a security?",
    answer: "Genesis Reloop tokens are utility tokens that provide governance rights and access to protocol services. They're not designed as investments or securities. Always consult legal and tax advisors in your jurisdiction.",
    category: "Token & DAO",
    icon: <Coins className="h-5 w-5" />
  },
  
  // Partnership Questions
  {
    question: "How can my restaurant participate?",
    answer: "Simply sign up through our platform! We provide free collection containers and schedule regular pickups. You get a green certification, potential tax benefits, and the satisfaction of converting waste into clean energy. No cost to join.",
    category: "Partnerships",
    icon: <Users className="h-5 w-5" />
  },
  {
    question: "What if I want to invest in a facility?",
    answer: "The DAO regularly votes on funding new biodiesel facilities. Token holders can propose locations and business plans. Approved projects receive funding from the treasury, with returns flowing back to benefit all token holders.",
    category: "Partnerships",
    icon: <Users className="h-5 w-5" />
  },
  {
    question: "Can I become a UCO collector?",
    answer: "Yes! We partner with local collectors who manage restaurant relationships and logistics. You'll need proper licensing and equipment, but we provide training and guaranteed purchase agreements for collected oil.",
    category: "Partnerships",
    icon: <Users className="h-5 w-5" />
  },
  
  // Security & Trust Questions
  {
    question: "How secure is the platform?",
    answer: "Our smart contracts are audited by leading security firms. The treasury uses multi-signature wallets requiring multiple approvals for any transaction. All code is open-source for community verification.",
    category: "Security & Trust",
    icon: <Shield className="h-5 w-5" />
  },
  {
    question: "What blockchain does Genesis Reloop use?",
    answer: "We're deployed on [Blockchain TBD - likely Polygon or Base], chosen for its low transaction costs and environmental efficiency. This ensures accessibility while maintaining security and decentralization.",
    category: "Security & Trust",
    icon: <Shield className="h-5 w-5" />
  },
  {
    question: "How can I verify the impact claims?",
    answer: "All operations are recorded on-chain: oil collected, biodiesel produced, carbon credits generated. Our dashboard shows real-time metrics with blockchain verification. Third-party auditors verify our environmental impact annually.",
    category: "Security & Trust",
    icon: <Shield className="h-5 w-5" />
  },
  
  // Financial Questions
  {
    question: "How does Genesis Reloop make money?",
    answer: "Revenue comes from: 1) Biodiesel sales to fleet operators, 2) Carbon credit sales, 3) Glycerin by-product sales, 4) Tipping fees from waste generators. All revenue flows through smart contracts with automatic distribution.",
    category: "Financial",
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    question: "What are the costs involved?",
    answer: "Main costs include: collection logistics, processing facility operations, and technology development. Our efficient model and economies of scale keep costs low, with detailed financials available in our documentation.",
    category: "Financial",
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    question: "When can I expect returns from staking?",
    answer: "Staking rewards are distributed monthly based on protocol revenues. The amount varies with biodiesel sales and operational scale. As more facilities come online, total rewards increase.",
    category: "Financial",
    icon: <TrendingUp className="h-5 w-5" />
  },
  
  // Environmental Questions
  {
    question: "How is the environmental impact measured?",
    answer: "We track: liters of UCO diverted from waste, liters of biodiesel produced, CO₂ emissions reduced, water contamination prevented, and jobs created. All metrics follow international standards and are third-party verified.",
    category: "Environmental",
    icon: <Leaf className="h-5 w-5" />
  },
  {
    question: "What happens to the glycerin by-product?",
    answer: "Glycerin from biodiesel production is sold for use in cosmetics, pharmaceuticals, and industrial applications. This creates additional revenue while ensuring zero waste from our process.",
    category: "Environmental",
    icon: <Leaf className="h-5 w-5" />
  },
  {
    question: "How does this help fight climate change?",
    answer: "By replacing fossil diesel with biodiesel from waste, we prevent new carbon extraction while recycling existing carbon. Each liter of biodiesel saves approximately 2.5 kg of CO₂ emissions.",
    category: "Environmental",
    icon: <Leaf className="h-5 w-5" />
  }
]

const categories = [
  { name: "All", icon: <HelpCircle className="h-5 w-5" /> },
  { name: "General", icon: <HelpCircle className="h-5 w-5" /> },
  { name: "UCO & Biodiesel", icon: <Droplets className="h-5 w-5" /> },
  { name: "Token & DAO", icon: <Coins className="h-5 w-5" /> },
  { name: "Partnerships", icon: <Users className="h-5 w-5" /> },
  { name: "Security & Trust", icon: <Shield className="h-5 w-5" /> },
  { name: "Financial", icon: <TrendingUp className="h-5 w-5" /> },
  { name: "Environmental", icon: <Leaf className="h-5 w-5" /> }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h1>
          
          <p className="text-xl text-mythic-text-muted text-center mb-12 max-w-3xl mx-auto">
            Find answers to common questions about Genesis Reloop, our circular economy model, 
            and how you can participate in the waste-to-energy revolution.
          </p>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mythic-text-muted" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary placeholder-mythic-text-muted focus:outline-none focus:border-mythic-primary-500/50 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900'
                    : 'bg-mythic-dark-900 text-mythic-text-muted hover:text-mythic-text-primary border border-mythic-primary-500/20'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredFAQs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-lg border border-mythic-primary-500/20 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-mythic-dark-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-mythic-primary-500">{item.icon}</span>
                      <h3 className="font-semibold text-mythic-text-primary">{item.question}</h3>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-mythic-text-muted transition-transform duration-200 ${
                        expandedItems.has(index) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.has(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <p className="text-mythic-text-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-mythic-text-muted text-lg">
                No questions found matching your search. Try different keywords or browse all categories.
              </p>
            </div>
          )}

          {/* Still have questions? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center glass rounded-2xl p-8 border border-mythic-primary-500/20"
          >
            <h3 className="text-2xl font-bold text-mythic-text-primary mb-4">
              Still have questions?
            </h3>
            <p className="text-mythic-text-muted mb-6">
              Can't find what you're looking for? Our community is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/community"
                className="px-6 py-3 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
              >
                Join Our Community
              </Link>
              <Link
                href="/learn/glossary"
                className="px-6 py-3 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                View Glossary
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
