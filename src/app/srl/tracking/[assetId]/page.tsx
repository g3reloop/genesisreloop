'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { chainOfCustody } from '@/lib/srl/chain-of-custody'
import type { AssetDigitalTwin, CoCLogEntry } from '@/types/srl-domain'

const STATE_COLORS = {
  entrusted: 'bg-blue-500',
  transport_pickup: 'bg-yellow-500',
  received_at_facility: 'bg-purple-500',
  qa_verified: 'bg-green-500',
  sorted: 'bg-orange-500',
  processing_start: 'bg-red-500',
  digested: 'bg-pink-500',
  processed: 'bg-indigo-500',
  output_generated: 'bg-teal-500',
  disposed: 'bg-gray-500'
}

const STATE_LABELS = {
  entrusted: 'Entrusted',
  transport_pickup: 'In Transit',
  received_at_facility: 'Received',
  qa_verified: 'QA Verified',
  sorted: 'Sorted',
  processing_start: 'Processing',
  digested: 'Digested',
  processed: 'Processed',
  output_generated: 'Output Generated',
  disposed: 'Disposed'
}

export default function ChainOfCustodyDashboard() {
  const { assetId } = useParams()
  const [asset, setAsset] = useState<AssetDigitalTwin | null>(null)
  const [entries, setEntries] = useState<CoCLogEntry[]>([])
  const [integrity, setIntegrity] = useState<{ valid: boolean; issues: string[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<CoCLogEntry | null>(null)

  useEffect(() => {
    loadChainData()
    
    // Listen for real-time updates
    const handleUpdate = (e: any) => {
      if (e.detail.assetId === assetId) {
        loadChainData()
      }
    }
    
    window.addEventListener('coc:entry_added', handleUpdate)
    window.addEventListener('coc:alert', handleUpdate)
    
    return () => {
      window.removeEventListener('coc:entry_added', handleUpdate)
      window.removeEventListener('coc:alert', handleUpdate)
    }
  }, [assetId])

  const loadChainData = async () => {
    try {
      const cocData = await chainOfCustody.getAssetCoC(assetId as string)
      setAsset(cocData.asset)
      setEntries(cocData.entries)
      
      const integrityCheck = await chainOfCustody.verifyChainIntegrity(assetId as string)
      setIntegrity(integrityCheck)
    } catch (error) {
      console.error('Failed to load CoC data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black flex items-center justify-center">
        <div className="text-mythic-primary animate-pulse">Loading chain data...</div>
      </div>
    )
  }

  if (!asset || !entries.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black flex items-center justify-center">
        <div className="text-red-500">Asset not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-8 border border-mythic-primary/20 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-mythic-primary mb-2">
                Chain of Custody Tracking
              </h1>
              <p className="text-white/70">
                Asset ID: <code className="text-mythic-secondary font-mono">{assetId}</code>
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              integrity?.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {integrity?.valid ? 'Chain Valid' : 'Chain Issues Detected'}
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-black/30 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Current Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/60">State</p>
                <p className="text-xl font-semibold text-mythic-primary">
                  {STATE_LABELS[asset.currentState]}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Current Custodian</p>
                <p className="text-xl font-mono text-white/80">{asset.currentCustodianId}</p>
              </div>
            </div>
          </div>

          {/* Timeline View */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Process Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-white/20"></div>
              
              {/* Timeline entries */}
              <div className="space-y-6">
                {entries.map((entry, idx) => (
                  <div key={entry.entryId} className="relative flex items-start">
                    {/* Timeline dot */}
                    <div className={`absolute left-2 w-4 h-4 rounded-full ${
                      STATE_COLORS[entry.processState]
                    } ring-4 ring-black/50`}></div>
                    
                    {/* Entry card */}
                    <div 
                      className="ml-12 flex-1 bg-black/30 rounded-lg p-4 border border-white/10 hover:border-mythic-primary/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">
                          {STATE_LABELS[entry.processState]}
                        </h3>
                        <span className="text-xs text-white/60">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 font-mono mb-1">
                        Actor: {entry.actorVOC}
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-white/80">{entry.notes}</p>
                      )}
                      {entry.geolocation && (
                        <p className="text-xs text-mythic-secondary mt-2">
                          📍 {entry.geolocation.lat.toFixed(6)}, {entry.geolocation.lon.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integrity Issues */}
          {integrity && !integrity.valid && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-red-400 mb-2">Chain Integrity Issues</h3>
              <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                {integrity.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Entry Details Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={() => setSelectedEntry(null)}>
            <div className="bg-mythic-obsidian/90 rounded-2xl p-6 max-w-lg w-full border border-mythic-primary/30"
                 onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-mythic-primary mb-4">
                Entry Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/60">Entry ID</p>
                  <p className="font-mono text-sm text-white/80">{selectedEntry.entryId}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Evidence Hash</p>
                  <p className="font-mono text-xs text-mythic-secondary break-all">
                    {selectedEntry.evidenceHash}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Timestamp</p>
                  <p className="text-white/80">
                    {new Date(selectedEntry.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Process State</p>
                  <p className="text-white/80">{STATE_LABELS[selectedEntry.processState]}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Actor VOC</p>
                  <p className="font-mono text-sm text-white/80">{selectedEntry.actorVOC}</p>
                </div>
                {selectedEntry.geolocation && (
                  <div>
                    <p className="text-sm text-white/60">Location</p>
                    <p className="text-white/80">
                      {selectedEntry.geolocation.lat}, {selectedEntry.geolocation.lon}
                    </p>
                  </div>
                )}
                {selectedEntry.notes && (
                  <div>
                    <p className="text-sm text-white/60">Notes</p>
                    <p className="text-white/80">{selectedEntry.notes}</p>
                  </div>
                )}
              </div>
              <button
                className="mt-6 w-full py-2 bg-mythic-primary/20 hover:bg-mythic-primary/30 text-mythic-primary rounded-lg transition-colors"
                onClick={() => setSelectedEntry(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
