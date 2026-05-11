import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thanks for Reaching Out',
  robots: { index: false },
}

export default function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="font-display font-bold text-3xl text-brand-navy mb-4">
        Got It — Barrett Will Be in Touch
      </h1>
      <p className="text-brand-slate mb-8">
        Thanks for reaching out. Barrett Henry typically responds within a few hours during business hours.
        In the meantime, keep exploring — there&apos;s a lot to learn about Tampa Bay.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/blog/" className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-sm">
          Browse the Blog
        </Link>
        <Link href="/moving-to-tampa-bay/" className="px-6 py-3 border-2 border-brand-navy text-brand-navy font-semibold rounded-lg hover:bg-brand-navy hover:text-white transition-colors text-sm">
          Moving Guide
        </Link>
      </div>
    </div>
  )
}
