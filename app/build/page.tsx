import { RecursiveCard, CardHeader, CardContent, CardTitle } from '@/components/genesis/RecursiveCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, Hammer, Users, FileText, Cpu } from 'lucide-react'
import Link from 'next/link'

export default function BuildPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-txt-snow mb-6">
            Start Building
          </h1>
          <p className="text-xl text-txt-ash max-w-3xl mx-auto">
            Everything you need to start your local loop. Choose your path.
          </p>
        </div>

        {/* Building Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Community Builder Path */}
          <RecursiveCard>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-acc-emerald/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-acc-emerald" />
                </div>
                <CardTitle className="text-2xl">Community Builder</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-txt-ash mb-6">
                Start with Tier 1 loops. Low hazard, high impact. Perfect for local communities.
              </p>
              
              <div className="space-y-4">
                <div id="bricks" className="p-4 bg-earth-obsidian/30 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-txt-snow mb-2">1. Choose Your Material</h4>
                  <ul className="space-y-2 text-sm text-txt-ash">
                    <li>• Polymer-sand bricks (easiest start)</li>
                    <li>• Geopolymer cement (stronger option)</li>
                    <li>• Mycelium foams (bio-based)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-earth-obsidian/30 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-txt-snow mb-2">2. Get Your Designs</h4>
                  <p className="text-sm text-txt-ash">
                    Download fabricator files and SOPs from our tool library.
                  </p>
                </div>
                
                <div className="p-4 bg-earth-obsidian/30 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-txt-snow mb-2">3. Apply for Funding</h4>
                  <p className="text-sm text-txt-ash">
                    DAO provides 50% seed funding for approved Tier 1 projects.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link href="/loops#tier1" className="block">
                  <Button className="w-full bg-acc-emerald hover:bg-acc-emerald/90">
                    View Tier 1 Loops
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/fabricator" className="block">
                  <Button variant="outline" className="w-full">
                    Get Fabricator Files
                  </Button>
                </Link>
              </div>
            </CardContent>
          </RecursiveCard>

          {/* Technical Operator Path */}
          <RecursiveCard>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-acc-amber/20 flex items-center justify-center">
                  <Hammer className="w-6 h-6 text-acc-amber" />
                </div>
                <CardTitle className="text-2xl">Technical Operator</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-txt-ash mb-6">
                Ready for Tier 2? Chemical processing experience required.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-earth-obsidian/30 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-txt-snow mb-2">Requirements</h4>
                  <ul className="space-y-2 text-sm text-txt-ash">
                    <li>• Chemical handling certification</li>
                    <li>• £50k-400k investment capacity</li>
                    <li>• Industrial space access</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-earth-obsidian/30 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-txt-snow mb-2">Popular Loops</h4>
                  <ul className="space-y-2 text-sm text-txt-ash">
                    <li>• UCO → Biodiesel (quickest ROI)</li>
                    <li>• E-waste → Precious metals</li>
                    <li>• Battery recycling</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link href="/loops#tier2" className="block">
                  <Button className="w-full bg-acc-amber hover:bg-acc-amber/90 text-earth-obsidian">
                    View Tier 2 Loops
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/docs" className="block">
                  <Button variant="outline" className="w-full">
                    Technical Documentation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </RecursiveCard>
        </div>

        {/* Quick Links */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif text-acc-emerald mb-6 text-center">
            Essential Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/ops-code" className="block">
              <RecursiveCard className="h-full hover:shadow-gen-emerald transition-all">
                <CardContent className="text-center py-6">
                  <FileText className="w-8 h-8 text-acc-emerald mx-auto mb-2" />
                  <h3 className="font-semibold text-txt-snow">Ops Code</h3>
                  <p className="text-sm text-txt-ash mt-1">Safety & quality standards</p>
                </CardContent>
              </RecursiveCard>
            </Link>
            
            <Link href="/dao" className="block">
              <RecursiveCard className="h-full hover:shadow-gen-emerald transition-all">
                <CardContent className="text-center py-6">
                  <Users className="w-8 h-8 text-acc-emerald mx-auto mb-2" />
                  <h3 className="font-semibold text-txt-snow">DAO Funding</h3>
                  <p className="text-sm text-txt-ash mt-1">Apply for seed capital</p>
                </CardContent>
              </RecursiveCard>
            </Link>
            
            <Link href="/references" className="block">
              <RecursiveCard className="h-full hover:shadow-gen-emerald transition-all">
                <CardContent className="text-center py-6">
                  <Cpu className="w-8 h-8 text-acc-emerald mx-auto mb-2" />
                  <h3 className="font-semibold text-txt-snow">Technical Refs</h3>
                  <p className="text-sm text-txt-ash mt-1">Research & benchmarks</p>
                </CardContent>
              </RecursiveCard>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
