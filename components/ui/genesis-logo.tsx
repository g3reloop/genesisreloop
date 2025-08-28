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
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
    >
      {/* Four connected concentric circles representing the Genesis loops */}
      <g opacity="0.9">
        {/* Top circle - Food Waste/Biogas */}
        <circle
          cx="60"
          cy="35"
          r="22"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-mythic-primary-500"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Right circle - UCO/Biodiesel */}
        <circle
          cx="85"
          cy="60"
          r="22"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-mythic-accent-300"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Bottom circle - Community/DAO */}
        <circle
          cx="60"
          cy="85"
          r="22"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-flow-credits"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Left circle - Technology/Agents */}
        <circle
          cx="35"
          cy="60"
          r="22"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-flow-reputation"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Connecting lines between circles */}
        <g opacity="0.4">
          <line x1="60" y1="57" x2="60" y2="63" stroke="currentColor" strokeWidth="2" className="text-mythic-text-muted"/>
          <line x1="63" y1="60" x2="57" y2="60" stroke="currentColor" strokeWidth="2" className="text-mythic-text-muted"/>
          <line x1="44" y1="44" x2="50" y2="50" stroke="currentColor" strokeWidth="2" className="text-mythic-text-muted"/>
          <line x1="76" y1="44" x2="70" y2="50" stroke="currentColor" strokeWidth="2" className="text-mythic-text-muted"/>
          <line x1="76" y1="76" x2="70" y2="70" stroke="currentColor" strokeWidth="2" className="text-mythic-text-muted"/>
          <line x1="44" y1="76" x2="50" y2="70" stroke="currentColor" strokeWidth="2" className="text-mythic-text-muted"/>
        </g>
        
        {/* Center Genesis point */}
        <circle
          cx="60"
          cy="60"
          r="8"
          className="text-mythic-primary-500"
          fill="currentColor"
          opacity="0.8"
        />
        <circle
          cx="60"
          cy="60"
          r="4"
          className="text-mythic-text-primary"
          fill="currentColor"
        />
      </g>
      
      {/* Enhanced glow effect */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feFlood floodColor="currentColor" floodOpacity="0.3" result="color"/>
          <feComposite in="color" in2="coloredBlur" operator="in" result="coloredBlur"/>
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
