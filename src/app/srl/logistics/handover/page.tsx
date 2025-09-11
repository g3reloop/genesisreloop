'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { chainOfCustody } from '@/lib/srl/chain-of-custody'
import { ProcessState, type TransportHandover } from '@/types/srl-domain'

export default function LogisticsHandoverInterface() {
  const router = useRouter()
  const [mode, setMode] = useState<'pickup' | 'dropoff'>('pickup')
  const [assetId, setAssetId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [sealNumber, setSealNumber] = useState('')
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  // Get current location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
        }
      )
    }
  }, [])

  // Simulate QR code scanning
  const handleQRScan = () => {
    setScanning(true)
    // Simulate scan delay
    setTimeout(() => {
      const mockAssetId = `asset-${Math.random().toString(36).substring(7)}`
      setAssetId(mockAssetId)
      setScanResult(mockAssetId)
      setScanning(false)
    }, 2000)
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoData(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHandover = async () => {
    if (!assetId || !location) return
    setProcessing(true)

    try {
      // Create handover record
      const handover: TransportHandover = {
        handoverId: `handover-${Date.now()}`,
        assetId,
        fromCustodianVOC: mode === 'pickup' ? 'facility-voc' : 'driver-voc',
        toCustodianVOC: mode === 'pickup' ? 'driver-voc' : 'facility-voc',
        timestamp: new Date().toISOString(),
        geolocation: location,
        vehicleId: vehicleId || undefined,
        sealNumber: sealNumber || undefined,
        photoEvidence: photoData || undefined,
        signature: 'digital-signature-placeholder'
      }

      // Add CoC entry
      await chainOfCustody.addCoCEntry(
        assetId,
        mode === 'pickup' ? 'driver-voc' : 'facility-voc',
        mode === 'pickup' ? ProcessState.TRANSPORT_PICKUP : ProcessState.RECEIVED_AT_FACILITY,
        handover,
        location,
        mode === 'pickup' ? 'Asset picked up for transport' : 'Asset delivered to facility'
      )

      // Navigate to tracking page
      router.push(`/srl/tracking/${assetId}`)
    } catch (error) {
      console.error('Handover failed:', error)
      alert('Handover failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-6 border border-mythic-primary/20">
          <h1 className="text-2xl font-bold text-mythic-primary mb-2">
            Logistics Handover
          </h1>
          <p className="text-white/70 mb-6">
            Quick custody transfer for circular logistics
          </p>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => setMode('pickup')}
              className={`py-3 rounded-lg font-medium transition-all ${
                mode === 'pickup'
                  ? 'bg-mythic-primary/20 text-mythic-primary border border-mythic-primary/30'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              📦 Pickup
            </button>
            <button
              onClick={() => setMode('dropoff')}
              className={`py-3 rounded-lg font-medium transition-all ${
                mode === 'dropoff'
                  ? 'bg-mythic-primary/20 text-mythic-primary border border-mythic-primary/30'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              📍 Drop-off
            </button>
          </div>

          {/* QR Scanner Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">
              Asset Identification
            </label>
            
            {!assetId ? (
              <button
                onClick={handleQRScan}
                disabled={scanning}
                className="w-full h-48 bg-black/30 border-2 border-dashed border-mythic-primary/30 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-mythic-primary/50 transition-colors"
              >
                {scanning ? (
                  <>
                    <div className="text-4xl animate-pulse">📷</div>
                    <span className="text-white/70">Scanning...</span>
                  </>
                ) : (
                  <>
                    <div className="text-4xl">📱</div>
                    <span className="text-white/70">Tap to scan QR code</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-black/30 rounded-lg p-4 border border-mythic-primary/30">
                <p className="text-sm text-white/60 mb-1">Asset ID</p>
                <p className="font-mono text-mythic-secondary">{assetId}</p>
              </div>
            )}

            {/* Manual entry option */}
            {!scanResult && (
              <div className="mt-3">
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white placeholder-white/40 focus:border-mythic-primary focus:outline-none"
                  placeholder="Or enter Asset ID manually"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Vehicle & Seal Info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Vehicle ID (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white placeholder-white/40 focus:border-mythic-primary focus:outline-none"
                placeholder="e.g., TRK-123"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              />
            </div>

            {mode === 'pickup' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Seal Number (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white placeholder-white/40 focus:border-mythic-primary focus:outline-none"
                  placeholder="e.g., SEAL-456789"
                  value={sealNumber}
                  onChange={(e) => setSealNumber(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Photo Evidence */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Photo Evidence (Optional)
            </label>
            
            {!photoData ? (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <div className="w-full py-8 bg-black/30 border border-white/10 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-mythic-primary/30 transition-colors cursor-pointer">
                  <div className="text-3xl">📸</div>
                  <span className="text-sm text-white/70">Take photo of container</span>
                </div>
              </label>
            ) : (
              <div className="relative">
                <img 
                  src={photoData} 
                  alt="Evidence" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setPhotoData(null)}
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Location Status */}
          <div className="mb-6">
            <div className="bg-black/30 rounded-lg p-4 flex items-center gap-3">
              {location ? (
                <>
                  <div className="text-2xl">📍</div>
                  <div>
                    <p className="text-sm font-medium text-white">Location captured</p>
                    <p className="text-xs text-white/60">
                      {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl animate-pulse">📍</div>
                  <p className="text-sm text-white/60">Acquiring location...</p>
                </>
              )}
            </div>
          </div>

          {/* Confirmation Button */}
          <Button
            onClick={handleHandover}
            disabled={!assetId || !location || processing}
            className="w-full py-3"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚡</span>
                Processing Handover...
              </span>
            ) : (
              <span>
                Confirm {mode === 'pickup' ? 'Pickup' : 'Drop-off'}
              </span>
            )}
          </Button>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-white/60 mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => router.push('/srl/tracking/demo-asset-123')}
                className="py-2 px-3 bg-white/5 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors"
              >
                View Recent
              </button>
              <button
                onClick={() => router.push('/srl/compliance')}
                className="py-2 px-3 bg-white/5 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors"
              >
                Compliance
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-optimized footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/40">
            Genesis ReLoop SRL System
          </p>
          <p className="text-xs text-white/40 mt-1">
            Verified Chain of Custody
          </p>
        </div>
      </div>
    </div>
  )
}
