'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  Eye, 
  Heart,
  Shield,
  Users,
  Globe,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            About Genesis Reloop
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Building community-owned infrastructure that turns local waste into local fuel,
          with transparent operations and real impact metrics
        </p>
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <Target className="h-8 w-8 text-emerald-500 mb-4" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              To transform food waste and used cooking oil into valuable resources through 
              a decentralized circular economy powered by blockchain and AI.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Eye className="h-8 w-8 text-teal-500 mb-4" />
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              A world where every drop of waste becomes a source of renewable energy, 
              creating a carbon-negative future for generations to come.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Heart className="h-8 w-8 text-pink-500 mb-4" />
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Transparency, sustainability, innovation, and community empowerment drive 
              everything we do at ReLoop.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Makes ReLoop Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Shield className="h-6 w-6 text-emerald-500" />
                <CardTitle>Secure Operations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                End-to-end encryption protects transaction data. All waste transfers 
                are tracked with cryptographic proof and photo evidence.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <CardTitle>Smart Matching</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Automated systems match waste suppliers with processors based on 
                location, volume, and quality requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Users className="h-6 w-6 text-blue-500" />
                <CardTitle>DAO Governance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Community-driven decision making ensures the platform evolves to meet 
                the needs of all stakeholders in the circular economy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <CardTitle>Real Value Creation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Convert waste into biodiesel, renewable energy, and verified carbon 
                credits with transparent tracking and instant settlements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Core Team */}
      <div className="bg-gradient-to-r from-mythic-primary-500/10 to-mythic-accent-300/10 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Core Team</h2>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-mythic-text-primary">Warren Brown</h3>
            <p className="text-mythic-text-muted">Founder & Systems Designer</p>
          </div>
          <p className="text-gray-400 mb-6">
            Genesis Reloop is currently led by a single founder focused on building 
            the foundational infrastructure and community partnerships needed to 
            make waste-to-fuel loops a reality.
          </p>
          <p className="text-sm text-mythic-text-muted italic">
            As the platform grows, governance will transition to the DAO, ensuring 
            true community ownership and decision-making.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
        <div className="text-4xl font-bold text-emerald-400">850K+</div>
            <div className="text-gray-400 mt-2">kg Waste Diverted</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-400">15K</div>
            <div className="text-gray-400 mt-2">tCO₂ Saved</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-400">2.4K</div>
            <div className="text-gray-400 mt-2">Active Suppliers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-400">£4.2M</div>
            <div className="text-gray-400 mt-2">Value Created</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Join the Revolution?
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Be part of the solution. Transform your waste into wealth while creating 
          a sustainable future for our planet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
