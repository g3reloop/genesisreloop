'use client'

import { motion } from 'framer-motion'
import { Leaf, Droplet, TrendingUp, Package, Truck, CheckCircle, ArrowRight, Filter } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type ProductType = 'digestate' | 'glycerol'

interface Listing {
  id: string
  type: ProductType
  title: string
  quantity: string
  price: string
  location: string
  quality: string
  seller: string
  available: string
}

export default function SecondaryProductsExchange() {
  const [activeTab, setActiveTab] = useState<ProductType>('digestate')
  const [showFilters, setShowFilters] = useState(false)

  const listings: Listing[] = [
    {
      id: 'DIG-001',
      type: 'digestate',
      title: 'High-N Digestate - Bulk',
      quantity: '50 tonnes',
      price: '£12/tonne',
      location: 'Brighton Node',
      quality: 'N: 4.2%, P: 1.8%, K: 2.1%',
      seller: 'Brighton Community Energy',
      available: 'Immediate'
    },
    {
      id: 'DIG-002',
      type: 'digestate',
      title: 'Bagged Digestate - Retail Ready',
      quantity: '200 x 25kg bags',
      price: '£4.50/bag',
      location: 'Manchester Node',
      quality: 'N: 3.8%, P: 1.6%, K: 2.0%',
      seller: 'Manchester Loop Co-op',
      available: '3 days'
    },
    {
      id: 'GLY-001',
      type: 'glycerol',
      title: 'Crude Glycerol 80%',
      quantity: '5,000 L',
      price: '£0.28/L',
      location: 'Bristol Node',
      quality: '80% purity, FFA < 2%',
      seller: 'Bristol Biodiesel Collective',
      available: 'Weekly batches'
    },
    {
      id: 'GLY-002',
      type: 'glycerol',
      title: 'Refined Glycerol 95%+',
      quantity: '1,000 L',
      price: '£0.65/L',
      location: 'Leeds Node',
      quality: '95%+ purity, cosmetic grade',
      seller: 'Yorkshire Energy Loop',
      available: 'On demand'
    }
  ]

  const filteredListings = listings.filter(listing => listing.type === activeTab)

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
              Secondary Products Exchange
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Digestate fertilizer and glycerol byproducts find their value here. 
            Close the loop, capture the worth.
          </p>
        </motion.div>

        {/* Product Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-mythic-dark-900 rounded-lg p-1 border border-mythic-primary-500/20">
            <button
              onClick={() => setActiveTab('digestate')}
              className={`px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'digestate'
                  ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                  : 'text-mythic-text-muted hover:text-mythic-text-primary'
              }`}
            >
              <Leaf className="h-4 w-4" />
              Digestate → Fertilizer
            </button>
            <button
              onClick={() => setActiveTab('glycerol')}
              className={`px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'glycerol'
                  ? 'bg-mythic-accent-300/20 text-mythic-accent-300'
                  : 'text-mythic-text-muted hover:text-mythic-text-primary'
              }`}
            >
              <Droplet className="h-4 w-4" />
              Glycerol → Value
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-mythic-text-primary flex items-center gap-2">
                  <Filter className="h-4 w-4 text-mythic-primary-500" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-mythic-text-muted"
                >
                  {showFilters ? '−' : '+'}
                </button>
              </div>
              
              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Distance Filter */}
                <div>
                  <label className="block text-sm font-medium text-mythic-text-primary mb-2">
                    Distance
                  </label>
                  <select className="w-full px-3 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary text-sm focus:border-mythic-primary-500 focus:outline-none">
                    <option>Within 50km</option>
                    <option>Within 100km</option>
                    <option>Within 200km</option>
                    <option>Any distance</option>
                  </select>
                </div>

                {/* Quantity Filter */}
                <div>
                  <label className="block text-sm font-medium text-mythic-text-primary mb-2">
                    Minimum Quantity
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === 'digestate' ? 'tonnes' : 'litres'}
                    className="w-full px-3 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary text-sm placeholder-mythic-text-muted focus:border-mythic-primary-500 focus:outline-none"
                  />
                </div>

                {/* Quality Filter */}
                {activeTab === 'digestate' ? (
                  <div>
                    <label className="block text-sm font-medium text-mythic-text-primary mb-2">
                      Nutrient Content
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        High Nitrogen ({'>'}4%)
                      </label>
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Balanced NPK
                      </label>
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Organic certified
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-mythic-text-primary mb-2">
                      Purity Level
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Crude (70-85%)
                      </label>
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Technical (85-95%)
                      </label>
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Refined ({'>'}95%)
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Type (Digestate only) */}
                {activeTab === 'digestate' && (
                  <div>
                    <label className="block text-sm font-medium text-mythic-text-primary mb-2">
                      Form
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Liquid/slurry
                      </label>
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Dried/pelletized
                      </label>
                      <label className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <input type="checkbox" className="rounded border-mythic-primary-500/20" />
                        Bagged retail
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
              <h4 className="font-semibold text-mythic-primary-500 mb-2 text-sm">
                {activeTab === 'digestate' ? 'Digestate Benefits' : 'Glycerol Uses'}
              </h4>
              {activeTab === 'digestate' ? (
                <ul className="space-y-1 text-xs text-mythic-text-muted">
                  <li>• Improves soil structure</li>
                  <li>• Slow-release nutrients</li>
                  <li>• Increases water retention</li>
                  <li>• Builds soil carbon</li>
                </ul>
              ) : (
                <ul className="space-y-1 text-xs text-mythic-text-muted">
                  <li>• Cosmetics & soaps</li>
                  <li>• Animal feed supplement</li>
                  <li>• Industrial solvents</li>
                  <li>• Co-digestion feedstock</li>
                </ul>
              )}
            </div>
          </motion.div>

          {/* Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-mythic-text-primary">
                Available {activeTab === 'digestate' ? 'Digestate' : 'Glycerol'}
              </h2>
              <Link
                href="/secondary/list"
                className="px-4 py-2 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 text-sm"
              >
                List Your Byproduct
              </Link>
            </div>

            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-6 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-mythic-text-primary mb-1">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-mythic-text-muted">{listing.seller}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                          listing.type === 'digestate'
                            ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                            : 'bg-mythic-accent-300/20 text-mythic-accent-300'
                        }`}>
                          {listing.id}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-mythic-text-muted mb-1">Quantity Available</p>
                          <p className="font-semibold text-mythic-text-primary">{listing.quantity}</p>
                        </div>
                        <div>
                          <p className="text-mythic-text-muted mb-1">Location</p>
                          <p className="font-semibold text-mythic-text-primary flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            {listing.location}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-mythic-text-muted mb-1">Quality Specs</p>
                          <p className="font-mono text-xs text-mythic-primary-500">{listing.quality}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action */}
                    <div className="flex flex-col justify-between">
                      <div className="text-right mb-4">
                        <p className="text-3xl font-bold text-mythic-accent-300">{listing.price}</p>
                        <p className="text-sm text-mythic-text-muted mt-1">
                          Available: {listing.available}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all font-semibold text-sm">
                          Contact Seller
                        </button>
                        <button className="w-full px-4 py-2 text-mythic-text-muted hover:text-mythic-text-primary transition-colors text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Market Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="glass rounded-lg p-4 border border-mythic-primary-500/10 text-center">
                <div className="text-2xl font-bold text-mythic-primary-500">
                  {activeTab === 'digestate' ? '2,450' : '18,500'}
                </div>
                <div className="text-xs text-mythic-text-muted">
                  {activeTab === 'digestate' ? 'tonnes traded' : 'litres traded'}
                </div>
              </div>
              <div className="glass rounded-lg p-4 border border-mythic-accent-300/10 text-center">
                <div className="text-2xl font-bold text-mythic-accent-300">
                  {activeTab === 'digestate' ? '£14.20' : '£0.42'}
                </div>
                <div className="text-xs text-mythic-text-muted">
                  avg price/{activeTab === 'digestate' ? 'tonne' : 'L'}
                </div>
              </div>
              <div className="glass rounded-lg p-4 border border-flow-credits/10 text-center">
                <div className="text-2xl font-bold text-flow-credits">
                  {activeTab === 'digestate' ? '47' : '23'}
                </div>
                <div className="text-xs text-mythic-text-muted">
                  active listings
                </div>
              </div>
              <div className="glass rounded-lg p-4 border border-mythic-primary-500/10 text-center">
                <div className="text-2xl font-bold text-mythic-primary-500 flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {activeTab === 'digestate' ? '+28%' : '+15%'}
                </div>
                <div className="text-xs text-mythic-text-muted">
                  volume MoM
                </div>
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-mythic-primary-500 mb-2">
                    {activeTab === 'digestate' 
                      ? 'Digestate Quality Assured' 
                      : 'Glycerol Traceability'
                    }
                  </h3>
                  <p className="text-sm text-mythic-text-muted">
                    {activeTab === 'digestate'
                      ? 'All digestate is tested for NPK content, heavy metals, and pathogens. Lab reports available on request. PAS110 compliance where applicable.'
                      : 'Every batch tracked from UCO source through processing. FFA levels, methanol content, and purity verified. Full chain of custody documentation.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-mythic-text-primary mb-6">
            Turn waste streams into value streams
          </h3>
          <p className="text-mythic-text-muted mb-8 max-w-2xl mx-auto">
            Connect directly with other loop operators. No middlemen, no markup. 
            Just community members trading what they produce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/secondary/list"
              className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200"
            >
              List Your Byproduct
            </Link>
            <Link
              href="/processors"
              className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
            >
              Find Processors
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
