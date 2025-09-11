'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Home, Package, Bot, BarChart3, LogIn, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/lib/cn'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/marketplace', label: 'Marketplace', icon: Package },
  { href: '/agents', label: 'AI Agents', icon: Bot },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  const handleLogin = () => {
    // Simulate authentication - in production use proper auth service
    setIsAuthenticated(true)
    setUser({ name: 'Genesis User', email: 'user@genesis.protocol' })
    setIsOpen(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="relative w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block gen-ring backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gen-torus-border flex items-center justify-center">
                <span className="text-acc-emerald font-bold">GR</span>
              </div>
              <span className="font-serif text-xl text-txt-snow">Genesis ReLoop</span>
            </Link>

            {/* Nav Items */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-txt-ash hover:text-txt-snow hover:bg-white/5 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="text-txt-ash hover:text-txt-snow">
                      <User className="w-4 h-4 mr-2" />
                      {user?.name}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-white/20 text-txt-ash hover:text-txt-snow"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogin}
                  size="sm"
                  className="bg-acc-emerald text-earth-obsidian hover:bg-acc-emerald/90"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="gen-ring backdrop-blur-sm border-b border-white/10 px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gen-torus-border flex items-center justify-center">
                <span className="text-acc-emerald font-bold text-sm">GR</span>
              </div>
              <span className="font-serif text-lg text-txt-snow">Genesis</span>
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-txt-ash hover:text-txt-snow hover:bg-white/5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "absolute top-16 inset-x-0 gen-ring backdrop-blur-lg border-b border-white/10 transition-all duration-300",
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-txt-ash hover:text-txt-snow hover:bg-white/5 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            <div className="border-t border-white/10 pt-3">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-txt-ash hover:text-txt-snow hover:bg-white/5"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user?.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-txt-ash hover:text-txt-snow hover:bg-white/5 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogin()
                    setIsOpen(false)
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg bg-acc-emerald text-earth-obsidian hover:bg-acc-emerald/90 font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
