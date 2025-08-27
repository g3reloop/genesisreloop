import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  glow?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', glow = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-ring disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-mythic-dark-900 text-white hover:bg-mythic-dark-800 shadow-sm': variant === 'default',
            'bg-mythic-primary-500 text-white hover:bg-mythic-primary-600 shadow-sm': variant === 'primary',
            'bg-mythic-secondary-500 text-white hover:bg-mythic-secondary-600 shadow-sm': variant === 'secondary',
            'bg-mythic-accent-500 text-mythic-dark-900 hover:bg-mythic-accent-600 shadow-sm': variant === 'accent',
            'hover:bg-mythic-dark-100 hover:text-mythic-dark-900 dark:hover:bg-mythic-dark-800 dark:hover:text-mythic-dark-50': variant === 'ghost',
            'text-mythic-primary-500 underline-offset-4 hover:underline': variant === 'link',
            'bg-red-500 text-white hover:bg-red-600 shadow-sm': variant === 'destructive',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          glow && 'glow-effect',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
