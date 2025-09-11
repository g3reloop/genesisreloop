import { RecursiveCard, CardContent } from '@/src/components/genesis/RecursiveCard'
import { BookOpen } from 'lucide-react'

interface Reference {
  title: string
  publisher: string
  year: string
}

const references: Reference[] = [
  // Polymer-Sand Bricks
  {
    title: "Polymer-Sand Bricks Operational Parameters",
    publisher: "",
    year: ""
  },
  {
    title: "Polymer-Sand Bricks QA & Standards",
    publisher: "",
    year: ""
  },
  {
    title: "Polymer-Sand Bricks Safety Standards",
    publisher: "",
    year: ""
  },
  {
    title: "Polymer-Sand Bricks Hazard Controls",
    publisher: "",
    year: ""
  },
  // Geopolymer
  {
    title: "Fly Ash & GGBS Geopolymer Strength",
    publisher: "",
    year: ""
  },
  {
    title: "Fly Ash & GGBS Geopolymer Activators & Curing",
    publisher: "",
    year: ""
  },
  {
    title: "Fly Ash & GGBS Geopolymer Mix Design",
    publisher: "",
    year: ""
  },
  {
    title: "Fly Ash & GGBS Geopolymer Safety",
    publisher: "",
    year: ""
  },
  // Foamed Glass
  {
    title: "Foamed Glass Insulation Process",
    publisher: "",
    year: ""
  },
  {
    title: "Foamed Glass Kiln Profiles & Density",
    publisher: "",
    year: ""
  },
  // Mycelium
  {
    title: "Mycelium Foam Mechanical Properties",
    publisher: "",
    year: ""
  },
  {
    title: "Mycelium Foam Production",
    publisher: "",
    year: ""
  },
  // Bacterial Cellulose
  {
    title: "Bacterial Cellulose Production",
    publisher: "",
    year: ""
  },
  {
    title: "Bacterial Cellulose Post-Processing",
    publisher: "",
    year: ""
  },
  // Biodiesel
  {
    title: "UCO to Biodiesel Quality Standards",
    publisher: "",
    year: ""
  },
  {
    title: "UCO to Biodiesel Reactor & Purification",
    publisher: "",
    year: ""
  },
  // Methanol
  {
    title: "Methanol Synthesis from Waste",
    publisher: "",
    year: ""
  },
  {
    title: "Methanol Synthesis Loops & Polishing",
    publisher: "",
    year: ""
  },
  // DES
  {
    title: "Deep Eutectic Solvents (DES) Fundamentals",
    publisher: "",
    year: ""
  },
  {
    title: "DES Reuse and Corrosion",
    publisher: "",
    year: ""
  },
  // E-Waste
  {
    title: "E-Waste Metals Recovery (Au/Ag/Cu)",
    publisher: "",
    year: ""
  },
  {
    title: "E-Waste Metals Recovery from PCB (Au/Ag/Cu)",
    publisher: "",
    year: ""
  },
  // Battery
  {
    title: "Battery Black Mass Recycling (Li/Co/Ni)",
    publisher: "",
    year: ""
  },
  {
    title: "Battery Black Mass Non-HF Leaching",
    publisher: "",
    year: ""
  },
  // Indium
  {
    title: "Indium Recovery Technology",
    publisher: "",
    year: ""
  },
  {
    title: "Indium Recovery from LCDs",
    publisher: "",
    year: ""
  }
]

// Group references by category
const categorizedRefs = {
  "Building Materials": references.slice(0, 14),
  "Fuels & Chemicals": references.slice(14, 20),
  "Metals Recovery": references.slice(20)
}

export default function ReferencesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-txt-snow mb-6">
            References
          </h1>
          <p className="text-xl text-txt-ash max-w-3xl mx-auto">
            Synthesized references for safety envelopes and benchmarks
          </p>
        </div>

        {/* Notice */}
        <RecursiveCard className="max-w-3xl mx-auto mb-12">
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-acc-emerald/10 border border-acc-emerald/20 mb-4">
              <BookOpen className="w-4 h-4 text-acc-emerald" />
              <span className="text-sm text-acc-emerald font-medium">Reference Note</span>
            </div>
            <p className="text-txt-ash text-sm">
              Each document represents a synthesis of multiple academic and industry sources 
              on the given topic. Full citations available to DAO members.
            </p>
          </CardContent>
        </RecursiveCard>

        {/* Categorized References */}
        <div className="max-w-4xl mx-auto space-y-12">
          {Object.entries(categorizedRefs).map(([category, refs]) => (
            <div key={category}>
              <h2 className="text-xl font-serif text-acc-emerald mb-4">{category}</h2>
              <div className="space-y-3">
                {refs.map((ref, idx) => (
                  <RecursiveCard key={idx}>
                    <CardContent className="py-4">
                      <h3 className="text-txt-snow font-medium">{ref.title}</h3>
                      {(ref.publisher || ref.year) && (
                        <p className="text-sm text-txt-ash mt-1">
                          {ref.publisher && <span>{ref.publisher}</span>}
                          {ref.publisher && ref.year && <span>, </span>}
                          {ref.year && <span>{ref.year}</span>}
                        </p>
                      )}
                    </CardContent>
                  </RecursiveCard>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Access Notice */}
        <div className="max-w-3xl mx-auto mt-12">
          <RecursiveCard>
            <CardContent className="text-center py-6">
              <p className="text-txt-ash text-sm">
                Full academic citations and source documents available through the DAO portal 
                for verified operators and researchers.
              </p>
            </CardContent>
          </RecursiveCard>
        </div>
      </div>
    </div>
  )
}
