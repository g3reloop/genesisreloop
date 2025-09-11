'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { chainOfCustody } from '@/lib/srl/chain-of-custody'
import type { FeedstockDeclaration } from '@/types/srl-domain'

export default function FeedstockEntrustmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [declaration, setDeclaration] = useState<Partial<FeedstockDeclaration>>({
    feedstockType: 'UCO',
    composition: '',
    estimatedWeight: 0,
    knownContaminants: ''
  })
  const [terms, setTerms] = useState({
    propertySewardship: false,
    dutyOfCare: false,
    truthAndHonour: false,
    consentToProcess: false
  })
  const [photoFiles, setPhotoFiles] = useState<File[]>([])

  const allTermsAccepted = Object.values(terms).every(v => v)

  const handleSubmit = async () => {
    if (!allTermsAccepted) return
    setLoading(true)

    try {
      // In production, upload photos and get URLs
      const photoUrls = photoFiles.map(f => URL.createObjectURL(f))
      
      const fullDeclaration: FeedstockDeclaration = {
        feedstockType: declaration.feedstockType as any,
        composition: declaration.composition || '',
        estimatedWeight: declaration.estimatedWeight || 0,
        knownContaminants: declaration.knownContaminants,
        photoEvidenceUrls: photoUrls,
        entrustorSignature: 'digital-sig-placeholder', // Would use WebAuthn
        timestamp: new Date().toISOString()
      }

      // Create asset in Chain of Custody
      const asset = await chainOfCustody.createAssetEntrustment(
        'agreement-' + Date.now(),
        'entrustor-voc-123', // Would come from auth
        'custodian-voc-456', // Selected custodian
        fullDeclaration
      )

      router.push(`/srl/tracking/${asset.assetId}`)
    } catch (error) {
      console.error('Failed to create entrustment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mythic-obsidian to-black p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-2xl p-8 border border-mythic-primary/20">
          <h1 className="text-3xl font-bold text-mythic-primary mb-2">
            Feedstock Entrustment Agreement
          </h1>
          <p className="text-white/70 mb-8">
            Transform your waste into valuable resources through the Genesis ReLoop SRL system
          </p>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-mythic-primary' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Step 1: Feedstock Declaration
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Feedstock Type
                </label>
                <select
                  className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                  value={declaration.feedstockType}
                  onChange={e => setDeclaration({...declaration, feedstockType: e.target.value as any})}
                >
                  <option value="UCO">Used Cooking Oil (UCO)</option>
                  <option value="FoodWaste">Food Waste</option>
                  <option value="AgriculturalWaste">Agricultural Waste</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Composition Description
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                  rows={4}
                  placeholder="Describe the composition of your feedstock..."
                  value={declaration.composition}
                  onChange={e => setDeclaration({...declaration, composition: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Estimated Weight (kg)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                  value={declaration.estimatedWeight}
                  onChange={e => setDeclaration({...declaration, estimatedWeight: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Known Contaminants (if any)
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-black/50 border border-mythic-primary/30 rounded-lg text-white focus:border-mythic-primary focus:outline-none"
                  rows={3}
                  placeholder="List any known contaminants..."
                  value={declaration.knownContaminants}
                  onChange={e => setDeclaration({...declaration, knownContaminants: e.target.value})}
                />
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                Continue to Evidence Upload
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Step 2: Evidence Upload
              </h2>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Representative Photos
                </label>
                <div className="border-2 border-dashed border-mythic-primary/30 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={e => setPhotoFiles(Array.from(e.target.files || []))}
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="text-mythic-primary mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <span className="text-white/70">
                      Click to upload photos or drag and drop
                    </span>
                  </label>
                </div>
                {photoFiles.length > 0 && (
                  <p className="mt-2 text-sm text-mythic-primary">
                    {photoFiles.length} file(s) selected
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue to Terms
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Step 3: Legal Terms & Principles
              </h2>

              <div className="bg-black/30 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-mythic-primary">
                  Truth and Honour Declaration
                </h3>
                <p className="text-sm text-white/70">
                  By accepting these terms, you declare that all information provided
                  about the feedstock is true and accurate to the best of your knowledge.
                </p>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={terms.truthAndHonour}
                    onChange={e => setTerms({...terms, truthAndHonour: e.target.checked})}
                  />
                  <span className="text-sm text-white/80">
                    I declare under the principle of <strong>Truth and Honour</strong> that
                    all information provided is accurate and I have not concealed any
                    hazardous components.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={terms.propertySewardship}
                    onChange={e => setTerms({...terms, propertySewardship: e.target.checked})}
                  />
                  <span className="text-sm text-white/80">
                    I understand the principle of <strong>Property Stewardship</strong> and
                    that my feedstock will be treated as entrusted property.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={terms.dutyOfCare}
                    onChange={e => setTerms({...terms, dutyOfCare: e.target.checked})}
                  />
                  <span className="text-sm text-white/80">
                    I acknowledge the <strong>Duty of Care</strong> that will be applied
                    to prevent harm from spillage, contamination, or improper transport.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={terms.consentToProcess}
                    onChange={e => setTerms({...terms, consentToProcess: e.target.checked})}
                  />
                  <span className="text-sm text-white/80">
                    I give my informed <strong>Consent</strong> for the feedstock to be
                    processed within the SRL system and understand this is revocable.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!allTermsAccepted || loading}
                  className="flex-1"
                >
                  {loading ? 'Creating Agreement...' : 'Submit Entrustment'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
