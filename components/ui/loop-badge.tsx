import * as React from 'react'
import { cn } from '@/lib/cn'

export interface LoopBadgeProps {
  type: 'SRL' | 'CRL'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoopBadge: React.FC<LoopBadgeProps> = ({ type, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        type === 'SRL' 
          ? 'bg-mythic-loop-srl/20 text-mythic-loop-srl border border-mythic-loop-srl/30' 
          : 'bg-mythic-loop-crl/20 text-mythic-loop-crl border border-mythic-loop-crl/30',
        className
      )}
    >
      {type}
    </span>
  )
}

export { LoopBadge }
