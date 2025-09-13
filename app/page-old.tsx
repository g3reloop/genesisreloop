import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RecursiveCard, CardHeader, CardContent, CardTitle } from '@/components/genesis/RecursiveCard'
import { ArrowRight } from 'lucide-react'

// Three-up tier cards
const TierCard = ({ title, body, href }: { 
  title: string; 
  body: string; 
  href: string;
}) => (
  <Link href={href} className="block h-full">
    <RecursiveCard className="h-full hover:shadow-gen-emerald transition-all duration-300 cursor-pointer">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-txt-snow">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-txt-ash text-sm leading-relaxed mb-4">{body}</p>
        <span className="text-acc-emerald text-sm font-medium flex items-center gap-1">
          Learn more <ArrowRight className="w-4 h-4" />
        </span>
      </CardContent>
    </RecursiveCard>
  </Link>
)

// KPI metric display
const KPIMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-bold text-acc-emerald">{value}</div>
    <div className="text-xs md:text-sm text-txt-ash mt-1">{label}</div>
  </div>
)

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight text-txt-snow mb-6">
              Housing-first loops.
            </h1>
            <h2 className="text-xl md:text-2xl text-txt-ash mb-8 max-w-2xl mx-auto">
              Community bricks today. Fuels and metals when ready.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/build#bricks">
                <Button size="lg" className="w-full sm:w-auto bg-acc-emerald text-earth-obsidian hover:bg-acc-emerald/90 font-medium">
                  Make Bricks
                </Button>
              </Link>
              <Link href="/loops">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-txt-snow hover:bg-white/5 font-medium">
                  View Loops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three-up Section */}
      <section className="bg-earth-obsidian/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TierCard
              title="Tier 1: Community-Safe"
              body="Bricks, geopolymers, glass foam, mycelium, cellulose. Low hazard, high trust."
              href="/loops#tier1"
            />
            <TierCard
              title="Tier 2: Regional Chemistry"
              body="Biodiesel, biomethanol, DES, e-waste metals. Container-scale hubs."
              href="/loops#tier2"
            />
            <TierCard
              title="Tier 3: Strategic"
              body="Indium & rare earth loops. DAO-gated."
              href="/loops#tier3"
            />
          </div>
        </div>
      </section>

      {/* KPI Strip */}
      <section className="border-y border-white/10 bg-earth-obsidian/30">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-white/10">
            <KPIMetric label="Blocks/hour/node" value="400–600" />
            <KPIMetric label="28-day strength" value="30–60 MPa (geo)" />
            <KPIMetric label="Solvent reuse" value="≥10× (DES)" />
          </div>
        </div>
      </section>
    </>
  )
}
