'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import {
  Package,
  Filter,
  Plus,
  TrendingUp,
  Droplet,
  Flame,
  Leaf,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

// Mock data for feedstock batches
const mockBatches = [
  {
    id: '1',
    batchCode: 'UCO-2024-001',
    node: 'Community Kitchen Co-op',
    type: 'UCO',
    quantity: 450,
    fatContent: 85,
    loopType: 'SRL',
    status: 'REGISTERED',
    price: 0.65,
    location: 'London',
    createdAt: new Date('2024-01-15'),
    girmProof: 'GIRM-2024-001-ABC'
  },
  {
    id: '2',
    batchCode: 'FW-2024-002',
    node: 'Local Food Network',
    type: 'FOOD_WASTE',
    quantity: 800,
    loopType: 'SRL',
    status: 'ASSIGNED',
    price: 0.45,
    location: 'Manchester',
    createdAt: new Date('2024-01-14'),
    girmProof: 'GIRM-2024-002-DEF'
  },
  {
    id: '3',
    batchCode: 'UCO-2024-003',
    node: 'Corporate Chain (overflow)',
    type: 'UCO',
    quantity: 320,
    fatContent: 78,
    loopType: 'CRL',
    status: 'REGISTERED',
    price: 0.55,
    location: 'Birmingham',
    createdAt: new Date('2024-01-13'),
    girmProof: 'pending'
  }
]

// Mock secondary products
const mockSecondaryProducts = [
  {
    id: '1',
    productType: 'BIODIESEL',
    quantity: 5000,
    unit: 'liters',
    price: 1.25,
    processor: 'BioFuel Solutions Ltd',
    status: 'AVAILABLE',
    carbonSaved: 12.5
  },
  {
    id: '2',
    productType: 'GLYCERIN',
    quantity: 800,
    unit: 'kg',
    price: 0.85,
    processor: 'Green Processing Co',
    status: 'AVAILABLE',
    carbonSaved: 2.1
  },
  {
    id: '3',
    productType: 'DIGESTATE',
    quantity: 2500,
    unit: 'kg',
    price: 0.15,
    processor: 'Circular Bio Plant',
    status: 'RESERVED',
    carbonSaved: 3.8
  }
]

const typeIcons = {
  UCO: Droplet,
  FOOD_WASTE: Leaf,
  BIODIESEL: Flame,
  GLYCERIN: Package,
  DIGESTATE: Leaf
}

const statusColors = {
  REGISTERED: 'text-mythic-primary-500',
  ASSIGNED: 'text-mythic-accent-500',
  AVAILABLE: 'text-mythic-secondary-500',
  RESERVED: 'text-mythic-accent-500',
  SOLD: 'text-mythic-dark-500'
}

const statusIcons = {
  REGISTERED: Clock,
  ASSIGNED: AlertCircle,
  AVAILABLE: CheckCircle,
  RESERVED: AlertCircle,
  SOLD: CheckCircle
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'feedstock' | 'secondary'>('feedstock')
  const [filterLoopType, setFilterLoopType] = useState<'all' | 'SRL' | 'CRL'>('all')

  const filteredBatches = mockBatches.filter(batch => 
    filterLoopType === 'all' || batch.loopType === filterLoopType
  )

  return (
    <div className="marketplace-root space-y-8 min-h-screen bg-black">
      {/* Header */}
      <div className="marketplace-header flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-2">Trade batches. See the proofs.</h1>
          <p className="text-mythic-text-muted">
            List only SRL-verified supply. Escrow settles after LoopAuditBot confirms delivery.
          </p>
        </div>
        <Button 
          variant="primary" 
          glow
          data-test="list-srl-batches"
        >
          <Plus className="h-4 w-4 mr-2" />
          List SRL batches
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-mythic-dark-100 dark:bg-mythic-dark-900 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('feedstock')}
          className={cn(
            "px-4 py-2 rounded-md transition-all duration-200",
            activeTab === 'feedstock'
              ? "bg-white dark:bg-mythic-dark-800 shadow-sm"
              : "hover:bg-mythic-dark-50 dark:hover:bg-mythic-dark-800"
          )}
        >
          Community Supply
        </button>
        <button
          onClick={() => setActiveTab('secondary')}
          className={cn(
            "px-4 py-2 rounded-md transition-all duration-200",
            activeTab === 'secondary'
              ? "bg-white dark:bg-mythic-dark-800 shadow-sm"
              : "hover:bg-mythic-dark-50 dark:hover:bg-mythic-dark-800"
          )}
        >
          Converted Products
        </button>
      </div>

      {activeTab === 'feedstock' && (
        <>
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-mythic-dark-500" />
              <span className="text-sm">Filter by loop:</span>
            </div>
            <div className="flex space-x-2">
              {(['all', 'SRL', 'CRL'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterLoopType(type)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-all",
                    filterLoopType === type
                      ? type === 'SRL' 
                        ? "bg-mythic-loop-srl text-white"
                        : type === 'CRL'
                        ? "bg-mythic-loop-crl text-white"
                        : "bg-mythic-primary-500 text-white"
                      : "bg-mythic-dark-100 dark:bg-mythic-dark-800 hover:bg-mythic-dark-200 dark:hover:bg-mythic-dark-700"
                  )}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Feedstock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map(batch => {
              const Icon = typeIcons[batch.type as keyof typeof typeIcons] || Package
              const StatusIcon = statusIcons[batch.status as keyof typeof statusIcons] || Clock
              
              return (
                <Card key={batch.id} className="marketplace-card hover:shadow-lg transition-all duration-200 overflow-hidden bg-mythic-dark-900 border-mythic-primary-500/20">
                  <div className={cn(
                    "h-1 w-full",
                    batch.loopType === 'SRL' ? "bg-mythic-primary-500" : "bg-mythic-accent-300"
                  )} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center text-mythic-text-primary">
                          <Icon className="h-5 w-5 mr-2" />
                          {batch.batchCode}
                        </CardTitle>
                        <CardDescription className="text-mythic-text-muted">{batch.node}</CardDescription>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        batch.loopType === 'SRL' 
                          ? "bg-mythic-primary-500/20 text-mythic-primary-500"
                          : "bg-mythic-accent-300/20 text-mythic-accent-300"
                      )}>
                        {batch.loopType}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-mythic-text-muted">Quantity</p>
                        <p className="font-semibold text-mythic-text-primary">{batch.quantity} kg</p>
                      </div>
                      {batch.fatContent && (
                        <div>
                          <p className="text-mythic-text-muted">Fat Content</p>
                          <p className="font-semibold text-mythic-text-primary">{batch.fatContent}%</p>
                        </div>
                      )}
                      <div>
                        <p className="text-mythic-text-muted">Price</p>
                        <p className="font-semibold text-mythic-text-primary">£{batch.price}/kg</p>
                      </div>
                      <div>
                        <p className="text-mythic-text-muted">Location</p>
                        <p className="font-semibold text-mythic-text-primary">{batch.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className={cn("flex items-center text-sm", statusColors[batch.status as keyof typeof statusColors])}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {batch.status}
                      </div>
                      <Button 
                        size="sm" 
                        variant={batch.loopType === 'SRL' ? 'secondary' : 'default'}
                        data-test="view-details"
                        className="bg-mythic-primary-500 text-mythic-dark-900 hover:bg-mythic-primary-600"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {activeTab === 'secondary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSecondaryProducts.map(product => {
            const Icon = typeIcons[product.productType as keyof typeof typeIcons] || Package
            const StatusIcon = statusIcons[product.status as keyof typeof statusIcons] || Clock
            
            return (
              <Card key={product.id} className="marketplace-card hover:shadow-lg transition-all duration-200 bg-mythic-dark-900 border-mythic-primary-500/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center text-mythic-text-primary">
                        <Icon className="h-5 w-5 mr-2" />
                        {product.productType}
                      </CardTitle>
                      <CardDescription className="text-mythic-text-muted">{product.processor}</CardDescription>
                    </div>
                    <div className="flex items-center text-mythic-secondary-500">
                      <Leaf className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">{product.carbonSaved} tCO₂</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-mythic-text-muted">Quantity</p>
                      <p className="font-semibold text-mythic-text-primary">{product.quantity} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-mythic-text-muted">Price</p>
                      <p className="font-semibold text-mythic-text-primary">£{product.price}/{product.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className={cn("flex items-center text-sm", statusColors[product.status as keyof typeof statusColors])}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {product.status}
                    </div>
                    <Button 
                      size="sm" 
                      variant="accent"
                      data-test="contact-seller"
                      className="bg-mythic-primary-500 text-mythic-dark-900 hover:bg-mythic-primary-600"
                    >
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Market Stats */}
      <Card className="marketplace-card mt-8 bg-mythic-dark-900 border-mythic-primary-500/20">
        <CardHeader>
          <CardTitle className="text-mythic-text-primary">Loop Activity</CardTitle>
          <CardDescription className="text-mythic-text-muted">Community node performance today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-mythic-primary-500">245</p>
              <p className="text-sm text-mythic-text-muted">Active Batches</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-mythic-accent-300">78%</p>
              <p className="text-sm text-mythic-text-muted">SRL Verified</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-mythic-accent-300">£45.2K</p>
              <p className="text-sm text-mythic-text-muted">Settled Today</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-flow-credits">128.5</p>
              <p className="text-sm text-mythic-text-muted">tCO₂ Anchored</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
