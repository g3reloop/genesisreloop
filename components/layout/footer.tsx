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

const footerLinks = [
  { name: 'Docs', href: '/docs' },
  { name: 'Methodology', href: '/docs/methodology' },
  { name: 'Contact', href: '/contact' },
  { name: 'Tutorial', href: '/tutorial' }
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

          {/* Links Section */}
          <div className="lg:col-span-4">
            <h3 className="text-mythic-text-primary font-semibold mb-4">Quick Links</h3>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {footerLinks.map((link) => (
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
              {/* Social icons removed per requirements */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
