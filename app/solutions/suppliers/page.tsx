'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Building2,
  TrendingUp,
  Shield,
  Coins,
  BarChart3,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function SuppliersPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Solutions for Suppliers
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Turn your used cooking oil and food waste into a reliable revenue stream while 
          contributing to a sustainable future
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <Coins className="h-8 w-8 text-emerald-500 mb-4" />
            <CardTitle>Guaranteed Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Receive competitive prices for your UCO and food waste with transparent 
              pricing and instant payments through smart contracts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-teal-500 mb-4" />
            <CardTitle>Carbon Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Earn verified carbon credits for your sustainability efforts, creating 
              additional revenue streams and ESG compliance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-blue-500 mb-4" />
            <CardTitle>Full Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Automated documentation and blockchain-verified audit trails ensure 
              you meet all UK and EU regulatory requirements.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="text-2xl">How It Works for Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Register Your Business</h3>
                <p className="text-gray-400">
                  Sign up as a supplier and complete simple KYC verification to get started.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Schedule Collections</h3>
                <p className="text-gray-400">
                  Our AI optimizes collection routes to minimize costs and maximize efficiency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track & Earn</h3>
                <p className="text-gray-400">
                  Monitor your collections in real-time and receive instant payments upon verification.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features Built for Your Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-emerald-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Real-Time Analytics</h3>
              <p className="text-gray-400">Track volumes, revenues, and environmental impact</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-emerald-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Automated Invoicing</h3>
              <p className="text-gray-400">Blockchain-verified records for easy accounting</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-emerald-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Quality Verification</h3>
              <p className="text-gray-400">AI-powered testing ensures fair pricing</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-emerald-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
              <p className="text-gray-400">Collections that work around your business hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">
          Start Earning from Your Waste Today
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already benefiting from the circular economy
        </p>
        <Button size="lg" asChild>
          <Link href="/register">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
