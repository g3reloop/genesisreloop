'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import {
  MapPin,
  Truck,
  Package,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  Navigation,
  Phone,
  Mail
} from 'lucide-react'

const mockCollections = [
  {
    id: 'COL-001',
    supplier: 'The Green Kitchen',
    type: 'UCO',
    quantity: '45L',
    scheduledDate: '2024-01-22',
    scheduledTime: '14:00',
    status: 'scheduled',
    location: 'SW1A 1AA, London',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    contact: { name: 'John Smith', phone: '+44 20 7946 0958', email: 'john@greenkitchen.uk' },
    srlRatio: 92,
    lastCollection: '2024-01-08'
  },
  {
    id: 'COL-002',
    supplier: 'City Food Hub',
    type: 'Food Waste',
    quantity: '120kg',
    scheduledDate: '2024-01-22',
    scheduledTime: '09:30',
    status: 'in-transit',
    location: 'M1 1AD, Manchester',
    coordinates: { lat: 53.4808, lng: -2.2426 },
    contact: { name: 'Sarah Johnson', phone: '+44 161 123 4567', email: 'sarah@cityfoodhub.co.uk' },
    srlRatio: 78,
    lastCollection: '2024-01-15'
  },
  {
    id: 'COL-003',
    supplier: 'Fast Food Network',
    type: 'UCO',
    quantity: '75L',
    scheduledDate: '2024-01-21',
    scheduledTime: '16:00',
    status: 'completed',
    location: 'B1 1BB, Birmingham',
    coordinates: { lat: 52.4862, lng: -1.8904 },
    contact: { name: 'Mike Brown', phone: '+44 121 234 5678', email: 'mike@ffn.uk' },
    srlRatio: 88,
    lastCollection: '2024-01-07'
  },
  {
    id: 'COL-004',
    supplier: 'Organic Bistro',
    type: 'Mixed',
    quantity: '30L UCO, 50kg FW',
    scheduledDate: '2024-01-23',
    scheduledTime: '11:00',
    status: 'scheduled',
    location: 'EH1 1RF, Edinburgh',
    coordinates: { lat: 55.9533, lng: -3.1883 },
    contact: { name: 'Emma Wilson', phone: '+44 131 987 6543', email: 'emma@organicbistro.scot' },
    srlRatio: 85,
    lastCollection: '2024-01-09'
  },
  {
    id: 'COL-005',
    supplier: 'Hotel Grande',
    type: 'UCO',
    quantity: '150L',
    scheduledDate: '2024-01-21',
    scheduledTime: '08:00',
    status: 'cancelled',
    location: 'CF10 1AA, Cardiff',
    coordinates: { lat: 51.4816, lng: -3.1791 },
    contact: { name: 'David Jones', phone: '+44 29 2000 0000', email: 'david@hotelgrande.co.uk' },
    srlRatio: 45,
    lastCollection: '2024-01-01'
  }
]

const statusConfig = {
  scheduled: { 
    bg: 'bg-mythic-primary-100 dark:bg-mythic-primary-900/20', 
    text: 'text-mythic-primary-700 dark:text-mythic-primary-400', 
    icon: Calendar,
    label: 'Scheduled'
  },
  'in-transit': { 
    bg: 'bg-mythic-accent-100 dark:bg-mythic-accent-900/20', 
    text: 'text-mythic-accent-700 dark:text-mythic-accent-400', 
    icon: Truck,
    label: 'In Transit'
  },
  completed: { 
    bg: 'bg-mythic-secondary-100 dark:bg-mythic-secondary-900/20', 
    text: 'text-mythic-secondary-700 dark:text-mythic-secondary-400', 
    icon: CheckCircle2,
    label: 'Completed'
  },
  cancelled: { 
    bg: 'bg-red-100 dark:bg-red-900/20', 
    text: 'text-red-700 dark:text-red-400', 
    icon: XCircle,
    label: 'Cancelled'
  }
}

export default function CollectionPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'in-transit' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const filteredCollections = mockCollections.filter(collection => {
    const matchesFilter = selectedFilter === 'all' || collection.status === selectedFilter
    const matchesSearch = collection.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    totalScheduled: mockCollections.filter(c => c.status === 'scheduled').length,
    inTransit: mockCollections.filter(c => c.status === 'in-transit').length,
    completed: mockCollections.filter(c => c.status === 'completed').length,
    avgSRL: Math.round(mockCollections.reduce((acc, c) => acc + c.srlRatio, 0) / mockCollections.length)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Collections</h1>
          <p className="text-mythic-dark-500 dark:text-mythic-dark-400">
            Track and manage feedstock collection routes
          </p>
        </div>
        <Button variant="primary">
          <Package className="h-4 w-4 mr-2" />
          Schedule Collection
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-mythic-dark-500">Scheduled</p>
                <p className="text-2xl font-bold">{stats.totalScheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-mythic-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-mythic-dark-500">In Transit</p>
                <p className="text-2xl font-bold">{stats.inTransit}</p>
              </div>
              <Truck className="h-8 w-8 text-mythic-accent-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-mythic-dark-500">Completed Today</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-mythic-secondary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-mythic-dark-500">Avg SRL Ratio</p>
                <p className="text-2xl font-bold">{stats.avgSRL}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-mythic-secondary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mythic-dark-400" />
          <input
            type="text"
            placeholder="Search by supplier, ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-mythic-dark-200 dark:border-mythic-dark-700 bg-white dark:bg-mythic-dark-900"
          />
        </div>
        <div className="flex space-x-2">
          {(['all', 'scheduled', 'in-transit', 'completed'] as const).map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter === 'all' ? 'All' : statusConfig[filter]?.label || filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCollections.map(collection => {
          const status = statusConfig[collection.status as keyof typeof statusConfig]
          const StatusIcon = status.icon
          const isSelected = selectedCollection === collection.id

          return (
            <Card 
              key={collection.id}
              className={cn(
                "cursor-pointer transition-all duration-200",
                isSelected && "ring-2 ring-mythic-primary-500"
              )}
              onClick={() => setSelectedCollection(collection.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{collection.supplier}</CardTitle>
                    <CardDescription>{collection.id}</CardDescription>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex items-center",
                    status.bg,
                    status.text
                  )}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-mythic-dark-500">Type</p>
                    <p className="font-medium">{collection.type}</p>
                  </div>
                  <div>
                    <p className="text-mythic-dark-500">Quantity</p>
                    <p className="font-medium">{collection.quantity}</p>
                  </div>
                  <div>
                    <p className="text-mythic-dark-500">Schedule</p>
                    <p className="font-medium">{collection.scheduledDate}</p>
                    <p className="text-xs text-mythic-dark-400">{collection.scheduledTime}</p>
                  </div>
                  <div>
                    <p className="text-mythic-dark-500">SRL Ratio</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-mythic-dark-100 dark:bg-mythic-dark-800 rounded-full h-2 mr-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full",
                            collection.srlRatio >= 85 ? 'bg-mythic-secondary-500' :
                            collection.srlRatio >= 70 ? 'bg-mythic-accent-500' :
                            'bg-red-500'
                          )}
                          style={{ width: `${collection.srlRatio}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{collection.srlRatio}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-mythic-dark-400" />
                    <span className="text-mythic-dark-600 dark:text-mythic-dark-300">{collection.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-mythic-dark-400" />
                    <span className="text-mythic-dark-600 dark:text-mythic-dark-300">
                      Last: {collection.lastCollection}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Navigate to map
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Contact supplier
                    }}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Collection Details */}
      {selectedCollection && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Collection Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const collection = mockCollections.find(c => c.id === selectedCollection)
              if (!collection) return null

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="text-mythic-dark-500 w-20">Name:</span>
                        <span>{collection.contact.name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-mythic-dark-400" />
                        <span>{collection.contact.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-mythic-dark-400" />
                        <span>{collection.contact.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Location Coordinates</h4>
                    <div className="p-4 bg-mythic-dark-50 dark:bg-mythic-dark-900 rounded-lg">
                      <p className="text-sm text-mythic-dark-500">Latitude: {collection.coordinates.lat}</p>
                      <p className="text-sm text-mythic-dark-500">Longitude: {collection.coordinates.lng}</p>
                    </div>
                    <Button variant="primary" className="w-full">
                      Open in Maps
                    </Button>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
