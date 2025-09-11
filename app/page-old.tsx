'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Network, 
  Shield, 
  RefreshCw, 
  TrendingUp,
  CircleDollarSign,
  CheckCircle,
  Route,
  Package,
  Microscope,
  Truck,
  Users,
  Building2,
  Beaker,
  ShoppingCart,
  MapPin
} from 'lucide-react'
import { AnimatedParticles } from '@/components/animated-particles'
import { GenesisLogoWatermark } from '@/components/ui/genesis-logo'
import { cn } from '@/lib/cn'
import { brandConfig, pageContent } from '@/config/brand.config'

const iconMap = {
  'route': Route,
  'shield': Shield,
  'contract': CircleDollarSign,
  'metric': TrendingUp
}

export default function HomePage() {
  const { home } = pageContent
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Show content immediately on server render, animate on client
  const animationProps = mounted ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  } : {
    initial: false,
    animate: { opacity: 1, y: 0 }
  }
  
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-mythic-primary-500/10 via-black to-mythic-accent-300/10" />
          <AnimatedParticles />
          {/* Logo Watermark */}
          <GenesisLogoWatermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96" />
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            {...animationProps}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Pretitle */}
            <p className="text-mythic-accent-300 text-sm font-semibold tracking-wider uppercase mb-4">
              {home.hero.pretitle}
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                {home.hero.title}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-mythic-text-muted mb-12 max-w-3xl mx-auto">
              {home.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={home.hero.primaryCta.href}
                className="group px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {home.hero.primaryCta.label}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={home.hero.secondaryCta.href}
                className="px-8 py-4 bg-mythic-dark-900/80 backdrop-blur text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800/80 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {home.hero.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {home.valueProps.map((prop, index) => {
              const Icon = iconMap[prop.icon as keyof typeof iconMap] || Shield
              return (
                <motion.div
                  key={prop.title}
                  initial={mounted ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mounted ? 0.1 * index : 0 }}
                  className="glass rounded-xl p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all"
                >
                  <Icon className="h-10 w-10 text-mythic-primary-500 mb-4" />
                  <h3 className="text-lg font-semibold text-mythic-text-primary mb-2">{prop.title}</h3>
                  <p className="text-sm text-mythic-text-muted">{prop.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-8">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                {home.proof.title}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {home.proof.bullets.map((bullet, index) => (
                <motion.div
                  key={index}
                  initial={mounted ? { opacity: 0, x: -20 } : false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: mounted ? 0.1 * index : 0 }}
                  className="flex items-start gap-3 text-left"
                >
                  <CheckCircle className="h-5 w-5 text-mythic-accent-300 mt-0.5 flex-shrink-0" />
                  <span className="text-mythic-text-muted">{bullet}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Segments Section */}
      <section className="py-24 relative bg-mythic-dark-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Built for every node in the loop
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {home.segments.map((segment, index) => {
              const icons = {
                'For Suppliers': Package,
                'For Labs & Operators': Beaker,
                'For Buyers': ShoppingCart,
                'For Municipalities': Building2
              }
              const Icon = icons[segment.title as keyof typeof icons] || Users
              
              return (
                <motion.div
                  key={segment.title}
                  initial={mounted ? { opacity: 0, y: 20 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: mounted ? 0.1 * index : 0 }}
                  className="glass rounded-xl p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all flex flex-col"
                >
                  <Icon className="h-12 w-12 text-mythic-primary-500 mb-4" />
                  <h3 className="text-xl font-semibold text-mythic-text-primary mb-3">{segment.title}</h3>
                  <p className="text-mythic-text-muted mb-6 flex-grow">{segment.body}</p>
                  <Link
                    href={segment.cta.href}
                    className="inline-flex items-center gap-2 text-mythic-primary-500 hover:text-mythic-accent-300 transition-colors font-medium"
                  >
                    {segment.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-12 text-mythic-text-primary">
              {home.socialProof.kpiHeadline}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {home.socialProof.kpis.map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={mounted ? { opacity: 0, scale: 0.9 } : false}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: mounted ? 0.1 * index : 0 }}
                  className="glass rounded-lg p-6 text-center"
                >
                  <div className="text-3xl font-bold text-mythic-accent-300 mb-2">{kpi.value}</div>
                  <div className="text-sm text-mythic-text-muted">{kpi.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-mythic-text-muted mt-8">{home.socialProof.note}</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center glass rounded-2xl p-12 border border-mythic-primary-500/20"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                {brandConfig.footer.cta.headline}
              </span>
            </h2>
            <p className="text-lg text-mythic-text-muted mb-8">
              {brandConfig.footer.cta.subcopy}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {brandConfig.footer.cta.buttons.map((button) => (
                <Link
                  key={button.label}
                  href={button.href}
                  className="px-6 py-3 bg-mythic-primary-500/10 text-mythic-primary-500 font-medium rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-primary-500/20 transition-all duration-200"
                >
                  {button.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
