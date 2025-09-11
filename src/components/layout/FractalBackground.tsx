"use client"
import React, { useEffect, useRef } from 'react'

export default function FractalBackground({ children }:{children:React.ReactNode}){
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    const c = canvasRef.current; if(!c) return
    const ctx = c.getContext('2d'); if(!ctx) return
    let raf:number; let t=0
    const dpr = Math.max(1, window.devicePixelRatio||1)
    const resize=()=>{ c.width = innerWidth*dpr; c.height = innerHeight*dpr; c.style.width = '100%'; c.style.height='100%'; ctx.scale(dpr,dpr) }
    resize(); addEventListener('resize', resize)
    const draw=()=>{
      t+=0.002
      ctx.clearRect(0,0,innerWidth,innerHeight)
      // Earthly gradient base
      const g = ctx.createLinearGradient(0,0,innerWidth,innerHeight)
      g.addColorStop(0,'#0b0f14'); g.addColorStop(1,'#101828');
      ctx.fillStyle = g; ctx.fillRect(0,0,innerWidth,innerHeight)
      // Recursive torus rings
      ctx.globalAlpha = 0.12
      for(let i=0;i<11;i++){
        const r = 60 + i*48
        ctx.beginPath();
        ctx.arc(innerWidth*0.72, innerHeight*0.28, r + Math.sin(t+i)*6, 0, Math.PI*2)
        ctx.strokeStyle = i%2? '#28F2E4' : '#00D084'
        ctx.lineWidth = 1
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return ()=>{ cancelAnimationFrame(raf); removeEventListener('resize', resize) }
  },[])
  return (
    <div className='relative min-h-screen'>
      <canvas ref={canvasRef} className='absolute inset-0 -z-10 fractal-grid' aria-hidden />
      <div className='relative z-10'>{children}</div>
    </div>
  )
}
