'use client'

import React from 'react'
import { ThemeCtx } from './GenesisThemeProvider'
/**
 * Quintuple layered wrapper applying the five Genesis layers subtly.
 * Use minimal z-index so content remains accessible and visible.
 */
export function QuintupleLayer({children}:{children:React.ReactNode}){
  const { reduceMotion } = React.useContext(ThemeCtx)
  return (
    <div className="relative">
      {/* FRACTAL BACKDROP */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-fractal-gradient" />
      {/* RECURSION TOROIDAL HINT */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 g3-scroll" style={{animation: reduceMotion? undefined : 'loopRotate 120s linear infinite'}} />
      {/* MYTHIC GLYPH WATERMARK */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="rounded-full border border-mythic-accent/20 p-24 animate-glyph-pulse" />
      </div>
      {/* TECH SCHEMATIC ANNOTATION LAYER (disabled by default, use on hover in components) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" />
      {/* EARTHLY CONTENT LAYER */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
