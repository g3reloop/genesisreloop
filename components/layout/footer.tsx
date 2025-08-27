import Link from 'next/link'
import { GenesisLogo } from '@/components/ui/genesis-logo'
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Recycle
} from 'lucide-react'

const footerLinks = {
  loops: [
    { name: 'Loop Overview', href: '/loops' },
    { name: 'Heat Cascade', href: '/heat-cascade' },
    { name: 'Secondary Products', href: '/secondary' },
    { name: 'Processors', href: '/processors' },
    { name: 'Micro-Collection', href: '/micro-collection' }
  ],
  trade: [
    { name: 'GIRM Credits', href: '/girm' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Secondary Products', href: '/secondary' },
    { name: 'Compliance', href: '/compliance' }
  ],
  build: [
    { name: 'Request RFQ', href: '/rfq' },
    { name: 'Join Network', href: '/register' },
    { name: 'Operator Console', href: '/ops' },
    { name: 'Documentation', href: '/docs' }
  ],
  governance: [
    { name: 'DAO Overview', href: '/dao' },
    { name: 'Submit Proposal', href: '/dao#proposals' },
    { name: 'Treasury', href: '/dao#treasury' },
    { name: 'About', href: '/about' }
  ]
}

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/genesisreloop' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/genesisreloop' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/genesisreloop' },
  { name: 'Discord', icon: MessageCircle, href: 'https://discord.gg/genesisreloop' }
]

export function Footer() {
  return (
    <footer id="footer-navigation" className="bg-black border-t border-mythic-primary-500/10" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-3 mb-4">
              <GenesisLogo size="lg" />
              <span className="text-2xl font-bold text-mythic-text-primary">Genesis Reloop</span>
            </Link>
            <p className="text-mythic-text-muted mb-4 max-w-sm">
              Waste to Fuel. Fuel to Food. Loops that Pay Communities.
            </p>
            <p className="text-sm text-mythic-text-muted mb-4">
              Local waste becomes local fuel. No greenwash. No ESG theatre. 
              Just operational proof.
            </p>
            <div className="space-y-2 text-sm text-mythic-text-muted">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-mythic-primary-500" />
                <span>Brighton, United Kingdom</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-mythic-primary-500" />
                <a href="mailto:ops@genesisreloop.com" className="hover:text-mythic-text-primary transition-colors">
                  ops@genesisreloop.com
                </a>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-mythic-text-primary font-semibold mb-4">Loops</h3>
            <ul className="space-y-2">
              {footerLinks.loops.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-mythic-text-muted hover:text-mythic-primary-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-mythic-text-primary font-semibold mb-4">Trade</h3>
            <ul className="space-y-2">
              {footerLinks.trade.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-mythic-text-muted hover:text-mythic-primary-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-mythic-text-primary font-semibold mb-4">Build</h3>
            <ul className="space-y-2">
              {footerLinks.build.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-mythic-text-muted hover:text-mythic-primary-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-mythic-text-primary font-semibold mb-4">Governance</h3>
            <ul className="space-y-2">
              {footerLinks.governance.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-mythic-text-muted hover:text-mythic-primary-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Metrics Section */}
        <div className="mt-12 pt-8 border-t border-mythic-primary-500/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-mythic-primary-500">247</div>
              <div className="text-sm text-mythic-text-muted">Active Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mythic-accent-300">142 tpd</div>
              <div className="text-sm text-mythic-text-muted">Processing Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-flow-credits">98.5%</div>
              <div className="text-sm text-mythic-text-muted">WTN Compliance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mythic-primary-500">£2.8M</div>
              <div className="text-sm text-mythic-text-muted">Community Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-mythic-primary-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-mythic-text-muted">
              © 2024 Genesis Reloop. Turn waste into community wealth. No ESG theatre.
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-mythic-text-muted hover:text-mythic-primary-500 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
