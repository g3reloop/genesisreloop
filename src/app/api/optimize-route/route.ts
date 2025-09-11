import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { routingOptimization, RouteStop, RouteConstraints } from '@/lib/agents/routing-optimization'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { stops, constraints, materialType, region } = body

    // Validate input
    if (!stops || !Array.isArray(stops) || stops.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 stops are required' },
        { status: 400 }
      )
    }

    // Validate stops have required fields
    for (const stop of stops) {
      if (!stop.lat || !stop.lng || !stop.address) {
        return NextResponse.json(
          { error: 'Each stop must have lat, lng, and address' },
          { status: 400 }
        )
      }
    }

    // Optimize route
    const routeResult = await routingOptimization.optimizeRoute(
      stops as RouteStop[],
      constraints as RouteConstraints
    )

    // Get carrier suggestions if requested
    let carriers = []
    if (materialType && region) {
      carriers = await routingOptimization.getSuggestedCarriers(
        materialType,
        constraints as RouteConstraints,
        region
      )
    }

    // Log the request for analytics
    await supabase.from('api_usage_logs').insert({
      user_id: user.id,
      endpoint: '/api/optimize-route',
      method: 'POST',
      request_data: {
        stops_count: stops.length,
        constraints,
        material_type: materialType
      },
      response_status: 200,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      route: routeResult,
      carriers: carriers
    })

  } catch (error) {
    console.error('Route optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize route' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // API documentation endpoint
  return NextResponse.json({
    endpoint: '/api/optimize-route',
    method: 'POST',
    description: 'Optimize multi-stop collection and delivery routes',
    authentication: 'Required (Bearer token)',
    request_body: {
      stops: [
        {
          id: 'string',
          name: 'string',
          lat: 'number',
          lng: 'number',
          address: 'string',
          timeWindow: {
            start: 'HH:MM',
            end: 'HH:MM'
          },
          serviceDuration: 'number (minutes)',
          demand: 'number (kg)'
        }
      ],
      constraints: {
        vehicleCapacity: 'number (kg)',
        maxDrivingTime: 'number (minutes)',
        maxDistance: 'number (km)',
        adrClass: 'string',
        temperatureControl: 'boolean',
        tunnelRestrictions: 'string[]',
        avoidAreas: 'array of {lat, lng, radius}'
      },
      materialType: 'string (food_waste, uco, etc)',
      region: 'string (UK, London, etc)'
    },
    response: {
      route: {
        stops: 'array of optimized stops',
        totalDistance: 'number (km)',
        totalTime: 'number (minutes)',
        totalCO2: 'number (kg)',
        segments: 'array of route segments',
        warnings: 'array of constraint violations'
      },
      carriers: 'array of suggested carriers with scores'
    },
    example: {
      stops: [
        {
          id: '1',
          name: 'Depot',
          lat: 51.5074,
          lng: -0.1278,
          address: 'London, UK'
        },
        {
          id: '2',
          name: 'Restaurant A',
          lat: 51.5155,
          lng: -0.1419,
          address: 'Baker Street, London',
          timeWindow: { start: '09:00', end: '11:00' },
          demand: 100
        }
      ],
      constraints: {
        vehicleCapacity: 1000,
        maxDrivingTime: 480,
        temperatureControl: true
      },
      materialType: 'food_waste',
      region: 'London'
    }
  })
}
