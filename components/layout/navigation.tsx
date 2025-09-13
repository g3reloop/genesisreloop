"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { path: '/marketplace', title: 'Marketplace' },
  { path: '/agents', title: 'Agents' },
  { path: '/docs', title: 'Docs' },
  { path: '/girm', title: 'GIRM' },
  { path: '/contact', title: 'Contact' },
  { path: '/join', title: 'Join the Network' },
  { path: '/girm-dao', title: 'GIRM DAO' },
  { path: '/wtn', title: 'WTN' },
  { path: '/login', title: 'Login' }
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-earth-obsidian/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif text-txt-snow">Genesis Reloop</span>
          </Link>
          
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-acc-emerald",
                      pathname === item.path 
                        ? "text-acc-emerald" 
                        : "text-txt-ash"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-txt-snow">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
