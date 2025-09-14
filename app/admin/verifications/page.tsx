'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Globe,
  FileCheck,
  Mail,
  Search,
  Filter,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'

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
  profiles: {
    id: string
    business_name: string
    email: string
    phone: string
    website?: string
  }
}

function AdminVerificationsPageContent() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [processing, setProcessing] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('pending')
  
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    checkAdminAndLoad()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, activeTab])

  const checkAdminAndLoad = async () => {
    // AuthGuard already handles role checking, so we just load requests
    await loadRequests()
  }

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          profiles (
            id,
            business_name,
            email,
            phone,
            website
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setRequests(data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
      toast.error('Failed to load verification requests')
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(req => req.status === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.profiles.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.company_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }

  const handleApprove = async () => {
    if (!selectedRequest) return
    
    setProcessing(true)
    try {
      // Update verification request
      const { error: reqError } = await supabase
        .from('verification_requests')
        .update({
          status: 'approved',
          notes: adminNotes || 'Verification approved by admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id)

      if (reqError) throw reqError

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          verified: true,
          verification_score: selectedRequest.score
        })
        .eq('id', selectedRequest.user_id)

      if (profileError) throw profileError

      toast.success('Verification approved successfully!')
      setSelectedRequest(null)
      setAdminNotes('')
      await loadRequests()
    } catch (error: any) {
      console.error('Error approving verification:', error)
      toast.error(error.message || 'Failed to approve verification')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return
    
    if (!adminNotes) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setProcessing(true)
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status: 'rejected',
          notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id)

      if (error) throw error

      toast.success('Verification rejected')
      setSelectedRequest(null)
      setAdminNotes('')
      await loadRequests()
    } catch (error: any) {
      console.error('Error rejecting verification:', error)
      toast.error(error.message || 'Failed to reject verification')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-500 border-green-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-500 border-red-500/50'
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'
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


  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mythic-text-primary flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-mythic-primary" />
            Verification Queue
          </h1>
          <p className="text-mythic-text-muted">
            Review and process business verification requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-mythic-text-muted">Total Requests</p>
                  <p className="text-2xl font-bold text-mythic-text-primary">{requests.length}</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-mythic-text-muted" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-mythic-dark-900/50 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-mythic-text-muted">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-mythic-dark-900/50 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-mythic-text-muted">Approved</p>
                  <p className="text-2xl font-bold text-green-500">
                    {requests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-mythic-dark-900/50 border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-mythic-text-muted">Rejected</p>
                  <p className="text-2xl font-bold text-red-500">
                    {requests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
                  <Input
                    placeholder="Search by business name, email, or company number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[var(--field-bg)] border-[var(--field-border)]"
                  />
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">
              Verification Requests ({filteredRequests.length})
            </h3>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card 
                  key={request.id} 
                  className={`bg-mythic-dark-900/50 border-mythic-primary/20 cursor-pointer hover:border-mythic-primary/50 transition-colors ${
                    selectedRequest?.id === request.id ? 'ring-2 ring-mythic-primary' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-mythic-text-primary">
                          {request.profiles.business_name}
                        </h4>
                        <p className="text-sm text-mythic-text-muted">
                          {request.company_number}
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <Mail className="h-4 w-4" />
                        {request.profiles.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-mythic-text-muted">
                        <Clock className="h-4 w-4" />
                        {format(new Date(request.created_at), 'PP')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-mythic-text-muted">Score:</span>
                        <span className={`font-bold ${getScoreColor(request.score)}`}>
                          {request.score}/100
                        </span>
                      </div>
                      {request.proofs?.documents && request.proofs.documents.length > 0 && (
                        <Badge variant="secondary">
                          <FileCheck className="h-3 w-3 mr-1" />
                          {request.proofs.documents.length} docs
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Request Details */}
          <div>
            {selectedRequest ? (
              <Card className="bg-mythic-dark-900/50 border-mythic-primary/20 sticky top-24">
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Business Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-mythic-text-primary">Business Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">Name:</span>
                        <span className="text-mythic-text-primary">{selectedRequest.profiles.business_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">Company #:</span>
                        <span className="text-mythic-text-primary">{selectedRequest.company_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">Email:</span>
                        <span className="text-mythic-text-primary">{selectedRequest.profiles.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mythic-text-muted">Phone:</span>
                        <span className="text-mythic-text-primary">{selectedRequest.profiles.phone}</span>
                      </div>
                      {selectedRequest.profiles.website && (
                        <div className="flex justify-between">
                          <span className="text-mythic-text-muted">Website:</span>
                          <a 
                            href={selectedRequest.profiles.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mythic-primary hover:underline"
                          >
                            {selectedRequest.profiles.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-mythic-text-primary">Verification Score</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-mythic-text-muted">Total Score</span>
                        <span className={`text-lg font-bold ${getScoreColor(selectedRequest.score)}`}>
                          {selectedRequest.score}/100
                        </span>
                      </div>
                      <Progress value={selectedRequest.score} className="h-2" />
                    </div>
                  </div>

                  {/* Documents */}
                  {selectedRequest.proofs?.documents && selectedRequest.proofs.documents.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-mythic-text-primary">Supporting Documents</h4>
                      <div className="space-y-2">
                        {selectedRequest.proofs.documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg bg-mythic-dark-800 hover:bg-mythic-dark-700 transition-colors"
                          >
                            <FileCheck className="h-4 w-4 text-mythic-primary" />
                            <span className="text-sm text-mythic-text-primary flex-1">{doc.name}</span>
                            <Eye className="h-4 w-4 text-mythic-text-muted" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {selectedRequest.status === 'pending' && (
                    <div className="space-y-3 pt-4 border-t border-mythic-dark-800">
                      <Label htmlFor="admin-notes">Admin Notes</Label>
                      <Textarea
                        id="admin-notes"
                        placeholder="Add notes about your decision..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="min-h-[100px] bg-[var(--field-bg)] border-[var(--field-border)]"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleApprove}
                          disabled={processing}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <ThumbsUp className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={handleReject}
                          disabled={processing}
                          variant="destructive"
                          className="flex-1"
                        >
                          {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <ThumbsDown className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Existing Notes */}
                  {selectedRequest.notes && (
                    <div className="space-y-2 pt-4 border-t border-mythic-dark-800">
                      <h4 className="font-medium text-mythic-text-primary flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Decision Notes
                      </h4>
                      <p className="text-sm text-mythic-text-muted">{selectedRequest.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
                <CardContent className="py-16 text-center">
                  <ShieldCheck className="h-12 w-12 text-mythic-text-muted mx-auto mb-4" />
                  <p className="text-mythic-text-muted">
                    Select a verification request to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminVerificationsPage() {
  return (
    <AuthGuard 
      requiredRoles={['admin']}
      requireVerified={true}
      requireOnboarded={true}
    >
      <AdminVerificationsPageContent />
    </AuthGuard>
  )
}
