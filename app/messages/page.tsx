'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search,
  MessageCircle,
  Clock,
  Package,
  CheckCheck,
  Circle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  last_message_at: string
  created_at: string
  listings: {
    id: string
    title: string
    category: string
    media?: {
      images?: string[]
    }
  }
  buyer: {
    id: string
    business_name: string
    verified: boolean
  }
  seller: {
    id: string
    business_name: string
    verified: boolean
  }
  messages: {
    id: string
    body: string
    sender_id: string
    created_at: string
    read_at: string | null
  }[]
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [userId, setUserId] = useState<string>('')
  const [unreadCount, setUnreadCount] = useState(0)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadConversations()
    setupRealtimeSubscription()
  }, [])

  useEffect(() => {
    filterConversations()
  }, [conversations, searchQuery])

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      setUserId(user.id)

      // Fetch conversations where user is either buyer or seller
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listings!inner (
            id,
            title,
            category,
            media
          ),
          buyer:profiles!buyer_id (
            id,
            business_name,
            verified
          ),
          seller:profiles!seller_id (
            id,
            business_name,
            verified
          ),
          messages (
            id,
            body,
            sender_id,
            created_at,
            read_at
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

      if (error) throw error

      // Process conversations to get last message and unread count
      const processedConversations = data?.map(convo => ({
        ...convo,
        messages: convo.messages
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 1) // Get only the last message
      })) || []

      setConversations(processedConversations)

      // Count unread messages
      const unread = data?.reduce((count, convo) => {
        const unreadMessages = convo.messages.filter(
          (msg: any) => msg.sender_id !== user.id && !msg.read_at
        )
        return count + unreadMessages.length
      }, 0) || 0

      setUnreadCount(unread)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          // Reload conversations when a new message arrives
          loadConversations()
        }
      )
      .subscribe()

    // Subscribe to conversation updates
    const conversationSubscription = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${user.id},seller_id=eq.${user.id}`
        },
        (payload) => {
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(messageSubscription)
      supabase.removeChannel(conversationSubscription)
    }
  }

  const filterConversations = () => {
    if (!searchQuery) {
      setFilteredConversations(conversations)
      return
    }

    const filtered = conversations.filter(convo => {
      const otherParty = convo.buyer_id === userId ? convo.seller : convo.buyer
      return (
        otherParty.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convo.listings.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convo.messages[0]?.body.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

    setFilteredConversations(filtered)
  }

  const getOtherParty = (conversation: Conversation) => {
    return conversation.buyer_id === userId ? conversation.seller : conversation.buyer
  }

  const isUnread = (conversation: Conversation) => {
    return conversation.messages.some(
      msg => msg.sender_id !== userId && !msg.read_at
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-mythic-dark-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mythic-text-primary mb-1 sm:mb-2">
                Messages
              </h1>
              <p className="text-sm sm:text-base text-mythic-text-muted">
                Manage your conversations with buyers and sellers
              </p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="default" className="bg-mythic-primary text-black">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mythic-text-muted" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[var(--field-bg)] border-[var(--field-border)] text-sm sm:text-base"
          />
        </div>

        {/* Conversations List */}
        {filteredConversations.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {filteredConversations.map((conversation) => {
              const otherParty = getOtherParty(conversation)
              const lastMessage = conversation.messages[0]
              const unread = isUnread(conversation)

              return (
                <Card
                  key={conversation.id}
                  className={`bg-mythic-dark-900/50 border-mythic-primary/20 hover:border-mythic-primary/40 transition-all cursor-pointer ${
                    unread ? 'border-l-4 border-l-mythic-primary' : ''
                  }`}
                  onClick={() => router.push(`/messages/${conversation.id}`)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Avatar or Product Image */}
                      <div className="flex-shrink-0">
                        {conversation.listings.media?.images?.[0] ? (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-mythic-dark-800">
                            <img
                              src={conversation.listings.media.images[0]}
                              alt={conversation.listings.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                            <AvatarFallback className="bg-mythic-primary/20 text-mythic-primary text-xs sm:text-sm">
                              {getInitials(otherParty.business_name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {/* Conversation Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 gap-1 sm:gap-0">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-mythic-text-primary text-sm sm:text-base flex items-center gap-2">
                              <span className="truncate">{otherParty.business_name}</span>
                              {otherParty.verified && (
                                <Badge variant="outline" className="text-xs border-mythic-primary/50 shrink-0">
                                  Verified
                                </Badge>
                              )}
                            </h3>
                            <p className="text-xs sm:text-sm text-mythic-text-muted flex items-center gap-1">
                              <Package className="h-3 w-3 shrink-0" />
                              <span className="truncate">{conversation.listings.title}</span>
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-2 sm:block">
                            <p className="text-xs text-mythic-text-muted flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(conversation.last_message_at), {
                                addSuffix: true
                              })}
                            </p>
                            {lastMessage && lastMessage.sender_id === userId && (
                              <CheckCheck className={`h-4 w-4 mt-1 hidden sm:block ${
                                lastMessage.read_at ? 'text-mythic-primary' : 'text-mythic-text-muted'
                              }`} />
                            )}
                          </div>
                        </div>
                        
                        {lastMessage && (
                          <p className={`text-xs sm:text-sm line-clamp-1 ${
                            unread ? 'text-mythic-text-primary font-medium' : 'text-mythic-text-muted'
                          }`}>
                            {lastMessage.sender_id === userId && (
                              <span className="text-mythic-text-muted">You: </span>
                            )}
                            {lastMessage.body}
                          </p>
                        )}
                      </div>

                      {/* Unread Indicator */}
                      {unread && (
                        <div className="flex-shrink-0">
                          <Circle className="h-2 w-2 fill-mythic-primary text-mythic-primary" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="bg-mythic-dark-900/50 border-mythic-primary/20">
            <CardContent className="text-center py-16">
              <MessageCircle className="h-16 w-16 text-mythic-primary/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-mythic-text-primary mb-2">
                No conversations yet
              </h3>
              <p className="text-mythic-text-muted mb-4">
                {searchQuery
                  ? 'No conversations match your search'
                  : 'Start a conversation by messaging a seller from a listing'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
