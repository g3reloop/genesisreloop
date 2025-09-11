'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { routingOptimization, RouteStop, RouteConstraints, RouteResult, CarrierSuggestion } from '@/lib/agents/routing-optimization'
import { MapPin, Truck, Clock, Gauge, Leaf, AlertCircle, Plus, X, Navigation } from 'lucide-react'
import { formatDistance, formatDuration } from '@/lib/utils'

export default function RoutePlannerPage() {
  return (
    <AuthGuard
      requiredRole={['supplier', 'processor', 'buyer', 'logistics']}
      requireVerified={true}
      requireOnboarded={true}
    >
      <RoutePlannerContent />
    </AuthGuard>
  )
}

function RoutePlannerContent() {
  // Check for stops from session storage (from marketplace)
  const getInitialStops = () => {
    if (typeof window !== 'undefined') {
      const savedStops = sessionStorage.getItem('routePlannerStops')
      if (savedStops) {
        const parsedStops = JSON.parse(savedStops)
        // Clear session storage after reading
        sessionStorage.removeItem('routePlannerStops')
        // Format stops for route planner
        return parsedStops.map((stop: any, index: number) => ({
          ...stop,
          id: stop.id || `${index + 1}`,
          timeWindow: { start: '09:00', end: '17:00' },
          serviceDuration: 15
        }))
      }
    }
    // Default single stop if no saved stops
    return [{
      id: '1',
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      timeWindow: { start: '09:00', end: '17:00' },
      serviceDuration: 15
    }]
  }

  const [stops, setStops] = useState<RouteStop[]>(getInitialStops())
  
  const [constraints, setConstraints] = useState<RouteConstraints>({
    vehicleCapacity: 1000,
    maxDrivingTime: 480,
    maxDistance: 500,
    temperatureControl: false,
    adrClass: ''
  })

  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [carriers, setCarriers] = useState<CarrierSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [materialType, setMaterialType] = useState('food_waste')

  const addStop = () => {
    setStops([...stops, {
      id: `${stops.length + 1}`,
      name: '',
      address: '',
      lat: 0,
      lng: 0,
      timeWindow: { start: '09:00', end: '17:00' },
      serviceDuration: 15
    }])
  }

  const removeStop = (index: number) => {
    if (stops.length > 1) {
      setStops(stops.filter((_, i) => i !== index))
    }
  }

  const updateStop = (index: number, updates: Partial<RouteStop>) => {
    const newStops = [...stops]
    newStops[index] = { ...newStops[index], ...updates }
    setStops(newStops)
  }

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    // In production, this would call a geocoding service
    // For now, return mock London coordinates with slight variations
    const baseLat = 51.5074
    const baseLng = -0.1278
    const variation = 0.05
    
    return {
      lat: baseLat + (Math.random() - 0.5) * variation,
      lng: baseLng + (Math.random() - 0.5) * variation
    }
  }

  const optimizeRoute = async () => {
    setLoading(true)
    
    try {
      // Geocode addresses if needed
      const geocodedStops = await Promise.all(
        stops.map(async (stop) => {
          if (stop.lat === 0 && stop.lng === 0 && stop.address) {
            const coords = await geocodeAddress(stop.address)
            if (coords) {
              return { ...stop, ...coords }
            }
          }
          return stop
        })
      )

      // Filter out stops without valid coordinates
      const validStops = geocodedStops.filter(s => s.lat !== 0 && s.lng !== 0)
      
      if (validStops.length < 2) {
        alert('Please enter at least 2 valid addresses')
        setLoading(false)
        return
      }

      // Optimize route
      const result = await routingOptimization.optimizeRoute(validStops, constraints)
      setRouteResult(result)

      // Get carrier suggestions
      const region = validStops[0].address.split(',')[1]?.trim() || 'UK'
      const carrierSuggestions = await routingOptimization.getSuggestedCarriers(
        materialType,
        constraints,
        region
      )
      setCarriers(carrierSuggestions)
    } catch (error) {
      console.error('Route optimization error:', error)
      alert('Failed to optimize route. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Route Planner</h1>
          <p className="text-muted-foreground mt-1">
            Optimize multi-stop collection and delivery routes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stops */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Stops
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stops.map((stop, index) => (
                <div key={stop.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Stop {index + 1}</h4>
                    {stops.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStop(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>Location Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={stop.name}
                        onChange={(e) => updateStop(index, { name: e.target.value })}
                        placeholder="e.g., Restaurant ABC"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`address-${index}`}>Address</Label>
                      <Input
                        id={`address-${index}`}
                        value={stop.address}
                        onChange={(e) => updateStop(index, { address: e.target.value })}
                        placeholder="Full address"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`start-${index}`}>Time Window Start</Label>
                      <Input
                        id={`start-${index}`}
                        type="time"
                        value={stop.timeWindow?.start}
                        onChange={(e) => updateStop(index, { 
                          timeWindow: { ...stop.timeWindow!, start: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`end-${index}`}>Time Window End</Label>
                      <Input
                        id={`end-${index}`}
                        type="time"
                        value={stop.timeWindow?.end}
                        onChange={(e) => updateStop(index, {
                          timeWindow: { ...stop.timeWindow!, end: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`duration-${index}`}>Service Time (minutes)</Label>
                      <Input
                        id={`duration-${index}`}
                        type="number"
                        value={stop.serviceDuration}
                        onChange={(e) => updateStop(index, { 
                          serviceDuration: parseInt(e.target.value) || 15 
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`demand-${index}`}>Quantity (kg)</Label>
                      <Input
                        id={`demand-${index}`}
                        type="number"
                        value={stop.demand || ''}
                        onChange={(e) => updateStop(index, { 
                          demand: parseInt(e.target.value) || undefined 
                        })}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={addStop} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Stop
              </Button>
            </CardContent>
          </Card>

          {/* Constraints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Vehicle & Route Constraints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material Type</Label>
                  <Select value={materialType} onValueChange={setMaterialType}>
                    <SelectTrigger id="material">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food_waste">Food Waste</SelectItem>
                      <SelectItem value="uco">Used Cooking Oil</SelectItem>
                      <SelectItem value="bulk_liquid">Bulk Liquid</SelectItem>
                      <SelectItem value="hazardous">Hazardous Waste</SelectItem>
                      <SelectItem value="industrial">Industrial Waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="capacity">Vehicle Capacity (kg)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={constraints.vehicleCapacity}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      vehicleCapacity: parseInt(e.target.value) || 1000
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxTime">Max Driving Time (hours)</Label>
                  <Input
                    id="maxTime"
                    type="number"
                    value={(constraints.maxDrivingTime || 480) / 60}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      maxDrivingTime: (parseFloat(e.target.value) || 8) * 60
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxDistance">Max Distance (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    value={constraints.maxDistance}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      maxDistance: parseInt(e.target.value) || 500
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="adrClass">ADR Class (if required)</Label>
                  <Input
                    id="adrClass"
                    value={constraints.adrClass}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      adrClass: e.target.value
                    })}
                    placeholder="e.g., 3, 6.1, 8"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="temperature"
                    checked={constraints.temperatureControl}
                    onCheckedChange={(checked) => setConstraints({
                      ...constraints,
                      temperatureControl: checked
                    })}
                  />
                  <Label htmlFor="temperature">Temperature Control Required</Label>
                </div>
              </div>

              <Button 
                onClick={optimizeRoute} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>Optimizing...</>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Optimize Route
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {routeResult && (
            <>
              {/* Route Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Distance</span>
                    <span className="font-medium">{routeResult.totalDistance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Time</span>
                    <span className="font-medium">{formatDuration(routeResult.totalTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CO₂ Emissions</span>
                    <span className="font-medium">{routeResult.totalCO2.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of Stops</span>
                    <span className="font-medium">{routeResult.stops.length}</span>
                  </div>

                  {routeResult.warnings.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {routeResult.warnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-yellow-600">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Optimized Route */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Route</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {routeResult.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{stop.name || `Stop ${index + 1}`}</p>
                        <p className="text-sm text-muted-foreground">{stop.address}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Carrier Suggestions */}
              {carriers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Carriers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {carriers.map((carrier, index) => (
                      <div key={index} className="space-y-2 pb-3 last:pb-0 border-b last:border-b-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{carrier.name}</h4>
                          <Badge>{carrier.score}% Match</Badge>
                        </div>
                        <div className="space-y-1">
                          {carrier.reasons.map((reason, i) => (
                            <p key={i} className="text-sm text-muted-foreground">• {reason}</p>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {carrier.certifications.slice(0, 3).map((cert, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
