'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/dashboard')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">ReLoop Platform</h1>
        <p className="text-mythic-dark-500 dark:text-mythic-dark-400">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
