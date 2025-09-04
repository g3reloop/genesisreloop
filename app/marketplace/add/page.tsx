'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft,
  Upload,
  X,
  MapPin,
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ListingForm {
  title: string
  description: string
  category: string
  waste_stream: string
  quantity: string
  unit: string
  price: string
  currency: string
  incoterms?: string
  location: {
    city: string
    country: string
  }
  certifications: string[]
}

const categories = [
  { value: 'Used Cooking Oil', label: 'Used Cooking Oil' },
  { value: 'Food Waste', label: 'Food Waste' },
  { value: 'Agricultural Waste', label: 'Agricultural Waste' },
  { value: 'Packaging Waste', label: 'Packaging Waste' },
  { value: 'Other', label: 'Other' }
]

const wasteStreams = [
  'Used Cooking Oil (UCO)',
  'Food Waste - Pre-consumer',
  'Food Waste - Post-consumer',
  'Agricultural Waste',
  'Other Organic Waste'
]

const units = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'tonnes', label: 'Tonnes (t)' },
  { value: 'liters', label: 'Liters (L)' },
  { value: 'containers', label: 'Containers' },
  { value: 'pallets', label: 'Pallets' }
]

const certifications = [
  'ISCC Certified',
  'RED II Compliant',
  'ISO 14001',
  'Organic Certified',
  'Halal Certified',
  'Other'
]

function AddListingPageContent() {
  const [form, setForm] = useState<ListingForm>({
    title: '',
    description: '',
    category: '',
    waste_stream: '',
    quantity: '',
    unit: 'kg',
    price: '',
    currency: 'GBP',
    location: {
      city: '',
      country: 'UK'
    },
    certifications: []
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = parseInt(process.env.NEXT_PUBLIC_FILE_MAX_MB || '25') * 1024 * 1024
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is ${process.env.NEXT_PUBLIC_FILE_MAX_MB || '25'}MB`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        return false
      }
      return true
    })

    if (images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    setImages(prev => [...prev, ...validFiles])
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.title) newErrors.title = 'Title is required'
    if (!form.description) newErrors.description = 'Description is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (!form.waste_stream) newErrors.waste_stream = 'Waste stream is required'
    if (!form.quantity) newErrors.quantity = 'Quantity is required'
    if (!form.price) newErrors.price = 'Price is required'
    if (!form.location.city) newErrors.city = 'City is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload images to Supabase storage
      const imageUrls: string[] = []
      
      for (const image of images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random()}.${fileExt}`
        
        const { error: uploadError, data } = await supabase.storage
          .from('listing-media')
          .upload(fileName, image)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('listing-media')
          .getPublicUrl(fileName)
        
        imageUrls.push(publicUrl)
      }

      // Create listing
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          seller_id: user.id,
          title: form.title,
          description: form.description,
          category: form.category,
          waste_stream: form.waste_stream,
          quantity: parseFloat(form.quantity),
          unit: form.unit,
          price: parseFloat(form.price),
          currency: form.currency,
          incoterms: form.incoterms || null,
          location: form.location,
          certifications: form.certifications.length > 0 ? form.certifications : null,
          media: imageUrls.length > 0 ? { images: imageUrls } : null,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Listing created successfully!')
      router.push(`/marketplace/${listing.id}`)
    } catch (error: any) {
      console.error('Error creating listing:', error)
      toast.error(error.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field: keyof ListingForm | 'city' | 'country', value: any) => {
    if (field === 'city' || field === 'country') {
      setForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }))
    } else {
      setForm(prev => ({ ...prev, [field]: value }))
    }
    
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
    <div className="min-h-screen bg-black pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/marketplace')}
            className="mb-3 sm:mb-4 p-2 sm:p-2.5"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mythic-text-primary mb-1 sm:mb-2">
            Create New Listing
          </h1>
          <p className="text-mythic-text-muted text-sm sm:text-base">
            List your waste feedstock for the circular economy network
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
                <CardDescription className="text-sm">Provide details about your listing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., High-Quality Used Cooking Oil"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className="bg-[var(--field-bg)] border-[var(--field-border)]"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your waste material, quality, collection frequency, etc."
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    rows={4}
                    className="bg-[var(--field-bg)] border-[var(--field-border)]"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="category" className="text-sm">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.category} onValueChange={(value) => updateForm('category', value)}>
                      <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)] text-sm sm:text-base">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs sm:text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="wasteStream" className="text-sm">
                      Waste Stream <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.waste_stream} onValueChange={(value) => updateForm('waste_stream', value)}>
                      <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)] text-sm sm:text-base">
                        <SelectValue placeholder="Select waste stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteStreams.map(stream => (
                          <SelectItem key={stream} value={stream}>
                            {stream}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.waste_stream && (
                      <p className="text-xs sm:text-sm text-red-500">{errors.waste_stream}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Pricing */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Quantity & Pricing</CardTitle>
                <CardDescription className="text-sm">Specify available quantity and your pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 500"
                      value={form.quantity}
                      onChange={(e) => updateForm('quantity', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                    {errors.quantity && (
                      <p className="text-sm text-red-500">{errors.quantity}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={form.unit} onValueChange={(value) => updateForm('unit', value)}>
                      <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price per Unit <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 25.00"
                      value={form.price}
                      onChange={(e) => updateForm('price', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incoterms">Incoterms (optional)</Label>
                    <Input
                      id="incoterms"
                      placeholder="e.g., EXW, FOB, CIF"
                      value={form.incoterms || ''}
                      onChange={(e) => updateForm('incoterms', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where is the material located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g., London"
                      value={form.location.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      className="bg-[var(--field-bg)] border-[var(--field-border)]"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={form.location.country} 
                      onValueChange={(value) => updateForm('country', value)}
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
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader>
                <CardTitle>Certifications (Optional)</CardTitle>
                <CardDescription>Select any relevant certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certifications.map(cert => (
                    <div key={cert} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={cert}
                        checked={form.certifications.includes(cert)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateForm('certifications', [...form.certifications, cert])
                          } else {
                            updateForm('certifications', form.certifications.filter(c => c !== cert))
                          }
                        }}
                        className="w-4 h-4 text-mythic-primary bg-[var(--field-bg)] border-[var(--field-border)] rounded focus:ring-mythic-primary"
                      />
                      <label
                        htmlFor={cert}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-mythic-text-primary"
                      >
                        {cert}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">Images (Optional)</CardTitle>
                <CardDescription className="text-sm">Add up to 5 images of your material</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  {/* Image previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  {images.length < 5 && (
                    <div>
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="images"
                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-mythic-primary/30 rounded-lg cursor-pointer hover:border-mythic-primary/50 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-mythic-primary" />
                        <span className="text-mythic-text-muted">
                          Upload Images ({images.length}/5)
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-mythic-primary hover:bg-mythic-primary/90 text-black font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Create Listing
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AddListingPage() {
  return (
    <AuthGuard 
      requiredRoles={['supplier', 'processor']}
      requireVerified={true}
      requireOnboarded={true}
    >
      <AddListingPageContent />
    </AuthGuard>
  )
}
