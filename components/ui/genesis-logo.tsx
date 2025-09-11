import { cn } from '@/lib/cn'

interface GenesisLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function GenesisLogo({ className, size = 'md' }: GenesisLogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
    >
      {/* Four interlocking circles in the new design */}
      <g>
        {/* Top circle */}
        <circle
          cx="100"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          className="text-mythic-primary-500"
          fill="none"
        />
        
        {/* Right circle */}
        <circle
          cx="150"
          cy="100"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          className="text-mythic-primary-500"
          fill="none"
        />
        
        {/* Bottom circle */}
        <circle
          cx="100"
          cy="150"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          className="text-mythic-primary-500"
          fill="none"
        />
        
        {/* Left circle */}
        <circle
          cx="50"
          cy="100"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          className="text-mythic-primary-500"
          fill="none"
        />
        
        {/* Center circle */}
        <circle
          cx="100"
          cy="100"
          r="12"
          stroke="currentColor"
          strokeWidth="8"
          className="text-mythic-primary-500"
          fill="none"
        />
      </g>
    </svg>
  )
}

// Watermark version with lower opacity
export function GenesisLogoWatermark({ className }: { className?: string }) {
  return (
    <div className={cn("absolute opacity-5 pointer-events-none", className)}>
      <GenesisLogo size="xl" />
    </div>
  )
}
