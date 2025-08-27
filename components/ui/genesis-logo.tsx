import { cn } from '@/lib/utils/cn'

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
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
    >
      {/* Triple interlocking circles representing the circular economy */}
      <g opacity="0.9">
        {/* First circle - Food Waste Loop */}
        <circle
          cx="35"
          cy="40"
          r="25"
          stroke="currentColor"
          strokeWidth="3"
          className="text-mythic-primary-500"
          fill="none"
        />
        
        {/* Second circle - UCO Loop */}
        <circle
          cx="65"
          cy="40"
          r="25"
          stroke="currentColor"
          strokeWidth="3"
          className="text-mythic-accent-300"
          fill="none"
        />
        
        {/* Third circle - Community/DAO */}
        <circle
          cx="50"
          cy="65"
          r="25"
          stroke="currentColor"
          strokeWidth="3"
          className="text-flow-credits"
          fill="none"
        />
        
        {/* Center intersection point */}
        <circle
          cx="50"
          cy="48"
          r="4"
          className="text-mythic-text-primary"
          fill="currentColor"
        />
      </g>
      
      {/* Optional: Add subtle glow effect */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
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
