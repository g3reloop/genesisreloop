'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import OnboardingStepper from '@/components/onboarding/OnboardingStepper'

export default function OnboardingPage() {
  return <OnboardingStepper />
}
