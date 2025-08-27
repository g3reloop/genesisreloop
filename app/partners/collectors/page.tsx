import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Truck,
  MapPin,
  DollarSign,
  Shield,
  Users,
  BarChart3,
  Clock,
  Briefcase,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Become a UCO Collector - Partner with Genesis Reloop',
  description: 'Join our network of certified collectors. Guaranteed purchase agreements, training provided, and be part of the circular economy revolution.',
}

export default function CollectorsPage() {
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
                Become a UCO Collector
              </span>
            </h1>
            
            <p className="text-xl text-mythic-text-muted mb-8 max-w-3xl mx-auto">
              Build a profitable business collecting used cooking oil. We provide training, 
              guaranteed purchase agreements, and support to help you succeed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup?type=collector"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/tools/roi-calculator"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Calculate Earnings
              </Link>
            </div>
          </div>

          {/* Opportunity Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-primary-500 mb-2">$2.5K</h3>
              <p className="text-mythic-text-muted">Avg Monthly Income</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-accent-300 mb-2">100%</h3>
              <p className="text-mythic-text-muted">Purchase Guarantee</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-green-400 mb-2">50+</h3>
              <p className="text-mythic-text-muted">Cities Operating</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-blue-400 mb-2">24/7</h3>
              <p className="text-mythic-text-muted">Support Available</p>
            </div>
          </motion.div>

          {/* Business Model */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              How the Business Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">1. Claim Territory</h3>
                <p className="text-sm text-mythic-text-muted">
                  Get exclusive collection rights in your area
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">2. Build Network</h3>
                <p className="text-sm text-mythic-text-muted">
                  Partner with local restaurants
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">3. Collect UCO</h3>
                <p className="text-sm text-mythic-text-muted">
                  Regular pickups on your schedule
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-mythic-dark-900" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">4. Get Paid</h3>
                <p className="text-sm text-mythic-text-muted">
                  Guaranteed purchase at market rates
                </p>
              </div>
            </div>
          </motion.div>

          {/* Income Potential */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-accent-300/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-8 w-8 text-mythic-accent-300" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Income Potential</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-mythic-text-primary mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-mythic-text-muted">UCO Purchase (per liter)</span>
                    <span className="font-semibold text-mythic-accent-300">$0.50 - $0.75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mythic-text-muted">Average Monthly Collection</span>
                    <span className="font-semibold text-mythic-accent-300">3,000 - 5,000L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-mythic-text-muted">Collection Bonus</span>
                    <span className="font-semibold text-green-400">+10% for quality</span>
                  </div>
                  <div className="h-px bg-mythic-primary-500/20 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-mythic-text-primary">Monthly Revenue</span>
                    <span className="font-bold text-mythic-primary-500 text-xl">$1,500 - $3,750</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-mythic-text-primary mb-4">Growth Opportunities</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-mythic-text-primary">Expand Territory</p>
                      <p className="text-sm text-mythic-text-muted">Grow your collection area</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-mythic-text-primary">Build Team</p>
                      <p className="text-sm text-mythic-text-muted">Hire drivers and scale up</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-mythic-text-primary">Premium Routes</p>
                      <p className="text-sm text-mythic-text-muted">Access to high-volume partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What We Provide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
                What We Provide
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Guaranteed Purchase</p>
                    <p className="text-sm text-mythic-text-muted">
                      We buy 100% of quality UCO at competitive rates
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Briefcase className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Complete Training</p>
                    <p className="text-sm text-mythic-text-muted">
                      Collection best practices, safety, and business operations
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Territory Protection</p>
                    <p className="text-sm text-mythic-text-muted">
                      Exclusive collection rights in your assigned area
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Partner Support</p>
                    <p className="text-sm text-mythic-text-muted">
                      Help securing restaurant partnerships
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-8 border border-mythic-accent-300/20">
              <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
                What You Need
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Collection Vehicle</p>
                    <p className="text-sm text-mythic-text-muted">
                      Van or small truck with proper storage
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Business License</p>
                    <p className="text-sm text-mythic-text-muted">
                      Local permits for waste collection
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Time Commitment</p>
                    <p className="text-sm text-mythic-text-muted">
                      Part-time or full-time flexibility
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-mythic-text-primary">Customer Service</p>
                    <p className="text-sm text-mythic-text-muted">
                      Build relationships with restaurants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Success Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-mythic-text-primary mb-12">
              Collector Success Stories
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <p className="text-mythic-text-muted italic mb-4">
                  "Started part-time while keeping my day job. Now I run a fleet of 3 trucks 
                  and employ 5 people. Genesis Reloop changed my life."
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">James Wilson</p>
                  <p className="text-sm text-mythic-primary-500">Denver, CO - 3 years</p>
                </div>
              </div>
              
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <p className="text-mythic-text-muted italic mb-4">
                  "The guaranteed purchase agreement gave me confidence to invest. I'm now 
                  collecting from 50+ restaurants and expanding monthly."
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Maria Garcia</p>
                  <p className="text-sm text-mythic-primary-500">Austin, TX - 2 years</p>
                </div>
              </div>
              
              <div className="glass rounded-xl p-6 border border-mythic-primary-500/10">
                <p className="text-mythic-text-muted italic mb-4">
                  "Love being part of the solution. Making good money while helping the 
                  environment. My kids are proud of what I do."
                </p>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Robert Chen</p>
                  <p className="text-sm text-mythic-primary-500">Portland, OR - 1 year</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Application Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              Simple Application Process
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-mythic-primary-500 mb-2">1</div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Apply Online</h3>
                <p className="text-sm text-mythic-text-muted">
                  5-minute application
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-mythic-primary-500 mb-2">2</div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Get Approved</h3>
                <p className="text-sm text-mythic-text-muted">
                  Background check & verification
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-mythic-primary-500 mb-2">3</div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Complete Training</h3>
                <p className="text-sm text-mythic-text-muted">
                  Online + hands-on training
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-mythic-primary-500 mb-2">4</div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Start Collecting</h3>
                <p className="text-sm text-mythic-text-muted">
                  Begin earning immediately
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center glass rounded-2xl p-12 border border-mythic-primary-500/20"
          >
            <h2 className="text-3xl font-bold text-mythic-text-primary mb-4">
              Ready to Build Your Business?
            </h2>
            <p className="text-xl text-mythic-text-muted mb-8 max-w-2xl mx-auto">
              Join our growing network of successful collectors. Turn waste into wealth 
              while making a real environmental impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup?type=collector"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/learn/faq#collectors"
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
