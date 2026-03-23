import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { getContentByType } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'

// SEO metadata for the counties index
export const metadata: Metadata = {
  title: 'Tampa Bay Counties — Explore All 8 Counties | TB Relo',
  description: 'Explore all 8 Tampa Bay area counties: Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, and Citrus. Relocation guides, cities, and cost of living for each.',
  openGraph: {
    images: [{ url: 'https://tbrelo.com/images/heroes/homepage.jpg', width: 1200, height: 630 }],
  },
}

export default function CountiesIndex() {
  // Get all county pages
  const counties = getContentByType('counties')

  const schema = generateWebPageSchema({
    title: 'Tampa Bay Counties',
    description: 'Explore all 8 Tampa Bay area counties.',
    url: '/counties/',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[{ label: 'Counties', href: '/counties/' }]} />

        <h1 className="mb-4">Tampa Bay Counties</h1>
        <p className="text-brand-slate mb-10 max-w-2xl">
          Tampa Bay spans 8 counties, each with its own character, cost of living, and lifestyle. Pick a county to explore cities, neighborhoods, and what it's really like to live there.
        </p>

        {/* County grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {counties.map(county => (
            <Link
              key={county.slug}
              href={`/counties/${county.slug}/`}
              className="group block relative rounded-xl overflow-hidden h-48 hover:shadow-lg transition-all"
            >
              {/* County hero image */}
              <Image
                src={`/images/heroes/${county.slug}.jpg`}
                alt={county.frontmatter.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-brand-navy/50 group-hover:bg-brand-navy/40 transition-colors" />
              {/* County name */}
              <div className="relative z-10 flex flex-col justify-end h-full p-6">
                <h2 className="font-display font-bold text-2xl text-white">
                  {county.frontmatter.title}
                </h2>
                {county.frontmatter.metaDescription && (
                  <p className="text-gray-200 text-sm mt-1 line-clamp-2">
                    {county.frontmatter.metaDescription}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
