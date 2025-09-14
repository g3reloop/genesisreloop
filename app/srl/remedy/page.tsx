'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { type RemedyCase, BreachType } from '@/types/srl-domain'

// Mock data for demo
const mockCases: RemedyCase[] = [
  {
    caseId: 'case-001',
    breachType: BreachType.NUISANCE_VIOLATION,
    facilityId: 'facility-001',
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'remedy_ordered',
    breachedPrinciples: ['nuisance_prevention'],
    evidenceItems: [
      {
        type: 'sensor_data',
        url: '/evidence/odour-data-001.json',
        hash: 'a1b2c3d4e5f6...',
        submittedBy: 'IoT System'
      },
      {
        type: 'photo',
        url: '/evidence/facility-photo-001.jpg',
        hash: 'f6e5d4c3b2a1...',
        submittedBy: 'Community Member'
      }
    ],
    remedyOrders: [
      {
        type: 'abatement',
        description: 'Install enhanced carbon filtration system within 14 days',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    communicationLog: [
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        from: 'Compliance Officer',
        message: 'Abatement order issued. Please confirm receipt and implementation plan.'
      }
    ]
  },
  {
    caseId: 'case-002',
    breachType: BreachType.BROKEN_CHAIN_OF_CUSTODY,
    assetId: 'asset-456',
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'investigation',
    breachedPrinciples: ['coc_protocol'],
    evidenceItems: [
      {
        type: 'system_log',
        url: '/evidence/missing-entry-log.txt',
        hash: 'xyz789...',
        submittedBy: 'Automated Alert System'
      }
    ],
    communicationLog: [
      {
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        from: 'Investigator',
        message: 'Transport delay confirmed. Reviewing GPS logs from vehicle.'
      }
    ]
  }
]

const BREACH_LABELS = {
  [BreachType.SPILL_CONTAMINATION]: { name: 'Spill/Contamination', color: 'text-red-500', bg: 'bg-red-500/20' },
  [BreachType.BROKEN_CHAIN_OF_CUSTODY]: { name: 'Broken Chain', color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
  [BreachType.MATERIAL_MISREPRESENTATION]: { name: 'Misrepresentation', color: 'text-orange-500', bg: 'bg-orange-500/20' },
  [BreachType.NUISANCE_VIOLATION]: { name: 'Nuisance', color: 'text-purple-500', bg: 'bg-purple-500/20' }
}

const STATUS_LABELS = {
  'open': { name: 'Open', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'investigation': { name: 'Under Investigation', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  'remedy_ordered': { name: 'Remedy Ordered', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  'completed': { name: 'Completed', color: 'text-green-400', bg: 'bg-green-500/20' },
  'escalated': { name: 'Escalated', color: 'text-red-400', bg: 'bg-red-500/20' }
}

export default function RemedyProcessManagement() {
  const [cases, setCases] = useState<RemedyCase[]>(mockCases)
  const [selectedCase, setSelectedCase] = useState<RemedyCase | null>(null)
  const [showNewCaseModal, setShowNewCaseModal] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredCases = filterStatus === 'all'
    ? cases
    : cases.filter(c => c.status === filterStatus)

  const handleAddMessage = () => {
    if (!selectedCase || !newMessage.trim()) return

    const updatedCase = {
      ...selectedCase,
      communicationLog: [
        ...selectedCase.communicationLog,
        {
          timestamp: new Date().toISOString(),
          from: 'Current User', // Would come from auth
          message: newMessage
        }
      ]
    }

    setCases(cases.map(c => c.caseId === selectedCase.caseId ? updatedCase : c))
    setSelectedCase(updatedCase)
    setNewMessage('')
  }

  const handleStatusUpdate = (caseId: string, newStatus: RemedyCase['status']) => {
    setCases(cases.map(c => c.caseId === caseId ? { ...c, status: newStatus } : c))
    if (selectedCase?.caseId === caseId) {
      setSelectedCase({ ...selectedCase, status: newStatus })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-8 border border-mythic-primary/20 mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-mythic-primary mb-2">
                Remedy Process Management
              </h1>
              <p className="text-white/70">
                Due process for handling breaches and compliance violations
              </p>
            </div>
            <Button onClick={() => setShowNewCaseModal(true)}>
              Report New Breach
            </Button>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-mythic-primary/20 text-mythic-primary border border-mythic-primary/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              All Cases
            </button>
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-mythic-primary/20 text-mythic-primary border border-mythic-primary/30'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                {label.name}
              </button>
            ))}
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            {filteredCases.map((remedyCase) => (
              <div
                key={remedyCase.caseId}
                className="bg-black/30 rounded-lg p-6 border border-white/10 hover:border-mythic-primary/30 cursor-pointer transition-all"
                onClick={() => setSelectedCase(remedyCase)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        Case #{remedyCase.caseId}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        BREACH_LABELS[remedyCase.breachType].bg
                      } ${BREACH_LABELS[remedyCase.breachType].color}`}>
                        {BREACH_LABELS[remedyCase.breachType].name}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">
                      Reported: {new Date(remedyCase.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    STATUS_LABELS[remedyCase.status].bg
                  } ${STATUS_LABELS[remedyCase.status].color}`}>
                    {STATUS_LABELS[remedyCase.status].name}
                  </span>
                </div>

                {remedyCase.remedyOrders && remedyCase.remedyOrders.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-yellow-400 mb-1">
                      Active Remedy Order
                    </p>
                    <p className="text-sm text-white/80">
                      {remedyCase.remedyOrders[0].description}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      Due: {new Date(remedyCase.remedyOrders[0].dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>
                    📎 {remedyCase.evidenceItems.length} evidence items
                  </span>
                  <span>
                    💬 {remedyCase.communicationLog.length} messages
                  </span>
                  {remedyCase.assetId && (
                    <span>Asset: {remedyCase.assetId}</span>
                  )}
                  {remedyCase.facilityId && (
                    <span>Facility: {remedyCase.facilityId}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Details Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto z-50">
            <div className="min-h-screen p-4 flex items-start justify-center">
              <div className="bg-mythic-obsidian/90 rounded-2xl p-8 max-w-4xl w-full border border-mythic-primary/30 my-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-mythic-primary mb-2">
                      Case #{selectedCase.caseId}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        BREACH_LABELS[selectedCase.breachType].bg
                      } ${BREACH_LABELS[selectedCase.breachType].color}`}>
                        {BREACH_LABELS[selectedCase.breachType].name}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_LABELS[selectedCase.status].bg
                      } ${STATUS_LABELS[selectedCase.status].color}`}>
                        {STATUS_LABELS[selectedCase.status].name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Case Information */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-black/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-white/60 mb-2">
                      BREACH DETAILS
                    </h3>
                    <p className="text-sm text-white mb-2">
                      Type: {BREACH_LABELS[selectedCase.breachType].name}
                    </p>
                    <p className="text-sm text-white mb-2">
                      Reported: {new Date(selectedCase.reportedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-white">
                      Principles: {selectedCase.breachedPrinciples.join(', ')}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-white/60 mb-2">
                      IDENTIFIERS
                    </h3>
                    {selectedCase.assetId && (
                      <p className="text-sm text-white mb-2">
                        Asset: <code className="text-mythic-secondary">{selectedCase.assetId}</code>
                      </p>
                    )}
                    {selectedCase.facilityId && (
                      <p className="text-sm text-white">
                        Facility: <code className="text-mythic-secondary">{selectedCase.facilityId}</code>
                      </p>
                    )}
                  </div>
                </div>

                {/* Remedy Orders */}
                {selectedCase.remedyOrders && selectedCase.remedyOrders.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Remedy Orders
                    </h3>
                    <div className="space-y-3">
                      {selectedCase.remedyOrders.map((order, idx) => (
                        <div key={idx} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-yellow-400 uppercase">
                              {order.type} ORDER
                            </span>
                            <span className="text-sm text-white/60">
                              Due: {new Date(order.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-white mb-2">{order.description}</p>
                          {order.completionEvidence && (
                            <p className="text-sm text-green-400">
                              ✓ Completion evidence submitted
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Evidence Items ({selectedCase.evidenceItems.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCase.evidenceItems.map((item, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-3 flex items-center gap-3">
                        <div className="text-2xl">
                          {item.type === 'photo' ? '📷' :
                           item.type === 'sensor_data' ? '📊' :
                           item.type === 'system_log' ? '📋' : '📄'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{item.type}</p>
                          <p className="text-xs text-white/60">by {item.submittedBy}</p>
                          <p className="text-xs text-mythic-secondary font-mono truncate">
                            {item.hash}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communication Log */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Communication Log
                  </h3>
                  <div className="bg-black/30 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                    {selectedCase.communicationLog.map((msg, idx) => (
                      <div key={idx} className="border-b border-white/10 pb-3 last:border-0">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-mythic-primary">{msg.from}</span>
                          <span className="text-white/60">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-white/80">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Message */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                      placeholder="Add a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleAddMessage()}
                    />
                    <Button onClick={handleAddMessage}>Send</Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedCase.status === 'open' && (
                    <Button onClick={() => handleStatusUpdate(selectedCase.caseId, 'investigation')}>
                      Begin Investigation
                    </Button>
                  )}
                  {selectedCase.status === 'investigation' && (
                    <Button onClick={() => handleStatusUpdate(selectedCase.caseId, 'remedy_ordered')}>
                      Issue Remedy Order
                    </Button>
                  )}
                  {selectedCase.status === 'remedy_ordered' && (
                    <Button onClick={() => handleStatusUpdate(selectedCase.caseId, 'completed')}>
                      Mark Completed
                    </Button>
                  )}
                  {selectedCase.status !== 'completed' && selectedCase.status !== 'escalated' && (
                    <Button 
                      variant="danger"
                      onClick={() => handleStatusUpdate(selectedCase.caseId, 'escalated')}
                    >
                      Escalate to Sanctions
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
