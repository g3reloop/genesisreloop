'use client'

import { motion } from 'framer-motion'
import { Thermometer, ArrowDown, Activity, Gauge, Settings, Info, CheckCircle } from 'lucide-react'
import { useState } from 'react'

type HeatStage = 'exhaust' | 'jacket' | 'plate'
type LoadType = 'greenhouse' | 'drying' | 'hvac' | 'process' | 'hot_water'

interface HeatLoad {
  id: string
  type: LoadType
  name: string
  tempRequired: number
  kWth: number
  stage?: HeatStage
}

export default function HeatCascadePlanner() {
  const [chpPower, setChpPower] = useState(100) // kWe
  const [loads, setLoads] = useState<HeatLoad[]>([
    { id: '1', type: 'greenhouse', name: 'Main Greenhouse', tempRequired: 65, kWth: 45 },
    { id: '2', type: 'drying', name: 'Digestate Drying', tempRequired: 85, kWth: 30 },
    { id: '3', type: 'hvac', name: 'Office Heating', tempRequired: 45, kWth: 20 },
  ])

  // Calculate available heat based on CHP size
  const availableHeat = {
    exhaust: chpPower * 0.45, // 45% of electric in exhaust heat
    jacket: chpPower * 0.25,  // 25% in jacket water
    plate: chpPower * 0.15,   // 15% in low-grade heat
  }

  const totalHeat = availableHeat.exhaust + availableHeat.jacket + availableHeat.plate
  const electricEfficiency = 0.42
  const totalEfficiency = electricEfficiency + (totalHeat / chpPower)

  // Auto-assign loads to appropriate heat stages
  const assignedLoads = loads.map(load => {
    let stage: HeatStage = 'plate'
    if (load.tempRequired >= 80) stage = 'exhaust'
    else if (load.tempRequired >= 60) stage = 'jacket'
    return { ...load, stage }
  })

  const heatUsage = {
    exhaust: assignedLoads.filter(l => l.stage === 'exhaust').reduce((sum, l) => sum + l.kWth, 0),
    jacket: assignedLoads.filter(l => l.stage === 'jacket').reduce((sum, l) => sum + l.kWth, 0),
    plate: assignedLoads.filter(l => l.stage === 'plate').reduce((sum, l) => sum + l.kWth, 0),
  }

  const totalHeatUsed = heatUsage.exhaust + heatUsage.jacket + heatUsage.plate
  const overallEfficiency = electricEfficiency + (totalHeatUsed / chpPower)

  const loadTemplates: Partial<HeatLoad>[] = [
    { type: 'greenhouse', name: 'Vertical Farm', tempRequired: 70, kWth: 50 },
    { type: 'drying', name: 'Grain Drying', tempRequired: 90, kWth: 40 },
    { type: 'hvac', name: 'District Heating', tempRequired: 50, kWth: 35 },
    { type: 'process', name: 'Industrial Process', tempRequired: 120, kWth: 60 },
    { type: 'hot_water', name: 'Hot Water System', tempRequired: 55, kWth: 25 },
  ]

  const addLoad = (template: Partial<HeatLoad>) => {
    const newLoad: HeatLoad = {
      id: Date.now().toString(),
      type: template.type!,
      name: template.name!,
      tempRequired: template.tempRequired!,
      kWth: template.kWth!,
    }
    setLoads([...loads, newLoad])
  }

  const removeLoad = (id: string) => {
    setLoads(loads.filter(l => l.id !== id))
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
              Heat Cascade Planner
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Use exhaust HX (high-temp), jacket HX (mid-temp), and plate HX (low-grade) 
            to reach ~80–85% total utilization. No wasted heat.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* CHP Size */}
            <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
              <h3 className="text-lg font-semibold text-mythic-text-primary mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-mythic-primary-500" />
                CHP Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-mythic-text-muted mb-2">
                    Electric Power Output (kWe)
                  </label>
                  <input
                    type="number"
                    value={chpPower}
                    onChange={(e) => setChpPower(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-mythic-dark-900 border border-mythic-primary-500/20 rounded-lg text-mythic-text-primary focus:border-mythic-primary-500 focus:outline-none"
                  />
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-mythic-text-muted">Electric efficiency:</span>
                    <span className="text-mythic-primary-500">{(electricEfficiency * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mythic-text-muted">Available heat:</span>
                    <span className="text-mythic-accent-300">{totalHeat.toFixed(0)} kWth</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Loads */}
            <div className="glass rounded-xl p-6 border border-mythic-accent-300/20">
              <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">
                Add Heat Loads
              </h3>
              <div className="space-y-2">
                {loadTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => addLoad(template)}
                    className="w-full p-3 bg-mythic-dark-900 rounded-lg border border-mythic-accent-300/10 hover:border-mythic-accent-300/30 transition-all text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-semibold text-mythic-text-primary">{template.name}</div>
                        <div className="text-xs text-mythic-text-muted">
                          {template.tempRequired}°C • {template.kWth} kWth
                        </div>
                      </div>
                      <span className="text-mythic-accent-300">+</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center - Cascade Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-mythic-text-primary">Heat Cascade Flow</h2>
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-mythic-accent-300" />
                  <span className="text-lg font-semibold text-mythic-accent-300">
                    {(overallEfficiency * 100).toFixed(1)}% Total Efficiency
                  </span>
                </div>
              </div>

              {/* Cascade Stages */}
              <div className="space-y-6">
                {/* Exhaust HX */}
                <div className="relative">
                  <div className="glass rounded-lg p-6 border border-red-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                          <Thermometer className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-mythic-text-primary">Exhaust HX</h3>
                          <p className="text-sm text-mythic-text-muted">350-450°C → 80-120°C</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-500">{availableHeat.exhaust.toFixed(0)} kWth</p>
                        <p className="text-sm text-mythic-text-muted">
                          {heatUsage.exhaust.toFixed(0)} used ({((heatUsage.exhaust / availableHeat.exhaust) * 100).toFixed(0)}%)
                        </p>
                      </div>
                    </div>
                    
                    {/* Loads using exhaust heat */}
                    <div className="space-y-2">
                      {assignedLoads.filter(l => l.stage === 'exhaust').map(load => (
                        <div key={load.id} className="flex items-center justify-between p-2 bg-mythic-dark-900 rounded border border-red-500/10">
                          <span className="text-sm text-mythic-text-primary">{load.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-mythic-text-muted">{load.kWth} kWth</span>
                            <button
                              onClick={() => removeLoad(load.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ArrowDown className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 text-mythic-text-muted z-10" />
                </div>

                {/* Jacket HX */}
                <div className="relative">
                  <div className="glass rounded-lg p-6 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Thermometer className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-mythic-text-primary">Jacket HX</h3>
                          <p className="text-sm text-mythic-text-muted">80-90°C → 60-70°C</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500">{availableHeat.jacket.toFixed(0)} kWth</p>
                        <p className="text-sm text-mythic-text-muted">
                          {heatUsage.jacket.toFixed(0)} used ({((heatUsage.jacket / availableHeat.jacket) * 100).toFixed(0)}%)
                        </p>
                      </div>
                    </div>
                    
                    {/* Loads using jacket heat */}
                    <div className="space-y-2">
                      {assignedLoads.filter(l => l.stage === 'jacket').map(load => (
                        <div key={load.id} className="flex items-center justify-between p-2 bg-mythic-dark-900 rounded border border-orange-500/10">
                          <span className="text-sm text-mythic-text-primary">{load.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-mythic-text-muted">{load.kWth} kWth</span>
                            <button
                              onClick={() => removeLoad(load.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ArrowDown className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 text-mythic-text-muted z-10" />
                </div>

                {/* Plate HX */}
                <div className="relative">
                  <div className="glass rounded-lg p-6 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Thermometer className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-mythic-text-primary">Plate HX (Low-grade)</h3>
                          <p className="text-sm text-mythic-text-muted">40-50°C → 30-40°C</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-500">{availableHeat.plate.toFixed(0)} kWth</p>
                        <p className="text-sm text-mythic-text-muted">
                          {heatUsage.plate.toFixed(0)} used ({((heatUsage.plate / availableHeat.plate) * 100).toFixed(0)}%)
                        </p>
                      </div>
                    </div>
                    
                    {/* Loads using plate heat */}
                    <div className="space-y-2">
                      {assignedLoads.filter(l => l.stage === 'plate').map(load => (
                        <div key={load.id} className="flex items-center justify-between p-2 bg-mythic-dark-900 rounded border border-blue-500/10">
                          <span className="text-sm text-mythic-text-primary">{load.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-mythic-text-muted">{load.kWth} kWth</span>
                            <button
                              onClick={() => removeLoad(load.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-8 p-6 bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-lg border border-mythic-primary-500/20">
                <h3 className="font-semibold text-mythic-primary-500 mb-3">Efficiency Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-mythic-text-muted">Electric:</p>
                    <p className="text-xl font-bold text-mythic-primary-500">{(electricEfficiency * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-mythic-text-muted">Heat Recovery:</p>
                    <p className="text-xl font-bold text-mythic-accent-300">{((totalHeatUsed / chpPower) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-mythic-text-muted">Total:</p>
                    <p className="text-xl font-bold text-mythic-accent-300">{(overallEfficiency * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                {overallEfficiency >= 0.8 && (
                  <div className="mt-4 flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Target efficiency achieved!</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="glass rounded-xl p-6 border border-mythic-primary-500/20">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-mythic-primary-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-mythic-primary-500 mb-2">Heat Cascade Best Practices</h3>
                <ul className="space-y-2 text-sm text-mythic-text-muted">
                  <li>• Match high-temperature needs to exhaust heat first (drying, sterilization)</li>
                  <li>• Use jacket water for space heating, greenhouses, and mid-temp processes</li>
                  <li>• Capture low-grade heat for preheating, floor heating, or aquaculture</li>
                  <li>• Consider thermal storage to balance supply/demand timing mismatches</li>
                  <li>• Monitor actual vs design performance—real efficiency often differs</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
