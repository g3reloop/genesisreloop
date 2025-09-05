'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Building2,
  Globe,
  FileCheck,
  ArrowRight,
  Loader2,
  Upload,
  X
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VerificationForm {
  companyNumber: string
  website: string
  documents: File[]
}

interface Profile {
  id: string
  business_name: string
  email: string
  verified: boolean
  verification_score: number
  website?: string
}

export default function VerificationPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<VerificationForm>({
    companyNumber: '',
    website: '',
    documents: []
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [existingRequest, setExistingRequest] = useState<any>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setForm(prev => ({
          ...prev,
          website: profileData.website || ''
        }))

        // Check for existing verification request
        const { data: requestData } = await supabase
          .from('verification_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (requestData) {
          setExistingRequest(requestData)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.companyNumber) {
      newErrors.companyNumber = 'Company number is required'
    } else if (!/^[A-Z0-9]{8}$/.test(form.companyNumber.toUpperCase())) {
      newErrors.companyNumber = 'Invalid UK company number format'
    }

    const emailDomain = profile?.email.split('@')[1] || ''
    const websiteDomain = form.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]
    
    if (form.website && !isValidUrl(form.website)) {
      newErrors.website = 'Invalid website URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = 5 * 1024 * 1024 // 5MB per file
    const maxFiles = 5

    const validFiles = files.filter((file, index) => {
      if (form.documents.length + index >= maxFiles) {
        toast.error(`Maximum ${maxFiles} documents allowed`)
        return false
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB`)
        return false
      }
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid document type`)
        return false
      }
      return true
    })

    setForm(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles]
    }))
  }

  const removeDocument = (index: number) => {
    setForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    if (!profile) return

    setSubmitting(true)

    try {
      // Upload documents
      const uploadedDocs = []
      for (const doc of form.documents) {
        const fileExt = doc.name.split('.').pop()
        const fileName = `verification/${profile.id}/${Date.now()}-${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('verification-docs')
          .upload(fileName, doc)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('verification-docs')
          .getPublicUrl(fileName)
        
        uploadedDocs.push({
          name: doc.name,
          url: publicUrl,
          type: doc.type
        })
      }

      // Extract email domain
      const emailDomain = profile.email.split('@')[1] || ''

      // Create verification request
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: profile.id,
          company_number: form.companyNumber.toUpperCase(),
          email_domain: emailDomain,
          proofs: uploadedDocs.length > 0 ? { documents: uploadedDocs } : null,
          status: 'pending',
          score: 0 // Will be calculated by the verification service
        })
        .select()
        .single()

      if (error) throw error

      // Trigger verification check (this would be a server-side function in production)
      await checkVerification(data.id)

      toast.success('Verification request submitted successfully!')
      router.push('/verify/status')
    } catch (error: any) {
      console.error('Error submitting verification:', error)
      toast.error(error.message || 'Failed to submit verification request')
    } finally {
      setSubmitting(false)
    }
  }

  // Call Companies House API to verify company
  const checkVerification = async (requestId: string) => {
    try {
      // Call our API route
      const response = await fetch('/api/verify-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyNumber: form.companyNumber,
          emailDomain: profile?.email.split('@')[1] || ''
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update verification request with real score
        await supabase
          .from('verification_requests')
          .update({
            score: data.verification.score,
            notes: `Automated verification: ${data.verification.recommendedAction}. Company: ${data.company.name}`,
            proofs: {
              ...((await supabase.from('verification_requests').select('proofs').eq('id', requestId).single()).data?.proofs || {}),
              companyData: data.company,
              scoreBreakdown: data.verification.scoreBreakdown
            }
          })
          .eq('id', requestId)

        // Auto-approve if score is high enough
        if (data.verification.score >= 80) {
          await supabase
            .from('verification_requests')
            .update({
              status: 'approved',
              updated_at: new Date().toISOString()
            })
            .eq('id', requestId)

          await supabase
            .from('profiles')
            .update({
              verified: true,
              verification_score: data.verification.score
            })
            .eq('id', profile.id)
        }
      } else {
        // Update with error info
        await supabase
          .from('verification_requests')
          .update({
            score: 0,
            notes: data.error || 'Failed to verify company with Companies House'
          })
          .eq('id', requestId)
      }
    } catch (error) {
      console.error('Error checking verification:', error)
      // Update with error
      await supabase
        .from('verification_requests')
        .update({
          score: 0,
          notes: 'Failed to complete automated verification'
        })
        .eq('id', requestId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mythic-primary" />
      </div>
    )
  }

  if (profile?.verified) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
            <CardContent className="text-center py-16">
              <ShieldCheck className="h-20 w-20 text-mythic-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-2">
                Already Verified
              </h2>
              <p className="text-mythic-text-muted mb-4">
                Your business is already verified with a score of {profile.verification_score}/100
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (existingRequest && existingRequest.status === 'pending') {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
            <CardContent className="text-center py-16">
              <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-2">
                Verification Pending
              </h2>
              <p className="text-mythic-text-muted mb-4">
                Your verification request is being reviewed. This usually takes 24-48 hours.
              </p>
              <Button onClick={() => router.push('/verify/status')}>
                Check Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <ShieldCheck className="h-16 w-16 text-mythic-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-mythic-text-primary mb-2">
            Business Verification
          </h1>
          <p className="text-mythic-text-muted">
            Verify your business to unlock full platform features
          </p>
        </div>

        {/* Benefits */}
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 mb-8">
          <CardHeader>
            <CardTitle>Why Get Verified?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-mythic-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-mythic-text-primary">Build Trust</p>
                  <p className="text-sm text-mythic-text-muted">
                    Display a verified badge on your profile and listings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-mythic-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-mythic-text-primary">Priority Support</p>
                  <p className="text-sm text-mythic-text-muted">
                    Get faster response times from our support team
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-mythic-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-mythic-text-primary">Advanced Features</p>
                  <p className="text-sm text-mythic-text-muted">
                    Access premium AI agents and analytics tools
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
            <CardHeader>
              <CardTitle>Verification Information</CardTitle>
              <CardDescription>
                We'll verify your business using Companies House data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Number */}
              <div className="space-y-2">
                <Label htmlFor="companyNumber">
                  UK Company Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
                  <Input
                    id="companyNumber"
                    type="text"
                    placeholder="e.g., 12345678"
                    value={form.companyNumber}
                    onChange={(e) => setForm(prev => ({
                      ...prev,
                      companyNumber: e.target.value.toUpperCase()
                    }))}
                    className="pl-10 bg-[var(--field-bg)] border-[var(--field-border)]"
                    maxLength={8}
                  />
                </div>
                {errors.companyNumber && (
                  <p className="text-sm text-red-500">{errors.companyNumber}</p>
                )}
                <p className="text-xs text-mythic-text-muted">
                  Enter your 8-digit UK company registration number
                </p>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">
                  Business Website
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={form.website}
                    onChange={(e) => setForm(prev => ({
                      ...prev,
                      website: e.target.value
                    }))}
                    className="pl-10 bg-[var(--field-bg)] border-[var(--field-border)]"
                  />
                </div>
                {errors.website && (
                  <p className="text-sm text-red-500">{errors.website}</p>
                )}
                {form.website && profile && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Make sure your website domain matches your business email domain for higher verification score
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Documents */}
              <div className="space-y-2">
                <Label htmlFor="documents">
                  Supporting Documents (Optional)
                </Label>
                <p className="text-sm text-mythic-text-muted mb-2">
                  Upload business certificates, waste carrier licenses, or other relevant documents
                </p>
                
                {form.documents.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {form.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-mythic-dark-800 px-3 py-2 rounded-lg"
                      >
                        <FileCheck className="h-4 w-4 text-mythic-primary" />
                        <span className="text-sm text-mythic-text-primary flex-1 truncate">
                          {doc.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-mythic-text-muted hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={form.documents.length >= 5}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents ({form.documents.length}/5)
                </Button>
              </div>

              {/* Business Info */}
              <Alert>
                <Building2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Business Name:</strong> {profile?.business_name}<br />
                  <strong>Email:</strong> {profile?.email}
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardContent className="pt-0">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-mythic-primary hover:bg-mythic-primary/90 text-black font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Verification
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
