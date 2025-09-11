'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Users,
  MessageCircle,
  Calendar,
  Trophy,
  Heart,
  Globe,
  Sparkles,
  Github,
  Twitter,
  Youtube,
  ExternalLink
} from 'lucide-react'

export default function CommunityPage() {
  const upcomingEvents = [
    {
      date: 'Dec 15',
      title: 'Monthly Community Call',
      time: '2:00 PM UTC',
      type: 'Virtual',
      description: 'DAO updates, Q&A, and community spotlight'
    },
    {
      date: 'Dec 20',
      title: 'Denver Facility Opening',
      time: '10:00 AM MST',
      type: 'In-Person',
      description: 'Tour our newest biodiesel production facility'
    },
    {
      date: 'Jan 5',
      title: 'Web3 & Circular Economy Workshop',
      time: '4:00 PM UTC',
      type: 'Virtual',
      description: 'Learn how blockchain enables sustainable business'
    }
  ]

  const topContributors = [
    { name: 'Sarah Chen', contributions: 47, specialty: 'Governance' },
    { name: 'Miguel Rodriguez', contributions: 42, specialty: 'Technical' },
    { name: 'Emma Watson', contributions: 38, specialty: 'Community' },
    { name: 'James Park', contributions: 35, specialty: 'Operations' },
    { name: 'Lisa Johnson', contributions: 31, specialty: 'Marketing' }
  ]

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
                Join Our Community
              </span>
            </h1>
            
            <p className="text-xl text-mythic-text-muted mb-8 max-w-3xl mx-auto">
              Connect with thousands of changemakers building the circular economy. 
              Share ideas, learn together, and make a real impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://discord.gg/genesisreloop"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Join Discord
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#events"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                View Events
              </Link>
            </div>
          </div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-primary-500 mb-2">12,500+</h3>
              <p className="text-mythic-text-muted">Active Members</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-mythic-accent-300 mb-2">45</h3>
              <p className="text-mythic-text-muted">Countries</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-green-400 mb-2">24/7</h3>
              <p className="text-mythic-text-muted">Support</p>
            </div>
            <div className="text-center glass rounded-lg p-6">
              <h3 className="text-3xl font-bold text-blue-400 mb-2">1,200+</h3>
              <p className="text-mythic-text-muted">Monthly Active</p>
            </div>
          </motion.div>

          {/* Community Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              Connect With Us
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="https://discord.gg/genesisreloop"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-mythic-dark-900 rounded-lg p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-8 w-8 text-mythic-primary-500" />
                  <h3 className="font-semibold text-mythic-text-primary group-hover:text-mythic-primary-500 transition-colors">
                    Discord
                  </h3>
                </div>
                <p className="text-sm text-mythic-text-muted mb-3">
                  Our main hub for discussions, support, and collaboration
                </p>
                <div className="flex items-center gap-2 text-mythic-primary-500 text-sm font-semibold">
                  Join 8,500+ members
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
              
              <a
                href="https://twitter.com/genesisreloop"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-mythic-dark-900 rounded-lg p-6 border border-mythic-accent-300/10 hover:border-mythic-accent-300/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Twitter className="h-8 w-8 text-mythic-accent-300" />
                  <h3 className="font-semibold text-mythic-text-primary group-hover:text-mythic-accent-300 transition-colors">
                    Twitter/X
                  </h3>
                </div>
                <p className="text-sm text-mythic-text-muted mb-3">
                  Latest updates, news, and circular economy insights
                </p>
                <div className="flex items-center gap-2 text-mythic-accent-300 text-sm font-semibold">
                  Follow for updates
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
              
              <a
                href="https://github.com/genesisreloop"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-mythic-dark-900 rounded-lg p-6 border border-green-500/10 hover:border-green-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Github className="h-8 w-8 text-green-400" />
                  <h3 className="font-semibold text-mythic-text-primary group-hover:text-green-400 transition-colors">
                    GitHub
                  </h3>
                </div>
                <p className="text-sm text-mythic-text-muted mb-3">
                  Open source code, documentation, and contributions
                </p>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  View repositories
                  <ExternalLink className="h-4 w-4" />
                </div>
              </a>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
            id="events"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6">
              Upcoming Events
            </h2>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="glass rounded-lg p-6 border border-mythic-primary-500/10 hover:border-mythic-primary-500/20 transition-all duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-lg flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-mythic-dark-900" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-mythic-text-primary mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-mythic-text-muted mb-2">
                          {event.description}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-mythic-primary-500">
                            {event.date} • {event.time}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            event.type === 'Virtual'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-mythic-primary-500/20 text-mythic-primary-500 rounded-lg hover:bg-mythic-primary-500/30 transition-all duration-200 font-semibold">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link
                href="/community/events"
                className="text-mythic-primary-500 hover:text-mythic-primary-400 font-semibold"
              >
                View All Events →
              </Link>
            </div>
          </motion.div>

          {/* Community Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <div className="glass rounded-2xl p-8 border border-mythic-primary-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-8 w-8 text-yellow-400" />
                <h2 className="text-2xl font-bold text-mythic-text-primary">Top Contributors</h2>
              </div>
              
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 rounded-full flex items-center justify-center">
                        <span className="font-bold text-mythic-dark-900">
                          {contributor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-mythic-text-primary">{contributor.name}</p>
                        <p className="text-sm text-mythic-text-muted">{contributor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-mythic-accent-300">{contributor.contributions}</p>
                      <p className="text-xs text-mythic-text-muted">contributions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass rounded-2xl p-8 border border-mythic-accent-300/20">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-8 w-8 text-red-400" />
                <h2 className="text-2xl font-bold text-mythic-text-primary">Community Values</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-mythic-text-primary mb-1">Innovation First</h3>
                    <p className="text-sm text-mythic-text-muted">
                      We embrace new ideas and technologies to solve old problems
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Globe className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-mythic-text-primary mb-1">Global Impact</h3>
                    <p className="text-sm text-mythic-text-muted">
                      Think globally, act locally - every action matters
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Users className="h-5 w-5 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-mythic-text-primary mb-1">Inclusive Growth</h3>
                    <p className="text-sm text-mythic-text-muted">
                      Everyone has a role in building the circular economy
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Heart className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-mythic-text-primary mb-1">Radical Transparency</h3>
                    <p className="text-sm text-mythic-text-muted">
                      Open books, open code, open community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Get Involved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8 mb-16 border border-mythic-primary-500/20"
          >
            <h2 className="text-2xl font-bold text-mythic-text-primary mb-6 text-center">
              Ways to Get Involved
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500/20 to-mythic-accent-300/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-8 w-8 text-mythic-primary-500" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Join Discussions</h3>
                <p className="text-sm text-mythic-text-muted">
                  Share ideas and learn from others in Discord
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500/20 to-mythic-accent-300/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Github className="h-8 w-8 text-mythic-accent-300" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Contribute Code</h3>
                <p className="text-sm text-mythic-text-muted">
                  Help build the platform on GitHub
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500/20 to-mythic-accent-300/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Host Events</h3>
                <p className="text-sm text-mythic-text-muted">
                  Organize local meetups and workshops
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mythic-primary-500/20 to-mythic-accent-300/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="font-semibold text-mythic-text-primary mb-2">Spread the Word</h3>
                <p className="text-sm text-mythic-text-muted">
                  Share our mission with your network
                </p>
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
              Be Part of Something Bigger
            </h2>
            <p className="text-xl text-mythic-text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of changemakers building a sustainable future. 
              Your voice, your ideas, your impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://discord.gg/genesisreloop"
                className="px-8 py-4 bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Join Discord Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-mythic-dark-900 text-mythic-text-primary font-semibold rounded-lg border border-mythic-primary-500/20 hover:bg-mythic-dark-800 transition-all duration-200"
              >
                Become a Member
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
