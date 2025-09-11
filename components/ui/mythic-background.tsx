import { cn } from '@/lib/cn'

interface MythicBackgroundProps {
  className?: string
  variant?: 'spiral' | 'concentric' | 'tessellation' | 'flow'
  opacity?: number
}

export function MythicBackground({ 
  className, 
  variant = 'concentric',
  opacity = 0.05 
}: MythicBackgroundProps) {
  const variants = {
    spiral: (
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-mythic-primary-500" stopColor="currentColor" stopOpacity="0.1"/>
            <stop offset="50%" className="text-mythic-accent-300" stopColor="currentColor" stopOpacity="0.05"/>
            <stop offset="100%" className="text-flow-reputation" stopColor="currentColor" stopOpacity="0.1"/>
          </linearGradient>
          <pattern id="spiralPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path 
              d="M100 20 C 140 40, 160 80, 140 120 C 120 160, 80 180, 40 160 C 0 140, -20 100, 0 60 C 20 20, 60 0, 100 20"
              fill="none" 
              stroke="url(#spiralGrad)" 
              strokeWidth="1"
              opacity="0.3"
            />
            <path 
              d="M100 50 C 120 60, 130 80, 120 100 C 110 120, 90 130, 70 120 C 50 110, 40 90, 50 70 C 60 50, 80 40, 100 50"
              fill="none" 
              stroke="url(#spiralGrad)" 
              strokeWidth="0.5"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#spiralPattern)" />
      </svg>
    ),
    concentric: (
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="concentricGrad">
            <stop offset="0%" className="text-mythic-primary-500" stopColor="currentColor" stopOpacity="0.05"/>
            <stop offset="50%" className="text-mythic-accent-300" stopColor="currentColor" stopOpacity="0.03"/>
            <stop offset="100%" className="text-mythic-dark-800" stopColor="currentColor" stopOpacity="0.05"/>
          </radialGradient>
          <pattern id="concentricPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#concentricGrad)" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#concentricGrad)" strokeWidth="0.5" opacity="0.25"/>
            <circle cx="50" cy="50" r="25" fill="none" stroke="url(#concentricGrad)" strokeWidth="0.5" opacity="0.2"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="url(#concentricGrad)" strokeWidth="0.5" opacity="0.15"/>
            <circle cx="50" cy="50" r="5" fill="url(#concentricGrad)" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#concentricPattern)" />
      </svg>
    ),
    tessellation: (
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="tessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-mythic-emerald-500" stopColor="currentColor" stopOpacity="0.08"/>
            <stop offset="33%" className="text-mythic-teal-500" stopColor="currentColor" stopOpacity="0.05"/>
            <stop offset="66%" className="text-mythic-dark-700" stopColor="currentColor" stopOpacity="0.08"/>
            <stop offset="100%" className="text-flow-credits" stopColor="currentColor" stopOpacity="0.05"/>
          </linearGradient>
          <pattern id="tessPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,0 60,26 30,52 0,26" fill="none" stroke="url(#tessGrad)" strokeWidth="0.5" opacity="0.4"/>
            <polygon points="30,10 50,26 30,42 10,26" fill="none" stroke="url(#tessGrad)" strokeWidth="0.3" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tessPattern)" />
      </svg>
    ),
    flow: (
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-mythic-primary-500" stopColor="currentColor" stopOpacity="0.1">
              <animate attributeName="stopOpacity" values="0.1;0.05;0.1" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" className="text-mythic-accent-300" stopColor="currentColor" stopOpacity="0.05">
              <animate attributeName="stopOpacity" values="0.05;0.1;0.05" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" className="text-flow-reputation" stopColor="currentColor" stopOpacity="0.1">
              <animate attributeName="stopOpacity" values="0.1;0.05;0.1" dur="8s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          <pattern id="flowPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path 
              d="M0,100 Q50,50 100,100 T200,100" 
              fill="none" 
              stroke="url(#flowGrad)" 
              strokeWidth="1"
              opacity="0.3"
            >
              <animate attributeName="d" 
                values="M0,100 Q50,50 100,100 T200,100;M0,100 Q50,150 100,100 T200,100;M0,100 Q50,50 100,100 T200,100" 
                dur="10s" 
                repeatCount="indefinite" 
              />
            </path>
            <path 
              d="M0,150 Q50,100 100,150 T200,150" 
              fill="none" 
              stroke="url(#flowGrad)" 
              strokeWidth="0.5"
              opacity="0.2"
            >
              <animate attributeName="d" 
                values="M0,150 Q50,100 100,150 T200,150;M0,150 Q50,200 100,150 T200,150;M0,150 Q50,100 100,150 T200,150" 
                dur="12s" 
                repeatCount="indefinite" 
              />
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#flowPattern)" />
      </svg>
    )
  }

  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
      style={{ opacity }}
    >
      {variants[variant]}
      {/* WCAG overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-mythic-dark-900/85 to-black/80" />
    </div>
  )
}

// Animated version with multiple layers - DISABLED per requirements
export function MythicBackgroundAnimated({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 bg-black", className)}>
      {/* Static background only - no animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-mythic-primary-500/5 via-black to-mythic-accent-300/5" />
    </div>
  )
}
