'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  FileCheck,
  Globe,
  Mail,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'

interface VerificationRequest {
  id: string
  user_id: string
  company_number: string
  email_domain: string
  status: 'pending' | 'approved' | 'rejected'
  score: number
  notes?: string
  proofs?: {
    documents: Array<{
      name: string
      url: string
      type: string
    }>
  }
  created_at: string
  updated_at: string
}

interface Profile {
  id: string
  business_name: string
  email: string
  verified: boolean
  verification_score: number
  website?: string
}

export default function VerificationStatusPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [request, setRequest] = useState<VerificationRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Load latest verification request
      const { data: requestData } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (requestData) {
        setRequest(requestData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500'
      case 'rejected':
        return 'text-red-500'
      case 'pending':
      default:
        return 'text-yellow-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-20 w-20 text-green-500" />
      case 'rejected':
        return <XCircle className="h-20 w-20 text-red-500" />
      case 'pending':
      default:
        return <Clock className="h-20 w-20 text-yellow-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mythic-primary" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
            <CardContent className="text-center py-16">
              <ShieldCheck className="h-20 w-20 text-mythic-text-muted mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-2">
                No Verification Request
              </h2>
              <p className="text-mythic-text-muted mb-4">
                You haven't submitted a verification request yet.
              </p>
              <Button onClick={() => router.push('/verify')}>
                Start Verification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-mythic-text-primary">
              Verification Status
            </h1>
            <p className="text-mythic-text-muted">
              Track your business verification progress
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Status Card */}
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 mb-6">
          <CardContent className="text-center py-12">
            {getStatusIcon(request.status)}
            <h2 className="text-2xl font-bold text-mythic-text-primary mt-4 mb-2">
              Verification {request.status === 'approved' ? 'Approved' : 
                          request.status === 'rejected' ? 'Rejected' : 'Pending'}
            </h2>
            <p className="text-mythic-text-muted">
              {request.status === 'approved' 
                ? 'Your business has been successfully verified!'
                : request.status === 'rejected'
                ? 'Unfortunately, we couldn\'t verify your business at this time.'
                : 'Your verification request is being reviewed.'}
            </p>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 mb-6">
          <CardHeader>
            <CardTitle>Verification Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Company Info */}
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-mythic-text-muted flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-mythic-text-primary">Company Number</p>
                <p className="text-sm text-mythic-text-muted">{request.company_number}</p>
              </div>
            </div>

            {/* Email Domain */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-mythic-text-muted flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-mythic-text-primary">Email Domain</p>
                <p className="text-sm text-mythic-text-muted">{request.email_domain}</p>
              </div>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-mythic-text-primary">Verification Score</p>
                <span className={`text-lg font-bold ${getScoreColor(request.score)}`}>
                  {request.score}/100
                </span>
              </div>
              <Progress value={request.score} className="h-2" />
            </div>

            {/* Documents */}
            {request.proofs?.documents && request.proofs.documents.length > 0 && (
              <div className="flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-mythic-text-muted flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-mythic-text-primary mb-2">
                    Supporting Documents
                  </p>
                  <div className="space-y-1">
                    {request.proofs.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {doc.type.split('/')[1]?.toUpperCase() || 'DOC'}
                        </Badge>
                        <span className="text-xs text-mythic-text-muted truncate">
                          {doc.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {request.notes && (
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-mythic-text-muted flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-mythic-text-primary">Notes</p>
                  <p className="text-sm text-mythic-text-muted">{request.notes}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="pt-4 border-t border-mythic-dark-800">
              <p className="text-xs text-mythic-text-muted">
                Submitted: {format(new Date(request.created_at), 'PPp')}
              </p>
              {request.updated_at !== request.created_at && (
                <p className="text-xs text-mythic-text-muted">
                  Last updated: {format(new Date(request.updated_at), 'PPp')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {request.status === 'approved' && (
            <Button 
              className="flex-1"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          )}
          {request.status === 'rejected' && (
            <Button 
              className="flex-1"
              onClick={() => router.push('/verify')}
            >
              Submit New Request
            </Button>
          )}
          {request.status === 'pending' && (
            <Button 
              className="flex-1"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Return to Dashboard
            </Button>
          )}
        </div>

        {/* Score Breakdown */}
        {request.score > 0 && (
          <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 mt-6">
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>
                How your verification score was calculated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-mythic-text-muted">Company Registration</span>
                  <span className="text-sm font-medium text-mythic-text-primary">+40</span>
                </div>
                {request.email_domain && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-mythic-text-muted">Email Domain Match</span>
                    <span className="text-sm font-medium text-mythic-text-primary">+20</span>
                  </div>
                )}
                {request.proofs?.documents && request.proofs.documents.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-mythic-text-muted">Supporting Documents</span>
                    <span className="text-sm font-medium text-mythic-text-primary">
                      +{Math.min(request.proofs.documents.length * 5, 20)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-mythic-dark-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-mythic-text-primary">Total Score</span>
                    <span className={`text-lg font-bold ${getScoreColor(request.score)}`}>
                      {request.score}/100
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
