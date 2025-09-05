'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { agentServiceClient as agentService, isConfigured } from '@/lib/agents/agent-service-client'
import { AGENTS, type AgentType } from '@/lib/agents/agent-constants'
import { 
  Brain, 
  Route, 
  Leaf, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Lock,
  Unlock,
  Calculator,
  DollarSign,
  Shield,
  Vote,
  Network,
  HelpCircle,
  Loader2,
  AlertCircle,
  FileCheck,
  Recycle,
  MapPin,
  BarChart3,
  Coins,
  Send,
  MessageSquare,
  X,
  Sparkles,
  Search,
  Beaker,
  Award
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

// Icon mapping for agent types
const AGENT_ICONS: Record<AgentType, React.ReactNode> = {
  feedstock_matcher: <Recycle className="h-6 w-6" />,
  traceability_tracker: <Search className="h-6 w-6" />,
  route_optimizer: <Route className="h-6 w-6" />,
  byproduct_matcher: <Beaker className="h-6 w-6" />,
  buyer_discovery: <Users className="h-6 w-6" />,
  carbon_verification: <Leaf className="h-6 w-6" />,
  compliance_checker: <ShieldCheck className="h-6 w-6" />,
  reputation_scorer: <Award className="h-6 w-6" />,
  dynamic_pricing: <TrendingUp className="h-6 w-6" />,
  predictive_supply: <BarChart3 className="h-6 w-6" />,
  insurance_calculator: <Shield className="h-6 w-6" />,
  finance_advisor: <DollarSign className="h-6 w-6" />,
  dao_governance: <Vote className="h-6 w-6" />,
  loop_expander: <Network className="h-6 w-6" />,
  consumer_guide: <HelpCircle className="h-6 w-6" />
}

// Category mapping
const AGENT_CATEGORIES: Record<AgentType, string> = {
  feedstock_matcher: 'matching',
  traceability_tracker: 'operations',
  route_optimizer: 'operations',
  byproduct_matcher: 'matching',
  buyer_discovery: 'matching',
  carbon_verification: 'compliance',
  compliance_checker: 'compliance',
  reputation_scorer: 'reputation',
  dynamic_pricing: 'finance',
  predictive_supply: 'analytics',
  insurance_calculator: 'finance',
  finance_advisor: 'finance',
  dao_governance: 'governance',
  loop_expander: 'innovation',
  consumer_guide: 'education'
}

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  matching: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  operations: 'bg-green-500/10 text-green-500 border-green-500/20',
  compliance: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  reputation: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  finance: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  analytics: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  governance: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  innovation: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  education: 'bg-teal-500/10 text-teal-500 border-teal-500/20'
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  loading?: boolean
}

export default function AgentsPage() {
  const [user, setUser] = useState<any>(null)
  const [availableAgents, setAvailableAgents] = useState<Array<{ type: AgentType; agent: typeof AGENTS[AgentType] }>>([])
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null)
  const [chatMessages, setChatMessages] = useState<Record<AgentType, ChatMessage[]>>({} as any)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isChatting, setIsChatting] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  
  const router = useRouter()

  useEffect(() => {
    loadUserAndAgents()
  }, [])

  const loadUserAndAgents = async () => {
    try {
      // Get user
      const supabase = createClientComponentClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        setUser({ ...authUser, ...profile })
      }
      
      // Get available agents
      const agents = await agentService.getAvailableAgents(authUser?.id)
      setAvailableAgents(agents)
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent || isChatting) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '...',
      timestamp: new Date(),
      loading: true
    }
    
    // Update messages
    setChatMessages(prev => ({
      ...prev,
      [selectedAgent]: [...(prev[selectedAgent] || []), userMessage, loadingMessage]
    }))
    
    setInputMessage('')
    setIsChatting(true)
    
    try {
      // Get agent response
      const response = await agentService.chat(selectedAgent, userMessage.content, {
        userId: user?.id,
        userRole: user?.role,
        businessType: user?.business_type
      })
      
      // Replace loading message with actual response
      setChatMessages(prev => ({
        ...prev,
        [selectedAgent]: prev[selectedAgent].map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: response.content, loading: false }
            : msg
        )
      }))
      
      // Log usage if user is authenticated
      if (user && response.usage) {
        await agentService.logUsage(selectedAgent, user.id, {
          prompt: response.usage.prompt_tokens,
          completion: response.usage.completion_tokens
        })
      }
    } catch (error) {
      console.error('Error chatting with agent:', error)
      
      // Show error message
      setChatMessages(prev => ({
        ...prev,
        [selectedAgent]: prev[selectedAgent].map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', loading: false }
            : msg
        )
      }))
      
      toast.error('Failed to get agent response')
    } finally {
      setIsChatting(false)
    }
  }

  const openChat = (agentType: AgentType) => {
    setSelectedAgent(agentType)
    
    // Initialize chat if not exists
    if (!chatMessages[agentType]) {
      const agent = AGENTS[agentType]
      setChatMessages(prev => ({
        ...prev,
        [agentType]: [{
          id: '0',
          role: 'assistant',
          content: `Hello! I'm the ${agent.name}. ${agent.description} How can I help you today?`,
          timestamp: new Date()
        }]
      }))
    }
  }

  // Get unique categories
  const categories = Array.from(new Set(Object.values(AGENT_CATEGORIES)))
  const filteredAgents = categoryFilter === 'all' 
    ? availableAgents 
    : availableAgents.filter(({ type }) => AGENT_CATEGORIES[type] === categoryFilter)

  if (isLoading) {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-mythic-text-primary mb-4">
            AI Agent Hub
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Intelligent agents powering the circular economy. Access role-based AI assistants 
            to optimize your operations.
          </p>
          
          {!user && (
            <Alert className="mt-6 max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Sign in to access all agents. Currently showing public agents only.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setCategoryFilter('all')}
            size="sm"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              onClick={() => setCategoryFilter(category)}
              size="sm"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAgents.map(({ type, agent }) => {
            const category = AGENT_CATEGORIES[type]
            const hasAccess = !!user // All agents require authentication for now
            
            return (
              <Card 
                key={type}
                className={cn(
                  "bg-mythic-dark-900/50 border-mythic-primary/20 transition-all cursor-pointer",
                  hasAccess 
                    ? "hover:border-mythic-primary/50 hover:shadow-lg hover:shadow-mythic-primary/20" 
                    : "opacity-60 cursor-not-allowed"
                )}
                onClick={() => hasAccess && openChat(type)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-lg bg-mythic-primary/10 text-mythic-primary">
                      {AGENT_ICONS[type]}
                    </div>
                    {!hasAccess && (
                      <Lock className="h-5 w-5 text-mythic-text-muted" />
                    )}
                  </div>
                  <CardTitle className="text-mythic-text-primary">
                    {agent.name}
                  </CardTitle>
                  <CardDescription className="text-mythic-text-muted">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={cn("border", CATEGORY_COLORS[category])}>
                      {category}
                    </Badge>
                    {hasAccess ? (
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    ) : (
                      <span className="text-sm text-mythic-text-muted">
                        Sign in required
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* OpenRouter Status */}
        <div className="text-center">
          <Badge 
            variant="outline" 
            className={cn(
              "border",
              isConfigured() 
                ? "border-green-500/50 text-green-500" 
                : "border-yellow-500/50 text-yellow-500"
            )}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {isConfigured() ? 'AI Powered by OpenRouter' : 'Demo Mode - Configure OpenRouter for AI'}
          </Badge>
        </div>
      </div>

      {/* Chat Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedAgent(null)}
          />
          <div className="relative bg-mythic-dark-900 rounded-xl border border-mythic-primary/20 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-mythic-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mythic-primary/10 text-mythic-primary">
                  {AGENT_ICONS[selectedAgent]}
                </div>
                <div>
                  <h3 className="font-semibold text-mythic-text-primary">
                    {AGENTS[selectedAgent].name}
                  </h3>
                  <Badge className={cn("text-xs border", CATEGORY_COLORS[AGENT_CATEGORIES[selectedAgent]])}>
                    {AGENT_CATEGORIES[selectedAgent]}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedAgent(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages[selectedAgent]?.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === 'user'
                        ? "bg-mythic-primary/20 text-mythic-text-primary"
                        : "bg-mythic-dark-800 text-mythic-text-secondary"
                    )}
                  >
                    {message.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-mythic-primary/20">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isChatting}
                  className="flex-1 bg-[var(--field-bg)] border-[var(--field-border)]"
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isChatting}
                >
                  {isChatting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
