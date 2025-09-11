import { RecursiveCard, CardContent } from '@/src/components/genesis/RecursiveCard'
import { CheckCircle } from 'lucide-react'

export default function OpsCodePage() {
  const principles = [
    "No exports without training badge for gated packs.",
    "No cats-off, no cowboy hacks.",
    "DES reuse ≥10×; no solvent dumping.",
    "Workers first: living wage, PPE, audit trails."
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-txt-snow mb-6">
              Ops Code
            </h1>
            <p className="text-xl text-txt-ash">
              Operational principles for all Genesis Reloop nodes
            </p>
          </div>

          {/* Principles Card */}
          <RecursiveCard>
            <CardContent className="py-8">
              <ul className="space-y-6">
                {principles.map((principle, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-acc-emerald mt-0.5 flex-shrink-0" />
                    <span className="text-lg text-txt-snow">{principle}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 p-6 bg-acc-emerald/10 border border-acc-emerald/20 rounded-lg">
                <p className="text-sm text-acc-emerald font-medium mb-2">
                  Remember:
                </p>
                <p className="text-sm text-txt-ash">
                  These aren't suggestions. They're how we maintain trust, safety, and quality 
                  across the network. Every loop operator agrees to these terms before starting.
                </p>
              </div>
            </CardContent>
          </RecursiveCard>

          {/* Additional Context */}
          <div className="mt-12 text-center">
            <p className="text-txt-ash mb-4">
              Questions about operational standards?
            </p>
            <a 
              href="/docs" 
              className="text-acc-emerald hover:underline font-medium"
            >
              Check the Operator Docs →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
