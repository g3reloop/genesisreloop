'use client'
import React, { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function GenesisProvider({ children }:{ children: React.ReactNode }){
  const reduced = useReducedMotion()
  useEffect(()=>{
    // Optional: could inject dynamic noise here; we keep static CSS var
    document.documentElement.style.setProperty('--dur-parallax', reduced ? '0s' : '30s')
  },[reduced])
  return <>{children}</>
}
