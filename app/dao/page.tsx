import { RecursiveCard, CardHeader, CardContent, CardTitle } from '@/components/genesis/RecursiveCard'
import { PieChart, TrendingUp, Calendar } from 'lucide-react'

export default function DAOPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-txt-snow mb-6">
            DAO & Allocation
          </h1>
          <p className="text-xl text-txt-ash max-w-3xl mx-auto">
            Community-owned. Transparent allocation. Anti-capture by design.
          </p>
        </div>

        {/* Allocation Models */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-serif text-acc-emerald mb-8 text-center">
            Allocation Models by Tier
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <RecursiveCard>
              <CardHeader>
                <CardTitle className="text-xl text-acc-emerald">Tier 1 Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-acc-amber mb-2">CAPEX Split</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">DAO Seed:</span>
                        <span className="text-txt-snow font-mono">50%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Community:</span>
                        <span className="text-txt-snow font-mono">25%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Insurance:</span>
                        <span className="text-txt-snow font-mono">25%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-acc-amber mb-2">Profit Split</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Local Reinvest:</span>
                        <span className="text-txt-snow font-mono">50%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">DAO Reserve:</span>
                        <span className="text-txt-snow font-mono">25%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Wages:</span>
                        <span className="text-txt-snow font-mono">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </RecursiveCard>

            {/* Tier 2 */}
            <RecursiveCard>
              <CardHeader>
                <CardTitle className="text-xl text-acc-emerald">Tier 2 Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-acc-amber mb-2">CAPEX Split</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">DAO Seed:</span>
                        <span className="text-txt-snow font-mono">40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Partner In-Kind:</span>
                        <span className="text-txt-snow font-mono">40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Community:</span>
                        <span className="text-txt-snow font-mono">20%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-acc-amber mb-2">Profit Split</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Reinvest:</span>
                        <span className="text-txt-snow font-mono">40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Wages:</span>
                        <span className="text-txt-snow font-mono">30%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Treasury:</span>
                        <span className="text-txt-snow font-mono">30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </RecursiveCard>

            {/* Tier 3 */}
            <RecursiveCard>
              <CardHeader>
                <CardTitle className="text-xl text-acc-emerald">Tier 3 Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-acc-amber mb-2">CAPEX Split</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">DAO Seed:</span>
                        <span className="text-txt-snow font-mono">60%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Licensed Node:</span>
                        <span className="text-txt-snow font-mono">40%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-acc-amber mb-2">Profit Split</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">DAO Reserve:</span>
                        <span className="text-txt-snow font-mono">60%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Reinvest:</span>
                        <span className="text-txt-snow font-mono">20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-ash">Wages:</span>
                        <span className="text-txt-snow font-mono">20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </RecursiveCard>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-serif text-acc-emerald mb-8 text-center">
            Deployment Timeline
          </h2>
          
          <RecursiveCard className="max-w-3xl mx-auto">
            <CardContent>
              <div className="space-y-6">
                {/* 2025-2026 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-acc-emerald/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-acc-emerald" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-txt-snow mb-1">2025-2026</h3>
                    <p className="text-txt-ash">Tier 1 housing materials</p>
                    <p className="text-sm text-txt-ash/70 mt-2">
                      Focus on community-safe loops. Polymer-sand bricks, geopolymer cement, 
                      foamed glass, mycelium, and bacterial cellulose production.
                    </p>
                  </div>
                </div>

                {/* 2026-2028 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-acc-amber/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-acc-amber" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-txt-snow mb-1">2026-2028</h3>
                    <p className="text-txt-ash">Tier 2 fuels & metals</p>
                    <p className="text-sm text-txt-ash/70 mt-2">
                      Regional chemistry hubs. Biodiesel, biomethanol, DES extraction, 
                      e-waste metals recovery, battery recycling.
                    </p>
                  </div>
                </div>

                {/* 2029+ */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-acc-cyan/20 flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-acc-cyan" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-txt-snow mb-1">2029+</h3>
                    <p className="text-txt-ash">Tier 3 strategic metals & solvents</p>
                    <p className="text-sm text-txt-ash/70 mt-2">
                      DAO-gated strategic operations. Indium recovery, rare earth extraction, 
                      advanced DES research and development.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </RecursiveCard>
        </div>

        {/* Anti-Capture Notice */}
        <div className="max-w-3xl mx-auto">
          <RecursiveCard>
            <CardContent className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-acc-amber/10 border border-acc-amber/20 mb-4">
                <span className="text-sm text-acc-amber font-medium">Anti-Capture Mechanisms Active</span>
              </div>
              <p className="text-txt-ash">
                Fixed allocations. Community ownership. No single entity can control more than 10% of votes.
              </p>
            </CardContent>
          </RecursiveCard>
        </div>
      </div>
    </div>
  )
}
