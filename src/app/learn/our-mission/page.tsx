'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Leaf, Recycle, TrendingDown } from 'lucide-react'

export default function OurMissionPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Our Mission: Powering the Circular Economy
            </span>
          </h1>

          <div className="glass rounded-2xl p-8 mb-12 border border-mythic-primary-500/20">
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-4 flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-red-500" />
              The Problem: A Linear World of Waste
            </h2>
            
            <p className="text-mythic-text-muted mb-4">
              Our modern economy operates on a linear model: <em>take, make, dispose</em>. This system generates 
              immense value but at a staggering environmental cost. We extract finite resources, use them once, 
              and discard them in landfills, leading to overflowing waste sites and harmful greenhouse gas (GHG) 
              emissions. This is not sustainable.
            </p>

            <blockquote className="border-l-4 border-mythic-primary-500 pl-4 italic text-mythic-text-muted">
              The world generates over 2 billion tonnes of municipal solid waste annually, with at least 
              33 percent of that not managed in an environmentally safe manner.
            </blockquote>
          </div>

          <div className="glass rounded-2xl p-8 mb-12 border border-mythic-primary-500/20">
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-4 flex items-center gap-3">
              <Recycle className="h-8 w-8 text-mythic-primary-500" />
              The Solution: A Circular, Regenerative Future
            </h2>
            
            <p className="text-mythic-text-muted mb-4">
              Genesis Reloop was founded to break this cycle. We believe in a <strong className="text-mythic-primary-500">circular economy</strong>—a 
              system where waste is not an endpoint, but a beginning. By transforming discarded materials into 
              valuable resources, we can create a regenerative loop that benefits both the economy and the planet.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 mb-12 border border-mythic-accent-300/20">
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-4 flex items-center gap-3">
              <Leaf className="h-8 w-8 text-mythic-accent-300" />
              Our Impact: From Waste Oil to Clean Fuel
            </h2>
            
            <p className="text-mythic-text-muted mb-6">
              Our initial focus is on one of the world's most problematic waste streams: 
              <strong className="text-mythic-accent-300"> Used Cooking Oil (UCO)</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30">
                <h3 className="font-semibold text-red-400 mb-2">The Challenge:</h3>
                <p className="text-mythic-text-muted">
                  Improperly disposed UCO clogs drainage systems and contaminates water sources.
                </p>
              </div>
              
              <div className="bg-green-900/20 rounded-lg p-6 border border-green-500/30">
                <h3 className="font-semibold text-green-400 mb-2">The Opportunity:</h3>
                <p className="text-mythic-text-muted">
                  UCO is a rich feedstock for creating high-quality biodiesel.
                </p>
              </div>
            </div>

            <p className="text-mythic-text-muted mb-4">
              By converting UCO into biodiesel, we achieve a powerful dual impact:
            </p>

            <ol className="list-decimal list-inside space-y-3 mb-6">
              <li className="text-mythic-text-muted">
                <strong className="text-mythic-text-primary">Waste Reduction:</strong> We divert a harmful 
                pollutant from our environment.
              </li>
              <li className="text-mythic-text-muted">
                <strong className="text-mythic-text-primary">GHG Reduction:</strong> Biodiesel produced from 
                UCO reduces greenhouse gas emissions by up to <span className="text-mythic-accent-300 font-bold text-2xl">88%</span> compared 
                to conventional diesel.
              </li>
            </ol>

            <p className="text-mythic-text-muted">
              Crucially, this process avoids the contentious 'food-vs-fuel' debate, as it uses a 
              post-consumer waste product rather than agricultural crops.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="text-xl text-mythic-text-primary font-semibold mb-8">
              Join us in building a sustainable future, one loop at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn/our-process"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Learn Our Process
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/join"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Get Involved
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
