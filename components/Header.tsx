'use client'

import { useState } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Moving to Tampa Bay', href: '/moving-to-tampa-bay/' },
    { label: 'Counties', href: '/counties/', children: siteConfig.counties.map(c => ({
      label: `${c} County`,
      href: `/counties/${c.toLowerCase()}/`,
    }))},
    { label: 'Cost of Living', href: '/cost-of-living/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Find a REALTOR®', href: 'https://nowtb.com', external: true },
  ]

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white hover:text-brand-sky transition-colors">
            <span className="font-display font-extrabold text-2xl tracking-tight">
              TB<span className="text-brand-sky">Relo</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <div key={item.label} className="relative group">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
                {/* Dropdown for counties */}
                {item.children && (
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
                    <div className="bg-white text-brand-dark rounded-lg shadow-xl py-2 min-w-[200px]">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm hover:bg-brand-sand transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            {navItems.map(item => (
              <div key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 text-gray-300 hover:text-white"
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-2 text-gray-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
                {item.children?.map(child => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-1 pl-4 text-sm text-gray-400 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
