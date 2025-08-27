import { cn } from '@/lib/utils/cn'
import { Shield, AlertCircle, CheckCircle } from 'lucide-react'

interface LoopBadgeProps {
  type: 'SRL' | 'CRL'
  className?: string
}

export function LoopBadge({ type, className }: LoopBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      type === 'SRL' 
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "bg-red-500/20 text-red-400 border border-red-500/30",
      className
    )}>
      {type === 'SRL' ? (
        <CheckCircle className="h-3 w-3 mr-1" />
      ) : (
        <AlertCircle className="h-3 w-3 mr-1" />
      )}
      {type} {type === 'SRL' ? 'verified' : 'converted (corporate)'}
    </div>
  )
}

interface GirmBadgeProps {
  proofId?: string
  className?: string
}

export function GirmBadge({ proofId, className }: GirmBadgeProps) {
  const hasProof = proofId && proofId !== 'pending'
  
  return (
    <div className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      hasProof
        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
        : "bg-gray-500/20 text-gray-400 border border-gray-500/30",
      className
    )}>
      <Shield className="h-3 w-3 mr-1" />
      {hasProof ? `GIRM: ${proofId}` : 'GIRM pending'}
    </div>
  )
}

interface DaoBadgeProps {
  className?: string
}

export function DaoBadge({ className }: DaoBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      className
    )}>
      <Shield className="h-3 w-3 mr-1" />
      DAO-signed
    </div>
  )
}
