import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { getContentByType } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import { siteConfig } from '@/lib/config'
import Breadcrumb from '@/components/Breadcrumb'

// SEO metadata
export const metadata: Metadata = {
  title: 'Moving to Tampa Bay From... — State-by-State Relocation Guides | TB Relo',
  description: 'Moving to Tampa Bay from another state? We have guides for 20 major cities and states covering cost of living comparisons, what to expect, and how to plan your move.',
  openGraph: {
    images: [{ url: `${siteConfig.url}/images/moving-from.jpg`, width: 1200, height: 630 }],
  },
}

export default function MovingFromIndex() {
  // Get all moving-from pages, sorted alphabetically
  const guides = getContentByType('moving-from')

  const schema = generateWebPageSchema({
    title: 'Moving to Tampa Bay — State-by-State Guides',
    description: 'Relocation guides for people moving to Tampa Bay from 20 major cities and states.',
    url: '/moving-from/',
    imageUrl: `${siteConfig.url}/images/moving-from.jpg`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="relative w-full h-[200px] md:h-[280px] overflow-hidden bg-brand-navy">
        <Image
          src="/images/moving-from.jpg"
          alt="Moving to Tampa Bay"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-brand-navy/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-white text-3xl md:text-5xl font-display font-extrabold leading-tight">
            Moving to Tampa Bay From...
          </h1>
          <p className="text-gray-300 text-lg mt-3 max-w-2xl">
            State-by-state guides comparing your current city to Tampa Bay.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[{ label: 'Moving From', href: '/moving-from/' }]} />

        <p className="text-brand-slate mb-10 max-w-2xl">
          Each guide covers cost of living comparisons, lifestyle differences, neighborhood matches, and practical tips for making the move from your specific city or state.
        </p>

        {/* Guides grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {guides.map(guide => {
            // Extract the origin from the title (e.g., "Moving from California" → "California")
            const origin = guide.frontmatter.title.replace(/Moving (to Tampa Bay )?from /i, '')
            return (
              <Link
                key={guide.slug}
                href={`/moving-from/${guide.slug}/`}
                className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-blue hover:shadow-lg transition-all"
              >
                <h2 className="font-display font-bold text-lg text-brand-navy group-hover:text-brand-blue transition-colors">
                  From {origin}
                </h2>
                {guide.frontmatter.metaDescription && (
                  <p className="text-brand-slate text-sm mt-2 line-clamp-2">
                    {guide.frontmatter.metaDescription}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
