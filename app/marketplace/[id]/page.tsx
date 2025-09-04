'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Building2,
  ShieldCheck,
  MessageCircle,
  Phone,
  Globe,
  Award,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Truck
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Listing {
  id: string
  title: string
  description: string
  category: string
  waste_stream: string
  quantity: number
  unit: string
  price: number
  currency: string
  incoterms?: string
  location: {
    city?: string
    country?: string
  }
  certifications?: string[]
  media?: {
    images?: string[]
  }
  status: 'active' | 'paused' | 'sold' | 'archived'
  created_at: string
  seller_id: string
  profiles: {
    id: string
    business_name: string
    business_type: string
    verified: boolean
    role: string
    email: string
    phone?: string
    website?: string
    address?: {
      city?: string
      country?: string
    }
  }
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadListing()
    checkUser()
  }, [params.id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
    }
  }

  const loadListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!seller_id (
            id,
            business_name,
            business_type,
            verified,
            role,
            email,
            phone,
            website,
            address
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      setListing(data)
    } catch (error) {
      console.error('Error loading listing:', error)
      toast.error('Failed to load listing')
      router.push('/marketplace')
    } finally {
      setLoading(false)
    }
  }

  const handleMessageSeller = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

    if (!listing) return

    try {
      // Check if conversation already exists
      const { data: existingConvo } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('buyer_id', userId)
        .single()

      if (existingConvo) {
        // Conversation exists, navigate to it
        router.push(`/messages/${existingConvo.id}`)
      } else {
        // Create new conversation
        const { data: newConvo, error } = await supabase
          .from('conversations')
          .insert({
            listing_id: listing.id,
            buyer_id: userId,
            seller_id: listing.seller_id
          })
          .select()
          .single()

        if (error) throw error

        router.push(`/messages/${newConvo.id}`)
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast.error('Failed to start conversation')
    }
  }

  const nextImage = () => {
    if (listing?.media?.images) {
      setCurrentImageIndex((prev) => 
        prev === listing.media.images!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (listing?.media?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.media.images!.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="animate-pulse">
          <Package className="h-16 w-16 text-mythic-primary/30" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-mythic-primary/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-mythic-text-primary mb-2">
            Listing not found
          </h2>
          <Button onClick={() => router.push('/marketplace')}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    )
  }

  const isOwner = userId === listing.seller_id

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 overflow-hidden">
              <div className="relative h-96">
                {listing.media?.images && listing.media.images.length > 0 ? (
                  <>
                    <img
                      src={listing.media.images[currentImageIndex]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.media.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-6 w-6 text-white" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-6 w-6 text-white" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {listing.media.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? 'bg-mythic-primary'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-mythic-dark-800">
                    <Package className="h-24 w-24 text-mythic-primary/30" />
                  </div>
                )}
              </div>
            </Card>

            {/* Listing Details */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-mythic-text-primary">
                      {listing.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="border-mythic-primary/50">
                        {listing.category}
                      </Badge>
                      <Badge variant="outline" className="border-mythic-accent-300/50">
                        {listing.waste_stream}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-mythic-primary">
                      £{listing.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-mythic-text-muted">
                      per {listing.unit}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-mythic-text-primary mb-2">
                    Description
                  </h3>
                  <p className="text-mythic-text-muted whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-mythic-text-muted mb-1">
                      Available Quantity
                    </h4>
                    <p className="text-mythic-text-primary">
                      {listing.quantity} {listing.unit}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-mythic-text-muted mb-1">
                      Location
                    </h4>
                    <p className="text-mythic-text-primary flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.location.city}, {listing.location.country || 'UK'}
                    </p>
                  </div>

                  {listing.incoterms && (
                    <div>
                      <h4 className="text-sm font-medium text-mythic-text-muted mb-1">
                        Incoterms
                      </h4>
                      <p className="text-mythic-text-primary">
                        {listing.incoterms}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-mythic-text-muted mb-1">
                      Listed On
                    </h4>
                    <p className="text-mythic-text-primary flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Certifications */}
                {listing.certifications && listing.certifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-mythic-text-primary mb-2 flex items-center gap-2">
                      <Award className="h-5 w-5 text-mythic-primary" />
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-mythic-primary/10 text-mythic-primary border-mythic-primary/30"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-mythic-primary" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-mythic-text-primary">
                      {listing.profiles.business_name}
                    </h3>
                    {listing.profiles.verified && (
                      <Badge variant="outline" className="border-mythic-primary/50 text-mythic-primary">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-mythic-text-muted">
                    {listing.profiles.business_type}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pt-2 border-t border-mythic-primary/10">
                  {listing.profiles.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-mythic-text-muted" />
                      <span className="text-mythic-text-muted">
                        {listing.profiles.phone}
                      </span>
                    </div>
                  )}
                  
                  {listing.profiles.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-mythic-text-muted" />
                      <a
                        href={listing.profiles.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mythic-primary hover:underline"
                      >
                        {listing.profiles.website}
                      </a>
                    </div>
                  )}
                  
                  {listing.profiles.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-mythic-text-muted" />
                      <span className="text-mythic-text-muted">
                        {listing.profiles.address.city}, {listing.profiles.address.country || 'UK'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isOwner && (
                  <div className="pt-4 border-t border-mythic-primary/10 space-y-2">
                    <Button
                      onClick={handleMessageSeller}
                      className="w-full bg-mythic-primary hover:bg-mythic-primary/90 text-black font-semibold"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Seller
                    </Button>
                    <Button
                      onClick={() => {
                        // Store listing in session storage for route planner
                        const routeStop = {
                          id: listing.id,
                          name: listing.title,
                          address: `${listing.location.city}, ${listing.location.country || 'UK'}`,
                          lat: 0, // Will be geocoded in route planner
                          lng: 0,
                          demand: listing.quantity
                        }
                        
                        // Get existing stops or create new array
                        const existingStops = JSON.parse(sessionStorage.getItem('routePlannerStops') || '[]')
                        
                        // Check if this stop already exists
                        if (!existingStops.find((s: any) => s.id === listing.id)) {
                          existingStops.push(routeStop)
                          sessionStorage.setItem('routePlannerStops', JSON.stringify(existingStops))
                        }
                        
                        router.push('/logistics/route-planner')
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Add to Route
                    </Button>
                  </div>
                )}

                {isOwner && (
                  <div className="pt-4 border-t border-mythic-primary/10 space-y-2">
                    <Button
                      onClick={() => router.push(`/marketplace/edit/${listing.id}`)}
                      variant="outline"
                      className="w-full"
                    >
                      Edit Listing
                    </Button>
                    <p className="text-xs text-center text-mythic-text-muted">
                      This is your listing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-mythic-text-muted">
                      Total Value
                    </dt>
                    <dd className="text-xl font-semibold text-mythic-primary">
                      £{(listing.price * listing.quantity).toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-mythic-text-muted">
                      Minimum Order
                    </dt>
                    <dd className="text-mythic-text-primary">
                      No minimum specified
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-mythic-text-muted">
                      Payment Terms
                    </dt>
                    <dd className="text-mythic-text-primary">
                      Negotiable
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
            Similar Listings
          </h2>
          <p className="text-mythic-text-muted">
            Feature coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
