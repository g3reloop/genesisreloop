'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Truck,
  Factory,
  Coins,
  Users,
  ArrowRight,
  CheckCircle,
  Shield,
  Building2,
  Recycle,
  ChartLine
} from 'lucide-react'

type UserRole = 'collector' | 'operator' | 'investor' | 'supplier'

interface RoleInfo {
  id: UserRole
  title: string
  description: string
  icon: any
  benefits: string[]
  color: string
  requirements: string[]
}

const roles: RoleInfo[] = [
  {
    id: 'supplier',
    title: 'Waste Supplier',
    description: 'Restaurants, hotels, and food businesses with waste to convert',
    icon: Building2,
    benefits: [
      'Turn waste into revenue',
      'Earn GIRM credits monthly',
      'Free collection service',
      'Compliance documentation'
    ],
    requirements: [
      'Monthly waste volume > 100kg',
      'Business registration',
      'Waste carrier consent'
    ],
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 'collector',
    title: 'Collection Partner',
    description: 'Local logistics providers collecting waste for processing',
    icon: Truck,
    benefits: [
      'Fair-pay guaranteed routes',
      'Real-time route optimization',
      'Instant payment settlement',
      'Fuel cost offsets'
    ],
    requirements: [
      'Commercial vehicle',
      'Waste carrier license',
      'Insurance coverage'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'operator',
    title: 'Loop Operator',
    description: 'Run biogas or biodiesel processing modules',
    icon: Factory,
    benefits: [
      'Guaranteed feedstock supply',
      'Technical support included',
      'Revenue share model',
      'Equipment financing'
    ],
    requirements: [
      'Site with utilities',
      'Environmental permits',
      'Technical capability'
    ],
    color: 'from-mythic-primary-500 to-mythic-accent-300'
  },
  {
    id: 'investor',
    title: 'Impact Investor',
    description: 'Fund infrastructure and earn from community loops',
    icon: ChartLine,
    benefits: [
      'Direct infrastructure ownership',
      'Transparent impact metrics',
      'DAO governance rights',
      'Verified carbon credits'
    ],
    requirements: [
      'KYC verification',
      'Accredited investor status',
      'Minimum commitment'
    ],
    color: 'from-purple-500 to-pink-500'
  }
]

export default function JoinPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const router = useRouter()

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (!selectedRole) return
    
    // Route based on selected role
    switch(selectedRole) {
      case 'supplier':
        router.push('/onboard-supplier')
        break
      case 'collector':
        router.push('/join/collector')
        break
      case 'operator':
        router.push('/join/operator')
        break
      case 'investor':
        router.push('/join/investor')
        break
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-black via-mythic-dark-900 to-black">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
              Join Genesis Reloop
            </span>
          </h1>
          <p className="text-xl text-mythic-text-muted max-w-3xl mx-auto">
            Choose your role in the circular economy. Turn waste into community wealth.
          </p>
        </motion.div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {roles.map((role, index) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border-2 cursor-pointer transition-all duration-300 h-full bg-mythic-dark-900 ${
                    isSelected 
                      ? 'border-mythic-primary-500 bg-mythic-primary-500/10' 
                      : 'border-mythic-primary-500/20 hover:border-mythic-primary-500/40'
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${role.color} bg-opacity-20`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-mythic-primary-500" />
                      )}
                    </div>
                    <CardTitle className="text-2xl mt-4 text-mythic-text-primary">{role.title}</CardTitle>
                    <CardDescription className="text-mythic-text-muted">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Benefits */}
                    <div>
                      <h4 className="text-sm font-semibold text-mythic-text-primary mb-2">
                        Benefits
                      </h4>
                      <ul className="space-y-1">
                        {role.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2 text-sm text-mythic-text-muted">
                            <CheckCircle className="h-4 w-4 text-mythic-primary-500 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-sm font-semibold text-mythic-text-primary mb-2">
                        Requirements
                      </h4>
                      <ul className="space-y-1">
                        {role.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-sm text-mythic-text-muted">
                            <Shield className="h-4 w-4 text-mythic-accent-300 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            size="lg"
            disabled={!selectedRole}
            onClick={handleContinue}
            className="bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 text-mythic-dark-900 px-8 py-6 text-lg font-semibold hover:shadow-lg hover:shadow-mythic-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : '...'}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-xl p-8 border border-mythic-primary-500/20 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-mythic-text-primary mb-4">
              Join a Growing Network
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-mythic-primary-500">247</div>
                <div className="text-sm text-mythic-text-muted">Active Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-mythic-accent-300">850K kg</div>
                <div className="text-sm text-mythic-text-muted">Waste Diverted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-flow-credits">15K</div>
                <div className="text-sm text-mythic-text-muted">Credits Issued</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-mythic-primary-500">98.5%</div>
                <div className="text-sm text-mythic-text-muted">Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center text-sm text-mythic-text-muted"
        >
          <Shield className="h-4 w-4 inline-block mr-2 text-mythic-primary-500" />
          All members undergo KYC verification. Your data is encrypted and never sold.
        </motion.div>
      </div>
    </div>
  )
}
