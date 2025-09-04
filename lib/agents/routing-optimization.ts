export interface RouteStop {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  timeWindow?: {
    start: string // HH:MM
    end: string   // HH:MM
  }
  serviceDuration?: number // minutes
  demand?: number // quantity to pick up/deliver
}

export interface RouteConstraints {
  vehicleCapacity?: number
  maxDrivingTime?: number // minutes
  maxDistance?: number // km
  adrClass?: string
  temperatureControl?: boolean
  tunnelRestrictions?: string[]
  avoidAreas?: Array<{ lat: number; lng: number; radius: number }>
}

export interface RouteResult {
  stops: RouteStop[]
  totalDistance: number
  totalTime: number
  totalCO2: number
  segments: RouteSegment[]
  warnings: string[]
}

export interface RouteSegment {
  from: RouteStop
  to: RouteStop
  distance: number
  duration: number
  co2Emissions: number
  mode: 'road' | 'rail' | 'sea'
}

export interface CarrierSuggestion {
  name: string
  capabilities: string[]
  certifications: string[]
  serviceAreas: string[]
  score: number
  reasons: string[]
}

export class RoutingOptimizationService {
  private mapboxToken: string | null
  private orsToken: string | null
  private googleMapsKey: string | null

  constructor() {
    this.mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || null
    this.orsToken = process.env.NEXT_PUBLIC_ORS_API_KEY || null
    this.googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || null
  }

  /**
   * Optimize a multi-stop route
   */
  async optimizeRoute(
    stops: RouteStop[],
    constraints: RouteConstraints = {}
  ): Promise<RouteResult> {
    // Try different optimization services
    if (this.mapboxToken) {
      return this.optimizeWithMapbox(stops, constraints)
    } else if (this.orsToken) {
      return this.optimizeWithORS(stops, constraints)
    } else if (this.googleMapsKey) {
      return this.optimizeWithGoogle(stops, constraints)
    } else {
      // Fallback to simple greedy algorithm
      return this.optimizeWithGreedy(stops, constraints)
    }
  }

  /**
   * Mapbox Optimization API
   */
  private async optimizeWithMapbox(
    stops: RouteStop[],
    constraints: RouteConstraints
  ): Promise<RouteResult> {
    try {
      const coordinates = stops.map(s => `${s.lng},${s.lat}`).join(';')
      
      const url = new URL(`https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}`)
      url.searchParams.append('access_token', this.mapboxToken!)
      url.searchParams.append('geometries', 'geojson')
      url.searchParams.append('overview', 'full')
      
      if (stops[0].timeWindow) {
        url.searchParams.append('distributions', this.buildMapboxDistributions(stops))
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (data.code !== 'Ok') {
        throw new Error(data.message || 'Mapbox optimization failed')
      }

      return this.parseMapboxResponse(data, stops)
    } catch (error) {
      console.error('Mapbox optimization error:', error)
      // Fallback to greedy
      return this.optimizeWithGreedy(stops, constraints)
    }
  }

  /**
   * OpenRouteService Optimization
   */
  private async optimizeWithORS(
    stops: RouteStop[],
    constraints: RouteConstraints
  ): Promise<RouteResult> {
    try {
      const body = {
        vehicles: [{
          id: 1,
          start: [stops[0].lng, stops[0].lat],
          end: [stops[stops.length - 1].lng, stops[stops.length - 1].lat],
          capacity: constraints.vehicleCapacity ? [constraints.vehicleCapacity] : undefined,
          time_window: constraints.maxDrivingTime ? [0, constraints.maxDrivingTime * 60] : undefined
        }],
        jobs: stops.slice(1, -1).map((stop, i) => ({
          id: i + 1,
          location: [stop.lng, stop.lat],
          service: stop.serviceDuration ? stop.serviceDuration * 60 : 300,
          time_windows: stop.timeWindow ? [[
            this.timeToSeconds(stop.timeWindow.start),
            this.timeToSeconds(stop.timeWindow.end)
          ]] : undefined,
          amount: stop.demand ? [stop.demand] : undefined
        })),
        options: {
          g: true // Return geometry
        }
      }

      const response = await fetch('https://api.openrouteservice.org/optimization', {
        method: 'POST',
        headers: {
          'Authorization': this.orsToken!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      return this.parseORSResponse(data, stops)
    } catch (error) {
      console.error('ORS optimization error:', error)
      return this.optimizeWithGreedy(stops, constraints)
    }
  }

  /**
   * Google Maps optimization (Distance Matrix + custom algorithm)
   */
  private async optimizeWithGoogle(
    stops: RouteStop[],
    constraints: RouteConstraints
  ): Promise<RouteResult> {
    try {
      // Get distance matrix
      const matrix = await this.getGoogleDistanceMatrix(stops)
      
      // Apply TSP algorithm
      const optimizedOrder = this.solveTSP(matrix, constraints)
      
      // Build result
      return this.buildRouteResult(stops, optimizedOrder, matrix)
    } catch (error) {
      console.error('Google optimization error:', error)
      return this.optimizeWithGreedy(stops, constraints)
    }
  }

  /**
   * Fallback greedy optimization
   */
  private optimizeWithGreedy(
    stops: RouteStop[],
    constraints: RouteConstraints
  ): Promise<RouteResult> {
    const result: RouteResult = {
      stops: [],
      totalDistance: 0,
      totalTime: 0,
      totalCO2: 0,
      segments: [],
      warnings: []
    }

    // Simple nearest neighbor algorithm
    const unvisited = [...stops.slice(1)] // Skip start point
    const route = [stops[0]]
    let current = stops[0]

    while (unvisited.length > 0) {
      // Find nearest unvisited stop
      let nearestIdx = 0
      let minDistance = this.haversineDistance(current, unvisited[0])

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.haversineDistance(current, unvisited[i])
        if (distance < minDistance) {
          minDistance = distance
          nearestIdx = i
        }
      }

      // Add to route
      const next = unvisited[nearestIdx]
      route.push(next)
      
      // Create segment
      const segment: RouteSegment = {
        from: current,
        to: next,
        distance: minDistance,
        duration: minDistance / 50 * 60, // Assume 50 km/h average
        co2Emissions: this.calculateCO2(minDistance, 'road'),
        mode: 'road'
      }
      
      result.segments.push(segment)
      result.totalDistance += segment.distance
      result.totalTime += segment.duration
      result.totalCO2 += segment.co2Emissions

      // Update current and remove from unvisited
      current = next
      unvisited.splice(nearestIdx, 1)
    }

    result.stops = route

    // Add warnings for constraints
    if (constraints.maxDistance && result.totalDistance > constraints.maxDistance) {
      result.warnings.push(`Route exceeds maximum distance: ${result.totalDistance.toFixed(1)}km > ${constraints.maxDistance}km`)
    }
    if (constraints.maxDrivingTime && result.totalTime > constraints.maxDrivingTime) {
      result.warnings.push(`Route exceeds maximum driving time: ${(result.totalTime / 60).toFixed(1)}h > ${(constraints.maxDrivingTime / 60).toFixed(1)}h`)
    }

    return Promise.resolve(result)
  }

  /**
   * Get suggested carriers for a route
   */
  async getSuggestedCarriers(
    materialType: string,
    constraints: RouteConstraints,
    region: string
  ): Promise<CarrierSuggestion[]> {
    // Mock carrier database - in production this would query the logistics_providers_capabilities collection
    const carriers = [
      {
        name: 'EcoTransport Ltd',
        capabilities: ['temperature_control', 'adr_certified', 'real_time_tracking'],
        certifications: ['ISO 14001', 'FORS Gold', 'ADR License'],
        serviceAreas: ['UK', 'London', 'Southeast'],
        specialties: ['food_waste', 'uco']
      },
      {
        name: 'Green Logistics Co',
        capabilities: ['bulk_transport', 'rail_access', 'carbon_neutral'],
        certifications: ['ISO 9001', 'ISCC'],
        serviceAreas: ['UK', 'EU'],
        specialties: ['bulk_liquid', 'industrial']
      },
      {
        name: 'SafeWaste Carriers',
        capabilities: ['hazardous_waste', 'adr_certified', '24_7_service'],
        certifications: ['ADR License', 'Hazardous Waste License'],
        serviceAreas: ['UK'],
        specialties: ['hazardous', 'chemical']
      }
    ]

    // Score and filter carriers
    const suggestions: CarrierSuggestion[] = []

    for (const carrier of carriers) {
      let score = 0
      const reasons: string[] = []

      // Check service area
      if (carrier.serviceAreas.some(area => 
        region.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(region.toLowerCase())
      )) {
        score += 30
        reasons.push(`Services ${region} area`)
      }

      // Check capabilities match
      if (constraints.temperatureControl && carrier.capabilities.includes('temperature_control')) {
        score += 20
        reasons.push('Temperature controlled vehicles')
      }
      
      if (constraints.adrClass && carrier.capabilities.includes('adr_certified')) {
        score += 25
        reasons.push('ADR certified for dangerous goods')
      }

      // Check material type specialty
      if (carrier.specialties.includes(materialType)) {
        score += 25
        reasons.push(`Specializes in ${materialType} transport`)
      }

      if (score > 0) {
        suggestions.push({
          name: carrier.name,
          capabilities: carrier.capabilities,
          certifications: carrier.certifications,
          serviceAreas: carrier.serviceAreas,
          score,
          reasons
        })
      }
    }

    // Sort by score
    return suggestions.sort((a, b) => b.score - a.score)
  }

  /**
   * Calculate CO2 emissions for a route segment
   */
  private calculateCO2(distanceKm: number, mode: string): number {
    // DEFRA emission factors (kg CO2e per km)
    const emissionFactors: Record<string, number> = {
      road: 0.98,    // HGV average
      rail: 0.027,   // Freight train
      sea: 0.016     // Container ship
    }

    return distanceKm * (emissionFactors[mode] || emissionFactors.road)
  }

  /**
   * Haversine distance between two points
   */
  private haversineDistance(a: RouteStop, b: RouteStop): number {
    const R = 6371 // Earth radius in km
    const dLat = this.toRad(b.lat - a.lat)
    const dLon = this.toRad(b.lng - a.lng)
    
    const lat1 = this.toRad(a.lat)
    const lat2 = this.toRad(b.lat)

    const x = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * 
              Math.cos(lat1) * Math.cos(lat2)
    
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
    
    return R * c
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  /**
   * Convert time string to seconds
   */
  private timeToSeconds(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 3600 + minutes * 60
  }

  /**
   * Build Mapbox distributions parameter
   */
  private buildMapboxDistributions(stops: RouteStop[]): string {
    return stops.map((stop, i) => {
      if (stop.timeWindow) {
        return `${i},${this.timeToSeconds(stop.timeWindow.start)};${i},${this.timeToSeconds(stop.timeWindow.end)}`
      }
      return null
    }).filter(Boolean).join(';')
  }

  /**
   * Parse Mapbox optimization response
   */
  private parseMapboxResponse(data: any, originalStops: RouteStop[]): RouteResult {
    const result: RouteResult = {
      stops: [],
      totalDistance: 0,
      totalTime: 0,
      totalCO2: 0,
      segments: [],
      warnings: []
    }

    // Reorder stops based on waypoint_index
    const trip = data.trips[0]
    result.stops = trip.waypoints.map((wp: any) => originalStops[wp.waypoint_index])
    
    // Calculate totals
    result.totalDistance = trip.distance / 1000 // Convert to km
    result.totalTime = trip.duration / 60 // Convert to minutes
    result.totalCO2 = this.calculateCO2(result.totalDistance, 'road')

    // Build segments
    for (let i = 0; i < result.stops.length - 1; i++) {
      const leg = trip.legs[i]
      result.segments.push({
        from: result.stops[i],
        to: result.stops[i + 1],
        distance: leg.distance / 1000,
        duration: leg.duration / 60,
        co2Emissions: this.calculateCO2(leg.distance / 1000, 'road'),
        mode: 'road'
      })
    }

    return result
  }

  /**
   * Parse ORS optimization response
   */
  private parseORSResponse(data: any, originalStops: RouteStop[]): RouteResult {
    const result: RouteResult = {
      stops: [],
      totalDistance: 0,
      totalTime: 0,
      totalCO2: 0,
      segments: [],
      warnings: []
    }

    if (data.unassigned && data.unassigned.length > 0) {
      result.warnings.push(`${data.unassigned.length} stops could not be included in route`)
    }

    // Parse route
    const route = data.routes[0]
    const steps = route.steps

    // Rebuild stop order
    const stopOrder = [originalStops[0]] // Start with depot
    for (const step of steps) {
      if (step.type === 'job') {
        stopOrder.push(originalStops[step.id])
      }
    }
    stopOrder.push(originalStops[originalStops.length - 1]) // End depot

    result.stops = stopOrder
    result.totalDistance = route.distance / 1000
    result.totalTime = route.duration / 60
    result.totalCO2 = this.calculateCO2(result.totalDistance, 'road')

    // Build segments from geometry
    for (let i = 0; i < stopOrder.length - 1; i++) {
      result.segments.push({
        from: stopOrder[i],
        to: stopOrder[i + 1],
        distance: 0, // Would need to calculate from geometry
        duration: 0,
        co2Emissions: 0,
        mode: 'road'
      })
    }

    return result
  }

  /**
   * Get Google Distance Matrix
   */
  private async getGoogleDistanceMatrix(stops: RouteStop[]): Promise<number[][]> {
    const n = stops.length
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0))

    // Build origins and destinations
    const locations = stops.map(s => `${s.lat},${s.lng}`).join('|')

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json')
    url.searchParams.append('origins', locations)
    url.searchParams.append('destinations', locations)
    url.searchParams.append('key', this.googleMapsKey!)

    const response = await fetch(url.toString())
    const data = await response.json()

    // Parse matrix
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const element = data.rows[i].elements[j]
          if (element.status === 'OK') {
            matrix[i][j] = element.distance.value / 1000 // Convert to km
          } else {
            // Fallback to haversine
            matrix[i][j] = this.haversineDistance(stops[i], stops[j])
          }
        }
      }
    }

    return matrix
  }

  /**
   * Solve TSP using nearest neighbor with 2-opt improvement
   */
  private solveTSP(matrix: number[][], constraints: RouteConstraints): number[] {
    const n = matrix.length
    const visited = new Array(n).fill(false)
    const tour = [0]
    visited[0] = true
    
    let current = 0
    let totalDistance = 0

    // Nearest neighbor construction
    for (let i = 1; i < n; i++) {
      let nearest = -1
      let minDist = Infinity

      for (let j = 0; j < n; j++) {
        if (!visited[j] && matrix[current][j] < minDist) {
          minDist = matrix[current][j]
          nearest = j
        }
      }

      if (nearest !== -1) {
        tour.push(nearest)
        visited[nearest] = true
        totalDistance += minDist
        current = nearest
      }
    }

    // 2-opt improvement
    let improved = true
    while (improved) {
      improved = false
      
      for (let i = 1; i < n - 2; i++) {
        for (let j = i + 1; j < n; j++) {
          if (j - i === 1) continue

          const currentDist = matrix[tour[i - 1]][tour[i]] + matrix[tour[j]][tour[(j + 1) % n]]
          const newDist = matrix[tour[i - 1]][tour[j]] + matrix[tour[i]][tour[(j + 1) % n]]

          if (newDist < currentDist) {
            // Reverse segment
            const reversed = tour.slice(i, j + 1).reverse()
            tour.splice(i, j - i + 1, ...reversed)
            improved = true
          }
        }
      }
    }

    return tour
  }

  /**
   * Build route result from optimized order
   */
  private buildRouteResult(
    stops: RouteStop[],
    order: number[],
    matrix: number[][]
  ): RouteResult {
    const result: RouteResult = {
      stops: order.map(i => stops[i]),
      totalDistance: 0,
      totalTime: 0,
      totalCO2: 0,
      segments: [],
      warnings: []
    }

    for (let i = 0; i < order.length - 1; i++) {
      const from = order[i]
      const to = order[i + 1]
      const distance = matrix[from][to]
      const duration = distance / 50 * 60 // Assume 50 km/h

      const segment: RouteSegment = {
        from: stops[from],
        to: stops[to],
        distance,
        duration,
        co2Emissions: this.calculateCO2(distance, 'road'),
        mode: 'road'
      }

      result.segments.push(segment)
      result.totalDistance += distance
      result.totalTime += duration
      result.totalCO2 += segment.co2Emissions
    }

    return result
  }
}

// Export singleton instance
export const routingOptimization = new RoutingOptimizationService()
