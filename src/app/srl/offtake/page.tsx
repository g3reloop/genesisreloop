'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { OfftakeAgreement } from '@/types/srl-domain'

type OfftakeProduct = {
  id: string
  custodianId: string
  custodianName: string
  productType: 'electricity_kwh' | 'digestate_tonnes' | 'recycled_material' | 'biogas_m3'
  availableQuantity: number
  unit: string
  pricePerUnit: number
  currency: string
  location: string
  qualitySpecs: {
    purity?: number
    npkRatio?: string
    calorificValue?: number
    moisture?: number
  }
  minOrderQuantity: number
  deliveryOptions: string[]
  certifications: string[]
  productionDate: string
  expiryDate?: string
}

// Mock data for demo
const mockProducts: OfftakeProduct[] = [
  {
    id: 'prod-001',
    custodianId: 'custodian-001',
    custodianName: 'Genesis Energy Hub',
    productType: 'electricity_kwh',
    availableQuantity: 50000,
    unit: 'kWh',
    pricePerUnit: 0.12,
    currency: 'GBP',
    location: 'Manchester, UK',
    qualitySpecs: {
      calorificValue: 3.6
    },
    minOrderQuantity: 1000,
    deliveryOptions: ['Grid Feed-in', 'Direct Connection'],
    certifications: ['REGO', 'Carbon Neutral'],
    productionDate: new Date().toISOString()
  },
  {
    id: 'prod-002',
    custodianId: 'custodian-002',
    custodianName: 'BioLoop Processing',
    productType: 'digestate_tonnes',
    availableQuantity: 150,
    unit: 'tonnes',
    pricePerUnit: 45,
    currency: 'GBP',
    location: 'Birmingham, UK',
    qualitySpecs: {
      npkRatio: '3-2-5',
      moisture: 15
    },
    minOrderQuantity: 10,
    deliveryOptions: ['Bulk Delivery', 'Bagged (25kg)', 'Collection'],
    certifications: ['Organic', 'PAS110'],
    productionDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod-003',
    custodianId: 'custodian-003',
    custodianName: 'CleanTech Refineries',
    productType: 'biogas_m3',
    availableQuantity: 10000,
    unit: 'm³',
    pricePerUnit: 0.85,
    currency: 'GBP',
    location: 'Leeds, UK',
    qualitySpecs: {
      purity: 98.5,
      calorificValue: 35.8
    },
    minOrderQuantity: 500,
    deliveryOptions: ['Pipeline', 'Compressed Tanker'],
    certifications: ['RTFO', 'Green Gas Certification'],
    productionDate: new Date().toISOString()
  }
]

const PRODUCT_LABELS = {
  electricity_kwh: { name: 'Green Electricity', icon: '⚡', color: 'text-yellow-400' },
  digestate_tonnes: { name: 'Organic Digestate', icon: '🌱', color: 'text-green-400' },
  recycled_material: { name: 'Recycled Material', icon: '♻️', color: 'text-blue-400' },
  biogas_m3: { name: 'Biogas', icon: '🔥', color: 'text-orange-400' }
}

export default function OfftakeMarketplace() {
  const [products] = useState<OfftakeProduct[]>(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<OfftakeProduct | null>(null)
  const [showBidModal, setShowBidModal] = useState(false)
  const [bidDetails, setBidDetails] = useState({
    quantity: 0,
    pricePerUnit: 0,
    deliveryDate: '',
    notes: ''
  })
  const [agreements, setAgreements] = useState<OfftakeAgreement[]>([])
  const [filterType, setFilterType] = useState<string>('all')

  const filteredProducts = filterType === 'all' 
    ? products 
    : products.filter(p => p.productType === filterType)

  const handleCreateBid = () => {
    if (!selectedProduct) return

    const agreement: OfftakeAgreement = {
      agreementId: `agreement-${Date.now()}`,
      custodianId: selectedProduct.custodianId,
      offtakerId: 'offtaker-001', // Would come from auth
      productType: selectedProduct.productType,
      quantity: bidDetails.quantity,
      unit: selectedProduct.unit,
      pricePerUnit: bidDetails.pricePerUnit,
      currency: selectedProduct.currency,
      deliverySchedule: {
        startDate: bidDetails.deliveryDate,
        endDate: bidDetails.deliveryDate,
        frequency: 'on_demand'
      },
      status: 'draft'
    }

    setAgreements([...agreements, agreement])
    setShowBidModal(false)
    setBidDetails({ quantity: 0, pricePerUnit: 0, deliveryDate: '', notes: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-8 border border-mythic-primary/20 mb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-mythic-primary mb-2">
              Offtake Marketplace
            </h1>
            <p className="text-white/70">
              Purchase energy and materials from verified SRL processing facilities
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-mythic-primary/20 text-mythic-primary border border-mythic-primary/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              All Products
            </button>
            {Object.entries(PRODUCT_LABELS).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === type
                    ? 'bg-mythic-primary/20 text-mythic-primary border border-mythic-primary/30'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{label.icon}</span>
                {label.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const label = PRODUCT_LABELS[product.productType]
              return (
                <div 
                  key={product.id}
                  className="bg-black/30 rounded-lg p-6 border border-white/10 hover:border-mythic-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className={`text-3xl mb-2 ${label.color}`}>
                        {label.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {label.name}
                      </h3>
                      <p className="text-sm text-white/60">
                        by {product.custodianName}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-mythic-primary">
                        £{product.pricePerUnit}
                      </div>
                      <div className="text-sm text-white/60">
                        per {product.unit}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Available</span>
                      <span className="text-white font-medium">
                        {product.availableQuantity.toLocaleString()} {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Min. Order</span>
                      <span className="text-white font-medium">
                        {product.minOrderQuantity} {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Location</span>
                      <span className="text-white font-medium">
                        {product.location}
                      </span>
                    </div>
                  </div>

                  {/* Quality Specs */}
                  {Object.entries(product.qualitySpecs).length > 0 && (
                    <div className="mb-4 pt-4 border-t border-white/10">
                      <p className="text-xs font-semibold text-white/60 mb-2">
                        QUALITY SPECIFICATIONS
                      </p>
                      <div className="space-y-1">
                        {product.qualitySpecs.purity && (
                          <div className="text-sm">
                            <span className="text-white/60">Purity:</span>{' '}
                            <span className="text-white">{product.qualitySpecs.purity}%</span>
                          </div>
                        )}
                        {product.qualitySpecs.npkRatio && (
                          <div className="text-sm">
                            <span className="text-white/60">NPK:</span>{' '}
                            <span className="text-white">{product.qualitySpecs.npkRatio}</span>
                          </div>
                        )}
                        {product.qualitySpecs.calorificValue && (
                          <div className="text-sm">
                            <span className="text-white/60">Calorific:</span>{' '}
                            <span className="text-white">{product.qualitySpecs.calorificValue} MJ</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.certifications.map((cert) => (
                      <span 
                        key={cert}
                        className="text-xs px-2 py-1 bg-mythic-primary/10 text-mythic-primary rounded"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  <Button 
                    onClick={() => {
                      setSelectedProduct(product)
                      setBidDetails(prev => ({ ...prev, pricePerUnit: product.pricePerUnit }))
                      setShowBidModal(true)
                    }}
                    className="w-full"
                  >
                    Place Bid
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Agreements */}
        {agreements.length > 0 && (
          <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-8 border border-mythic-primary/20">
            <h2 className="text-xl font-bold text-white mb-6">Your Agreements</h2>
            <div className="space-y-4">
              {agreements.map((agreement) => (
                <div 
                  key={agreement.agreementId}
                  className="bg-black/30 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">
                        {PRODUCT_LABELS[agreement.productType].name}
                      </h3>
                      <p className="text-sm text-white/60">
                        {agreement.quantity} {agreement.unit} @ £{agreement.pricePerUnit}/{agreement.unit}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      agreement.status === 'active' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {agreement.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bid Modal */}
        {showBidModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={() => setShowBidModal(false)}>
            <div className="bg-mythic-obsidian/90 rounded-2xl p-6 max-w-lg w-full border border-mythic-primary/30"
                 onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-mythic-primary mb-4">
                Create Offtake Agreement
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/60 mb-1">Product</p>
                  <p className="text-lg font-semibold text-white">
                    {PRODUCT_LABELS[selectedProduct.productType].icon} {PRODUCT_LABELS[selectedProduct.productType].name}
                  </p>
                  <p className="text-sm text-white/60">
                    from {selectedProduct.custodianName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Quantity ({selectedProduct.unit})
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                    min={selectedProduct.minOrderQuantity}
                    max={selectedProduct.availableQuantity}
                    value={bidDetails.quantity}
                    onChange={e => setBidDetails({...bidDetails, quantity: Number(e.target.value)})}
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Min: {selectedProduct.minOrderQuantity} | Max: {selectedProduct.availableQuantity}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Price per {selectedProduct.unit} (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                    value={bidDetails.pricePerUnit}
                    onChange={e => setBidDetails({...bidDetails, pricePerUnit: Number(e.target.value)})}
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Current ask: £{selectedProduct.pricePerUnit}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                    value={bidDetails.deliveryDate}
                    onChange={e => setBidDetails({...bidDetails, deliveryDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                    rows={3}
                    placeholder="Special requirements, delivery instructions..."
                    value={bidDetails.notes}
                    onChange={e => setBidDetails({...bidDetails, notes: e.target.value})}
                  />
                </div>

                {bidDetails.quantity > 0 && (
                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-sm text-white/60">Total Value</p>
                    <p className="text-2xl font-bold text-mythic-primary">
                      £{(bidDetails.quantity * bidDetails.pricePerUnit).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="ghost" onClick={() => setShowBidModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateBid}
                  disabled={!bidDetails.quantity || !bidDetails.deliveryDate}
                  className="flex-1"
                >
                  Submit Bid
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
