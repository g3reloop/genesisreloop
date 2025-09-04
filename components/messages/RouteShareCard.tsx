import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Route, 
  TruckIcon,
  Clock,
  MapPin,
  Package,
  Fuel,
  DollarSign,
  ExternalLink
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RouteShareData {
  routeId: string
  summary: string
  waypoints: {
    id: string
    name: string
    address: string
    volume: number
    arrivalTime?: string
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
  optimizedAt: string
}

interface RouteShareCardProps {
  data: RouteShareData
  onViewRoute?: () => void
  onContactCarrier?: () => void
  compact?: boolean
}

export default function RouteShareCard({ 
  data, 
  onViewRoute, 
  onContactCarrier,
  compact = false 
}: RouteShareCardProps) {
  return (
    <Card className={`bg-mythic-dark-800 border-mythic-primary/30 ${compact ? 'max-w-sm' : ''}`}>
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-mythic-primary" />
            <CardTitle className="text-base">{data.summary}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            Optimized Route
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className={`space-y-${compact ? '2' : '4'}`}>
        {/* Route Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-mythic-text-muted" />
            <span className="text-mythic-text-muted">Distance:</span>
            <span className="font-medium text-mythic-text-primary">
              {data.totals.distance.toFixed(1)} km
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-mythic-text-muted" />
            <span className="text-mythic-text-muted">Duration:</span>
            <span className="font-medium text-mythic-text-primary">
              {Math.round(data.totals.duration)} min
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-mythic-text-muted" />
            <span className="text-mythic-text-muted">Volume:</span>
            <span className="font-medium text-mythic-text-primary">
              {data.totals.volume} liters
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="h-4 w-4 text-mythic-text-muted" />
            <span className="text-mythic-text-muted">CO₂:</span>
            <span className="font-medium text-mythic-text-primary">
              {data.totals.emissions.toFixed(2)} kg
            </span>
          </div>
        </div>

        {/* Waypoints List */}
        {!compact && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-mythic-text-primary">
              Collection Points ({data.waypoints.length})
            </h4>
            <div className="space-y-1">
              {data.waypoints.map((waypoint, index) => (
                <div key={waypoint.id} className="flex items-start gap-2 text-sm">
                  <span className="text-mythic-primary font-medium w-4">
                    {waypoint.order}
                  </span>
                  <div className="flex-1">
                    <p className="text-mythic-text-primary">{waypoint.name}</p>
                    <p className="text-mythic-text-muted text-xs">
                      {waypoint.address} • {waypoint.volume}L
                      {waypoint.arrivalTime && ` • ${waypoint.arrivalTime}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carrier Suggestion */}
        {data.carrier && (
          <div className="bg-mythic-dark-900 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-mythic-primary" />
                <span className="text-sm font-medium text-mythic-text-primary">
                  Suggested Carrier
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Best Match
              </Badge>
            </div>
            
            <div className="space-y-1">
              <p className="font-medium text-mythic-text-primary">
                {data.carrier.name}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-mythic-text-muted">
                <span>★ {data.carrier.rating.toFixed(1)}</span>
                <span>Response: {data.carrier.responseTime}</span>
                <span className="text-mythic-primary font-medium">
                  £{data.carrier.price.toFixed(2)}
                </span>
              </div>
            </div>
            
            {onContactCarrier && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={onContactCarrier}
                className="w-full mt-2"
              >
                Contact Carrier
              </Button>
            )}
          </div>
        )}

        {/* Total Cost */}
        <div className="flex items-center justify-between pt-2 border-t border-mythic-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-mythic-text-muted" />
            <span className="text-mythic-text-muted">Total Cost:</span>
          </div>
          <span className="font-semibold text-mythic-primary">
            £{data.totals.cost.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        {onViewRoute && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={onViewRoute}
              className="flex-1 bg-mythic-primary hover:bg-mythic-primary/90 text-black"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Route
            </Button>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-mythic-text-muted text-center">
          Optimized {formatDistanceToNow(new Date(data.optimizedAt))} ago
        </p>
      </CardContent>
    </Card>
  )
}
