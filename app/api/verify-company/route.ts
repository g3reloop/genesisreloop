import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Mock Companies House data for development
// In production, this would make a real API call to Companies House
const mockCompanyData: Record<string, any> = {
  '12345678': {
    company_name: 'GREEN RECYCLING LTD',
    company_status: 'active',
    type: 'ltd',
    date_of_creation: '2018-03-15',
    registered_office_address: {
      address_line_1: '123 Green Street',
      locality: 'London',
      postal_code: 'EC1A 1BB',
      country: 'England'
    },
    sic_codes: ['38110', '38120'], // Waste collection codes
    confirmation_statement: {
      last_made_up_to: '2023-03-14',
      next_due: '2024-03-28'
    }
  },
  '87654321': {
    company_name: 'SUSTAINABLE OILS UK LIMITED',
    company_status: 'active',
    type: 'ltd',
    date_of_creation: '2020-07-22',
    registered_office_address: {
      address_line_1: '456 Eco Avenue',
      locality: 'Manchester',
      postal_code: 'M1 2AB',
      country: 'England'
    },
    sic_codes: ['38210'], // Waste treatment and disposal
    confirmation_statement: {
      last_made_up_to: '2023-07-21',
      next_due: '2024-08-04'
    }
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { companyNumber, emailDomain } = await request.json()

    if (!companyNumber) {
      return NextResponse.json(
        { error: 'Company number is required' },
        { status: 400 }
      )
    }

    // Normalize company number
    const normalizedNumber = companyNumber.toUpperCase().replace(/[^A-Z0-9]/g, '')

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if company exists in mock data
    const companyData = mockCompanyData[normalizedNumber]
    
    if (!companyData) {
      // In production, this would be a real Companies House API call
      // For now, we'll return a not found error
      return NextResponse.json(
        { 
          error: 'Company not found',
          details: 'No company found with this registration number'
        },
        { status: 404 }
      )
    }

    // Calculate verification score
    let score = 0
    const scoreBreakdown = []

    // Base score for valid company
    if (companyData.company_status === 'active') {
      score += 40
      scoreBreakdown.push({ criteria: 'Active Company', points: 40 })
    } else {
      score += 10
      scoreBreakdown.push({ criteria: 'Inactive Company', points: 10 })
    }

    // Score for relevant SIC codes (waste/recycling)
    const wasteSicCodes = ['38110', '38120', '38210', '38220', '38310', '38320']
    const hasWasteSicCode = companyData.sic_codes?.some((code: string) => 
      wasteSicCodes.includes(code)
    )
    if (hasWasteSicCode) {
      score += 20
      scoreBreakdown.push({ criteria: 'Waste Industry SIC Code', points: 20 })
    }

    // Score for email domain match (simplified check)
    if (emailDomain && companyData.company_name) {
      const companyNameWords = companyData.company_name.toLowerCase().split(' ')
      const domainMatch = companyNameWords.some((word: string) => 
        emailDomain.toLowerCase().includes(word) && word.length > 3
      )
      if (domainMatch) {
        score += 20
        scoreBreakdown.push({ criteria: 'Email Domain Match', points: 20 })
      }
    }

    // Score for company age
    const companyAge = new Date().getFullYear() - new Date(companyData.date_of_creation).getFullYear()
    if (companyAge >= 2) {
      score += 10
      scoreBreakdown.push({ criteria: 'Established Company (2+ years)', points: 10 })
    }

    // Score for up-to-date filings
    const nextDue = new Date(companyData.confirmation_statement.next_due)
    if (nextDue > new Date()) {
      score += 10
      scoreBreakdown.push({ criteria: 'Up-to-date Filings', points: 10 })
    }

    return NextResponse.json({
      success: true,
      company: {
        number: normalizedNumber,
        name: companyData.company_name,
        status: companyData.company_status,
        type: companyData.type,
        incorporationDate: companyData.date_of_creation,
        address: companyData.registered_office_address,
        sicCodes: companyData.sic_codes
      },
      verification: {
        score,
        maxScore: 100,
        scoreBreakdown,
        isWasteIndustry: hasWasteSicCode,
        recommendedAction: score >= 60 ? 'approve' : score >= 40 ? 'review' : 'reject'
      }
    })
  } catch (error: any) {
    console.error('Company verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  // Health check endpoint
  return NextResponse.json({ 
    status: 'ok', 
    service: 'company-verification',
    mockData: true 
  })
}
