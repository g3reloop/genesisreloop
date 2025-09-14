'use client'

// Force dynamic rendering to avoid Supabase initialization during build
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  Send,
  Package,
  ShieldCheck,
  Paperclip,
  X,
  Download,
  File,
  Image as ImageIcon,
  Loader2,
  Route,
  MapIcon
} from 'lucide-react'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { toast } from 'react-hot-toast'
import RouteShareCard from '@/components/messages/RouteShareCard'
import ShareRouteModal from '@/components/messages/ShareRouteModal'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  attachments?: {
    name: string
    url: string
    type: string
    size: number
  }[]
  created_at: string
  read_at: string | null
  sender: {
    id: string
    business_name: string
    verified: boolean
  }
}

interface ConversationDetails {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  listings: {
    id: string
    title: string
    category: string
    price: number
    unit: string
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
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [conversation, setConversation] = useState<ConversationDetails | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [showRouteShare, setShowRouteShare] = useState(false)
  
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    loadConversation()
    setupRealtimeSubscription()
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      setUserId(user.id)

      // Load conversation details
      const { data: convoData, error: convoError } = await supabase
        .from('conversations')
        .select(`
          *,
          listings!inner (
            id,
            title,
            category,
            price,
            unit,
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
          )
        `)
        .eq('id', params.id)
        .single()

      if (convoError) throw convoError
      setConversation(convoData)

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            business_name,
            verified
          )
        `)
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError
      setMessages(messagesData || [])

      // Mark messages as read
      await markMessagesAsRead(user.id, messagesData || [])
    } catch (error) {
      console.error('Error loading conversation:', error)
      toast.error('Failed to load conversation')
      router.push('/messages')
    } finally {
      setLoading(false)
    }
  }

  const markMessagesAsRead = async (userId: string, messages: Message[]) => {
    const unreadMessageIds = messages
      .filter(msg => msg.sender_id !== userId && !msg.read_at)
      .map(msg => msg.id)

    if (unreadMessageIds.length > 0) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadMessageIds)
    }
  }

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel(`conversation-${params.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${params.id}`
        },
        async (payload) => {
          // Fetch the full message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!sender_id (
                id,
                business_name,
                verified
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => [...prev, data])
            
            // Mark as read if it's not from current user
            if (data.sender_id !== userId) {
              await markMessagesAsRead(userId, [data])
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  const handleSendMessage = async (e?: React.FormEvent, shareData?: any) => {
    e?.preventDefault()
    
    if (!newMessage.trim() && attachments.length === 0 && !shareData) return
    if (!conversation) return

    setSending(true)

    try {
      // Upload attachments if any
      const attachmentData = shareData ? [shareData] : []
      if (attachments.length > 0) {
        for (const file of attachments) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${userId}/${Date.now()}-${Math.random()}.${fileExt}`
          
          const { error: uploadError } = await supabase.storage
            .from('message-attachments')
            .upload(fileName, file)
          
          if (uploadError) throw uploadError
          
          const { data: { publicUrl } } = supabase.storage
            .from('message-attachments')
            .getPublicUrl(fileName)
          
          attachmentData.push({
            name: file.name,
            url: publicUrl,
            type: file.type,
            size: file.size
          })
        }
      }

      // Send message
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: userId,
          body: shareData ? `Shared a route: ${shareData.data.summary}` : newMessage.trim(),
          attachments: attachmentData.length > 0 ? attachmentData : null
        })

      if (error) throw error

      setNewMessage('')
      setAttachments([])
      toast.success('Message sent')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB`)
        return false
      }
      return true
    })

    setAttachments(prev => [...prev, ...validFiles])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleShareRoute = async (routeData: any) => {
    await handleSendMessage(undefined, routeData)
  }

  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date)
    
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm')
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, 'HH:mm')}`
    } else {
      return format(messageDate, 'dd/MM/yyyy HH:mm')
    }
  }

  const getOtherParty = () => {
    if (!conversation) return null
    return conversation.buyer_id === userId ? conversation.seller : conversation.buyer
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
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mythic-primary" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-mythic-text-primary mb-4">
            Conversation not found
          </h2>
          <Button onClick={() => router.push('/messages')}>
            Back to Messages
          </Button>
        </div>
      </div>
    )
  }

  const otherParty = getOtherParty()

  return (
    <div className="min-h-screen bg-black pt-20 pb-0">
      <div className="h-[calc(100vh-80px)] flex flex-col max-w-6xl mx-auto">
        {/* Header */}
        <Card className="rounded-none border-x-0 border-t-0 bg-mythic-dark-900/50 border-mythic-primary/20">
          <CardHeader className="py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/messages')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex-1 flex items-center gap-4">
                {/* Listing Image */}
                {conversation.listings.media?.images?.[0] ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-mythic-dark-800 flex-shrink-0">
                    <img
                      src={conversation.listings.media.images[0]}
                      alt={conversation.listings.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-mythic-dark-800 flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-mythic-primary/30" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-mythic-text-primary flex items-center gap-2">
                    {otherParty?.business_name}
                    {otherParty?.verified && (
                      <Badge variant="outline" className="text-xs border-mythic-primary/50">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </h2>
                  <p className="text-sm text-mythic-text-muted">
                    {conversation.listings.title} • £{conversation.listings.price}/{conversation.listings.unit}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => router.push(`/marketplace/${conversation.listing_id}`)}
                >
                  View Listing
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message, index) => {
            const isOwn = message.sender_id === userId
            const showDate = index === 0 || 
              new Date(messages[index - 1].created_at).toDateString() !== 
              new Date(message.created_at).toDateString()

            return (
              <div key={message.id}>
                {/* Date Separator */}
                {showDate && (
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-mythic-primary/20" />
                    <span className="text-xs text-mythic-text-muted">
                      {isToday(new Date(message.created_at))
                        ? 'Today'
                        : isYesterday(new Date(message.created_at))
                        ? 'Yesterday'
                        : format(new Date(message.created_at), 'dd MMMM yyyy')}
                    </span>
                    <div className="flex-1 h-px bg-mythic-primary/20" />
                  </div>
                )}

                {/* Message */}
                <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${
                      isOwn ? 'bg-mythic-primary text-black' : 'bg-mythic-primary/20 text-mythic-primary'
                    }`}>
                      {getInitials(message.sender.business_name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Bubble */}
                  <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-mythic-primary text-black'
                        : 'bg-mythic-dark-800 text-mythic-text-primary'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.body}
                      </p>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, i) => {
                            // Check if it's a route attachment
                            if (attachment.type === 'route' && attachment.data) {
                              return (
                                <RouteShareCard
                                  key={i}
                                  data={attachment.data}
                                  compact={true}
                                  onViewRoute={() => router.push(`/routes/${attachment.data.routeId}`)}
                                  onContactCarrier={attachment.data.carrier ? 
                                    () => router.push(`/carriers/${attachment.data.carrier.id}`) : 
                                    undefined
                                  }
                                />
                              )
                            }
                            
                            // Regular file attachment
                            return (
                              <a
                                key={i}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                  isOwn
                                    ? 'bg-black/20 hover:bg-black/30'
                                    : 'bg-mythic-dark-900 hover:bg-mythic-dark-900/80'
                                }`}
                              >
                                {attachment.type.startsWith('image/') ? (
                                  <ImageIcon className="h-4 w-4" />
                                ) : (
                                  <File className="h-4 w-4" />
                                )}
                                <span className="text-xs flex-1 truncate">
                                  {attachment.name}
                                </span>
                                <Download className="h-3 w-3" />
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <p className={`text-xs text-mythic-text-muted mt-1 px-2 ${
                      isOwn ? 'text-right' : 'text-left'
                    }`}>
                      {formatMessageDate(message.created_at)}
                      {isOwn && message.read_at && (
                        <span className="ml-2 text-mythic-primary">✓✓</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <Card className="rounded-none border-x-0 border-b-0 bg-mythic-dark-900/50 border-mythic-primary/20">
          <CardContent className="p-4">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-mythic-dark-800 px-3 py-1 rounded-lg"
                  >
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="h-4 w-4 text-mythic-primary" />
                    ) : (
                      <File className="h-4 w-4 text-mythic-primary" />
                    )}
                    <span className="text-xs text-mythic-text-muted max-w-[150px] truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-mythic-text-muted hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowRouteShare(true)}
                disabled={sending}
                title="Share Route"
              >
                <Route className="h-5 w-5" />
              </Button>

              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 min-h-[44px] max-h-32 resize-none bg-[var(--field-bg)] border-[var(--field-border)]"
                disabled={sending}
              />

              <Button
                type="submit"
                size="icon"
                disabled={sending || (!newMessage.trim() && attachments.length === 0)}
                className="bg-mythic-primary hover:bg-mythic-primary/90 text-black"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Route Share Modal */}
      <ShareRouteModal
        open={showRouteShare}
        onClose={() => setShowRouteShare(false)}
        onShare={handleShareRoute}
        listingId={conversation?.listing_id}
      />
    </div>
  )
}
