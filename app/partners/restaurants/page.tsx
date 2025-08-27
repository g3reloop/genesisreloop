import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  CheckCircle, 
  Droplets,
  Award,
  DollarSign,
  Truck,
  Shield,
  Users,
  Calendar,
  FileText
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Restaurant Partners - Join the Circular Economy | Genesis Reloop',
  description: 'Transform your used cooking oil into clean energy. Free collection, green certification, and join thousands of restaurants in the circular economy.',
}

export default function RestaurantPartnersPage() {
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
                Turn Your Waste Oil Into Value
              </span>
            </h1>
            
            <p className="text-xl text-mythic-text-muted mb-8 max-w-3xl mx-auto">
              Join thousands of restaurants transforming used cooking oil into clean energy. 
              Free collection, green certification, and real environmental impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup?type=restaurant"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Start Free Collection
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/tools/impact-calculator"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Calculate Your Impact
              </Link>
            </div>
          </div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-primary-500 mb-2">1,000+</h3>
              <p className="text-mythic-text-muted">Partner Restaurants</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-accent-300 mb-2">5M+</h3>
              <p className="text-mythic-text-muted">Liters Collected</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-green-400 mb-2">84%</h3>
              <p className="text-mythic-text-muted">CO₂ Reduction</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-blue-400 mb-2">$0</h3>
              <p className="text-mythic-text-muted">Collection Cost</p>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-mythic-text-primary mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">1. Sign Up</h3>
                <p className="text-sm text-mythic-text-muted">
                  Quick online registration, no paperwork required
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">2. Get Container</h3>
                <p className="text-sm text-mythic-text-muted">
                  We provide free collection containers for your UCO
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">3. Schedule Pickup</h3>
                <p className="text-sm text-mythic-text-muted">
                  Regular collection based on your needs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">4. Get Certified</h3>
                <p className="text-sm text-mythic-text-muted">
                  Receive green certification for marketing
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
                Environmental Benefits
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Prevent Water Pollution</p>
                    <p className="text-sm text-mythic-text-muted">
                      1 liter of oil can contaminate 1 million liters of water
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Reduce Carbon Emissions</p>
                    <p className="text-sm text-mythic-text-muted">
                      Biodiesel reduces CO₂ emissions by 84% vs fossil fuel
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Support Circular Economy</p>
                    <p className="text-sm text-mythic-text-muted">
                      Transform waste into valuable clean energy
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Protect Biodiversity</p>
                    <p className="text-sm text-mythic-text-muted">
                      Keep harmful oils out of ecosystems
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-8 border border-mythic-accent-300/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
                Business Benefits
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <DollarSign className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Save on Disposal Costs</p>
                    <p className="text-sm text-mythic-text-muted">
                      Free collection service saves money on waste management
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Prevent Plumbing Issues</p>
                    <p className="text-sm text-mythic-text-muted">
                      Proper disposal prevents costly drain blockages
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Award className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Green Certification</p>
                    <p className="text-sm text-mythic-text-muted">
                      Market your environmental commitment to customers
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Customer Loyalty</p>
                    <p className="text-sm text-mythic-text-muted">
                      73% of consumers prefer eco-friendly businesses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              What's Included
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Truck className="h-12 w-12 text-mythic-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Free Collection</h3>
                <p className="text-sm text-mythic-text-muted">
                  Regular pickups scheduled around your needs. No contracts, no fees.
                </p>
              </div>
              
              <div className="text-center">
                <Droplets className="h-12 w-12 text-mythic-accent-300 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Storage Containers</h3>
                <p className="text-sm text-mythic-text-muted">
                  Food-grade containers provided and maintained at no cost.
                </p>
              </div>
              
              <div className="text-center">
                <Award className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-mythic-text-primary mb-2">Impact Reports</h3>
                <p className="text-sm text-mythic-text-muted">
                  Monthly reports showing your environmental impact and savings.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-mythic-text-primary mb-12">
              What Partners Say
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <p className="text-mythic-text-muted italic mb-4">
                  "Genesis Reloop transformed our waste management. We save money, prevent 
                  drain issues, and our customers love that we're eco-friendly. It's a win-win-win!"
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Sarah Chen</p>
                  <p className="text-sm text-mythic-primary-500">Owner, Golden Wok Restaurant</p>
                </div>
              </div>
              
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <p className="text-mythic-text-muted italic mb-4">
                  "The green certification has been amazing for marketing. We've seen a 15% 
                  increase in customers who specifically mention our environmental efforts."
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Marco Rossi</p>
                  <p className="text-sm text-mythic-primary-500">Manager, Bella Vista Pizzeria</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center glass rounded-2xl p-12 border border-mythic-primary-500/20"
          >
            <h2 className="text-3xl font-bold text-mythic-text-primary mb-4">
              Ready to Join the Movement?
            </h2>
            <p className="text-xl text-mythic-text-muted mb-8 max-w-2xl mx-auto">
              Start your free UCO collection today and join thousands of restaurants 
              making a real environmental impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup?type=restaurant"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started Now
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
