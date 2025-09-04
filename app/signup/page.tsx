'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, Truck, Factory, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

type UserRole = 'supplier' | 'processor' | 'buyer'

interface RoleOption {
  value: UserRole
  label: string
  description: string
  icon: any
}

const roleOptions: RoleOption[] = [
  {
    value: 'supplier',
    label: 'Supplier',
    description: 'Supply waste materials',
    icon: Building2,
  },
  {
    value: 'processor',
    label: 'Processor',
    description: 'Process waste into products',
    icon: Factory,
  },
  {
    value: 'buyer',
    label: 'Buyer',
    description: 'Purchase processed products',
    icon: ShoppingCart,
  },
]

const businessTypes = {
  supplier: ['Restaurant', 'Hotel', 'Food Manufacturer', 'Supermarket', 'Other Food Business'],
  processor: ['Biogas Plant', 'Biodiesel Processor', 'Composting Facility', 'Other Processing'],
  buyer: ['Transport Company', 'Energy Provider', 'Agriculture', 'Other Buyer'],
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [businessType, setBusinessType] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!role) {
      setError('Please select a role')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
            role: role,
          }
        }
      })

      if (signUpError) throw signUpError

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            business_name: businessName,
            business_type: businessType,
            role: role,
            phone: phone || null,
          })

        if (profileError) throw profileError

        // Create onboarding state
        const { error: onboardingError } = await supabase
          .from('onboarding_states')
          .insert({
            user_id: authData.user.id,
            step: 1,
            data: {
              role,
              business_name: businessName,
              business_type: businessType,
              email,
              phone
            }
          })

        if (onboardingError) throw onboardingError

        // Redirect to onboarding
        router.push('/onboarding')
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const prefillRole = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('role') as UserRole | null
    : null

  if (prefillRole && !role && roleOptions.find(r => r.value === prefillRole)) {
    setRole(prefillRole)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 relative">
      <Card className="w-full max-w-2xl bg-mythic-dark-900/50 border-mythic-primary-500/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
            Join Genesis Reloop
          </CardTitle>
          <CardDescription className="text-center text-mythic-text-muted">
            Create your account and start your circular economy journey
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-mythic-text-muted">
                Select your role <span className="text-red-500">*</span>
              </Label>
              <Select value={role} onValueChange={(value: UserRole) => {
                setRole(value)
                setBusinessType('') // Reset business type when role changes
              }}>
                <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)]">
                  <SelectValue placeholder="Choose your role in the network" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                          <span className="text-mythic-text-muted text-sm">- {option.description}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-mythic-text-muted">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                disabled={loading}
                className="bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)]"
              />
            </div>

            {/* Business Type - conditional on role */}
            {role && (
              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-mythic-text-muted">
                  Business Type <span className="text-red-500">*</span>
                </Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="bg-[var(--field-bg)] border-[var(--field-border)]">
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes[role].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-mythic-text-muted">
                Business Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)]"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-mythic-text-muted">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-mythic-text-muted">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)]"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-mythic-text-muted">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)]"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black font-semibold"
              disabled={loading || !role || !businessType}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <div className="text-sm text-mythic-text-muted text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-mythic-primary-500 hover:text-mythic-primary-400">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
