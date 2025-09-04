'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Building2, 
  MapPin, 
  FileCheck, 
  Users, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react'

type UserRole = 'supplier' | 'processor' | 'buyer'
type OnboardingStep = 'business' | 'location' | 'operations' | 'team' | 'review'

interface StepConfig {
  id: OnboardingStep
  title: string
  description: string
  icon: any
}

const steps: StepConfig[] = [
  {
    id: 'business',
    title: 'Business Details',
    description: 'Tell us more about your business',
    icon: Building2
  },
  {
    id: 'location',
    title: 'Location & Address',
    description: 'Where is your business located',
    icon: MapPin
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Your operational details',
    icon: FileCheck
  },
  {
    id: 'team',
    title: 'Team & Contacts',
    description: 'Key people in your organization',
    icon: Users
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your application',
    icon: CheckCircle2
  }
]

interface OnboardingData {
  // Business Details
  website?: string
  vatNumber?: string
  companyNumber?: string
  businessDescription?: string
  
  // Location
  addressLine1?: string
  addressLine2?: string
  city?: string
  county?: string
  postcode?: string
  country?: string
  
  // Operations (role-specific)
  wasteStreams?: string[]
  monthlyVolume?: string
  volumeUnit?: string
  certifications?: string[]
  processingCapacity?: string
  processingTypes?: string[]
  purchaseCategories?: string[]
  
  // Team
  primaryContactName?: string
  primaryContactRole?: string
  primaryContactEmail?: string
  primaryContactPhone?: string
  
  // Agreement
  termsAccepted?: boolean
  dataProcessingAccepted?: boolean
}

const wasteStreamOptions = [
  'Used Cooking Oil (UCO)',
  'Food Waste - Pre-consumer',
  'Food Waste - Post-consumer',
  'Agricultural Waste',
  'Other Organic Waste'
]

const certificationOptions = [
  'ISO 14001',
  'ISO 9001',
  'ISCC',
  'RED II Compliance',
  'Safe Contractor',
  'Other'
]

const processingTypeOptions = [
  'Biodiesel Production',
  'Biogas/Anaerobic Digestion',
  'Composting',
  'Animal Feed Processing',
  'Other'
]

const purchaseCategoryOptions = [
  'Biodiesel (B100)',
  'Biogas/Biomethane',
  'Compost/Soil Products',
  'Animal Feed',
  'Carbon Credits',
  'Other Processed Products'
]

export default function OnboardingStepper() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('business')
  const [data, setData] = useState<OnboardingData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('supplier')
  const [userId, setUserId] = useState<string>('')
  
  const router = useRouter()

  useEffect(() => {
    loadOnboardingState()
  }, [])

  const loadOnboardingState = async () => {
    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    setUserId(user.id)

    // Load profile to get role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      setRole(profile.role)
    }

    // Load onboarding state
    const { data: onboardingState } = await supabase
      .from('onboarding_states')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (onboardingState) {
      setData(onboardingState.data || {})
      if (onboardingState.completed) {
        router.push('/dashboard')
      }
    }
  }

  const saveProgress = async () => {
    const supabase = createClientComponentClient()
    const { error } = await supabase
      .from('onboarding_states')
      .update({ 
        data,
        step: steps.findIndex(s => s.id === currentStep) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to save progress:', error)
    }
  }

  const validateStep = (step: OnboardingStep): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 'business':
        if (role === 'supplier' && !data.wasteStreams?.length) {
          newErrors.wasteStreams = 'Please select at least one waste stream'
        }
        if (role === 'supplier' && !data.monthlyVolume) {
          newErrors.monthlyVolume = 'Please specify your monthly volume'
        }
        break

      case 'location':
        if (!data.addressLine1) newErrors.addressLine1 = 'Address is required'
        if (!data.city) newErrors.city = 'City is required'
        if (!data.postcode) newErrors.postcode = 'Postcode is required'
        break

      case 'operations':
        if (role === 'processor' && !data.processingTypes?.length) {
          newErrors.processingTypes = 'Please select processing capabilities'
        }
        if (role === 'buyer' && !data.purchaseCategories?.length) {
          newErrors.purchaseCategories = 'Please select purchase categories'
        }
        break

      case 'team':
        if (!data.primaryContactName) newErrors.primaryContactName = 'Contact name is required'
        if (!data.primaryContactEmail) newErrors.primaryContactEmail = 'Contact email is required'
        break

      case 'review':
        if (!data.termsAccepted) newErrors.terms = 'You must accept the terms'
        if (!data.dataProcessingAccepted) newErrors.dataProcessing = 'You must accept data processing'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    await saveProgress()

    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep('review')) return

    setLoading(true)
    try {
      const supabase = createClientComponentClient()
      // Update onboarding state as submitted
      const { error } = await supabase
        .from('onboarding_states')
        .update({ 
          data,
          completed: true,
          submitted: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error

      // Update profile with additional details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          website: data.website,
          address: {
            line1: data.addressLine1,
            line2: data.addressLine2,
            city: data.city,
            county: data.county,
            postcode: data.postcode,
            country: data.country || 'UK'
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (profileError) throw profileError

      // Redirect to application submitted page
      router.push('/onboarding/submitted')
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`flex items-center ${index > 0 ? 'w-full' : ''}`}>
                    {index > 0 && (
                      <div className={`h-1 w-full mr-2 ${
                        isCompleted ? 'bg-mythic-primary-500' : 'bg-gray-700'
                      }`} />
                    )}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        isActive
                          ? 'bg-mythic-primary-500 text-black'
                          : isCompleted
                          ? 'bg-mythic-primary-500/20 text-mythic-primary-500'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  {index === steps.length - 1 && (
                    <div className={`h-1 w-full ml-2 ${
                      isCompleted ? 'bg-mythic-primary-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map(step => (
              <div key={step.id} className="flex-1 text-center">
                <p className={`text-xs ${
                  step.id === currentStep
                    ? 'text-mythic-primary-500 font-semibold'
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="bg-mythic-dark-900/50 border-mythic-primary-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-mythic-text-primary">
              {steps.find(s => s.id === currentStep)?.title}
            </CardTitle>
            <CardDescription className="text-mythic-text-muted">
              {steps.find(s => s.id === currentStep)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Details Step */}
            {currentStep === 'business' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={data.website || ''}
                      onChange={(e) => updateData('website', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input
                      id="vatNumber"
                      placeholder="GB123456789"
                      value={data.vatNumber || ''}
                      onChange={(e) => updateData('vatNumber', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                  </div>
                </div>

                {role === 'supplier' && (
                  <>
                    <div className="space-y-2">
                      <Label>Waste Streams <span className="text-red-500">*</span></Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {wasteStreamOptions.map(stream => (
                          <div key={stream} className="flex items-center space-x-2">
                            <Checkbox
                              id={stream}
                              checked={data.wasteStreams?.includes(stream) || false}
                              onCheckedChange={(checked) => {
                                const current = data.wasteStreams || []
                                if (checked) {
                                  updateData('wasteStreams', [...current, stream])
                                } else {
                                  updateData('wasteStreams', current.filter(s => s !== stream))
                                }
                              }}
                            />
                            <label
                              htmlFor={stream}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {stream}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.wasteStreams && (
                        <p className="text-sm text-red-500">{errors.wasteStreams}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyVolume">
                          Monthly Volume <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="monthlyVolume"
                          type="number"
                          placeholder="e.g., 500"
                          value={data.monthlyVolume || ''}
                          onChange={(e) => updateData('monthlyVolume', e.target.value)}
                          className="bg-[var(--field-bg)] border-[var(--field-border)]"
                        />
                        {errors.monthlyVolume && (
                          <p className="text-sm text-red-500">{errors.monthlyVolume}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="volumeUnit">Unit</Label>
                        <Select 
                          value={data.volumeUnit || 'kg'} 
                          onValueChange={(value) => updateData('volumeUnit', value)}
                        >
                          <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="liters">Liters (L)</SelectItem>
                            <SelectItem value="tonnes">Tonnes (t)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Tell us about your business..."
                    value={data.businessDescription || ''}
                    onChange={(e) => updateData('businessDescription', e.target.value)}
                    className="bg-[var(--field-bg)] border-[var(--field-border)] min-h-[100px]"
                  />
                </div>
              </>
            )}

            {/* Location Step */}
            {currentStep === 'location' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    placeholder="Street address"
                    value={data.addressLine1 || ''}
                    onChange={(e) => updateData('addressLine1', e.target.value)}
                    className="bg-[var(--field-bg)] border-[var(--field-border)]"
                  />
                  {errors.addressLine1 && (
                    <p className="text-sm text-red-500">{errors.addressLine1}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apartment, suite, etc."
                    value={data.addressLine2 || ''}
                    onChange={(e) => updateData('addressLine2', e.target.value)}
                    className="bg-[var(--field-bg)] border-[var(--field-border)]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={data.city || ''}
                      onChange={(e) => updateData('city', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      placeholder="County"
                      value={data.county || ''}
                      onChange={(e) => updateData('county', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postcode">
                      Postcode <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="postcode"
                      placeholder="Postcode"
                      value={data.postcode || ''}
                      onChange={(e) => updateData('postcode', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                    {errors.postcode && (
                      <p className="text-sm text-red-500">{errors.postcode}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={data.country || 'UK'} 
                      onValueChange={(value) => updateData('country', value)}
                    >
                      <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="IE">Ireland</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Operations Step */}
            {currentStep === 'operations' && (
              <>
                {role === 'processor' && (
                  <>
                    <div className="space-y-2">
                      <Label>
                        Processing Capabilities <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {processingTypeOptions.map(type => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={data.processingTypes?.includes(type) || false}
                              onCheckedChange={(checked) => {
                                const current = data.processingTypes || []
                                if (checked) {
                                  updateData('processingTypes', [...current, type])
                                } else {
                                  updateData('processingTypes', current.filter(t => t !== type))
                                }
                              }}
                            />
                            <label
                              htmlFor={type}
                              className="text-sm font-medium leading-none"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.processingTypes && (
                        <p className="text-sm text-red-500">{errors.processingTypes}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processingCapacity">Processing Capacity (monthly)</Label>
                      <Input
                        id="processingCapacity"
                        placeholder="e.g., 1000 tonnes"
                        value={data.processingCapacity || ''}
                        onChange={(e) => updateData('processingCapacity', e.target.value)}
                        className="bg-[var(--field-bg)] border-[var(--field-border)]"
                      />
                    </div>
                  </>
                )}

                {role === 'buyer' && (
                  <div className="space-y-2">
                    <Label>
                      Purchase Categories <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {purchaseCategoryOptions.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={data.purchaseCategories?.includes(category) || false}
                            onCheckedChange={(checked) => {
                              const current = data.purchaseCategories || []
                              if (checked) {
                                updateData('purchaseCategories', [...current, category])
                              } else {
                                updateData('purchaseCategories', current.filter(c => c !== category))
                              }
                            }}
                          />
                          <label
                            htmlFor={category}
                            className="text-sm font-medium leading-none"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.purchaseCategories && (
                      <p className="text-sm text-red-500">{errors.purchaseCategories}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Certifications</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {certificationOptions.map(cert => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={data.certifications?.includes(cert) || false}
                          onCheckedChange={(checked) => {
                            const current = data.certifications || []
                            if (checked) {
                              updateData('certifications', [...current, cert])
                            } else {
                              updateData('certifications', current.filter(c => c !== cert))
                            }
                          }}
                        />
                        <label
                          htmlFor={cert}
                          className="text-sm font-medium leading-none"
                        >
                          {cert}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Team Step */}
            {currentStep === 'team' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContactName">
                      Primary Contact Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="primaryContactName"
                      placeholder="Full name"
                      value={data.primaryContactName || ''}
                      onChange={(e) => updateData('primaryContactName', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                    {errors.primaryContactName && (
                      <p className="text-sm text-red-500">{errors.primaryContactName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryContactRole">Role/Title</Label>
                    <Input
                      id="primaryContactRole"
                      placeholder="e.g., Operations Manager"
                      value={data.primaryContactRole || ''}
                      onChange={(e) => updateData('primaryContactRole', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContactEmail">
                      Contact Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="primaryContactEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={data.primaryContactEmail || ''}
                      onChange={(e) => updateData('primaryContactEmail', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                    {errors.primaryContactEmail && (
                      <p className="text-sm text-red-500">{errors.primaryContactEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryContactPhone">Contact Phone</Label>
                    <Input
                      id="primaryContactPhone"
                      type="tel"
                      placeholder="+44 20 1234 5678"
                      value={data.primaryContactPhone || ''}
                      onChange={(e) => updateData('primaryContactPhone', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <>
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      Please review your information before submitting. You can go back to make changes.
                    </AlertDescription>
                  </Alert>

                  {/* Summary of key information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-mythic-text-primary mb-2">Business Information</h4>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-mythic-text-muted">Role:</dt>
                          <dd className="text-mythic-text-primary capitalize">{role}</dd>
                        </div>
                        {data.website && (
                          <div className="flex justify-between">
                            <dt className="text-mythic-text-muted">Website:</dt>
                            <dd className="text-mythic-text-primary">{data.website}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-semibold text-mythic-text-primary mb-2">Location</h4>
                      <p className="text-sm text-mythic-text-muted">
                        {data.addressLine1}, {data.city}, {data.postcode}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-mythic-text-primary mb-2">Primary Contact</h4>
                      <p className="text-sm text-mythic-text-muted">
                        {data.primaryContactName} - {data.primaryContactEmail}
                      </p>
                    </div>
                  </div>

                  {/* Terms acceptance */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={data.termsAccepted || false}
                        onCheckedChange={(checked) => updateData('termsAccepted', checked)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        I agree to the Genesis Reloop Terms of Service and acknowledge that my business
                        information will be reviewed for verification purposes.
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-sm text-red-500 ml-6">{errors.terms}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="dataProcessing"
                        checked={data.dataProcessingAccepted || false}
                        onCheckedChange={(checked) => updateData('dataProcessingAccepted', checked)}
                      />
                      <label
                        htmlFor="dataProcessing"
                        className="text-sm leading-relaxed cursor-pointer"
                      >
                        I consent to the processing of my business data in accordance with the
                        Privacy Policy and GDPR regulations.
                      </label>
                    </div>
                    {errors.dataProcessing && (
                      <p className="text-sm text-red-500 ml-6">{errors.dataProcessing}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>

          {/* Navigation */}
          <div className="p-6 pt-0 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'business'}
              className="border-mythic-primary-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep === 'review' ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
