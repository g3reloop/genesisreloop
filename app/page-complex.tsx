import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, TrendingUp, Shield, Users, DollarSign } from 'lucide-react'

// Hero metrics
const HeroMetric = ({ value, label, trend }: { value: string; label: string; trend: string }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-acc-emerald mb-1">{value}</div>
    <div className="text-sm text-txt-ash">{label}</div>
    <div className="text-xs text-acc-cyan mt-1">{trend}</div>
  </div>
)

// Feature card for "How it works" section
const FeatureCard = ({ number, text }: { number: string; text: string }) => (
  <div className="flex gap-4 items-start">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-acc-emerald/20 flex items-center justify-center">
      <span className="text-sm font-bold text-acc-emerald">{number}</span>
    </div>
    <p className="text-sm text-txt-ash leading-relaxed">{text}</p>
  </div>
)

// Stat card for key metrics
const StatCard = ({ icon: Icon, value, label, description }: { 
  icon: React.ElementType; 
  value: string; 
  label: string;
  description: string;
}) => (
  <Card className="bg-earth-midnight/50 border-white/10 hover:border-acc-emerald/40 transition-all">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Icon className="h-8 w-8 text-acc-emerald" />
        <span className="text-2xl font-bold text-txt-snow">{value}</span>
      </div>
    </CardHeader>
    <CardContent>
      <h3 className="font-semibold text-txt-snow mb-1">{label}</h3>
      <p className="text-xs text-txt-ash">{description}</p>
    </CardContent>
  </Card>
)

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-earth-obsidian">
        <div className="absolute inset-0 bg-gen-radial opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-txt-snow mb-6">
              Turn waste into value with decentralized loops
            </h1>
            <p className="text-xl text-txt-ash mb-8 max-w-3xl mx-auto">
              Genesis Reloop connects suppliers, processors, and buyers into verifiable circular supply chains. 
              Automate logistics, trace every kilogram, finance with GIRM credits, and prove real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button size="lg" className="w-full sm:w-auto bg-acc-emerald text-earth-obsidian hover:shadow-electric-glow font-semibold">
                  Join the network
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-acc-cyan/40 text-acc-cyan hover:bg-acc-cyan/10">
                  How it works
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
            <HeroMetric value="850K kg" label="Waste Diverted" trend="+25% MoM" />
            <HeroMetric value="15,234" label="GIRM Credits" trend="+18% MoM" />
            <HeroMetric value="2,456" label="Community Nodes" trend="+12% MoM" />
            <HeroMetric value="£487k" label="DAO Treasury" trend="+42% MoM" />
          </div>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="bg-earth-midnight/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={TrendingUp}
              value="40%"
              label="Lower CAPEX"
              description="Modular Plants: Containerized biogas & biodiesel units—40% lower CAPEX, deploy in weeks."
            />
            <StatCard
              icon={Shield}
              value="85%"
              label="Efficiency"
              description="Heat Cascading: CHP with 3-stage heat reuse lifts utilization to ~80–85%."
            />
            <StatCard
              icon={DollarSign}
              value="£2.30"
              label="Below Diesel"
              description="Real Credits: GIRM credits from measured batches, lowering fuel price—not greenwash."
            />
            <StatCard
              icon={Users}
              value="60%"
              label="Reinvested"
              description="DAO Ownership: Fees and credits flow to your treasury to fund the next loop."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-txt-snow mb-4">How it works</h2>
            <p className="text-lg text-txt-ash">Six steps to close the loop</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard number="1" text="List feedstock (UCO, plastics, organics) with specs and volumes." />
            <FeatureCard number="2" text="Match to processors via agents (technology, permits, capacity)." />
            <FeatureCard number="3" text="Automate routes & paperwork (WTN, duty-of-care)." />
            <FeatureCard number="4" text="Sell outputs (biodiesel, biogas, oils, digestate) to verified buyers." />
            <FeatureCard number="5" text="Finance with GIRM credits and settle via Treasury." />
            <FeatureCard number="6" text="Audit end-to-end with traceable, verifiable proof." />
          </div>
        </div>
      </section>

      {/* Real Loops Section */}
      <section className="bg-earth-midnight/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-txt-snow mb-4">
              Real Loops. Real Numbers.
            </h2>
            <p className="text-lg text-acc-emerald">No greenwashing. Every metric is measured and verified.</p>
          </div>
          
          <div className="text-center">
            <Link href="/credits">
              <Button variant="outline" className="border-acc-emerald/40 text-acc-emerald hover:bg-acc-emerald/10">
                View Live Credits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community First Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-txt-snow mb-4">
              Built for Communities, Not Corporations
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-earth-obsidian border-white/10">
              <CardHeader>
                <CardTitle className="text-acc-cyan">Fair-Pay Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-txt-ash">Local logistics stay local. No gig exploitation.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-earth-obsidian border-white/10">
              <CardHeader>
                <CardTitle className="text-acc-cyan">Anti-Capture Guardrails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-txt-ash">15% max draw per loop. Small actors get priority.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-earth-obsidian border-white/10">
              <CardHeader>
                <CardTitle className="text-acc-cyan">Treasury Compounds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-txt-ash">60% reinvested to fund the next loop. Always.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-earth-obsidian border-white/10">
              <CardHeader>
                <CardTitle className="text-acc-cyan">Zero ESG Theatre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-txt-ash">We show receipts. Physical batches, measured outputs, cryptographic proof. No corporate greenwash.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-earth-midnight/50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-txt-snow mb-4">
            Start stabilizing loops
          </h2>
          <p className="text-lg text-txt-ash mb-8">
            Deploy infrastructure that serves community first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button size="lg" className="bg-acc-emerald text-earth-obsidian hover:shadow-electric-glow">
                Join a community node
              </Button>
            </Link>
            <Link href="/escrow">
              <Button size="lg" variant="outline" className="border-hi-violet/40 text-hi-violet hover:bg-hi-violet/10">
                Open escrow
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
