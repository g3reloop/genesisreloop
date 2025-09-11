'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Building2, Truck, Factory, Users } from 'lucide-react'

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = [
    {
      id: 'supplier',
      title: 'Supply Node',
      description: 'Deploy materials. Mint proof anchors. Join SRL loops.',
      icon: Building2,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'collector',
      title: 'Route Node',
      description: 'Verify custody chains. Move stabilized batches.',
      icon: Truck,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'processor',
      title: 'Convert Node',
      description: 'Transform materials. Deploy products. Mint credits.',
      icon: Factory,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'community',
      title: 'Audit Node',
      description: 'Verify GIRM proofs. Participate in DAO. Trade credits.',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Deploy a community node.
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Select your node type. Anchor your materials. Route through stabilized loops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedRole === role.id ? 'ring-2 ring-emerald-500' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${role.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {selectedRole === role.id && (
                    <div className="text-emerald-500 text-sm font-medium">Selected</div>
                  )}
                </div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {selectedRole && (
        <Card>
          <CardHeader>
            <CardTitle>Deploy Node</CardTitle>
            <CardDescription>
              Connect wallet. Sign DAO agreement. Deploy {roles.find(r => r.id === selectedRole)?.title}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              Connect & Deploy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
