'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ArrowRight, FileCheck, Mail } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ApplicationSubmittedPage() {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('business_name, email')
      .eq('id', user.id)
      .single()

    if (profile) {
      setBusinessName(profile.business_name)
      setEmail(profile.email)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-mythic-dark-900/50 border-mythic-primary-500/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="w-20 h-20 bg-mythic-primary-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-mythic-primary-500" />
              </div>
            </motion.div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Application Submitted!
            </CardTitle>
            <CardDescription className="text-lg text-mythic-text-muted mt-2">
              Welcome to Genesis Reloop, {businessName}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-mythic-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-black" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-mythic-text-primary">Application Received</h3>
                  <p className="text-sm text-mythic-text-muted">
                    We've received your application and it's being processed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-mythic-primary-500/20 border-2 border-mythic-primary-500 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-mythic-primary-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-mythic-text-primary">Verification In Progress</h3>
                  <p className="text-sm text-mythic-text-muted">
                    Our team is reviewing your business details. This usually takes 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-500">Account Activated</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive an email at {email} once your account is activated.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-mythic-primary-500/10 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-mythic-text-primary flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-mythic-primary-500" />
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-mythic-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-mythic-primary-500 mt-0.5">•</span>
                  <span>We'll verify your business information within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mythic-primary-500 mt-0.5">•</span>
                  <span>Once approved, you'll get full access to the marketplace</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mythic-primary-500 mt-0.5">•</span>
                  <span>You can start listing materials or browsing available products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mythic-primary-500 mt-0.5">•</span>
                  <span>Access to AI agents for matching and optimization</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-mythic-primary-500/20"
                onClick={() => router.push('/docs')}
              >
                Read Documentation
              </Button>
              <Button 
                className="flex-1 bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black font-semibold"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Support Note */}
            <p className="text-center text-sm text-mythic-text-muted pt-4">
              Have questions? Contact our support team at{' '}
              <a href="mailto:support@genesisreloop.com" className="text-mythic-primary-500 hover:underline">
                support@genesisreloop.com
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
