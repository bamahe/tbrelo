import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { generateWebPageSchema, generateLocalBusinessSchema } from '@/lib/schema'
import CTABox from '@/components/CTABox'

export default function HomePage() {
  const schemas = [
    generateWebPageSchema({
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      url: '/',
    }),
    generateLocalBusinessSchema(),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      {/* Hero */}
      <section className="bg-brand-navy text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-white text-5xl md:text-6xl font-display font-extrabold mb-6 leading-tight">
            Moving to <span className="text-brand-sky">Tampa Bay</span>?
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Honest, local relocation guides for 8 counties and 100+ cities across the Tampa Bay area. 
            Written by someone who actually lives here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/moving-to-tampa-bay/"
              className="px-8 py-4 bg-brand-blue text-white font-display font-bold rounded-lg hover:bg-blue-600 transition-colors text-lg"
            >
              Start Here: Moving Guide
            </Link>
            <Link
              href="/cost-of-living/"
              className="px-8 py-4 bg-white/10 text-white font-display font-bold rounded-lg hover:bg-white/20 transition-colors text-lg"
            >
              Cost of Living
            </Link>
          </div>
        </div>
      </section>

      {/* County Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-4">Explore by County</h2>
          <p className="text-center text-brand-slate mb-12 max-w-xl mx-auto">
            Tampa Bay is more than just Tampa. Click a county to explore cities, neighborhoods, cost of living, and what it's really like to live there.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteConfig.counties.map(county => (
              <Link
                key={county}
                href={`/counties/${county.toLowerCase()}/`}
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-blue hover:shadow-lg transition-all"
              >
                <h3 className="font-display font-bold text-xl text-brand-navy group-hover:text-brand-blue transition-colors">
                  {county} County
                </h3>
                <p className="text-brand-slate text-sm mt-2">
                  Explore cities, neighborhoods, and relocation info →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-brand-sand py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-12">Essential Relocation Guides</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Moving Checklist', desc: 'Step-by-step timeline for your Florida move. What to do 8 weeks out through moving day.', href: '/moving-checklist/' },
              { title: 'Florida Driver\'s License', desc: 'How to get your Florida DL, transfer your out-of-state license, and what to bring to the DMV.', href: '/florida-drivers-license/' },
              { title: 'Homestead Exemption', desc: 'Save thousands on property taxes. How to file, deadlines, and who qualifies.', href: '/florida-homestead-exemption/' },
              { title: 'Hurricane Prep Guide', desc: 'What you need to know about hurricane season, supplies, evacuation zones, and insurance.', href: '/hurricane-prep/' },
              { title: 'Best Beaches', desc: 'Ranked: the best beaches across Tampa Bay for families, couples, and anyone who loves sand.', href: '/tampa-bay-beaches/' },
              { title: 'Schools Guide', desc: 'School districts, ratings, and what to know about education in each county.', href: '/tampa-bay-schools/' },
            ].map(guide => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group block bg-white rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <h3 className="font-display font-bold text-lg text-brand-navy group-hover:text-brand-blue transition-colors">
                  {guide.title}
                </h3>
                <p className="text-brand-slate text-sm mt-2">{guide.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <CTABox type="realtor" />
        </div>
      </section>
    </>
  )
}
