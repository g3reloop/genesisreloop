'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'
import { WalletConnect } from '@/components/Web3/WalletConnect'
import {
  Recycle,
  LayoutDashboard,
  Package,
  MapPin,
  Leaf,
  Shield,
  Star,
  Users,
  Menu,
  X,
  ChevronRight,
  Activity,
  TrendingUp
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Marketplace', href: '/marketplace', icon: Package },
  { name: 'Collections', href: '/collection', icon: MapPin },
  { name: 'Carbon Credits', href: '/carbon', icon: Leaf },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Roadmap', href: '/roadmap', icon: TrendingUp },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-mythic-dark-50 to-mythic-dark-100 dark:from-mythic-dark-950 dark:to-mythic-dark-900">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-mythic-dark-900 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-mythic-dark-200 dark:border-mythic-dark-800">
            <div className="flex items-center space-x-2">
              <Recycle className="w-8 h-8 text-mythic-secondary-500" />
              <span className="text-xl font-bold text-gradient">ReLoop</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all",
                    isActive
                      ? "bg-mythic-primary-500 text-white"
                      : "hover:bg-mythic-dark-100 dark:hover:bg-mythic-dark-800"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block">
        <div className="h-full bg-white/80 dark:bg-mythic-dark-900/80 backdrop-blur-xl border-r border-mythic-dark-200 dark:border-mythic-dark-800">
          <div className="flex items-center space-x-2 p-6 border-b border-mythic-dark-200 dark:border-mythic-dark-800">
            <Recycle className="w-10 h-10 text-mythic-secondary-500 animate-rotate-slow" />
            <div>
              <h1 className="text-2xl font-bold text-gradient">ReLoop</h1>
              <p className="text-xs text-mythic-dark-500 dark:text-mythic-dark-400">Circular Economy Platform</p>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-mythic-primary-500 to-mythic-primary-600 text-white shadow-lg"
                      : "hover:bg-mythic-dark-100 dark:hover:bg-mythic-dark-800"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "animate-pulse"
                  )} />
                  <span className="font-medium flex-1">{item.name}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform opacity-0 group-hover:opacity-100",
                    isActive && "opacity-100"
                  )} />
                </Link>
              )
            })}
          </nav>

          {/* AI Agents Status */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-mythic-dark-200 dark:border-mythic-dark-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">AI Agents</span>
              <Activity className="w-4 h-4 text-mythic-secondary-500 animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-mythic-dark-100 dark:bg-mythic-dark-800 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-mythic-secondary-500 to-mythic-primary-500 animate-flow" style={{ width: '27.78%' }} />
              </div>
              <span className="text-xs text-mythic-dark-500 dark:text-mythic-dark-400">5/18 Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-mythic-dark-900/80 backdrop-blur-xl border-b border-mythic-dark-200 dark:border-mythic-dark-800">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-mythic-secondary-100 dark:bg-mythic-secondary-900/20 rounded-full">
                <div className="w-2 h-2 bg-mythic-secondary-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-mythic-secondary-700 dark:text-mythic-secondary-400">System Active</span>
              </div>
              
              <WalletConnect />
              
              <Button variant="ghost" size="icon">
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <div className="toroidal-bg min-h-[calc(100vh-8rem)] rounded-2xl p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
