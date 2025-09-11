import React from 'react'
import { GlyphWatermark } from '@/components/genesis/GlyphWatermark'

const AnimatedBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative min-h-screen gen-earth-surface'>
      <div className='absolute inset-0 -z-10 gen-fractal-lattice anim-parallax' />
      <div className='absolute inset-0 -z-10 gen-blueprint' />
      <div className='absolute inset-0 -z-10 gen-noise' />
      <GlyphWatermark />
      <div className='relative z-10'>{children}</div>
    </div>
  )
}
export default AnimatedBackground
