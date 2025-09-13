'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  Clock, 
  DollarSign,
  CheckCircle,
  Plus,
  ArrowLeft,
  TrendingUp
} from 'lucide-react'

export default function SupplierDashboard() {
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [volume, setVolume] = useState('')
  const [contamination, setContamination] = useState<'none' | 'medium' | 'heavy'>('none')
  
  // Mock data
  const stats = {
    totalCollections: 42,
    totalRebates: '£1,847.50',
    pendingCollections: 3,
    averageVolume: '67L'
  }
  
  const recentCollections = [
    {
      id: '1',
      date: '2024-01-15',
      volume: '75L',
      contamination: 'none',
      status: 'completed',
      rebate: '£18.75',
      driver: 'John Smith'
    },
    {
      id: '2',
      date: '2024-01-12',
      volume: '50L',
      contamination: 'medium',
      status: 'completed',
      rebate: '£10.00',
      driver: 'Sarah Jones'
    }
  ]
  
  const calculateRebate = (vol: number, cont: string) => {
    let rate = 0.25 // Base rate per liter
    if (cont === 'medium') rate *= 0.8
    if (cont === 'heavy') rate *= 0.6
    return vol * rate
  }

  return (
    <div className="min-h-screen bg-earth-obsidian">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-txt-ash hover:text-acc-cyan transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-semibold text-txt-snow">Supplier Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-8 w-8 text-acc-emerald" />
                <span className="text-2xl font-bold text-txt-snow">{stats.totalCollections}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Total Collections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-acc-emerald" />
                <span className="text-2xl font-bold text-txt-snow">{stats.totalRebates}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Total Rebates</p>
            </CardContent>
          </Card>
          
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Clock className="h-8 w-8 text-acc-cyan" />
                <span className="text-2xl font-bold text-txt-snow">{stats.pendingCollections}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Pending Collections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-earth-midnight/50 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Package className="h-8 w-8 text-acc-cyan" />
                <span className="text-2xl font-bold text-txt-snow">{stats.averageVolume}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-txt-ash">Average Volume</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Collection */}
        <Card className="bg-earth-midnight/50 border-acc-emerald/20 mb-8">
          <CardHeader>
            <CardTitle className="text-txt-snow">Schedule New Collection</CardTitle>
            <CardDescription className="text-txt-ash">
              Request a pickup for your used cooking oil
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showScheduleForm ? (
              <Button 
                onClick={() => setShowScheduleForm(true)}
                className="w-full bg-acc-emerald text-earth-obsidian hover:shadow-electric-glow"
              >
                <Plus className="mr-2 h-5 w-5" />
                Schedule Collection
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-txt-ash mb-2">
                      Volume (Liters)
                    </label>
                    <input
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-4 py-2 bg-earth-obsidian border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-txt-ash mb-2">
                      Contamination Level
                    </label>
                    <select
                      value={contamination}
                      onChange={(e) => setContamination(e.target.value as any)}
                      className="w-full px-4 py-2 bg-earth-obsidian border border-white/10 rounded-lg text-txt-snow focus:border-acc-cyan focus:outline-none focus:ring-2 focus:ring-acc-cyan/20"
                    >
                      <option value="none">None</option>
                      <option value="medium">Medium</option>
                      <option value="heavy">Heavy</option>
                    </select>
                  </div>
                </div>
                
                {volume && (
                  <div className="bg-acc-emerald/10 border border-acc-emerald/20 p-4 rounded-lg">
                    <p className="text-sm text-txt-ash">
                      Estimated Rebate:{' '}
                      <span className="font-bold text-acc-emerald">
                        £{calculateRebate(parseFloat(volume) || 0, contamination).toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => {
                      // Handle submission
                      setShowScheduleForm(false)
                      setVolume('')
                      setContamination('none')
                    }}
                    disabled={!volume}
                    className="bg-acc-emerald text-earth-obsidian hover:shadow-electric-glow"
                  >
                    Confirm Collection
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowScheduleForm(false)
                      setVolume('')
                      setContamination('none')
                    }}
                    className="border-white/20 text-txt-ash hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Collections */}
        <Card className="bg-earth-midnight/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-txt-snow">Recent Collections</CardTitle>
            <CardDescription className="text-txt-ash">
              Your collection history and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-white/20 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      collection.status === 'completed' ? 'bg-acc-emerald/20' : 'bg-acc-cyan/20'
                    }`}>
                      {collection.status === 'completed' ? 
                        <CheckCircle className="h-5 w-5 text-acc-emerald" /> : 
                        <Clock className="h-5 w-5 text-acc-cyan" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-txt-snow">
                        {collection.volume} - {collection.contamination} contamination
                      </p>
                      <p className="text-sm text-txt-ash">
                        {new Date(collection.date).toLocaleDateString()} • Driver: {collection.driver}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-acc-emerald">{collection.rebate}</p>
                    <p className="text-xs text-txt-ash capitalize">{collection.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
