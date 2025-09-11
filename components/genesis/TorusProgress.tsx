import React from 'react'
import { cn } from '@/lib/cn'

type Props = { value: number; size?: number; thickness?: number; label?: string; className?: string }
export function TorusProgress({ value, size=72, thickness=8, label, className }: Props){
  const p = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <div className='gen-torus-progress' style={{ '--p': p+'%' } as React.CSSProperties}></div>
      <div className='absolute inset-0 m-[4px] rounded-full gen-blueprint' style={{ boxShadow: 'inset 0 0 0 1px rgba(233,244,255,.08)' }} />
      <div className='absolute inset-0 flex items-center justify-center text-[12px] text-txt-snow'>{label ?? p+'%'}</div>
    </div>
  )
}
