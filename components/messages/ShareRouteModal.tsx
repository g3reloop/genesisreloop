import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Route, 
  Search,
  MapPin,
  Clock,
  Package,
  Fuel,
  DollarSign,
  Calendar,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { toast } from 'react-hot-toast'

interface SavedRoute {
  id: string
  name: string
  waypoints: {
    id: string
    name: string
    address: string
    volume: number
    order: number
  }[]
  totals: {
    distance: number
    duration: number
    emissions: number
    cost: number
    volume: number
  }
  carrier?: {
    id: string
    name: string
    rating: number
    price: number
    responseTime: string
  }
  createdAt: string
  lastUsed: string
}

interface ShareRouteModalProps {
  open: boolean
  onClose: () => void
  onShare: (routeData: any) => void
  listingId?: string
}

export default function ShareRouteModal({ 
  open, 
  onClose, 
  onShare,
  listingId 
}: ShareRouteModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [routes, setRoutes] = useState<SavedRoute[]>([])

  useEffect(() => {
    if (open) {
      loadSavedRoutes()
    }
  }, [open, listingId])

  const loadSavedRoutes = async () => {
    setLoading(true)
    try {
      // Simulate loading saved routes - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - replace with actual data from Supabase
      setRoutes([
        {
          id: 'rt_001',
          name: 'London Central Collection Route',
          waypoints: [
            {
              id: 'wp_1',
              name: 'The Green Restaurant',
              address: '123 Main St, London',
              volume: 200,
              order: 1
            },
            {
              id: 'wp_2',
              name: 'Eco Cafe',
              address: '456 High St, London',
              volume: 150,
              order: 2
            },
            {
              id: 'wp_3',
              name: 'Sustainable Kitchen',
              address: '789 Park Ave, London',
              volume: 300,
              order: 3
            }
          ],
          totals: {
            distance: 25.5,
            duration: 85,
            emissions: 3.2,
            cost: 145.50,
            volume: 650
          },
          carrier: {
            id: 'car_123',
            name: 'EcoTransport Ltd',
            rating: 4.8,
            price: 145.50,
            responseTime: '2 hours'
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rt_002',
          name: 'North London Weekly Route',
          waypoints: [
            {
              id: 'wp_4',
              name: 'Fresh Foods Market',
              address: '321 Market St, Camden',
              volume: 500,
              order: 1
            },
            {
              id: 'wp_5',
              name: 'Local Bistro',
              address: '654 Camden High St',
              volume: 100,
              order: 2
            }
          ],
          totals: {
            distance: 15.2,
            duration: 45,
            emissions: 1.8,
            cost: 89.00,
            volume: 600
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])
    } catch (error) {
      console.error('Error loading routes:', error)
      toast.error('Failed to load saved routes')
    } finally {
      setLoading(false)
    }
  }

  const filteredRoutes = routes.filter(route => {
    const searchLower = searchTerm.toLowerCase()
    return (
      route.name.toLowerCase().includes(searchLower) ||
      route.waypoints.some(wp => 
        wp.name.toLowerCase().includes(searchLower) ||
        wp.address.toLowerCase().includes(searchLower)
      )
    )
  })

  const handleShare = () => {
    const route = routes.find(r => r.id === selectedRoute)
    if (!route) {
      toast.error('Please select a route to share')
      return
    }

    const shareData = {
      type: 'route',
      data: {
        routeId: route.id,
        summary: route.name,
        waypoints: route.waypoints,
        totals: route.totals,
        carrier: route.carrier,
        optimizedAt: route.createdAt
      }
    }

    onShare(shareData)
    onClose()
    toast.success('Route shared in conversation')
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Route</DialogTitle>
          <DialogDescription>
            Select a saved route to share in this conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
            <Input
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Routes List */}
          <ScrollArea className="h-[400px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-mythic-primary" />
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="text-center py-8 text-mythic-text-muted">
                {searchTerm ? 'No routes found matching your search' : 'No saved routes available'}
              </div>
            ) : (
              <RadioGroup value={selectedRoute} onValueChange={setSelectedRoute}>
                <div className="space-y-3">
                  {filteredRoutes.map((route) => (
                    <Label
                      key={route.id}
                      htmlFor={route.id}
                      className="cursor-pointer"
                    >
                      <div className={`
                        border rounded-lg p-4 transition-all
                        ${selectedRoute === route.id 
                          ? 'border-mythic-primary bg-mythic-primary/10' 
                          : 'border-mythic-primary/30 hover:border-mythic-primary/50'
                        }
                      `}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={route.id} id={route.id} />
                          
                          <div className="flex-1 space-y-3">
                            {/* Route Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-mythic-text-primary">
                                  {route.name}
                                </h3>
                                <p className="text-sm text-mythic-text-muted mt-1">
                                  {route.waypoints.length} stops • 
                                  Last used {formatDistanceToNow(new Date(route.lastUsed))} ago
                                </p>
                              </div>
                              <Route className="h-5 w-5 text-mythic-primary" />
                            </div>

                            {/* Route Stats */}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 text-mythic-text-muted" />
                                <span className="text-mythic-text-muted">
                                  {route.totals.distance.toFixed(1)} km
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-mythic-text-muted" />
                                <span className="text-mythic-text-muted">
                                  {route.totals.duration} min
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="h-3 w-3 text-mythic-text-muted" />
                                <span className="text-mythic-text-muted">
                                  {route.totals.volume} liters
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-3 w-3 text-mythic-text-muted" />
                                <span className="text-mythic-text-muted">
                                  £{route.totals.cost.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Carrier Badge */}
                            {route.carrier && (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {route.carrier.name} • ★ {route.carrier.rating}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare}
            disabled={!selectedRoute}
            className="bg-mythic-primary hover:bg-mythic-primary/90 text-black"
          >
            Share Route
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
