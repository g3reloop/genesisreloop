'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function AnimatedParticles() {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    initialOpacity: number
    duration: number
    targetY: number
    targetOpacity: number
  }>>([])

  useEffect(() => {
    setMounted(true)
    
    // Generate particles after mount to avoid hydration issues
    const newParticles = [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      initialOpacity: Math.random(),
      duration: Math.random() * 10 + 10,
      targetY: Math.random() * window.innerHeight,
      targetOpacity: Math.random()
    }))
    
    setParticles(newParticles)
  }, [])

  if (!mounted) {
    return null // Don't render on server
  }

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute h-px w-px bg-emerald-400"
          initial={{ 
            x: particle.x,
            y: particle.y,
            opacity: particle.initialOpacity
          }}
          animate={{
            y: [particle.y, particle.targetY],
            opacity: [particle.initialOpacity, particle.targetOpacity, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}
