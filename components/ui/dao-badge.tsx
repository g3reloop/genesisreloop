import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Vote, Shield, UserCheck } from 'lucide-react'

export interface DaoBadgeProps {
  status: 'signed' | 'voting' | 'member'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const DaoBadge: React.FC<DaoBadgeProps> = ({ 
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
    signed: {
      bg: 'bg-mythic-dao-signed/10',
      text: 'text-mythic-dao-signed',
      border: 'border-mythic-dao-signed/30',
      icon: Shield,
      label: 'DAO-signed'
    },
    voting: {
      bg: 'bg-mythic-primary-100 dark:bg-mythic-primary-900/20',
      text: 'text-mythic-primary-700 dark:text-mythic-primary-400',
      border: 'border-mythic-primary-200 dark:border-mythic-primary-800',
      icon: Vote,
      label: 'DAO Voting'
    },
    member: {
      bg: 'bg-mythic-secondary-100 dark:bg-mythic-secondary-900/20',
      text: 'text-mythic-secondary-700 dark:text-mythic-secondary-400',
      border: 'border-mythic-secondary-200 dark:border-mythic-secondary-800',
      icon: UserCheck,
      label: 'DAO Member'
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

export { DaoBadge }
