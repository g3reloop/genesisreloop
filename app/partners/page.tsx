import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Store,
  Truck,
  TrendingUp,
  Handshake,
  Globe,
  Shield,
  Leaf
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Partners - Join the Genesis Reloop Ecosystem',
  description: 'Partner with Genesis Reloop as a restaurant, collector, or investor. Together we\'re building the circular economy.',
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Partner With Genesis Reloop
              </span>
            </h1>
            
            <p className="text-xl text-mythic-text-muted mb-8 max-w-3xl mx-auto">
              Join our growing ecosystem of restaurants, collectors, and investors building 
              the circular economy. Every partnership creates real environmental impact.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center glass rounded-lg p-4">
                <h3 className="text-2xl font-bold text-mythic-primary-500 mb-1">5,000+</h3>
                <p className="text-sm text-mythic-text-muted">Active Partners</p>
              </div>
              <div className="text-center glass rounded-lg p-4">
                <h3 className="text-2xl font-bold text-mythic-accent-300 mb-1">50+</h3>
                <p className="text-sm text-mythic-text-muted">Cities</p>
              </div>
              <div className="text-center glass rounded-lg p-4">
                <h3 className="text-2xl font-bold text-green-400 mb-1">10M+</h3>
                <p className="text-sm text-mythic-text-muted">Liters Processed</p>
              </div>
              <div className="text-center glass rounded-lg p-4">
                <h3 className="text-2xl font-bold text-blue-400 mb-1">25K</h3>
                <p className="text-sm text-mythic-text-muted">Tons CO₂ Saved</p>
              </div>
            </div>
          </div>

          {/* Partner Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {/* Restaurants */}
            <Link 
              href="/partners/restaurants"
              className="group glass rounded-2xl p-8 border border-mythic-primary-500/20 hover:border-mythic-primary-500/40 transition-all duration-200"
            >
              <Store className="h-12 w-12 text-mythic-primary-500 mb-4" />
              <h2 className="text-xl font-bold text-mythic-text-primary mb-3 group-hover:text-mythic-primary-500 transition-colors">
                For Restaurants
              </h2>
              <p className="text-mythic-text-muted mb-4">
                Turn your waste oil into value. Free collection, green certification, and 
                join thousands making a real impact.
              </p>
              <ul className="space-y-2 text-sm text-mythic-text-muted mb-6">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Free UCO collection service</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Green certification for marketing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Save on disposal & plumbing costs</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-mythic-primary-500 font-semibold">
                Learn More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Collectors */}
            <Link 
              href="/partners/collectors"
              className="group glass rounded-2xl p-8 border border-mythic-accent-300/20 hover:border-mythic-accent-300/40 transition-all duration-200"
            >
              <Truck className="h-12 w-12 text-mythic-accent-300 mb-4" />
              <h2 className="text-xl font-bold text-mythic-text-primary mb-3 group-hover:text-mythic-accent-300 transition-colors">
                For Collectors
              </h2>
              <p className="text-mythic-text-muted mb-4">
                Build a profitable business collecting UCO. We provide training, guaranteed 
                purchase agreements, and support.
              </p>
              <ul className="space-y-2 text-sm text-mythic-text-muted mb-6">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Guaranteed purchase agreements</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Training & certification provided</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>$2.5k average monthly income</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-mythic-accent-300 font-semibold">
                Learn More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Investors */}
            <Link 
              href="/investors"
              className="group glass rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-200"
            >
              <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
              <h2 className="text-xl font-bold text-mythic-text-primary mb-3 group-hover:text-green-400 transition-colors">
                For Investors
              </h2>
              <p className="text-mythic-text-muted mb-4">
                Invest in real assets with real returns. Token staking, facility funding, 
                and own your environmental impact.
              </p>
              <ul className="space-y-2 text-sm text-mythic-text-muted mb-6">
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>15-25% target annual returns</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Asset-backed investments</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Multiple revenue streams</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 text-green-400 font-semibold">
                Learn More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Why Partner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              Why Partner With Genesis Reloop?
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <Leaf className="h-10 w-10 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Real Impact</h3>
                <p className="text-sm text-mythic-text-muted">
                  Every liter collected prevents water pollution and reduces CO₂ emissions
                </p>
              </div>
              
              <div className="text-center">
                <Shield className="h-10 w-10 text-mythic-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Trusted Network</h3>
                <p className="text-sm text-mythic-text-muted">
                  Join thousands of verified partners in our growing ecosystem
                </p>
              </div>
              
              <div className="text-center">
                <Globe className="h-10 w-10 text-mythic-accent-300 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Global Scale</h3>
                <p className="text-sm text-mythic-text-muted">
                  Operating in 50+ cities with expansion plans worldwide
                </p>
              </div>
              
              <div className="text-center">
                <Handshake className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Fair Terms</h3>
                <p className="text-sm text-mythic-text-muted">
                  Transparent agreements with no hidden fees or lock-ins
                </p>
              </div>
            </div>
          </motion.div>

          {/* Success Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              Partner Success Stories
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <Store className="h-8 w-8 text-mythic-primary-500 mb-3" />
                <p className="text-mythic-text-muted italic mb-4">
                  "Genesis Reloop solved our waste problem while saving us money. Our customers 
                  love that we're part of the circular economy. Win-win!"
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">The Green Fork</p>
                  <p className="text-sm text-mythic-primary-500">Restaurant Partner • Miami</p>
                </div>
              </div>
              
              <div className="glass rounded-xl p-6 border border-mythic-accent-300/10">
                <Truck className="h-8 w-8 text-mythic-accent-300 mb-3" />
                <p className="text-mythic-text-muted italic mb-4">
                  "Started with one truck, now I have three. The guaranteed purchase agreement 
                  gave me confidence to grow my business."
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">EcoCollect LLC</p>
                  <p className="text-sm text-mythic-accent-300">Collection Partner • Austin</p>
                </div>
              </div>
              
              <div className="glass rounded-xl p-6 border border-green-500/10">
                <TrendingUp className="h-8 w-8 text-green-400 mb-3" />
                <p className="text-mythic-text-muted italic mb-4">
                  "Best ESG investment we've made. Real returns from real assets, plus the 
                  environmental impact is measurable and meaningful."
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">GreenVest Capital</p>
                  <p className="text-sm text-green-400">Investment Partner • NYC</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center glass rounded-2xl p-12 border border-mythic-primary-500/20"
          >
            <h2 className="text-3xl font-bold text-mythic-text-primary mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-mythic-text-muted mb-8 max-w-2xl mx-auto">
              Choose how you want to partner with Genesis Reloop and join thousands 
              building the circular economy together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#partner-types"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Choose Partnership Type
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/learn/faq"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                View FAQs
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
