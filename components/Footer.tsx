import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400">
      {/* CTA Bar */}
      <div className="bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <a href="https://nowtb.com" target="_blank" rel="noopener noreferrer" className="group">
              <div className="text-brand-sky font-display font-bold text-lg group-hover:text-white transition-colors">
                Buying or Selling a Home?
              </div>
              <p className="text-white text-sm mt-1">Barrett Henry — The NOW Team at REMAX Collective</p>
              <p className="text-white text-xs mt-1">(813) 733-7907</p>
            </a>
            <a href="https://bestbayservices.com" target="_blank" rel="noopener noreferrer" className="group">
              <div className="text-brand-sky font-display font-bold text-lg group-hover:text-white transition-colors">
                Need a Handyman?
              </div>
              <p className="text-white text-sm mt-1">Best Bay Services — Tampa Bay Home Services</p>
              <p className="text-white text-xs mt-1">(813) 416-8676</p>
            </a>
            <a href="https://vivipm.com" target="_blank" rel="noopener noreferrer" className="group">
              <div className="text-brand-sky font-display font-bold text-lg group-hover:text-white transition-colors">
                Property Management
              </div>
              <p className="text-white text-sm mt-1">ViVi PM — Full-Service Property Management</p>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="font-display font-extrabold text-2xl text-white mb-3">
              TB<span className="text-brand-sky">Relo</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your complete guide to relocating to Tampa Bay, Florida. Covering Hillsborough, Pinellas, 
              Pasco, Hernando, Polk, Manatee, Sarasota, and Citrus counties with honest, local insight 
              from someone who actually lives here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Guides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/moving-to-tampa-bay/" className="hover:text-white transition-colors">Moving to Tampa Bay</Link></li>
              <li><Link href="/cost-of-living/" className="hover:text-white transition-colors">Cost of Living</Link></li>
              <li><Link href="/moving-checklist/" className="hover:text-white transition-colors">Moving Checklist</Link></li>
              <li><Link href="/blog/" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Counties */}
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Counties</h4>
            <ul className="space-y-2 text-sm">
              {siteConfig.counties.map(county => (
                <li key={county}>
                  <Link href={`/counties/${county.toLowerCase()}/`} className="hover:text-white transition-colors">
                    {county} County
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} TB Relo. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/affiliate-disclosure/" className="hover:text-white transition-colors">Affiliate Disclosure</Link>
            <Link href="/privacy-policy/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer/" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="bg-black/30 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-xs text-gray-500">
          Site by{' '}
          <a href="https://vyrabyte.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            Vyrabyte
          </a>
        </div>
      </div>
    </footer>
  )
}
