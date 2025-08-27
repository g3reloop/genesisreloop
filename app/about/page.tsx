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
            About ReLoop
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          We{`'`}re building the future of waste management through blockchain technology, 
          AI innovation, and community-driven sustainability
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
                <CardTitle>DARPA-Level Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Military-grade encryption, zero-knowledge proofs, and post-quantum 
                cryptography protect every transaction and data point.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <CardTitle>18 AI Agents</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Specialized AI agents work 24/7 to optimize routes, match suppliers 
                with processors, and verify carbon credits automatically.
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

      {/* Impact Stats */}
      <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-emerald-400">850K+</div>
            <div className="text-gray-400 mt-2">Liters Processed</div>
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
