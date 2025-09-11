'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Calendar, Clock, Users } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Audit the loop.
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Watch materials convert. See proofs anchor. Track credits mint.
        </p>
      </div>

      {/* Video Placeholder */}
      <Card className="mb-12">
        <CardContent className="p-0">
          <div className="relative h-96 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-10 w-10 text-white ml-1" />
              </div>
              <p className="text-xl text-gray-400">Loop Audit Demonstration</p>
              <p className="text-sm text-gray-500 mt-2">Loading node data...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Request Node Audit</CardTitle>
          <CardDescription>
            Community node will demonstrate live loop verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-emerald-500 mt-1" />
              <div>
                <p className="font-semibold">30 Minutes</p>
                <p className="text-sm text-gray-400">Full loop audit walkthrough</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-emerald-500 mt-1" />
              <div>
                <p className="font-semibold">Node-to-Node</p>
                <p className="text-sm text-gray-400">Direct verification session</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-emerald-500 mt-1" />
              <div>
                <p className="font-semibold">Node Hours</p>
                <p className="text-sm text-gray-400">Schedule with active nodes</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Node Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Your node identifier"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Audit Focus</label>
              <select className="w-full px-3 py-2 rounded-md border border-gray-700 bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                <option>Select audit type</option>
                <option>Supply Node Operations</option>
                <option>Route Node Verification</option>
                <option>Convert Node Process</option>
                <option>Credit Minting</option>
                <option>DAO Voting</option>
              </select>
            </div>
            
            <Button className="w-full" size="lg">
              Request Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
