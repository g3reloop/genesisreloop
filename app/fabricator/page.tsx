'use client'

import { RecursiveCard, CardHeader, CardContent, CardTitle } from '@/components/genesis/RecursiveCard'
import { Button } from '@/components/ui/button'
import { Lock, Download, FileCode, Wrench, Fuel, Package, Cpu } from 'lucide-react'
import { useState } from 'react'

interface Export {
  name: string
  icon: React.ReactNode
}

interface Mode {
  id: string
  title: string
  icon: React.ReactNode
  exports: Export[]
  isGated?: boolean
  gateRequirement?: string
}

const modes: Mode[] = [
  {
    id: 'process_hardware',
    title: 'Process Hardware',
    icon: <Wrench className="w-5 h-5" />,
    exports: [
      { name: 'manifold_insert.stl', icon: <FileCode className="w-4 h-4" /> },
      { name: 'static_mixer.stl', icon: <FileCode className="w-4 h-4" /> },
      { name: 'baffle_set.dxf', icon: <FileCode className="w-4 h-4" /> },
      { name: 'heat_spreader_foil.dxf', icon: <FileCode className="w-4 h-4" /> },
      { name: 'electrode_contours.svg', icon: <FileCode className="w-4 h-4" /> }
    ]
  },
  {
    id: 'fuel_mode',
    title: 'Fuel Mode',
    icon: <Fuel className="w-5 h-5" />,
    exports: [
      { name: 'gasifier_insert.stl', icon: <FileCode className="w-4 h-4" /> },
      { name: 'shift_heatfoil.dxf', icon: <FileCode className="w-4 h-4" /> },
      { name: 'plasma_grid.svg', icon: <FileCode className="w-4 h-4" /> },
      { name: 'MeOH_SOP.md', icon: <FileCode className="w-4 h-4" /> },
      { name: 'storage_BOM.json', icon: <FileCode className="w-4 h-4" /> }
    ],
    isGated: true,
    gateRequirement: 'TRAINING_BADGE_FUEL_SOP'
  },
  {
    id: 'materials_mode',
    title: 'Materials Mode',
    icon: <Package className="w-5 h-5" />,
    exports: [
      { name: 'brick_molds.dxf', icon: <FileCode className="w-4 h-4" /> },
      { name: 'geo_molds.dxf', icon: <FileCode className="w-4 h-4" /> },
      { name: 'kiln_baffles.dxf', icon: <FileCode className="w-4 h-4" /> },
      { name: 'foam_pellet_die.stl', icon: <FileCode className="w-4 h-4" /> }
    ]
  },
  {
    id: 'metals_mode',
    title: 'Metals Mode',
    icon: <Cpu className="w-5 h-5" />,
    exports: [
      { name: 'flowcell_body.stl', icon: <FileCode className="w-4 h-4" /> },
      { name: 'tree_manifold.dxf', icon: <FileCode className="w-4 h-4" /> },
      { name: 'current_program.json', icon: <FileCode className="w-4 h-4" /> },
      { name: 'des_recipe.json', icon: <FileCode className="w-4 h-4" /> }
    ],
    isGated: true,
    gateRequirement: 'DAO_LAB_LICENSE'
  }
]

export default function FabricatorPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [unlockedModes, setUnlockedModes] = useState<string[]>(['process_hardware', 'materials_mode']) // Mock unlocked modes

  const handleExport = (fileName: string) => {
    // In a real implementation, this would trigger a download
    console.log(`Exporting ${fileName}...`)
  }

  const isUnlocked = (modeId: string) => {
    return unlockedModes.includes(modeId)
  }

  const currentMode = modes.find(m => m.id === selectedMode)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-txt-snow mb-6">
            Fractal Fabricator
          </h1>
          <p className="text-xl text-txt-ash max-w-3xl mx-auto">
            Design files and SOPs for distributed manufacturing. Export what you need to build loops locally.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {modes.map((mode) => {
            const unlocked = isUnlocked(mode.id)
            
            return (
              <RecursiveCard 
                key={mode.id}
                className={`cursor-pointer transition-all ${
                  selectedMode === mode.id ? 'ring-2 ring-acc-emerald' : ''
                } ${!unlocked ? 'opacity-75' : ''}`}
                onClick={() => unlocked && setSelectedMode(mode.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${
                        unlocked ? 'bg-acc-emerald/20' : 'bg-txt-ash/20'
                      } flex items-center justify-center`}>
                        {mode.icon}
                      </div>
                      <CardTitle className="text-lg">{mode.title}</CardTitle>
                    </div>
                    {mode.isGated && !unlocked && (
                      <Lock className="w-5 h-5 text-acc-amber" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {mode.isGated && !unlocked ? (
                    <p className="text-sm text-acc-amber">
                      Requires: {mode.gateRequirement?.replace(/_/g, ' ')}
                    </p>
                  ) : (
                    <p className="text-sm text-txt-ash">
                      {mode.exports.length} files available
                    </p>
                  )}
                </CardContent>
              </RecursiveCard>
            )
          })}
        </div>

        {/* Export Panel */}
        {currentMode && isUnlocked(currentMode.id) && (
          <RecursiveCard className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                {currentMode.icon}
                {currentMode.title} Exports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentMode.exports.map((exp) => (
                  <div 
                    key={exp.name}
                    className="flex items-center justify-between p-4 bg-earth-obsidian/30 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      {exp.icon}
                      <span className="font-mono text-sm text-txt-snow">{exp.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExport(exp.name)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-acc-emerald/10 border border-acc-emerald/20 rounded-lg">
                <p className="text-sm text-acc-emerald">
                  <strong>Note:</strong> These files are for community fabrication. 
                  Follow all safety SOPs and local regulations. No warranties implied.
                </p>
              </div>
            </CardContent>
          </RecursiveCard>
        )}

        {/* Locked Mode Message */}
        {currentMode && !isUnlocked(currentMode.id) && (
          <RecursiveCard className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-acc-amber mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-txt-snow mb-2">
                Access Required
              </h3>
              <p className="text-txt-ash mb-6">
                This mode requires: <span className="text-acc-amber font-medium">
                  {currentMode.gateRequirement?.replace(/_/g, ' ')}
                </span>
              </p>
              <Button className="bg-acc-emerald hover:bg-acc-emerald/90">
                Request Access
              </Button>
            </CardContent>
          </RecursiveCard>
        )}
      </div>
    </div>
  )
}
