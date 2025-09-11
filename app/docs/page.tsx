'use client'

import { RecursiveCard, CardHeader, CardContent, CardTitle } from '@/src/components/genesis/RecursiveCard'
import { FileText, Download, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/src/components/ui/button'

interface SOPPack {
  pack_id: string
  title: string
  files: string[]
}

const sopPacks: SOPPack[] = [
  {
    pack_id: "SOP_polymer_sand_bricks",
    title: "SOP — Polymer–Sand Bricks",
    files: [
      "melt_profile.json",
      "press_cycle.json",
      "qa_checklist.md"
    ]
  },
  {
    pack_id: "SOP_geopolymer",
    title: "SOP — Geopolymer Cement",
    files: [
      "mix_designs.json",
      "curing_schedule.md",
      "alkali_handling.md"
    ]
  },
  {
    pack_id: "SOP_foamed_glass",
    title: "SOP — Foamed Glass",
    files: [
      "foamer_ratios.json",
      "kiln_profile.json",
      "cell_QA.md"
    ]
  },
  {
    pack_id: "SOP_mycelium",
    title: "SOP — Mycelium Foams",
    files: [
      "substrate_prep.md",
      "growth_env.json",
      "drying.md"
    ]
  },
  {
    pack_id: "SOP_cellulose",
    title: "SOP — Bacterial Cellulose",
    files: [
      "ferment_params.json",
      "washing_bleaching.md"
    ]
  },
  {
    pack_id: "SOP_biodiesel",
    title: "SOP — UCO→Biodiesel",
    files: [
      "reactor_pids.json",
      "spec_EN14214.md"
    ]
  },
  {
    pack_id: "SOP_biomethanol",
    title: "SOP — Bio-Methanol",
    files: [
      "gasifier_SOP.md",
      "shift_SOP.md",
      "synth_SOP.md",
      "emissions_controls.md"
    ]
  },
  {
    pack_id: "SOP_e_waste_DES",
    title: "SOP — E-waste DES + EW",
    files: [
      "des_makeup.md",
      "cell_setup.md",
      "current_schedules.json",
      "hazards.md"
    ]
  },
  {
    pack_id: "SOP_black_mass",
    title: "SOP — Black Mass Recovery",
    files: [
      "leach_profiles.json",
      "selective_plate.md",
      "waste_minimization.md"
    ]
  }
]

export default function DocsPage() {
  const [expandedPacks, setExpandedPacks] = useState<string[]>([])
  
  const togglePack = (packId: string) => {
    setExpandedPacks(prev => 
      prev.includes(packId) 
        ? prev.filter(id => id !== packId)
        : [...prev, packId]
    )
  }

  const handleDownload = (packId: string, fileName: string) => {
    // In production, this would trigger actual file download
    console.log(`Downloading ${fileName} from pack ${packId}`)
  }

  const handleDownloadPack = (packId: string) => {
    // In production, this would download entire pack as zip
    console.log(`Downloading entire pack ${packId}`)
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-txt-snow mb-6">
            Operator Docs
          </h1>
          <p className="text-xl text-txt-ash max-w-3xl mx-auto">
            Standard Operating Procedures for all loops. Safety first. Quality always.
          </p>
        </div>

        {/* SOP Packs Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {sopPacks.map((pack) => {
            const isExpanded = expandedPacks.includes(pack.pack_id)
            
            return (
              <RecursiveCard key={pack.pack_id}>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => togglePack(pack.pack_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-acc-emerald" />
                      <CardTitle className="text-lg">{pack.title}</CardTitle>
                      <span className="text-sm text-txt-ash">
                        ({pack.files.length} files)
                      </span>
                    </div>
                    <ChevronRight 
                      className={`w-5 h-5 text-txt-ash transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {pack.files.map((file) => (
                        <div 
                          key={file}
                          className="flex items-center justify-between p-3 bg-earth-obsidian/30 rounded-lg border border-white/10"
                        >
                          <span className="font-mono text-sm text-txt-snow">{file}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(pack.pack_id, file)}
                            className="text-acc-emerald hover:text-acc-emerald/80"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadPack(pack.pack_id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Complete Pack
                    </Button>
                  </CardContent>
                )}
              </RecursiveCard>
            )
          })}
        </div>

        {/* Safety Notice */}
        <div className="max-w-3xl mx-auto mt-12">
          <RecursiveCard>
            <CardContent className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-acc-amber/10 border border-acc-amber/20 mb-4">
                <span className="text-sm text-acc-amber font-medium">Safety Notice</span>
              </div>
              <p className="text-txt-ash">
                These SOPs assume proper training and PPE. Always follow local regulations. 
                When in doubt, contact your regional coordinator.
              </p>
            </CardContent>
          </RecursiveCard>
        </div>
      </div>
    </div>
  )
}
