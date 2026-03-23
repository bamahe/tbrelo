import Link from 'next/link'
import { siteConfig } from '@/lib/config'

// Custom 404 page — shows when someone hits a URL that doesn't exist
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-display font-extrabold text-brand-navy mb-4">404</h1>
      <p className="text-xl text-brand-slate mb-8">
        This page doesn't exist. Maybe you're looking for one of these?
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-12 text-left">
        <Link
          href="/moving-to-tampa-bay/"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-blue hover:shadow-lg transition-all"
        >
          <h3 className="font-display font-bold text-brand-navy">Moving Guide</h3>
          <p className="text-brand-slate text-sm mt-1">Complete guide to relocating to Tampa Bay</p>
        </Link>
        <Link
          href="/counties/"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-blue hover:shadow-lg transition-all"
        >
          <h3 className="font-display font-bold text-brand-navy">Explore Counties</h3>
          <p className="text-brand-slate text-sm mt-1">Browse all 8 Tampa Bay counties</p>
        </Link>
        <Link
          href="/cities/"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-blue hover:shadow-lg transition-all"
        >
          <h3 className="font-display font-bold text-brand-navy">Find a City</h3>
          <p className="text-brand-slate text-sm mt-1">90+ city and neighborhood guides</p>
        </Link>
        <Link
          href="/blog/"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-blue hover:shadow-lg transition-all"
        >
          <h3 className="font-display font-bold text-brand-navy">Blog</h3>
          <p className="text-brand-slate text-sm mt-1">Tips, comparisons, and local insights</p>
        </Link>
      </div>

      <Link
        href="/"
        className="px-8 py-4 bg-brand-blue text-white font-display font-bold rounded-lg hover:bg-blue-600 transition-colors text-lg inline-block"
      >
        Back to Home
      </Link>
    </div>
  )
}
