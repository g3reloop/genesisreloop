'use client'

import { motion } from 'framer-motion'
import { Factory, Droplet, MapPin, Gauge, Timer, Shield, ArrowRight, Filter } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type ProcessorType = 'biogas' | 'biodiesel' | 'all'

interface Processor {
  id: string
  name: string
  type: 'biogas' | 'biodiesel'
  capacity: string
  location: string
  distance: number
  uptime: number
  certifications: string[]
  leadTime: string
  status: 'operational' | 'commissioning' | 'available'
  features: string[]
}

export default function ProcessorDirectory() {
  const [filterType, setFilterType] = useState<ProcessorType>('all')
  const [maxDistance, setMaxDistance] = useState<number>(200)
  const [minCapacity, setMinCapacity] = useState<string>('')

  const processors: Processor[] = [
    {
      id: 'BIO-BRI-001',
      name: 'Brighton Community AD',
      type: 'biogas',
      capacity: '3 tpd',
      location: 'Brighton, UK',
      distance: 0,
      uptime: 98.5,
      certifications: ['ISO 14001', 'PAS 110'],
      leadTime: 'Operational',
      status: 'operational',
      features: ['CHP ready', 'Heat cascade', 'Remote monitoring']
    },
    {
      id: 'BIO-MAN-002',
      name: 'Manchester Loop Hub',
      type: 'biogas',
      capacity: '5 tpd',
      location: 'Manchester, UK',
      distance: 245,
      uptime: 99.2,
      certifications: ['ISO 14001', 'AD Quality Protocol'],
      leadTime: 'Operational',
      status: 'operational',
      features: ['Grid injection ready', '3-stage heat recovery', 'Auto-feed system']
    },
    {
      id: 'BIO-NEW-003',
      name: 'Newcastle Modular AD',
      type: 'biogas',
      capacity: '2 tpd',
      location: 'Newcastle, UK',
      distance: 312,
      uptime: 0,
      certifications: ['ISO 14001 (pending)'],
      leadTime: '8 weeks',
      status: 'available',
      features: ['Compact 40ft design', 'Plug & play', 'Training included']
    },
    {
      id: 'BD-BRI-001',
      name: 'Bristol Biodiesel Co-op',
      type: 'biodiesel',
      capacity: '1,000 L/day',
      location: 'Bristol, UK',
      distance: 78,
      uptime: 96.8,
      certifications: ['EN 14214', 'ISCC'],
      leadTime: 'Operational',
      status: 'operational',
      features: ['Automated process', 'Multi-feedstock', 'Lab on-site']
    },
    {
      id: 'BD-LEE-002',
      name: 'Leeds UCO Processing',
      type: 'biodiesel',
      capacity: '2,000 L/day',
      location: 'Leeds, UK',
      distance: 198,
      uptime: 97.5,
      certifications: ['EN 14214', 'ISO 9001'],
      leadTime: 'Operational',
      status: 'operational',
      features: ['High FFA tolerance', 'Glycerol refining', 'Fleet integration']
    },
    {
      id: 'BD-CAR-003',
      name: 'Cardiff Bay Biodiesel',
      type: 'biodiesel',
      capacity: '500 L/day',
      location: 'Cardiff, UK',
      distance: 156,
      uptime: 0,
      certifications: ['EN 14214 (pending)'],
      leadTime: '6 weeks',
      status: 'commissioning',
      features: ['20ft container', 'PLC control', 'Remote support']
    }
  ]

  const filteredProcessors = processors.filter(processor => {
    if (filterType !== 'all' && processor.type !== filterType) return false
    if (processor.distance > maxDistance) return false
    if (minCapacity) {
      const capacity = parseInt(processor.capacity)
      const minCap = parseInt(minCapacity)
      if (capacity < minCap) return false
    }
    return true
  })

  const getStatusColor = (status: Processor['status']) => {
    switch (status) {
      case 'operational': return 'text-green-400 bg-green-400/20'
      case 'commissioning': return 'text-yellow-400 bg-yellow-400/20'
      case 'available': return 'text-blue-400 bg-blue-400/20'
    }
  }

  const getStatusText = (status: Processor['status']) => {
    switch (status) {
      case 'operational': return 'Live & Processing'
      case 'commissioning': return 'Coming Online'
      case 'available': return 'Available to Deploy'
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Modular Processors Only
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Choose containerized units that fit your catchment tonnage. 
            We prioritise on-site use: CHP for electricity + heat; biodiesel for fleets.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-xl p-6 border border-mythic-primary-500/20 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-mythic-primary-500" />
            <h3 className="font-semibold text-mythic-text-primary">Filter Processors</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm text-mythic-text-muted mb-2">Type</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as ProcessorType)}
                className="w-full px-3 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="biogas">Biogas AD Container</option>
                <option value="biodiesel">Biodiesel Modular</option>
              </select>
            </div>

            {/* Distance Filter */}
            <div>
              <label className="block text-sm text-mythic-text-muted mb-2">
                Max Distance: {maxDistance}km
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Capacity Filter */}
            <div>
              <label className="block text-sm text-mythic-text-muted mb-2">
                Min Capacity
              </label>
              <input
                type="text"
                placeholder={filterType === 'biodiesel' ? 'L/day' : 'tpd'}
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary placeholder-mythic-text-muted focus:border-mythic-primary-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-mythic-text-muted mb-2">Status</label>
              <select className="w-full px-3 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none">
                <option>All Status</option>
                <option>Operational Only</option>
                <option>Available to Deploy</option>
                <option>Coming Soon</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Processors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProcessors.map((processor, index) => (
            <motion.div
              key={processor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glass rounded-xl p-6 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {processor.type === 'biogas' ? (
                    <Factory className="h-8 w-8 text-mythic-primary-500" />
                  ) : (
                    <Droplet className="h-8 w-8 text-mythic-accent-300" />
                  )}
                  <div>
                    <h3 className="font-semibold text-mythic-text-primary">{processor.name}</h3>
                    <p className="text-xs text-mythic-text-muted font-mono">{processor.id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getStatusColor(processor.status)}`}>
                  {getStatusText(processor.status)}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mythic-text-muted flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    Capacity
                  </span>
                  <span className="text-mythic-text-primary font-semibold">{processor.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-mythic-text-muted flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </span>
                  <span className="text-mythic-text-primary">{processor.location}</span>
                </div>
                {processor.status === 'operational' ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mythic-text-muted flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Uptime
                    </span>
                    <span className="text-green-400 font-semibold">{processor.uptime}%</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mythic-text-muted flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      Lead Time
                    </span>
                    <span className="text-mythic-accent-300">{processor.leadTime}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-xs text-mythic-text-muted mb-2">Features</p>
                <div className="flex flex-wrap gap-1">
                  {processor.features.map((feature) => (
                    <span key={feature} className="text-xs px-2 py-1 bg-mythic-primary-500/10 text-mythic-primary-500 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-4">
                <p className="text-xs text-mythic-text-muted mb-1">Certifications</p>
                <p className="text-xs text-mythic-text-primary">{processor.certifications.join(', ')}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                {processor.status === 'operational' ? (
                  <>
                    <button className="px-3 py-2 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all font-semibold text-sm">
                      Check Capacity
                    </button>
                    <button className="px-3 py-2 text-mythic-text-muted hover:text-mythic-text-primary transition-colors text-sm">
                      View Details
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/rfq"
                      className="px-3 py-2 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all font-semibold text-sm text-center"
                    >
                      Request RFQ
                    </Link>
                    <button className="px-3 py-2 text-mythic-text-muted hover:text-mythic-text-primary transition-colors text-sm">
                      Learn More
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="glass rounded-lg p-4 border border-mythic-primary-500/10 text-center">
            <div className="text-3xl font-bold text-mythic-primary-500">23</div>
            <div className="text-sm text-mythic-text-muted">Live Processors</div>
          </div>
          <div className="glass rounded-lg p-4 border border-mythic-accent-300/10 text-center">
            <div className="text-3xl font-bold text-mythic-accent-300">142 tpd</div>
            <div className="text-sm text-mythic-text-muted">Total Capacity</div>
          </div>
          <div className="glass rounded-lg p-4 border border-flow-credits/10 text-center">
            <div className="text-3xl font-bold text-flow-credits">98.2%</div>
            <div className="text-sm text-mythic-text-muted">Avg Uptime</div>
          </div>
          <div className="glass rounded-lg p-4 border border-mythic-primary-500/10 text-center">
            <div className="text-3xl font-bold text-mythic-primary-500">8-12w</div>
            <div className="text-sm text-mythic-text-muted">Deploy Time</div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass rounded-xl p-8 border border-mythic-primary-500/20 mb-12"
        >
          <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">Why Modular?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-mythic-primary-500 mb-2">Lower CAPEX</h3>
              <p className="text-sm text-mythic-text-muted">
                40% cheaper than fixed plants. Standard container designs enable 
                volume manufacturing and competitive pricing. Start small, scale smart.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-mythic-accent-300 mb-2">Rapid Deployment</h3>
              <p className="text-sm text-mythic-text-muted">
                8-12 week lead times vs 18+ months for traditional plants. 
                Minimal site prep. Plug into existing utilities and start processing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-flow-credits mb-2">Flexible & Moveable</h3>
              <p className="text-sm text-mythic-text-muted">
                Feedstock patterns change? Move your processor. Community grows? 
                Add modules. No stranded assets, just adaptable infrastructure.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-mythic-text-primary mb-6">
            Ready to deploy modular processing?
          </h3>
          <p className="text-mythic-text-muted mb-8 max-w-2xl mx-auto">
            Our pre-vetted suppliers offer standardized modules with transparent pricing. 
            Get quotes in days, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rfq"
              className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Request RFQ
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/heat-cascade"
              className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
            >
              Plan Heat Recovery
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
