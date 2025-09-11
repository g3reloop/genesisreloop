"use client"
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/loops/waste-energy', label: 'Loops' },
    { href: '/agents', label: 'AI Agents' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/governance', label: 'DGO' },
    { href: '/compliance', label: 'CAT' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f14]/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00D084] to-[#28F2E4]" />
          <span className="text-xl font-bold text-[#E9F4FF]">Genesis ReLoop</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#A3AAB8] hover:text-[#28F2E4] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0b0f14]/95 backdrop-blur-lg">
          <nav className="flex flex-col space-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#A3AAB8] hover:text-[#28F2E4] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
