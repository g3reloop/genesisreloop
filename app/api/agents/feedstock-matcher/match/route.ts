import { NextRequest, NextResponse } from 'next/server'
import { FeedstockLot, MatchResponse } from '@/types/agents'

export async function POST(request: NextRequest) {
  try {
    // Verify service auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const lot: FeedstockLot = body

    // Validate lot data
    if (!lot.id || !lot.type || !lot.volume || !lot.location) {
      return NextResponse.json(
        { error: 'Invalid lot data' },
        { status: 400 }
      )
    }

    // In production, queue this job for the FeedstockMatcher agent
    // For now, return mock matches
    const mockMatches = [
      {
        processorId: 'proc-001',
        processorName: 'Brighton Community Biogas',
        score: 92.5,
        distanceKm: 12.3,
        priceEstimate: lot.volume * 0.08,
        routeEta: new Date(Date.now() + 2 * 60 * 60 * 1000),
        srlScore: 0.8,
        notes: 'Excellent match for SRL'
      },
      {
        processorId: 'proc-002',
        processorName: 'Sussex Waste Processing',
        score: 78.2,
        distanceKm: 28.7,
        priceEstimate: lot.volume * 0.075,
        routeEta: new Date(Date.now() + 3 * 60 * 60 * 1000),
        srlScore: 0.4,
        notes: undefined
      },
      {
        processorId: 'proc-003',
        processorName: 'Kent Biofuels Ltd',
        score: 65.8,
        distanceKm: 45.2,
        priceEstimate: lot.volume * 0.07,
        routeEta: new Date(Date.now() + 4 * 60 * 60 * 1000),
        srlScore: 0.2,
        notes: 'Longer distance but available capacity'
      }
    ]

    const response: MatchResponse = {
      lotId: lot.id,
      matches: mockMatches,
      recommendedMatch: mockMatches[0]
    }

    // Log the match request
    console.log(`FeedstockMatcher processed lot ${lot.id}: ${mockMatches.length} matches found`)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing match request:', error)
    return NextResponse.json(
      { error: 'Failed to process match request' },
      { status: 500 }
    )
  }
}

// Get matches for a specific lot
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lotId = searchParams.get('lotId')

    if (!lotId) {
      return NextResponse.json(
        { error: 'lotId parameter required' },
        { status: 400 }
      )
    }

    // In production, fetch from database
    const mockResponse: MatchResponse = {
      lotId,
      matches: [],
      recommendedMatch: undefined
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
