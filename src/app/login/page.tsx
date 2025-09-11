'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      router.push('/') // Redirect to home after login
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8 relative">
      <Card className="w-full max-w-md bg-mythic-dark-900/50 border-mythic-primary-500/20">
        <CardHeader className="space-y-2 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
            Genesis Reloop Login
          </CardTitle>
          <CardDescription className="text-center text-mythic-text-muted text-sm sm:text-base">
            Enter your credentials to access the platform
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-4 sm:px-6">
            {error && (
              <Alert variant="destructive" className="text-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-mythic-text-muted text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:ring-mythic-primary-500 text-sm sm:text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-mythic-text-muted text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--ink-strong)] placeholder:text-[var(--placeholder)] focus:border-mythic-primary-500 focus:ring-mythic-primary-500 text-sm sm:text-base"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 px-4 sm:px-6">
            <Button 
              type="submit" 
              className="w-full bg-mythic-primary-500 hover:bg-mythic-primary-600 text-black font-semibold text-sm sm:text-base py-2 sm:py-2.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
            
            <div className="text-sm text-mythic-text-muted text-center">
              <p className="font-semibold mb-2 text-mythic-text-primary text-sm sm:text-base">Demo Credentials:</p>
              <div className="space-y-1 text-[11px] sm:text-xs">
                <p className="break-all"><strong className="text-mythic-primary-500">Admin:</strong> admin@genesisreloop.com / password</p>
                <p className="break-all"><strong className="text-mythic-primary-500">Supplier:</strong> supplier@example.com / password</p>
                <p className="break-all"><strong className="text-mythic-primary-500">Collector:</strong> collector@example.com / password</p>
                <p className="break-all"><strong className="text-mythic-primary-500">Processor:</strong> processor@example.com / password</p>
                <p className="break-all"><strong className="text-mythic-primary-500">Buyer:</strong> buyer@example.com / password</p>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
