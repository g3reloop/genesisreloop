import { useEffect, useState } from 'react'
export function useReducedMotion(){
  const [reduced, set] = useState(false)
  useEffect(()=>{
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => set(m.matches)
    on(); m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  },[])
  return reduced
}
