'use client'

import { RecursiveCard, CardHeader, CardContent, CardTitle } from '@/components/genesis/RecursiveCard'
import { ChevronDown, ChevronUp, Lock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

// Type definitions for loops data
interface LoopNote {
  why?: string
  throughput?: string
  safety?: string[]
  ops?: string
}

interface Loop {
  id: string
  title: string
  capex_gbp: string
  kpis: string[]
  fabricator_packs: string[]
  notes?: LoopNote
  governance?: {
    ops_gate?: string
  }
}

interface Tier {
  id: string
  title: string
  description: string
  loops: Loop[]
}

// Loops data from warp manifest
const tiersData: Tier[] = [
  {
    id: "tier1",
    title: "Tier 1 — Community-Safe",
    description: "Low hazard, high trust loops designed for rapid local deployment.",
    loops: [
      {
        id: "polymer_sand_bricks",
        title: "Plastic → Polymer–Sand Bricks",
        capex_gbp: "15,000–50,000",
        kpis: [
          "Compressive Strength: 12-27 MPa",
          "Water Absorption: ≤2.8%",
          "Fire Resistance: Maintains integrity up to 180°C"
        ],
        fabricator_packs: [
          "molds.dxf",
          "fractal_heat_jacket.dxf",
          "static_mixer.stl",
          "qa_checklist.md"
        ],
        notes: {
          why: "Solve housing fast. No cement clinker. Local plastics.",
          throughput: "0.8–1.5 t/day",
          safety: [
            "Use NIOSH-approved dust mask (silica hazard)",
            "Ensure melt ventilation",
            "Wear eye/skin protection",
            "No PVC feedstock"
          ]
        }
      },
      {
        id: "flyash_geopolymer",
        title: "Fly Ash / Slag → Geopolymer Cement",
        capex_gbp: "80,000–150,000",
        kpis: [
          "28-day Compressive Strength: 30–60 MPa (can exceed 70 MPa)",
          "Setting Time: Controllable via GGBS ratio",
          "Alkali Handling SOP required"
        ],
        fabricator_packs: [
          "mix_ratios.json",
          "mold_sets.dxf",
          "curing_schedule.md",
          "fractal_curing_baffles.dxf"
        ],
        notes: {
          safety: [
            "Highly caustic activators (NaOH, Na₂SiO₃)",
            "Requires full PPE: gloves, goggles",
            "Ensure ventilation"
          ]
        }
      },
      {
        id: "foamed_glass",
        title: "Waste Glass → Foamed Glass",
        capex_gbp: "100,000–200,000",
        kpis: [
          "Density: 120–250 kg/m³",
          "Thermal Conductivity (λ): 0.05–0.08 W/mK",
          "Closed-cell Structure: >90%"
        ],
        fabricator_packs: [
          "kiln_baffles.dxf",
          "heat_profile.json",
          "pellet_die.stl",
          "qa_foam_cells.md"
        ],
        notes: {
          ops: "Kiln heat profile (700-1000°C) is critical for density control."
        }
      },
      {
        id: "mycelium_foams",
        title: "Agri-waste → Mycelium Foams",
        capex_gbp: "20,000–50,000",
        kpis: [
          "Growth Cycle: 10–30 days",
          "Dry Density: 60–300 kg/m³",
          "Compressive Strength: 70+ kPa"
        ],
        fabricator_packs: [
          "sterile_box.dxf",
          "mold_set.stl",
          "drying_profile.json"
        ],
        notes: {
          ops: "Requires sterile substrate (pasteurization or autoclave) and controlled humidity (65-98%)."
        }
      },
      {
        id: "bacterial_cellulose",
        title: "Cotton Waste → Bacterial Cellulose",
        capex_gbp: "10,000–30,000",
        kpis: [
          "High wet tensile strength",
          "Bioburden control post-fermentation",
          "Fermentation Time: 7-14 days"
        ],
        fabricator_packs: [
          "fermenter_bill.json",
          "tray_stacks.dxf",
          "wash_press.stl"
        ],
        notes: {
          ops: "Purification requires alkaline wash (e.g., 0.1M NaOH) to remove cell debris."
        }
      }
    ]
  },
  {
    id: "tier2",
    title: "Tier 2 — Regional Chemistry",
    description: "Container-scale hubs requiring more advanced chemical handling and operational oversight.",
    loops: [
      {
        id: "uco_biodiesel",
        title: "UCO → Biodiesel + Glycerol",
        capex_gbp: "50,000–100,000",
        kpis: [
          "Biodiesel Quality: Meets EN 14214",
          "Glycerol Purity (post-purification): ≥95%"
        ],
        fabricator_packs: [
          "reactor_pids.json",
          "materials_compat.yaml",
          "glycerol_loop.md"
        ],
        governance: {}
      },
      {
        id: "bio_methanol",
        title: "Food/Cotton Waste → Methanol",
        capex_gbp: "150,000–250,000",
        kpis: [
          "Tar Reduction: −30%",
          "Single-pass yield w/ plasma: +5–10%",
          "Syngas Ratio (H₂:CO): ~2:1"
        ],
        fabricator_packs: [
          "gasifier_insert.stl",
          "shift_heatfoil.dxf",
          "plasma_grid.svg",
          "MeOH_SOP.md"
        ],
        governance: {}
      },
      {
        id: "digestate_npk_des",
        title: "Digestate → Fertilizers + DES",
        capex_gbp: "25,000–50,000",
        kpis: [
          "NPK Recovery: ≥60%",
          "DES Reuse Cycles: ≥7-10×",
          "Corrosion control for chloride-based DES"
        ],
        fabricator_packs: [
          "plate_stack.stl",
          "electro_plan.md",
          "des_recipe.json"
        ],
        governance: {}
      },
      {
        id: "pcb_des_metals",
        title: "E-waste → Au/Ag/Cu (DES + fractal EW)",
        capex_gbp: "200,000–400,000",
        kpis: [
          "Cu Purity: 99.0–99.9%",
          "Au/Ag Purity: 98%+",
          "Current Density (Cu): 200-600 A/m²"
        ],
        fabricator_packs: [
          "flowcell_body.stl",
          "manifold_tree.dxf",
          "current_program.json",
          "des_reuse.md"
        ],
        governance: {
          ops_gate: "DAO_LAB_LICENSE"
        }
      },
      {
        id: "black_mass_recovery",
        title: "Battery Black Mass → Li/Co/Ni",
        capex_gbp: "300,000–500,000",
        kpis: [
          "Li/Co/Ni Recovery: ≥85-90%",
          "Process Safety: No HF use (uses H₂SO₄/HCl/Organic Acids)",
          "Purity via selective precipitation/plating"
        ],
        fabricator_packs: [
          "leach_tank_pids.json",
          "selective_plate_profiles.json",
          "wash_loop.md"
        ],
        governance: {
          ops_gate: "DAO_LAB_LICENSE"
        }
      },
      {
        id: "glycerol_to_pdo",
        title: "Glycerol → Propanediol",
        capex_gbp: "25,000–50,000",
        kpis: [
          "Yield: ≥70%",
          "Catalyst Life: ≥500 h"
        ],
        fabricator_packs: [
          "reactor_coil.dxf",
          "cat_pack.yaml",
          "cleanup_des.json"
        ],
        governance: {}
      },
      {
        id: "pla_loop",
        title: "PLA → Lactic Acid → PLA",
        capex_gbp: "50,000–100,000",
        kpis: [
          "Lactic Acid Purity: ≥90%",
          "Cycle Closure: ≥2×"
        ],
        fabricator_packs: [
          "hydrolysis_vessel.dxf",
          "ferment_profile.json",
          "repolymer_sop.md"
        ],
        governance: {}
      }
    ]
  },
  {
    id: "tier3",
    title: "Tier 3 — Strategic (DAO-Gated)",
    description: "High-value, high-complexity loops requiring DAO approval and licensed operators.",
    loops: [
      {
        id: "indium_loop",
        title: "LCD/Solar → Indium Loop-Back",
        capex_gbp: "500,000–1,000,000",
        kpis: [
          "In Recovery (Leaching): >90% (process goal ≥70%)",
          "Hazard Control: Compliant with strong acid (HCl, H₂SO₄) & toxic dust handling protocols"
        ],
        fabricator_packs: [
          "ito_strip_cell.dxf",
          "halide_des_recipe.json",
          "precip_route.md"
        ],
        governance: {
          ops_gate: "DAO_STRATEGIC_LICENSE"
        }
      },
      {
        id: "rare_earths",
        title: "E-waste Magnets → Nd/RE",
        capex_gbp: "400,000–600,000",
        kpis: [
          "Nd Recovery: ≥75%",
          "Reagent Recycle: ≥5×"
        ],
        fabricator_packs: [
          "leach_column.dxf",
          "precip_map.json"
        ],
        governance: {
          ops_gate: "DAO_STRATEGIC_LICENSE"
        }
      },
      {
        id: "advanced_des",
        title: "Advanced DES R&D",
        capex_gbp: "R&D",
        kpis: [
          "Selectivity gains vs baseline",
          "Corrosion index OK"
        ],
        fabricator_packs: [
          "des_screening_matrix.json"
        ],
        governance: {
          ops_gate: "DAO_STRATEGIC_LICENSE"
        }
      }
    ]
  }
]

// Component for individual loop card
const LoopCard = ({ loop, isExpanded, onToggle }: { 
  loop: Loop
  isExpanded: boolean
  onToggle: () => void 
}) => {
  const hasGate = loop.governance?.ops_gate

  return (
    <RecursiveCard className="mb-4">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-medium text-txt-snow flex items-center gap-2">
              {loop.title}
              {hasGate && (
                <Lock className="w-4 h-4 text-acc-amber" />
              )}
            </CardTitle>
            <div className="text-sm text-txt-ash mt-1">
              CAPEX: £{loop.capex_gbp}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-txt-ash" />
          ) : (
            <ChevronDown className="w-5 h-5 text-txt-ash" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {/* KPIs */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-acc-emerald mb-2">KPIs</h4>
            <ul className="space-y-1">
              {loop.kpis.map((kpi, idx) => (
                <li key={idx} className="text-sm text-txt-ash">• {kpi}</li>
              ))}
            </ul>
          </div>

          {/* Fabricator Packs */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-acc-emerald mb-2">Fabricator Packs</h4>
            <div className="flex flex-wrap gap-2">
              {loop.fabricator_packs.map((pack, idx) => (
                <span 
                  key={idx} 
                  className="text-xs bg-earth-obsidian/50 border border-white/10 px-2 py-1 rounded font-mono"
                >
                  {pack}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {loop.notes && (
            <div>
              {loop.notes.why && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-acc-emerald mb-1">Why</h4>
                  <p className="text-sm text-txt-ash">{loop.notes.why}</p>
                </div>
              )}
              
              {loop.notes.throughput && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-acc-emerald mb-1">Throughput</h4>
                  <p className="text-sm text-txt-ash">{loop.notes.throughput}</p>
                </div>
              )}

              {loop.notes.ops && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-acc-emerald mb-1">Operations</h4>
                  <p className="text-sm text-txt-ash">{loop.notes.ops}</p>
                </div>
              )}

              {loop.notes.safety && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-acc-amber mb-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Safety
                  </h4>
                  <ul className="space-y-1">
                    {loop.notes.safety.map((item, idx) => (
                      <li key={idx} className="text-sm text-txt-ash">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Governance Gate */}
          {hasGate && (
            <div className="mt-4 p-3 bg-acc-amber/10 border border-acc-amber/20 rounded-lg">
              <p className="text-sm text-acc-amber font-medium">
                Requires: {loop.governance.ops_gate.replace(/_/g, ' ')}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </RecursiveCard>
  )
}

export default function LoopsPage() {
  const [expandedLoops, setExpandedLoops] = useState<string[]>([])
  
  const toggleLoop = (loopId: string) => {
    setExpandedLoops(prev => 
      prev.includes(loopId) 
        ? prev.filter(id => id !== loopId)
        : [...prev, loopId]
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-txt-snow mb-6">
            Production Loops
          </h1>
          <p className="text-xl text-txt-ash max-w-3xl mx-auto">
            Choose by safety and capability. Start at Tier 1; graduate as your DAO matures.
          </p>
        </div>

        {/* Tiers */}
        {tiersData.map((tier) => (
          <section key={tier.id} id={tier.id} className="mb-16 scroll-mt-20">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-acc-emerald mb-2">
                {tier.title}
              </h2>
              <p className="text-txt-ash">{tier.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tier.loops.map((loop) => (
                <LoopCard
                  key={loop.id}
                  loop={loop}
                  isExpanded={expandedLoops.includes(loop.id)}
                  onToggle={() => toggleLoop(loop.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
