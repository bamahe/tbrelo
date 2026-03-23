import Link from 'next/link'
import { Metadata } from 'next'
import { getContentByType } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/config'
import Breadcrumb from '@/components/Breadcrumb'

// SEO metadata for the cities index
export const metadata: Metadata = {
  title: 'Tampa Bay Cities & Neighborhoods — Explore 90+ Communities | TB Relo',
  description: 'Explore 90+ cities and neighborhoods across Tampa Bay. Find relocation guides, cost of living, and local insights for every community in the area.',
  openGraph: {
    images: [{ url: `${siteConfig.url}/images/heroes/homepage.jpg`, width: 1200, height: 630 }],
  },
}

export default function CitiesIndex() {
  // Get all city pages and group by county
  const cities = getContentByType('cities')

  // Group cities by county for organized browsing
  const byCounty: Record<string, typeof cities> = {}
  for (const city of cities) {
    const county = city.frontmatter.county || 'Other'
    if (!byCounty[county]) byCounty[county] = []
    byCounty[county].push(city)
  }

  // Sort counties to match siteConfig order
  const countyOrder = siteConfig.counties
  const sortedCounties = Object.keys(byCounty).sort((a, b) => {
    const ia = countyOrder.indexOf(a)
    const ib = countyOrder.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  const schema = generateWebPageSchema({
    title: 'Tampa Bay Cities & Neighborhoods',
    description: 'Explore 90+ cities and neighborhoods across Tampa Bay.',
    url: '/cities/',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[{ label: 'Cities', href: '/cities/' }]} />

        <h1 className="mb-4">Tampa Bay Cities & Neighborhoods</h1>
        <p className="text-brand-slate mb-10 max-w-2xl">
          {cities.length}+ communities across 8 counties. Each guide covers cost of living, neighborhoods, schools, and what it's actually like to live there.
        </p>

        {/* Cities grouped by county */}
        {sortedCounties.map(county => (
          <div key={county} className="mb-10">
            <h2 className="font-display font-bold text-xl text-brand-navy mb-4 pb-2 border-b-2 border-brand-navy">
              <Link href={`/counties/${county.toLowerCase()}/`} className="hover:text-brand-blue transition-colors">
                {county} County
              </Link>
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {byCounty[county].map(city => (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}/`}
                  className="group block bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-brand-blue hover:shadow-md transition-all"
                >
                  <span className="font-display font-semibold text-brand-navy group-hover:text-brand-blue transition-colors">
                    {city.frontmatter.title.replace(/Moving to |Relocating to /i, '')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
