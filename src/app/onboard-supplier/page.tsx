'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Upload,
  MapPin,
  Scale,
  AlertCircle,
  Package
} from 'lucide-react'

type Step = 'company' | 'waste' | 'logistics' | 'compliance' | 'review'

const steps: { id: Step; title: string; description: string }[] = [
  { id: 'company', title: 'Company Details', description: 'Tell us about your business' },
  { id: 'waste', title: 'Waste Streams', description: 'What materials do you generate?' },
  { id: 'logistics', title: 'Collection Details', description: 'How can we collect from you?' },
  { id: 'compliance', title: 'Compliance', description: 'Verify regulatory requirements' },
  { id: 'review', title: 'Review & Submit', description: 'Confirm your information' }
]

export default function OnboardSupplierPage() {
  const [currentStep, setCurrentStep] = useState<Step>('company')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Would redirect to dashboard after successful submission
    alert('Application submitted successfully! We will review and get back to you within 24 hours.')
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-black to-mythic-dark-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Supplier Onboarding
            </span>
          </h1>
          <p className="text-mythic-text-muted text-lg">
            Join the Genesis Reloop network and turn your waste into community value
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 relative">
                <div className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                      ${currentStepIndex >= index 
                        ? 'bg-mythic-primary-500 text-mythic-dark-900' 
                        : 'bg-mythic-dark-800 text-mythic-text-muted border border-mythic-primary-500/20'
                      }
                    `}
                  >
                    {currentStepIndex > index ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-2 transition-all
                        ${currentStepIndex > index 
                          ? 'bg-mythic-primary-500' 
                          : 'bg-mythic-dark-800'
                        }
                      `}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-mythic-text-primary">{step.title}</p>
                  <p className="text-xs text-mythic-text-muted hidden sm:block">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="glass border-mythic-primary-500/20">
          <CardHeader>
            <CardTitle>{steps[currentStepIndex].title}</CardTitle>
            <CardDescription>{steps[currentStepIndex].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'company' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-name">Company Name *</Label>
                      <Input 
                        id="company-name" 
                        placeholder="ABC Restaurant Ltd" 
                        className="bg-mythic-dark-900/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="registration">Registration Number</Label>
                      <Input 
                        id="registration" 
                        placeholder="12345678" 
                        className="bg-mythic-dark-900/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="business-type">Business Type *</Label>
                    <Select>
                      <SelectTrigger className="bg-mythic-dark-900/50">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant/Cafe</SelectItem>
                        <SelectItem value="hotel">Hotel/Hospitality</SelectItem>
                        <SelectItem value="catering">Catering Service</SelectItem>
                        <SelectItem value="food-manufacturing">Food Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail/Supermarket</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Business Address *</Label>
                    <Input 
                      id="address" 
                      placeholder="123 High Street, Brighton, BN1 1AA" 
                      className="bg-mythic-dark-900/50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Primary Contact *</Label>
                      <Input 
                        id="contact-name" 
                        placeholder="John Smith" 
                        className="bg-mythic-dark-900/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone Number *</Label>
                      <Input 
                        id="contact-phone" 
                        type="tel" 
                        placeholder="+44 7700 900000" 
                        className="bg-mythic-dark-900/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="waste@company.com" 
                      className="bg-mythic-dark-900/50"
                    />
                  </div>
                </div>
              )}

              {currentStep === 'waste' && (
                <div className="space-y-4">
                  <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-mythic-primary-500/10">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5 text-mythic-primary-500" />
                      Food Waste
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="food-volume">Monthly Volume (kg)</Label>
                        <Input 
                          id="food-volume" 
                          type="number" 
                          placeholder="500" 
                          className="bg-mythic-dark-900/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="food-type">Primary Types</Label>
                        <Input 
                          id="food-type" 
                          placeholder="Kitchen prep waste, plate scrapings" 
                          className="bg-mythic-dark-900/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-mythic-accent-300/10">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5 text-mythic-accent-300" />
                      Used Cooking Oil (UCO)
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="uco-volume">Monthly Volume (Litres)</Label>
                        <Input 
                          id="uco-volume" 
                          type="number" 
                          placeholder="200" 
                          className="bg-mythic-dark-900/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="oil-type">Oil Types</Label>
                        <Select>
                          <SelectTrigger className="bg-mythic-dark-900/50">
                            <SelectValue placeholder="Select oil type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vegetable">Vegetable Oil</SelectItem>
                            <SelectItem value="sunflower">Sunflower Oil</SelectItem>
                            <SelectItem value="mixed">Mixed Oils</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-200 font-medium">Quality Matters</p>
                        <p className="text-sm text-mythic-text-muted mt-1">
                          Higher quality waste (less contamination) earns better rates and priority collection
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'logistics' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collection-access">Collection Access</Label>
                    <Select>
                      <SelectTrigger className="bg-mythic-dark-900/50">
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="street">Street Level</SelectItem>
                        <SelectItem value="rear">Rear Access</SelectItem>
                        <SelectItem value="basement">Basement</SelectItem>
                        <SelectItem value="loading-bay">Loading Bay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="collection-days">Preferred Collection Days</Label>
                    <Input 
                      id="collection-days" 
                      placeholder="Monday, Wednesday, Friday" 
                      className="bg-mythic-dark-900/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="collection-time">Preferred Time Window</Label>
                    <Select>
                      <SelectTrigger className="bg-mythic-dark-900/50">
                        <SelectValue placeholder="Select time window" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6am-12pm)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12pm-6pm)</SelectItem>
                        <SelectItem value="evening">Evening (6pm-10pm)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="storage">Current Storage Method</Label>
                    <Input 
                      id="storage" 
                      placeholder="240L wheelie bins, IBCs for oil" 
                      className="bg-mythic-dark-900/50"
                    />
                  </div>

                  <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-mythic-primary-500/10">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-mythic-primary-500" />
                      Location Verification
                    </h3>
                    <p className="text-sm text-mythic-text-muted mb-3">
                      Click to confirm your collection point on the map
                    </p>
                    <Button variant="outline" className="w-full">
                      Set Collection Point
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'compliance' && (
                <div className="space-y-4">
                  <div className="bg-mythic-dark-900/50 rounded-lg p-4 border border-mythic-primary-500/10">
                    <h3 className="font-semibold mb-3">Required Documents</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-mythic-dark-900/50 rounded-lg">
                        <span className="text-sm">Waste Carrier License</span>
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-mythic-dark-900/50 rounded-lg">
                        <span className="text-sm">Environmental Permit</span>
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-mythic-dark-900/50 rounded-lg">
                        <span className="text-sm">Insurance Certificate</span>
                        <Button size="sm" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="waste-codes">Relevant EWC Codes</Label>
                    <Input 
                      id="waste-codes" 
                      placeholder="20 01 08 (biodegradable kitchen waste)" 
                      className="bg-mythic-dark-900/50"
                    />
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-200 font-medium">Compliance Support</p>
                        <p className="text-sm text-mythic-text-muted mt-1">
                          Genesis Reloop ensures all waste transfers are fully compliant with WTN regulations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'review' && (
                <div className="space-y-4">
                  <div className="bg-mythic-dark-900/50 rounded-lg p-6 border border-mythic-primary-500/10">
                    <h3 className="font-semibold mb-4">Application Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">Business Type:</span>
                        <span>Restaurant/Cafe</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">Food Waste:</span>
                        <span>~500 kg/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">UCO:</span>
                        <span>~200 L/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">Estimated GIRM Credits:</span>
                        <span className="text-mythic-primary-500 font-semibold">~85/month</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg p-6 border border-mythic-primary-500/20">
                    <h3 className="font-semibold mb-2">What Happens Next?</h3>
                    <ul className="space-y-2 text-sm text-mythic-text-muted">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                        <span>Your application will be reviewed within 24 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                        <span>A local collector will contact you to arrange first pickup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                        <span>You'll receive login credentials for the supplier dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-mythic-primary-500 mt-0.5" />
                        <span>Start earning GIRM credits from your first collection</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-mythic-text-muted">
                      I agree to the Genesis Reloop terms of service and confirm that all information provided is accurate
                    </Label>
                  </div>
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className={currentStepIndex === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
