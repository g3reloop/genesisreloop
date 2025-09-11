import React from 'react'

type Props = { glyph?: React.ReactNode; size?: number; className?: string }
export function GlyphWatermark({ glyph, size=420, className='' }: Props){
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}>
      <div className='gen-glyph-watermark' style={{ width: size, height: size }}>
        {glyph ?? (
          <svg viewBox='0 0 100 100' width={size} height={size}>
            <g fill='none' stroke='url(#g)' strokeWidth='1'>
              <defs>
                <radialGradient id='g'>
                  <stop offset='0%' stopColor='var(--acc-emerald)' stopOpacity='.8'/>
                  <stop offset='100%' stopColor='var(--acc-cyan)' stopOpacity='.2'/>
                </radialGradient>
              </defs>
              <circle cx='50' cy='50' r='40'/>
              <circle cx='50' cy='50' r='28'/>
              <circle cx='50' cy='50' r='16'/>
              <path d='M50 10 Q70 50 50 90 Q30 50 50 10Z' />
            </g>
          </svg>
        )}
      </div>
    </div>
  )
}
