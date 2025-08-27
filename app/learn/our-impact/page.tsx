import { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Leaf, 
  TrendingUp, 
  Globe, 
  Heart,
  Users,
  Droplets,
  Award,
  Calculator
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Impact: Environmental, Social & Economic Benefits | Genesis Reloop',
  description: 'Discover Genesis Reloop\'s measurable impact on the environment, communities, and economy through waste reduction, biodiesel production, and job creation.',
}

export default function OurImpactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Our Impact: Environmental, Social & Economic Benefits
            </span>
          </h1>
          
          <p className="text-xl text-mythic-text-muted text-center mb-12 max-w-3xl mx-auto">
            Every liter of used cooking oil we collect isn't just waste prevented—it's a ripple 
            effect of positive change across communities and ecosystems.
          </p>

          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 mb-8 border border-green-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="h-8 w-8 text-green-400" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Environmental Impact</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-mythic-dark-900/50 rounded-lg p-6 border border-green-500/10">
                <h3 className="text-4xl font-bold text-green-400 mb-2">84%</h3>
                <p className="font-semibold text-mythic-text-primary">CO₂ Reduction</p>
                <p className="text-mythic-text-muted text-sm mt-2">
                  Biodiesel from UCO reduces greenhouse gas emissions by 84% compared to fossil diesel
                </p>
              </div>
              
              <div className="bg-mythic-dark-900/50 rounded-lg p-6 border border-blue-500/10">
                <h3 className="text-4xl font-bold text-blue-400 mb-2">1:1</h3>
                <p className="font-semibold text-mythic-text-primary">Water Protection</p>
                <p className="text-mythic-text-muted text-sm mt-2">
                  1 liter of oil can contaminate 1 million liters of water—we prevent this
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Zero Waste to Landfill</p>
                  <p className="text-mythic-text-muted text-sm">
                    100% of collected UCO is converted into biodiesel and useful by-products like glycerin
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Circular Carbon</p>
                  <p className="text-mythic-text-muted text-sm">
                    Unlike fossil fuels, biodiesel recycles carbon already in the atmosphere
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-mythic-text-primary">Biodiversity Protection</p>
                  <p className="text-mythic-text-muted text-sm">
                    Prevents oil pollution in waterways that harm aquatic ecosystems
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Calculator Teaser */}
            <div className="mt-6 bg-mythic-dark-900/50 rounded-lg p-4 border border-mythic-primary-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-mythic-primary-500" />
                <p className="font-semibold text-mythic-primary-500">Calculate Your Impact</p>
              </div>
              <p className="text-mythic-text-muted text-sm mb-3">
                Want to see how much CO₂ your restaurant could save by recycling UCO with us?
              </p>
              <Link href="/tools/impact-calculator" className="text-mythic-accent-300 hover:text-mythic-accent-200 text-sm font-semibold">
                Try our Impact Calculator →
              </Link>
            </div>
          </motion.div>

          {/* Social Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-8 w-8 text-mythic-primary-500" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Social Impact</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center glass rounded-lg p-4">
                <Users className="h-10 w-10 text-mythic-primary-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-mythic-text-primary">500+</h3>
                <p className="text-sm text-mythic-text-muted">Green jobs created</p>
              </div>
              
              <div className="text-center glass rounded-lg p-4">
                <Droplets className="h-10 w-10 text-blue-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-mythic-text-primary">10M+</h3>
                <p className="text-sm text-mythic-text-muted">Liters of water protected</p>
              </div>
              
              <div className="text-center glass rounded-lg p-4">
                <Award className="h-10 w-10 text-mythic-accent-300 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-mythic-text-primary">1,000+</h3>
                <p className="text-sm text-mythic-text-muted">Businesses certified green</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Community Empowerment</h3>
                <ul className="space-y-2 text-mythic-text-muted text-sm">
                  <li className="flex gap-2">
                    <span className="text-mythic-primary-500">•</span>
                    <span>Training programs for UCO collection and biodiesel production</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mythic-primary-500">•</span>
                    <span>Micro-entrepreneurship opportunities in waste management</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mythic-primary-500">•</span>
                    <span>Educational workshops on circular economy principles</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Health Benefits</h3>
                <ul className="space-y-2 text-mythic-text-muted text-sm">
                  <li className="flex gap-2">
                    <span className="text-mythic-primary-500">•</span>
                    <span>Reduced air pollution from cleaner-burning biodiesel</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mythic-primary-500">•</span>
                    <span>Prevention of drain blockages and sewage overflows</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-mythic-primary-500">•</span>
                    <span>Cleaner waterways for community use</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Economic Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-accent-300/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-mythic-accent-300" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">Economic Impact</h2>
            </div>
            
            <div className="bg-mythic-dark-900/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">Revenue Streams Created</h makes>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-mythic-text-muted">Biodiesel Sales</span>
                  <span className="font-semibold text-mythic-accent-300">$2.5M annually</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mythic-text-muted">Carbon Credits</span>
                  <span className="font-semibold text-mythic-accent-300">$500K annually</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mythic-text-muted">Glycerin By-products</span>
                  <span className="font-semibold text-mythic-accent-300">$300K annually</span>
                </div>
                <div className="h-px bg-mythic-primary-500/20 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-mythic-text-primary">Total Economic Value</span>
                  <span className="font-bold text-mythic-primary-500 text-xl">$3.3M annually</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-mythic-dark-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-mythic-text-primary mb-2">For Restaurants</h4>
                <ul className="space-y-1 text-mythic-text-muted text-sm">
                  <li>✓ Free UCO collection service</li>
                  <li>✓ Green certification benefits</li>
                  <li>✓ Reduced plumbing costs</li>
                  <li>✓ Tax incentives eligibility</li>
                </ul>
              </div>
              
              <div className="bg-mythic-dark-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-mythic-text-primary mb-2">For Communities</h4>
                <ul className="space-y-1 text-mythic-text-muted text-sm">
                  <li>✓ Local job creation</li>
                  <li>✓ Energy independence</li>
                  <li>✓ Reduced waste management costs</li>
                  <li>✓ Circular economy development</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Global Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-8 border border-mythic-primary-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-8 w-8 text-mythic-primary-500" />
              <h2 className="text-2xl font-bold text-mythic-text-primary">UN Sustainable Development Goals</h2>
            </div>
            
            <p className="text-mythic-text-muted mb-6">
              Genesis Reloop directly contributes to 7 of the 17 UN SDGs:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="font-bold text-white">7</span>
                </div>
                <p className="text-xs text-mythic-text-muted">Affordable Clean Energy</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="font-bold text-white">8</span>
                </div>
                <p className="text-xs text-mythic-text-muted">Decent Work & Growth</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="font-bold text-white">11</span>
                </div>
                <p className="text-xs text-mythic-text-muted">Sustainable Cities</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="font-bold text-white">12</span>
                </div>
                <p className="text-xs text-mythic-text-muted">Responsible Production</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-green-800 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="font-bold text-white">13</span>
                </div>
                <p className="text-xs text-mythic-text-muted">Climate Action</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="font-bold text-white">14</span>
                </div>
                <p className="text-xs text-mythic-text-muted">Life Below Water</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="font-bold text-white">17</span>
                </div>
                <p className="text-xs text-mythic-text-muted">Partnerships</p>
              </div>
            </div>
          </motion.div>

          {/* Impact Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8 mb-8 bg-gradient-to-br from-mythic-primary-500/10 to-mythic-accent-300/10 border border-mythic-primary-500/20"
          >
            <h3 className="text-xl font-bold text-mythic-text-primary mb-4">Real Impact Story</h3>
            <blockquote className="italic text-mythic-text-muted mb-4">
              "Since partnering with Genesis Reloop, we've diverted 5,000 liters of cooking oil from our drains. 
              That's prevented 5 billion liters of water contamination and saved us thousands in plumbing costs. 
              Plus, knowing our waste powers local buses makes our customers proud to dine with us."
            </blockquote>
            <p className="text-sm font-semibold text-mythic-primary-500">
              — Maria Rodriguez, Owner of La Cocina Verde Restaurant Chain
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-xl text-mythic-text-primary font-semibold mb-8">
              Ready to multiply your positive impact?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/partners"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Become a Partner
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/tools/impact-calculator"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Calculate Your Impact
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
