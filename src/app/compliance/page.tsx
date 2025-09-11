'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  MapPin, Camera, FileText, Shield, CheckCircle, 
  AlertCircle, Upload, QrCode, Lock, TrendingUp,
  Truck, Package, Calendar, Search, Filter,
  ArrowRight, Download, Eye
} from 'lucide-react'
import Link from 'next/link'

interface WasteTransferNote {
  id: string
  batchId: string
  origin: string
  destination: string
  wasteType: 'food-waste' | 'uco'
  quantity: string
  collectorId: string
  timestamp: string
  geoTag: { lat: number; lng: number }
  photoProof: boolean
  zkProof: 'pending' | 'verified' | 'failed'
  status: 'in-transit' | 'delivered' | 'processed'
}

interface ComplianceMetric {
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

const mockWTNs: WasteTransferNote[] = [
  {
    id: 'WTN-2024-0142',
    batchId: 'BATCH-FW-0142',
    origin: 'Marks & Spencer Brighton',
    destination: 'Brighton Community AD',
    wasteType: 'food-waste',
    quantity: '0.82t',
    collectorId: 'COL-001',
    timestamp: '2024-01-26T14:30:00Z',
    geoTag: { lat: 50.8225, lng: -0.1372 },
    photoProof: true,
    zkProof: 'verified',
    status: 'processed'
  },
  {
    id: 'WTN-2024-0143',
    batchId: 'BATCH-UCO-0087',
    origin: 'The Ivy Restaurant',
    destination: 'Bristol Biodiesel Co-op',
    wasteType: 'uco',
    quantity: '215L',
    collectorId: 'COL-002',
    timestamp: '2024-01-26T16:45:00Z',
    geoTag: { lat: 51.4545, lng: -2.5879 },
    photoProof: true,
    zkProof: 'verified',
    status: 'delivered'
  },
  {
    id: 'WTN-2024-0144',
    batchId: 'BATCH-FW-0143',
    origin: 'Sainsburys Local Hove',
    destination: 'Brighton Community AD',
    wasteType: 'food-waste',
    quantity: '0.45t',
    collectorId: 'COL-003',
    timestamp: '2024-01-26T18:00:00Z',
    geoTag: { lat: 50.8301, lng: -0.1684 },
    photoProof: true,
    zkProof: 'pending',
    status: 'in-transit'
  }
]

const complianceMetrics: ComplianceMetric[] = [
  { name: 'WTN Completion', value: 98.5, target: 99, unit: '%', trend: 'up' },
  { name: 'Photo Evidence', value: 96.2, target: 95, unit: '%', trend: 'stable' },
  { name: 'Geo-tag Accuracy', value: 99.8, target: 99, unit: '%', trend: 'up' },
  { name: 'ZK Verification', value: 87.3, target: 90, unit: '%', trend: 'down' }
]

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'wtn' | 'batches' | 'evidence' | 'zk'>('wtn')
  const [filterType, setFilterType] = useState<'all' | 'food-waste' | 'uco'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWTNs = mockWTNs.filter(wtn => {
    if (filterType !== 'all' && wtn.wasteType !== filterType) return false
    if (searchTerm && !wtn.id.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getStatusColor = (status: WasteTransferNote['status']) => {
    switch (status) {
      case 'processed': return 'text-green-400 bg-green-400/20'
      case 'delivered': return 'text-blue-400 bg-blue-400/20'
      case 'in-transit': return 'text-yellow-400 bg-yellow-400/20'
    }
  }

  const getZKStatusColor = (status: WasteTransferNote['zkProof']) => {
    switch (status) {
      case 'verified': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
    }
  }

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
              Chain of Custody Tracking
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Every batch geotagged. Every transfer documented. Every claim verified.
            Real compliance, not paperwork theatre.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {complianceMetrics.map((metric, index) => (
            <div key={metric.name} className="glass rounded-lg p-4 border border-mythic-primary-500/10 text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-mythic-text-muted">{metric.name}</span>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : metric.trend === 'down' ? (
                  <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
                ) : (
                  <div className="h-4 w-4 text-yellow-400">→</div>
                )}
              </div>
              <div className="text-2xl font-bold text-mythic-text-primary">
                {metric.value}{metric.unit}
              </div>
              <p className="text-xs text-mythic-text-muted">Target: {metric.target}{metric.unit}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 mb-8 border-b border-mythic-primary-500/20"
        >
          <button
            onClick={() => setActiveTab('wtn')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'wtn'
                ? 'text-mythic-primary-500'
                : 'text-mythic-text-muted hover:text-mythic-text-primary'
            }`}
          >
            Waste Transfer Notes
            {activeTab === 'wtn' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mythic-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'batches'
                ? 'text-mythic-primary-500'
                : 'text-mythic-text-muted hover:text-mythic-text-primary'
            }`}
          >
            Batch Tracking
            {activeTab === 'batches' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mythic-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'evidence'
                ? 'text-mythic-primary-500'
                : 'text-mythic-text-muted hover:text-mythic-text-primary'
            }`}
          >
            Photo Evidence
            {activeTab === 'evidence' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mythic-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('zk')}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'zk'
                ? 'text-mythic-primary-500'
                : 'text-mythic-text-muted hover:text-mythic-text-primary'
            }`}
          >
            ZK Attestations
            {activeTab === 'zk' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mythic-primary-500" />
            )}
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Waste Transfer Notes Tab */}
          {activeTab === 'wtn' && (
            <div>
              {/* Filter Bar */}
              <div className="glass rounded-xl p-4 border border-mythic-primary-500/20 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="food-waste">Food Waste</option>
                      <option value="uco">UCO</option>
                    </select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
                      <input
                        type="text"
                        placeholder="Search WTN ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary placeholder-mythic-text-muted focus:border-mythic-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all">
                    <Upload className="h-4 w-4 inline mr-2" />
                    New WTN
                  </button>
                </div>
              </div>

              {/* WTN List */}
              <div className="space-y-4">
                {filteredWTNs.map((wtn) => (
                  <div key={wtn.id} className="glass rounded-xl p-6 border border-mythic-primary-500/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-mythic-primary-500" />
                          <h3 className="font-semibold text-mythic-text-primary">{wtn.id}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(wtn.status)}`}>
                            {wtn.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-mythic-text-muted">Origin:</span>
                            <p className="text-mythic-text-primary">{wtn.origin}</p>
                          </div>
                          <div>
                            <span className="text-mythic-text-muted">Destination:</span>
                            <p className="text-mythic-text-primary">{wtn.destination}</p>
                          </div>
                          <div>
                            <span className="text-mythic-text-muted">Quantity:</span>
                            <p className="text-mythic-text-primary font-semibold">{wtn.quantity}</p>
                          </div>
                          <div>
                            <span className="text-mythic-text-muted">Type:</span>
                            <p className="text-mythic-text-primary">
                              {wtn.wasteType === 'food-waste' ? 'Food Waste' : 'UCO'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <MapPin className={`h-5 w-5 mx-auto mb-1 ${wtn.geoTag ? 'text-green-400' : 'text-red-400'}`} />
                          <p className="text-xs text-mythic-text-muted">Geo-tag</p>
                        </div>
                        <div className="text-center">
                          <Camera className={`h-5 w-5 mx-auto mb-1 ${wtn.photoProof ? 'text-green-400' : 'text-red-400'}`} />
                          <p className="text-xs text-mythic-text-muted">Photo</p>
                        </div>
                        <div className="text-center">
                          <Lock className={`h-5 w-5 mx-auto mb-1 ${getZKStatusColor(wtn.zkProof)}`} />
                          <p className="text-xs text-mythic-text-muted">ZK</p>
                        </div>
                        <button className="px-3 py-2 text-mythic-text-muted hover:text-mythic-text-primary transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batch Tracking Tab */}
          {activeTab === 'batches' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-8 border border-mythic-primary-500/20">
                <h3 className="text-2xl font-bold text-mythic-text-primary mb-6">Real-Time Batch Tracking</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <QrCode className="h-6 w-6 text-mythic-primary-500" />
                      <h4 className="font-semibold text-mythic-text-primary">Unique Batch IDs</h4>
                    </div>
                    <p className="text-sm text-mythic-text-muted">
                      Every collection gets a unique identifier. QR codes on bins and vehicles 
                      ensure traceability from source to processor.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="h-6 w-6 text-mythic-accent-300" />
                      <h4 className="font-semibold text-mythic-text-primary">GPS Tracking</h4>
                    </div>
                    <p className="text-sm text-mythic-text-muted">
                      All vehicles equipped with GPS. Real-time location data ensures batches 
                      follow designated routes. No detours, no mixing.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="h-6 w-6 text-flow-credits" />
                      <h4 className="font-semibold text-mythic-text-primary">Weight Verification</h4>
                    </div>
                    <p className="text-sm text-mythic-text-muted">
                      Smart scales at origin and destination. Automated weight reconciliation 
                      flags any discrepancies immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Tracking Map Placeholder */}
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
                <h4 className="font-semibold text-mythic-text-primary mb-4">Live Batch Locations</h4>
                <div className="h-64 bg-mythic-dark-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-mythic-primary-500 mx-auto mb-3" />
                    <p className="text-mythic-text-muted">Interactive map showing real-time batch locations</p>
                    <p className="text-xs text-mythic-text-muted mt-2">3 batches currently in transit</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Photo Evidence Tab */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
                <h3 className="text-xl font-bold text-mythic-text-primary mb-4">Evidence Requirements</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-mythic-primary-500 mb-2">Collection Point</h4>
                    <ul className="space-y-2 text-sm text-mythic-text-muted">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Photo of waste container before collection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>QR code visible in frame</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Timestamp and GPS metadata required</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-mythic-accent-300 mb-2">Delivery Point</h4>
                    <ul className="space-y-2 text-sm text-mythic-text-muted">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Photo of waste being deposited</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Processor receipt confirmation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <span>Final weight measurement</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recent Evidence Grid */}
              <div>
                <h4 className="font-semibold text-mythic-text-primary mb-4">Recent Evidence Submissions</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass rounded-lg p-4 border border-mythic-primary-500/20">
                      <div className="aspect-video bg-mythic-dark-900 rounded mb-3 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-mythic-text-muted" />
                      </div>
                      <p className="text-sm font-semibold text-mythic-text-primary">WTN-2024-0{140 + i}</p>
                      <p className="text-xs text-mythic-text-muted">Verified • 2 hours ago</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ZK Attestations Tab */}
          {activeTab === 'zk' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-8 border border-mythic-primary-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-8 w-8 text-mythic-primary-500" />
                  <h3 className="text-2xl font-bold text-mythic-text-primary">Zero-Knowledge Proofs</h3>
                </div>
                <p className="text-mythic-text-muted mb-6">
                  Privacy-preserving verification ensures compliance without exposing sensitive 
                  business data. Prove tonnage processed without revealing customer details.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-mythic-dark-900 rounded-lg">
                    <h4 className="font-semibold text-mythic-text-primary mb-3">What{`'`}s Hidden</h4>
                    <ul className="space-y-2 text-sm text-mythic-text-muted">
                      <li>• Specific customer identities</li>
                      <li>• Exact collection addresses</li>
                      <li>• Individual transaction values</li>
                      <li>• Competitive route information</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-mythic-dark-900 rounded-lg">
                    <h4 className="font-semibold text-mythic-text-primary mb-3">What{`'`}s Proven</h4>
                    <ul className="space-y-2 text-sm text-mythic-text-muted">
                      <li>• Total tonnage collected</li>
                      <li>• Waste type classifications</li>
                      <li>• Processing completion</li>
                      <li>• Environmental impact metrics</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ZK Proof Status */}
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
                <h4 className="font-semibold text-mythic-text-primary mb-4">Recent ZK Attestations</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-mythic-primary-500/10">
                    <div>
                      <p className="font-medium text-mythic-text-primary">Daily Tonnage Proof</p>
                      <p className="text-sm text-mythic-text-muted">Brighton AD: 12.4t processed</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-green-400">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-mythic-primary-500/10">
                    <div>
                      <p className="font-medium text-mythic-text-primary">Weekly GIRM Generation</p>
                      <p className="text-sm text-mythic-text-muted">142 credits minted</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-green-400">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-mythic-text-primary">Monthly Compliance Bundle</p>
                      <p className="text-sm text-mythic-text-muted">All WTNs aggregated</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-mythic-text-muted mb-4">
                  Ready to implement privacy-preserving compliance?
                </p>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all"
                >
                  Learn More About ZK
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
