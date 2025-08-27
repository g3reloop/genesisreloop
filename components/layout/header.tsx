'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { WalletConnect } from '@/components/Web3/WalletConnect'
import { GenesisLogo } from '@/components/ui/genesis-logo'
import {
  Menu,
  X,
  ChevronDown,
  Recycle,
  Coins,
  Vote,
  FileText,
  Activity
} from 'lucide-react'

const navigation = [
  { 
    name: 'Loops', 
    href: '/loops',
    dropdown: [
      { name: 'Loop Overview', href: '/loops' },
      { name: 'Heat Cascade Planner', href: '/heat-cascade' },
      { name: 'Secondary Products', href: '/secondary' }
    ]
  },
  { 
    name: 'Trade', 
    href: '/marketplace',
    dropdown: [
      { name: 'GIRM Credits', href: '/girm' },
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'Secondary Products', href: '/secondary' }
    ]
  },
  { 
    name: 'Operate', 
    href: '#',
    dropdown: [
      { name: 'Operator Console', href: '/ops' },
      { name: 'Collection Routes', href: '/micro-collection' },
      { name: 'Compliance', href: '/compliance' },
      { name: 'Processors', href: '/processors' }
    ]
  },
  { 
    name: 'Build', 
    href: '#',
    dropdown: [
      { name: 'Request RFQ', href: '/rfq' },
      { name: 'Processor Directory', href: '/processors' },
      { name: 'Join Network', href: '/join' }
    ]
  },
  { name: 'DAO', href: '/dao' },
  { name: 'Treasury', href: '/treasury' },
  { name: 'Docs', href: '/docs' },
  { name: 'Contact', href: '/contact' }
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-black/90 backdrop-blur-xl border-b border-mythic-primary-500/10" 
        : "bg-transparent"
    )}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <GenesisLogo size="md" className="transition-transform group-hover:scale-110" />
              <span className="text-2xl font-bold bg-gradient-to-r from-mythic-primary-500 to-mythic-accent-300 bg-clip-text text-transparent">
                Genesis Reloop
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1",
                      pathname.startsWith(item.dropdown[0].href)
                        ? "text-mythic-primary-500"
                        : "text-mythic-text-muted hover:text-mythic-text-primary hover:bg-mythic-primary-500/10"
                    )}
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1",
                      pathname === item.href
                        ? "text-mythic-primary-500"
                        : "text-mythic-text-muted hover:text-mythic-text-primary hover:bg-mythic-primary-500/10"
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-mythic-dark-900 border border-mythic-primary-500/20 shadow-xl overflow-hidden glass">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-mythic-text-muted hover:bg-mythic-primary-500/10 hover:text-mythic-text-primary transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Links */}
            <Link href="/girm" className="hidden sm:flex items-center gap-1 p-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors">
              <Coins className="h-4 w-4" />
              <span className="text-sm">GIRM</span>
            </Link>
            <Link href="/dao" className="hidden sm:flex items-center gap-1 p-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors">
              <Vote className="h-4 w-4" />
              <span className="text-sm">DAO</span>
            </Link>
            <Link href="/compliance" className="hidden sm:flex items-center gap-1 p-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors">
              <FileText className="h-4 w-4" />
              <span className="text-sm">WTN</span>
            </Link>
            <Link href="/agents" className="hidden sm:flex items-center gap-1 p-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Agents</span>
            </Link>

            {/* Wallet Connect */}
            <WalletConnect />

            {/* Mobile Menu */}
            <button
              className="lg:hidden p-2 text-mythic-text-muted hover:text-mythic-text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-mythic-primary-500/10">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.dropdown ? item.dropdown[0].href : item.href}
                  className={cn(
                    "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                    pathname === item.href
                      ? "text-mythic-primary-500 bg-mythic-primary-500/10"
                      : "text-mythic-text-muted hover:text-mythic-text-primary hover:bg-mythic-primary-500/10"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.dropdown && (
                  <div className="ml-4 space-y-1 mt-1">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-mythic-text-muted hover:text-mythic-text-primary rounded-lg hover:bg-mythic-primary-500/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
