import * as React from 'react'
import { Button } from './Button'
export function Modal({open,onClose,title,children}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode}){
  if(!open) return null
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
      <div className="relative w-[90vw] max-w-xl rounded-2xl border border-white/10 bg-mythic-secondary/90 backdrop-blur-xl p-6">
        <div className="text-lg font-semibold mb-3">{title}</div>
        <div className="prose prose-invert text-sm mb-6">{children}</div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
        {/* scroll unfurl accent */}
        <div aria-hidden className="pointer-events-none absolute -top-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-mythic-primary/40" />
      </div>
    </div>
  )
}
