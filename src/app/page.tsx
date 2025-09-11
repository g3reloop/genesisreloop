import { Button } from '../components/ui/Button'
import Link from 'next/link'

const FeatureCard = ({ title, description, href }: { title: string; description: string; href: string }) => (
  <Link href={href}>
    <div className="bg-mythic-obsidian/50 backdrop-blur-lg rounded-xl p-6 border border-mythic-primary/20 hover:border-mythic-primary/40 transition-all hover:scale-105 cursor-pointer">
      <h3 className="text-xl font-semibold text-mythic-primary mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  </Link>
)

export default function Home(){
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">Genesis ReLoop</h1>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto">A decentralised circular economy platform converting waste into value through Short Renewable Loops (SRL).</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/marketplace">
            <Button>Enter Marketplace</Button>
          </Link>
          <Link href="/srl/entrustment">
            <Button variant="ghost">Start SRL Process</Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-mythic-primary mb-8 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Marketplace"
            description="Connect waste suppliers with processors in a transparent marketplace"
            href="/marketplace"
          />
          <FeatureCard
            title="AI Agents"
            description="Intelligent routing, matching, and optimization powered by 15+ AI agents"
            href="/agents"
          />
          <FeatureCard
            title="Analytics"
            description="Track environmental impact, carbon credits, and loop performance"
            href="/analytics"
          />
          <FeatureCard
            title="SRL Entrustment"
            description="Transform waste into energy through verified chain of custody"
            href="/srl/entrustment"
          />
          <FeatureCard
            title="Chain Tracking"
            description="Immutable tracking from entrustment to final disposition"
            href="/srl/tracking/demo-asset-123"
          />
          <FeatureCard
            title="Compliance"
            description="Real-time IoT monitoring with automated alerts and remediation"
            href="/srl/compliance"
          />
          <FeatureCard
            title="Offtake Market"
            description="Purchase green energy and materials from SRL facilities"
            href="/srl/offtake"
          />
          <FeatureCard
            title="Remedy Process"
            description="Due process management for compliance violations"
            href="/srl/remedy"
          />
          <FeatureCard
            title="Logistics Handover"
            description="Mobile custody transfer with QR scanning"
            href="/srl/logistics/handover"
          />
        </div>
      </div>
    </section>
  )
}
