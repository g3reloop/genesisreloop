'use client'

import React from 'react'
export type QuintupleLayer = 'earthly'|'recursion'|'fractal'|'mythic'|'tech'
export const ThemeCtx = React.createContext({ reduceMotion:false })
export default function GenesisThemeProvider({children}:{children:React.ReactNode}){
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return <ThemeCtx.Provider value={{reduceMotion}}>{children}</ThemeCtx.Provider>
}
