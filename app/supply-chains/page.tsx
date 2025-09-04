'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight,
  Filter,
  Recycle,
  Droplets,
  Shirt,
  Building,
  Cpu,
  Leaf,
  Search
} from 'lucide-react'
import { pageContent } from '@/config/brand.config'

const categoryIcons = {
  'Plastics to Monomers/Oils': Recycle,
  'Food & Ag Waste': Leaf,
  'Textiles': Shirt,
  'Wastewater & Sludge': Droplets,
  'C&D Waste': Building,
  'E-waste': Cpu
}

// Mock supply chain data
const mockChains = [
  {
    id: 'pet-depolymerization',
    category: 'Plastics to Monomers/Oils',
    title: 'PET Depolymerization',
    input: 'PET bottles & containers',
    output: 'Terephthalic acid & Ethylene glycol',
    yield: '92-95%',
    capex: '£2.5M - £5M',
    location: 'UK/EU',
    status: 'operational'
  },
  {
    id: 'food-waste-biogas',
    category: 'Food & Ag Waste',
    title: 'Food Waste to Biogas',
    input: 'Restaurant & retail food waste',
    output: 'Biomethane & digestate',
    yield: '85-90%',
    capex: '£1M - £3M',
    location: 'UK',
    status: 'operational'
  },
  {
    id: 'cotton-glucose',
    category: 'Textiles',
    title: 'Cotton to Glucose',
    input: 'Post-consumer cotton textiles',
    output: 'Glucose syrup for biochemicals',
    yield: '78-82%',
    capex: '£3M - £6M',
    location: 'EU',
    status: 'pilot'
  },
  {
    id: 'struvite-recovery',
    category: 'Wastewater & Sludge',
    title: 'Struvite Recovery',
    input: 'Wastewater treatment sludge',
    output: 'Struvite fertilizer',
    yield: '88-92%',
    capex: '£1.5M - £4M',
    location: 'UK/EU',
    status: 'operational'
  }
]

export default function SupplyChainsPage() {
  const { supplyChains } = pageContent
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChains = mockChains.filter(chain => {
    if (selectedCategory && chain.category !== selectedCategory) return false
    if (searchTerm && !chain.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

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
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                {supplyChains.hero.title}
              </span>
            </h1>
            <p className="text-xl text-mythic-text-muted mb-8">
              {supplyChains.hero.subtitle}
            </p>
            <p className="text-mythic-text-muted">
              {supplyChains.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {supplyChains.categories.map((category, index) => {
              const Icon = categoryIcons[category.title as keyof typeof categoryIcons] || Recycle
              
              return (
                <motion.button
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.title ? null : category.title
                  )}
                  className={cn(
                    "glass rounded-lg p-4 border transition-all text-left",
                    selectedCategory === category.title
                      ? "border-mythic-primary-500 bg-mythic-primary-500/10"
                      : "border-mythic-primary-500/10 hover:border-mythic-primary-500/30"
                  )}
                >
                  <Icon className="h-8 w-8 text-mythic-primary-500 mb-2" />
                  <h3 className="font-semibold text-sm text-mythic-text-primary mb-1">
                    {category.title}
                  </h3>
                  <p className="text-xs text-mythic-text-muted">
                    {category.body}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-6 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-mythic-text-muted" />
              <input
                type="text"
                placeholder="Search supply chains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-mythic-dark-900/50 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary placeholder-mythic-text-muted focus:outline-none focus:border-mythic-primary-500/50"
              />
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 text-sm text-mythic-primary-500 hover:text-mythic-accent-300 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Supply Chains Grid */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredChains.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-mythic-text-muted">
                No loops match your filters. Broaden specs or propose a new loop.
              </p>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 mt-4 text-mythic-primary-500 hover:text-mythic-accent-300 transition-colors"
              >
                Propose a new loop
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChains.map((chain, index) => {
                const Icon = categoryIcons[chain.category as keyof typeof categoryIcons] || Recycle
                
                return (
                  <motion.div
                    key={chain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="glass rounded-xl p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="h-8 w-8 text-mythic-primary-500" />
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        chain.status === 'operational' 
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {chain.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-mythic-text-primary mb-2">
                      {chain.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4 flex-grow">
                      <div>
                        <span className="text-xs text-mythic-text-muted">Input:</span>
                        <p className="text-sm text-mythic-text-primary">{chain.input}</p>
                      </div>
                      <div>
                        <span className="text-xs text-mythic-text-muted">Output:</span>
                        <p className="text-sm text-mythic-text-primary">{chain.output}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-mythic-primary-500/10">
                      <div>
                        <span className="text-xs text-mythic-text-muted">Yield</span>
                        <p className="text-sm font-semibold text-mythic-accent-300">{chain.yield}</p>
                      </div>
                      <div>
                        <span className="text-xs text-mythic-text-muted">CAPEX</span>
                        <p className="text-sm font-semibold text-mythic-text-primary">{chain.capex}</p>
                      </div>
                    </div>
                    
                    <Link
                      href={`/supply-chains/${chain.id}`}
                      className="inline-flex items-center gap-2 mt-4 text-mythic-primary-500 hover:text-mythic-accent-300 transition-colors text-sm font-medium"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
