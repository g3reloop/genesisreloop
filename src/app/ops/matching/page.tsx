'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  MapPin, Clock, TrendingUp, Truck, Filter, Search,
  CheckCircle, XCircle, AlertCircle, ChevronRight
} from 'lucide-react'
import { ProcessorMatch, FeedstockLot } from '@/types/agents'

interface PendingLot extends FeedstockLot {
  matches?: ProcessorMatch[]
  status: 'pending' | 'matched' | 'assigned' | 'rejected'
}

export default function MatchingOpsPage() {
  const [lots, setLots] = useState<PendingLot[]>([])
  const [selectedLot, setSelectedLot] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'FW' | 'UCO'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load pending lots
    loadPendingLots()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadPendingLots, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadPendingLots = async () => {
    // In production, fetch from API
    const mockLots: PendingLot[] = [
      {
        id: 'LOT-2024-001',
        type: 'FW',
        volume: 1500,
        unit: 'kg',
        location: {
          lat: 50.8274,
          lng: -0.1524,
          address: 'Brighton Marina Restaurant'
        },
        windowStart: new Date(Date.now() + 2 * 60 * 60 * 1000),
        windowEnd: new Date(Date.now() + 6 * 60 * 60 * 1000),
        supplierId: 'SUP-001',
        srlHint: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'pending',
        matches: [
          {
            processorId: 'proc-001',
            processorName: 'Brighton Community Biogas',
            score: 92.5,
            distanceKm: 12.3,
            priceEstimate: 120,
            routeEta: new Date(Date.now() + 2 * 60 * 60 * 1000),
            srlScore: 0.8,
            notes: 'Excellent match for SRL'
          },
          {
            processorId: 'proc-002',
            processorName: 'Sussex Waste Processing',
            score: 78.2,
            distanceKm: 28.7,
            priceEstimate: 112.5,
            routeEta: new Date(Date.now() + 3 * 60 * 60 * 1000),
            srlScore: 0.4
          }
        ]
      },
      {
        id: 'LOT-2024-002',
        type: 'UCO',
        volume: 800,
        unit: 'L',
        location: {
          lat: 50.8405,
          lng: -0.1372,
          address: 'The Grand Hotel Kitchen'
        },
        windowStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        windowEnd: new Date(Date.now() + 48 * 60 * 60 * 1000),
        qualityMetrics: {
          ffa: 3.2,
          moisture: 0.5,
          contamination: 0.1
        },
        supplierId: 'SUP-002',
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        status: 'matched',
        matches: [
          {
            processorId: 'proc-003',
            processorName: 'Sussex UCO Processing',
            score: 88.4,
            distanceKm: 15.2,
            priceEstimate: 384,
            routeEta: new Date(Date.now() + 24 * 60 * 60 * 1000),
            srlScore: 0.6
          }
        ]
      },
      {
        id: 'LOT-2024-003',
        type: 'FW',
        volume: 2200,
        unit: 'kg',
        location: {
          lat: 50.8195,
          lng: -0.1357,
          address: 'Brighton College Canteen'
        },
        windowStart: new Date(Date.now()),
        windowEnd: new Date(Date.now() + 4 * 60 * 60 * 1000),
        supplierId: 'SUP-003',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'assigned'
      }
    ]

    setLots(mockLots)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500'
      case 'matched': return 'text-blue-500'
      case 'assigned': return 'text-green-500'
      case 'rejected': return 'text-red-500'
      default: return 'text-mythic-text-muted'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'matched': return <AlertCircle className="h-4 w-4" />
      case 'assigned': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const assignMatch = async (lotId: string, processorId: string) => {
    // In production, call API to assign match
    console.log(`Assigning lot ${lotId} to processor ${processorId}`)
    
    // Update local state
    setLots(prev => prev.map(lot => 
      lot.id === lotId ? { ...lot, status: 'assigned' } : lot
    ))
  }

  const rejectLot = async (lotId: string, reason: string) => {
    // In production, call API to reject lot
    console.log(`Rejecting lot ${lotId}: ${reason}`)
    
    // Update local state
    setLots(prev => prev.map(lot => 
      lot.id === lotId ? { ...lot, status: 'rejected' } : lot
    ))
  }

  const filteredLots = lots.filter(lot => {
    if (filterType !== 'all' && lot.type !== filterType) return false
    if (searchTerm && !lot.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lot.location.address.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  const selectedLotData = lots.find(lot => lot.id === selectedLot)

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
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Feedstock Matching
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted">
            Match incoming lots to processors and manage assignments
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold text-mythic-text-primary">
                {lots.filter(l => l.status === 'pending').length}
              </span>
            </div>
            <div className="text-sm text-mythic-text-muted">Pending Matches</div>
          </div>

          <div className="glass rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold text-mythic-text-primary">
                {lots.filter(l => l.status === 'matched').length}
              </span>
            </div>
            <div className="text-sm text-mythic-text-muted">Awaiting Assignment</div>
          </div>

          <div className="glass rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold text-mythic-text-primary">
                {lots.filter(l => l.status === 'assigned').length}
              </span>
            </div>
            <div className="text-sm text-mythic-text-muted">Assigned Today</div>
          </div>

          <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 w-6 text-mythic-primary-500" />
              <span className="text-2xl font-bold text-mythic-text-primary">
                {lots.filter(l => l.srlHint).length}
              </span>
            </div>
            <div className="text-sm text-mythic-text-muted">SRL Eligible</div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-mythic-dark-900 rounded-lg p-1">
            <Filter className="h-4 w-4 text-mythic-text-muted ml-2" />
            {(['all', 'FW', 'UCO'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  filterType === type
                    ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                    : 'text-mythic-text-muted hover:text-mythic-text-primary'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
            <input
              type="text"
              placeholder="Search by ID or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg focus:border-mythic-primary-500 focus:outline-none text-mythic-text-primary placeholder-mythic-text-muted/50"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lots List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {filteredLots.map((lot) => (
              <div
                key={lot.id}
                onClick={() => setSelectedLot(lot.id)}
                className={`glass rounded-xl p-6 border transition-all cursor-pointer ${
                  selectedLot === lot.id
                    ? 'border-mythic-primary-500'
                    : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-mythic-primary-500">
                        {lot.id}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                        lot.type === 'FW' 
                          ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                          : 'bg-mythic-accent-300/20 text-mythic-accent-300'
                      }`}>
                        {lot.type}
                      </span>
                      {lot.srlHint && (
                        <span className="inline-flex px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">
                          SRL
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-mythic-text-primary font-medium">
                      {lot.location.address}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(lot.status)}`}>
                    {getStatusIcon(lot.status)}
                    <span className="text-xs font-semibold uppercase">{lot.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-mythic-text-muted">Volume</span>
                    <p className="font-semibold text-mythic-text-primary">
                      {lot.volume} {lot.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-mythic-text-muted">Window</span>
                    <p className="font-semibold text-mythic-text-primary">
                      {new Date(lot.windowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <span className="text-mythic-text-muted">Matches</span>
                    <p className="font-semibold text-mythic-text-primary">
                      {lot.matches?.length || 0}
                    </p>
                  </div>
                </div>

                {lot.status === 'pending' && lot.matches && lot.matches.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-mythic-primary-500/10">
                    <p className="text-xs text-mythic-text-muted mb-1">Best match:</p>
                    <p className="text-sm text-mythic-accent-300 font-medium">
                      {lot.matches[0].processorName} ({lot.matches[0].score.toFixed(1)}% match)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Match Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {selectedLotData ? (
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/20 sticky top-24">
                <h2 className="text-xl font-bold text-mythic-text-primary mb-4">
                  Match Details
                </h2>

                {/* Lot Info */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-mythic-text-primary mb-3">
                    Lot Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Supplier</span>
                      <span className="text-mythic-text-primary">{selectedLotData.supplierId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mythic-text-muted">Created</span>
                      <span className="text-mythic-text-primary">
                        {new Date(selectedLotData.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {selectedLotData.qualityMetrics && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-mythic-text-muted">FFA</span>
                          <span className="text-mythic-text-primary">
                            {selectedLotData.qualityMetrics.ffa}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mythic-text-muted">Moisture</span>
                          <span className="text-mythic-text-primary">
                            {selectedLotData.qualityMetrics.moisture}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Matches */}
                {selectedLotData.matches && selectedLotData.matches.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-mythic-text-primary mb-3">
                      Available Matches
                    </h3>
                    <div className="space-y-3">
                      {selectedLotData.matches.map((match) => (
                        <div
                          key={match.processorId}
                          className="bg-mythic-dark-900 rounded-lg p-4 border border-mythic-primary-500/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-mythic-text-primary">
                                {match.processorName}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-mythic-text-muted">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {match.distanceKm} km
                                </span>
                                <span className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  {new Date(match.routeEta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-mythic-primary-500">
                                {match.score.toFixed(1)}%
                              </p>
                              {match.srlScore > 0.5 && (
                                <p className="text-xs text-green-400 mt-1">
                                  SRL: {(match.srlScore * 100).toFixed(0)}%
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <p className="text-sm text-mythic-accent-300 font-semibold">
                              £{match.priceEstimate.toFixed(2)}
                            </p>
                            {selectedLotData.status === 'pending' && (
                              <button
                                onClick={() => assignMatch(selectedLotData.id, match.processorId)}
                                className="px-3 py-1 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all text-sm font-semibold"
                              >
                                Assign
                              </button>
                            )}
                          </div>

                          {match.notes && (
                            <p className="text-xs text-mythic-text-muted mt-2 italic">
                              {match.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-mythic-text-muted/50 mx-auto mb-3" />
                    <p className="text-mythic-text-muted">
                      No matches found for this lot
                    </p>
                  </div>
                )}

                {/* Actions */}
                {selectedLotData.status === 'pending' && (
                  <div className="mt-6 pt-6 border-t border-mythic-primary-500/10">
                    <button
                      onClick={() => rejectLot(selectedLotData.id, 'No suitable processor')}
                      className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold"
                    >
                      Reject Lot
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass rounded-xl p-12 border border-mythic-primary-500/20 text-center">
                <MapPin className="h-16 w-16 text-mythic-text-muted/30 mx-auto mb-4" />
                <p className="text-mythic-text-muted">
                  Select a lot to view matching details
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
