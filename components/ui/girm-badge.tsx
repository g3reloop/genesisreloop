import * as React from 'react'
import { cn } from '@/lib/cn'
import { CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react'

export interface GirmBadgeProps {
  status: 'verified' | 'pending' | 'failed' | 'anchored'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const GirmBadge: React.FC<GirmBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  className 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const statusConfig = {
    verified: {
      bg: 'bg-mythic-secondary-100 dark:bg-mythic-secondary-900/20',
      text: 'text-mythic-secondary-700 dark:text-mythic-secondary-400',
      border: 'border-mythic-secondary-200 dark:border-mythic-secondary-800',
      icon: CheckCircle,
      label: 'GIRM Verified'
    },
    pending: {
      bg: 'bg-mythic-accent-100 dark:bg-mythic-accent-900/20',
      text: 'text-mythic-accent-700 dark:text-mythic-accent-400',
      border: 'border-mythic-accent-200 dark:border-mythic-accent-800',
      icon: Clock,
      label: 'GIRM Pending'
    },
    failed: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      icon: AlertCircle,
      label: 'GIRM Failed'
    },
    anchored: {
      bg: 'bg-mythic-primary-100 dark:bg-mythic-primary-900/20',
      text: 'text-mythic-primary-700 dark:text-mythic-primary-400',
      border: 'border-mythic-primary-200 dark:border-mythic-primary-800',
      icon: Shield,
      label: 'GIRM Anchored'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        sizeClasses[size],
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  )
}

export { GirmBadge }
