'use client'

import { useState, useEffect } from 'react'
import { FiShoppingCart, FiPlus, FiTruck, FiPackage } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  unit: string
  quantity: number
  category: 'food-waste' | 'cooking-oil' | 'recycled-product'
  status: 'available' | 'pending' | 'sold'
  seller: {
    name: string
    rating: number
    verified: boolean
  }
  location: string
  images: string[]
  createdAt: string
}

// Mock data for demonstration
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Fresh Vegetable Scraps',
    description: 'Mixed vegetable trimmings from restaurant prep, perfect for composting',
    price: 15,
    unit: 'kg',
    quantity: 50,
    category: 'food-waste',
    status: 'available',
    seller: {
      name: 'Green Restaurant',
      rating: 4.8,
      verified: true
    },
    location: 'Downtown District',
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Used Cooking Oil - High Quality',
    description: 'Clean used cooking oil, filtered and ready for biodiesel processing',
    price: 25,
    unit: 'liter',
    quantity: 100,
    category: 'cooking-oil',
    status: 'available',
    seller: {
      name: 'City Diner',
      rating: 4.5,
      verified: true
    },
    location: 'Industrial Zone',
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Recycled Compost Bags',
    description: 'Eco-friendly compost bags made from recycled materials',
    price: 45,
    unit: 'pack',
    quantity: 30,
    category: 'recycled-product',
    status: 'available',
    seller: {
      name: 'EcoProducts Co.',
      rating: 4.9,
      verified: true
    },
    location: 'Green Valley',
    images: ['/api/placeholder/300/200'],
    createdAt: '2024-01-13'
  }
]

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<string[]>([])

  useEffect(() => {
    // Simulate loading data
    const loadListings = async () => {
      setIsLoading(true)
      // In production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setListings(mockListings)
      setFilteredListings(mockListings)
      setIsLoading(false)
    }
    loadListings()
  }, [])

  useEffect(() => {
    // Filter listings
    let filtered = [...listings]
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory)
    }

    // Sort listings
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    }

    setFilteredListings(filtered)
  }, [selectedCategory, sortBy, listings])

  const addToCart = (listingId: string) => {
    if (cartItems.includes(listingId)) {
      toast.error('Item already in cart')
      return
    }
    setCartItems([...cartItems, listingId])
    toast.success('Added to cart')
  }

  const categoryStyles = {
    'food-waste': 'bg-mythic-primary-500/20 text-mythic-primary-400 border border-mythic-primary-500/30',
    'cooking-oil': 'bg-mythic-accent-500/20 text-mythic-accent-400 border border-mythic-accent-500/30',
    'recycled-product': 'bg-mythic-secondary-500/20 text-mythic-secondary-400 border border-mythic-secondary-500/30'
  }

  const categoryIcons = {
    'food-waste': <FiPackage />,
    'cooking-oil': <FiTruck />,
    'recycled-product': <FiShoppingCart />
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent mb-4">Marketplace</h1>
          <p className="text-mythic-text-muted text-lg max-w-2xl mx-auto">Browse and purchase waste materials and recycled products from verified suppliers</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {/* Category Filters */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-mythic-primary-500 text-white'
                  : 'bg-mythic-dark-800 text-mythic-text-muted hover:bg-mythic-primary-500/10 hover:text-mythic-text-primary border border-mythic-primary-500/20'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory('food-waste')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'food-waste'
                  ? 'bg-mythic-primary-500 text-white'
                  : 'bg-mythic-dark-800 text-mythic-text-muted hover:bg-mythic-primary-500/10 hover:text-mythic-text-primary border border-mythic-primary-500/20'
              }`}
            >
              Food Waste
            </button>
            <button
              onClick={() => setSelectedCategory('cooking-oil')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'cooking-oil'
                  ? 'bg-mythic-primary-500 text-white'
                  : 'bg-mythic-dark-800 text-mythic-text-muted hover:bg-mythic-primary-500/10 hover:text-mythic-text-primary border border-mythic-primary-500/20'
              }`}
            >
              Cooking Oil
            </button>
            <button
              onClick={() => setSelectedCategory('recycled-product')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'recycled-product'
                  ? 'bg-mythic-primary-500 text-white'
                  : 'bg-mythic-dark-800 text-mythic-text-muted hover:bg-mythic-primary-500/10 hover:text-mythic-text-primary border border-mythic-primary-500/20'
              }`}
            >
              Recycled Products
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-mythic-primary-500/20 bg-mythic-dark-800 text-mythic-text-primary focus:ring-2 focus:ring-mythic-primary-500 focus:border-mythic-primary-500 w-full sm:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Add Listing Button */}
            <Link
              href="/marketplace/create"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-mythic-primary-500 text-white rounded-lg hover:bg-mythic-primary-600 transition-colors w-full sm:w-auto"
            >
              <FiPlus />
              <span>Add Listing</span>
            </Link>
          </div>
        </div>

        {/* Cart Indicator */}
        {cartItems.length > 0 && (
          <div className="mb-6 p-4 bg-mythic-primary-500/10 border border-mythic-primary-500/20 rounded-lg flex items-center justify-between">
            <span className="text-mythic-text-primary font-medium">
              {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in cart
            </span>
            <Link
              href="/marketplace/cart"
              className="text-mythic-primary-500 hover:text-mythic-primary-400 font-medium transition-colors"
            >
              View Cart →
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-mythic-dark-800 rounded-xl border border-mythic-primary-500/20 p-6 animate-pulse">
                <div className="h-48 bg-mythic-dark-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-mythic-dark-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-mythic-dark-700 rounded w-full mb-4"></div>
                <div className="h-10 bg-mythic-dark-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-mythic-dark-800 rounded-xl border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all hover:shadow-lg hover:shadow-mythic-primary-500/10">
                <div className="relative h-48 bg-mythic-dark-700 rounded-t-xl overflow-hidden">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryStyles[listing.category]}`}>
                      {listing.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-mythic-text-primary mb-2">
                    {listing.title}
                  </h3>
                  
                  <p className="text-mythic-text-muted text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-mythic-primary-500">
                        ${listing.price}
                      </span>
                      <span className="text-mythic-text-muted text-sm ml-1">
                        /{listing.unit}
                      </span>
                    </div>
                    <span className="text-sm text-mythic-text-muted">
                      {listing.quantity} {listing.unit}s available
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-mythic-text-primary">
                        {listing.seller.name}
                      </span>
                      {listing.seller.verified && (
                        <span className="text-xs bg-mythic-secondary-500/20 text-mythic-secondary-400 px-2 py-0.5 rounded-full border border-mythic-secondary-500/30">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-mythic-accent-500">★</span>
                      <span className="text-sm text-mythic-text-muted">{listing.seller.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      href={`/marketplace/${listing.id}`}
                      className="flex-1 text-center px-4 py-2 border border-mythic-primary-500/20 text-mythic-text-muted rounded-lg hover:bg-mythic-primary-500/10 hover:text-mythic-text-primary hover:border-mythic-primary-500/40 transition-all"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(listing.id)}
                      disabled={cartItems.includes(listing.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                        cartItems.includes(listing.id)
                          ? 'bg-mythic-dark-700 text-mythic-text-muted cursor-not-allowed opacity-50'
                          : 'bg-mythic-primary-500 text-white hover:bg-mythic-primary-600'
                      }`}
                    >
                      {cartItems.includes(listing.id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-mythic-text-muted text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-mythic-text-primary mb-2">No listings found</h3>
            <p className="text-mythic-text-muted mb-6">Try adjusting your filters or create a new listing</p>
            <Link
              href="/marketplace/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-mythic-primary-500 text-white rounded-lg hover:bg-mythic-primary-600 transition-colors"
            >
              <FiPlus />
              <span>Create First Listing</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
