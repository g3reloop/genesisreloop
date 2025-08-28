'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Bot, MessageSquare, X, Send,
  Truck, Recycle, Route, ShoppingBag, Beaker,
  Shield, Award, Search, AlertTriangle, DollarSign,
  Loader2
} from 'lucide-react'
import { MythicBackground } from '@/components/ui/mythic-background'
import { cn } from '@/lib/utils/cn'

interface AgentInfo {
  name: string
  icon: React.ReactNode
  description: string
  category: 'matching' | 'compliance' | 'finance' | 'reputation'
  color: string
}

const agents: AgentInfo[] = [
  {
    name: 'FeedstockMatcher',
    icon: <Recycle className="h-6 w-6" />,
    description: 'Connects waste suppliers to compatible recycling plants. Optimises feedstock alignment to maximise efficiency.',
    category: 'matching',
    color: 'from-mythic-primary-500 to-mythic-accent-300'
  },
  {
    name: 'TraceBot',
    icon: <Search className="h-6 w-6" />,
    description: 'Tracks material flows across the loop. Provides full transparency on where waste goes and what it becomes.',
    category: 'compliance',
    color: 'from-mythic-flow-credits to-mythic-gold-500'
  },
  {
    name: 'RouteGen',
    icon: <Route className="h-6 w-6" />,
    description: 'Designs decentralised logistics routes for collection and delivery. Minimises cost, maximises loop efficiency.',
    category: 'matching',
    color: 'from-mythic-teal-500 to-mythic-emerald-500'
  },
  {
    name: 'BuyerDiscoveryBot',
    icon: <ShoppingBag className="h-6 w-6" />,
    description: 'Finds buyers for recycled outputs like biogas or biodiesel. Matches supply to demand within Genesis loops.',
    category: 'matching',
    color: 'from-mythic-flow-byproduct to-mythic-flow-feedstock'
  },
  {
    name: 'ByproductMatcher',
    icon: <Beaker className="h-6 w-6" />,
    description: 'Allocates loop byproducts (digestate, glycerol) into new value streams. Prevents waste, ensures total utilisation.',
    category: 'matching',
    color: 'from-mythic-flow-reputation to-mythic-primary-500'
  },
  {
    name: 'CarbonVerifier',
    icon: <Shield className="h-6 w-6" />,
    description: 'Calculates and verifies carbon savings per loop. Issues GIRM credits tied to real tonnage conversion.',
    category: 'compliance',
    color: 'from-mythic-emerald-500 to-mythic-teal-500'
  },
  {
    name: 'ComplianceClerk',
    icon: <AlertTriangle className="h-6 w-6" />,
    description: 'Automates paperwork and compliance processes. Keeps every loop aligned with regulations.',
    category: 'compliance',
    color: 'from-mythic-status-warning to-mythic-status-active'
  },
  {
    name: 'ReputationBot',
    icon: <Award className="h-6 w-6" />,
    description: 'Builds transparent trust scores for suppliers, labs, and buyers. Helps users choose reliable partners.',
    category: 'reputation',
    color: 'from-mythic-flow-reputation to-mythic-flow-credits'
  },
  {
    name: 'LoopAuditBot',
    icon: <Search className="h-6 w-6" />,
    description: 'Audits the integrity of loops. Detects anomalies, flags risks, and ensures loops remain regenerative.',
    category: 'compliance',
    color: 'from-mythic-status-error to-mythic-status-warning'
  },
  {
    name: 'LoopInsurer',
    icon: <Shield className="h-6 w-6" />,
    description: 'Provides risk coverage for loops. Protects operators against disruptions or unexpected failures.',
    category: 'finance',
    color: 'from-mythic-dark-600 to-mythic-dark-500'
  },
  {
    name: 'LiquidityBot',
    icon: <DollarSign className="h-6 w-6" />,
    description: 'Monitors financial flows in the loop economy. Ensures liquidity for operators and smooth DAO allocation.',
    category: 'finance',
    color: 'from-mythic-flow-credits to-mythic-gold-400'
  }
]

interface ChatMessage {
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({})
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [filter, setFilter] = useState<'all' | 'matching' | 'compliance' | 'finance' | 'reputation'>('all')

  const filteredAgents = filter === 'all' 
    ? agents 
    : agents.filter(agent => agent.category === filter)

  const openChat = (agentName: string) => {
    setSelectedAgent(agentName)
    // Initialize chat if not exists
    if (!chatMessages[agentName]) {
      setChatMessages({
        ...chatMessages,
        [agentName]: [{
          role: 'agent',
          content: `Hello! I'm ${agentName}. How can I help you today?`,
          timestamp: new Date()
        }]
      })
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => ({
      ...prev,
      [selectedAgent]: [...(prev[selectedAgent] || []), userMessage]
    }))

    setInputMessage('')
    setIsTyping(true)

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        role: 'agent',
        content: `I understand you're asking about "${inputMessage}". Let me process that request for you...`,
        timestamp: new Date()
      }

      setChatMessages(prev => ({
        ...prev,
        [selectedAgent]: [...(prev[selectedAgent] || []), agentResponse]
      }))
      setIsTyping(false)
    }, 1500)
  }

  const selectedAgentInfo = agents.find(a => a.name === selectedAgent)

  return (
    <div className="relative min-h-screen bg-black">
      {/* Mythic Background */}
      <MythicBackground variant="flow" opacity={0.03} />
      
      <div className="relative pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 via-mythic-accent-300 to-mythic-flow-credits bg-clip-text text-transparent">
                Genesis AI Agents
              </span>
            </h1>
            <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
              Intelligent agents powering the decentralised loop economy. 
              Click any agent to start a conversation.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {(['all', 'matching', 'compliance', 'finance', 'reputation'] as const).map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                  "px-6 py-2 rounded-full font-medium transition-all",
                  filter === category 
                    ? "bg-mythic-primary-500/20 text-mythic-primary-500 border-2 border-mythic-primary-500/50" 
                    : "text-mythic-text-muted border-2 border-mythic-primary-500/20 hover:border-mythic-primary-500/40 hover:text-mythic-text-primary"
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => openChat(agent.name)}
                className={cn(
                  "group cursor-pointer rounded-2xl p-6",
                  "bg-mythic-dark-900/50 backdrop-blur-sm",
                  "border-2 border-mythic-primary-500/10",
                  "hover:border-mythic-primary-500/50",
                  "hover:shadow-lg hover:shadow-mythic-primary-500/10",
                  "transition-all duration-300"
                )}
              >
                {/* Icon with gradient background */}
                <div className={cn(
                  "w-16 h-16 rounded-xl mb-4",
                  "bg-gradient-to-br flex items-center justify-center",
                  "group-hover:scale-110 transition-transform duration-300",
                  agent.color
                )}>
                  <div className="text-white">
                    {agent.icon}
                  </div>
                </div>

                {/* Agent Name */}
                <h3 className="text-xl font-bold text-mythic-text-primary mb-2 group-hover:text-mythic-primary-500 transition-colors">
                  {agent.name}
                </h3>

                {/* Description */}
                <p className="text-mythic-text-muted text-sm leading-relaxed mb-4">
                  {agent.description}
                </p>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    "bg-mythic-primary-500/10 text-mythic-primary-500"
                  )}>
                    {agent.category}
                  </span>
                  <MessageSquare className="h-5 w-5 text-mythic-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgent(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:right-8 md:bottom-8 md:w-96 md:h-[600px] bg-mythic-dark-900 rounded-2xl shadow-2xl border-2 border-mythic-primary-500/20 z-50 flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-mythic-primary-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                      selectedAgentInfo?.color
                    )}>
                      <div className="text-white">
                        {selectedAgentInfo?.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-mythic-text-primary">
                        {selectedAgent}
                      </h3>
                      <p className="text-xs text-mythic-text-muted">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-2 hover:bg-mythic-dark-800 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-mythic-text-muted" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages[selectedAgent]?.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === 'user'
                        ? "bg-mythic-primary-500/20 text-mythic-text-primary"
                        : "bg-mythic-dark-800 text-mythic-text-muted"
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-mythic-dark-800 rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-mythic-text-muted" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-mythic-primary-500/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage()
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-mythic-dark-800 text-mythic-text-primary placeholder-mythic-text-muted focus:outline-none focus:ring-2 focus:ring-mythic-primary-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      inputMessage.trim()
                        ? "bg-mythic-primary-500 text-white hover:bg-mythic-primary-400"
                        : "bg-mythic-dark-800 text-mythic-text-muted cursor-not-allowed"
                    )}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
