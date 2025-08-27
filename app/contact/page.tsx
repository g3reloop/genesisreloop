'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Globe, MessageSquare, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Connect to the DAO.
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Deploy nodes. Request audits. Join community governance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Node Deployment Request</CardTitle>
              <CardDescription>
                Submit details. Community node will verify within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Node Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Community Kitchen Node"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Node Details</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  rows={4}
                  placeholder="Material types. Volumes. Loop preference (SRL/CRL)."
                />
              </div>
              
              <Button className="w-full" size="lg">
                Submit to DAO
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Nodes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:ops@genesisreloop.com" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    ops@genesisreloop.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-400">+44 20 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-sm text-gray-400">
                    123 Sustainability Street<br />
                    London, EC1A 1BB<br />
                    United Kingdom
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-gray-400">
                    Mon-Fri: 9:00 AM - 6:00 PM GMT<br />
                    Sat-Sun: Closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link 
                href="mailto:ops@genesisreloop.com" 
                className="w-full"
              >
                <Button className="w-full justify-center" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              </Link>
              
              <Link 
                href="https://calendar.app.google/7Xg3uNPpATPRzg5Y7" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full justify-center bg-mythic-primary-500 hover:bg-mythic-primary-600 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a 30-min intro call
                </Button>
              </Link>
              
              <div className="pt-4 space-y-2">
                <Link href="/marketplace" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    View Marketplace
                  </Button>
                </Link>
                <Link href="https://discord.gg/genesisreloop" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Join DAO Discord
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
