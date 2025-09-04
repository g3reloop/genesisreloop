'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Package, 
  Building2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight 
} from 'lucide-react'
import { motion } from 'framer-motion'
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
  location: {
    city?: string
    country?: string
  }
  status: 'active' | 'paused' | 'sold' | 'archived'
  created_at: string
  seller_id: string
  profiles: {
    id: string
    business_name: string
    verified: boolean
    role: string
  }
  media?: {
    images?: string[]
  }
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Used Cooking Oil', label: 'Used Cooking Oil' },
  { value: 'Food Waste', label: 'Food Waste' },
  { value: 'Agricultural Waste', label: 'Agricultural Waste' },
  { value: 'Packaging Waste', label: 'Packaging Waste' },
  { value: 'Other', label: 'Other' }
]

const wasteStreams = [
  'All Waste Streams',
  'Used Cooking Oil (UCO)',
  'Food Waste - Pre-consumer',
  'Food Waste - Post-consumer',
  'Agricultural Waste',
  'Other Organic Waste'
]

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedWasteStream, setSelectedWasteStream] = useState('All Waste Streams')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadListings()
    checkUserRole()
  }, [])

  useEffect(() => {
    filterListings()
  }, [listings, searchQuery, selectedCategory, selectedWasteStream, priceRange])

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setUserRole(profile.role)
      }
    }
  }

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!seller_id (
            id,
            business_name,
            verified,
            role
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      setListings(data || [])
      setFilteredListings(data || [])
    } catch (error) {
      console.error('Error loading listings:', error)
      toast.error('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = [...listings]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.profiles.business_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory)
    }

    // Waste stream filter
    if (selectedWasteStream !== 'All Waste Streams') {
      filtered = filtered.filter(listing => listing.waste_stream === selectedWasteStream)
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(listing => listing.price >= parseFloat(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(listing => listing.price <= parseFloat(priceRange.max))
    }

    setFilteredListings(filtered)
  }

  const canCreateListing = userRole === 'supplier' || userRole === 'processor' || userRole === 'admin'
  
  // Get paginated listings
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedListings = filteredListings.slice(startIndex, endIndex)
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedWasteStream, priceRange])

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-mythic-primary to-mythic-accent bg-clip-text text-transparent">
              Genesis Reloop Marketplace
            </h1>
            <p className="text-sm sm:text-base text-mythic-text-muted mt-1 sm:mt-2">
              Transform waste into value through our circular economy network
            </p>
          </div>
          
          {canCreateListing && (
            <Button
              onClick={() => router.push('/marketplace/add')}
              className="bg-mythic-primary hover:bg-mythic-primary/90 text-black font-semibold w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="glass rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
              <Input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)] text-sm sm:text-base"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1 sm:flex-initial sm:w-[200px] bg-[var(--field-bg)] border-[var(--field-border)] text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-mythic-primary/20 text-sm sm:text-base"
                size={"sm"}
              >
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-mythic-primary/20">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="wasteStream" className="text-sm">Waste Stream</Label>
                <Select value={selectedWasteStream} onValueChange={setSelectedWasteStream}>
                  <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)] text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteStreams.map(stream => (
                      <SelectItem key={stream} value={stream}>
                        {stream}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="priceMin" className="text-sm">Min Price (£)</Label>
                <Input
                  id="priceMin"
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="bg-[var(--field-bg)] border-[var(--field-border)] text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="priceMax" className="text-sm">Max Price (£)</Label>
                <Input
                  id="priceMax"
                  type="number"
                  placeholder="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="bg-[var(--field-bg)] border-[var(--field-border)] text-sm sm:text-base"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-sm sm:text-base text-mythic-text-muted">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredListings.length)} of {filteredListings.length}
          </p>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="perPage" className="text-xs sm:text-sm text-mythic-text-muted">Per page:</Label>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(parseInt(value))
              setCurrentPage(1)
            }}>
              <SelectTrigger id="perPage" className="w-[70px] sm:w-[80px] h-7 sm:h-8 bg-[var(--field-bg)] border-[var(--field-border)] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : paginatedListings.length > 0 ? (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="bg-mythic-dark-900/50 border-mythic-primary/20 hover:border-mythic-primary/40 transition-all duration-300 cursor-pointer h-full"
                  onClick={() => router.push(`/marketplace/${listing.id}`)}
                >
                  {/* Image or Placeholder */}
                  <div className="relative h-48 bg-mythic-dark-800 rounded-t-lg overflow-hidden">
                    {listing.media?.images?.[0] ? (
                      <img
                        src={listing.media.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-mythic-primary/30" />
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur rounded px-2 py-1">
                      <span className="text-mythic-primary font-semibold">
                        £{listing.price.toFixed(2)}/{listing.unit}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-1 text-mythic-text-primary">
                      {listing.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-mythic-text-muted">
                      {listing.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Quantity and Location */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-mythic-text-muted">
                        {listing.quantity} {listing.unit} available
                      </span>
                      <span className="flex items-center gap-1 text-mythic-text-muted">
                        <MapPin className="h-3 w-3" />
                        {listing.location?.city || 'Location TBA'}
                      </span>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-mythic-primary/10">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-mythic-text-muted" />
                        <span className="text-sm text-mythic-text-muted">
                          {listing.profiles.business_name}
                        </span>
                      </div>
                      {listing.profiles.verified && (
                        <Badge variant="outline" className="border-mythic-primary/50 text-mythic-primary">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* View Details Link */}
                    <div className="flex items-center justify-end text-mythic-primary text-sm font-medium group">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="border-mythic-primary/20"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-mythic-primary/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {/* Show page numbers */}
                {(() => {
                  const pages = []
                  const maxButtons = 5
                  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
                  let endPage = Math.min(totalPages, startPage + maxButtons - 1)
                  
                  if (endPage - startPage < maxButtons - 1) {
                    startPage = Math.max(1, endPage - maxButtons + 1)
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={i === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i)}
                        className={i === currentPage 
                          ? "bg-mythic-primary text-black" 
                          : "border-mythic-primary/20"}
                      >
                        {i}
                      </Button>
                    )
                  }
                  return pages
                })()}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-mythic-primary/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="border-mythic-primary/20"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-mythic-primary/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-mythic-text-primary mb-2">
              No listings found
            </h3>
            <p className="text-mythic-text-muted">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
