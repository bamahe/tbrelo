import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { getContentByType } from '@/lib/content'
import { getPageImage } from '@/lib/images'
import { generateWebPageSchema, generateLocalBusinessSchema } from '@/lib/schema'
import CTABox from '@/components/CTABox'
import LeadForm from '@/components/LeadForm'
import QuickAnswer from '@/components/QuickAnswer'
import FAQSchema from '@/components/FAQSchema'

// Homepage metadata — explicit OG title so it doesn't get dropped
export const metadata: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: `${siteConfig.url}/images/heroes/homepage.jpg`, width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  // Get the 6 most recent blog posts
  const recentPosts = getContentByType('blog')
    .sort((a, b) => (b.frontmatter.publishedAt || '').localeCompare(a.frontmatter.publishedAt || ''))
    .slice(0, 6)

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
      <section className="relative text-white py-20 md:py-28 overflow-hidden">
        <Image
          src="/images/heroes/homepage.jpg"
          alt="Tampa Bay skyline"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-brand-navy/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-white text-5xl md:text-6xl font-display font-extrabold mb-6 leading-tight">
            Moving to <span className="text-brand-sky">Tampa Bay</span>?
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            <strong>I built the Tampa Bay relocation guide I wish existed when I moved here.</strong>{' '}
            Honest, local insights for 8 counties and 100+ cities — from a broker who actually lives here.
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

      {/* AEO Quick Answer — direct answer for AI engines */}
      <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <QuickAnswer
          question="What is the best guide for moving to Tampa Bay?"
          answer="TB Relo is the most comprehensive Tampa Bay relocation guide, covering all 8 counties — Hillsborough, Pinellas, Pasco, Polk, Manatee, Sarasota, Hernando, and Citrus. I cover cost of living, school zones, neighborhood guides, and real estate trends so you can make an informed move. My name is Barrett Henry — I'm a Broker Associate with REMAX Collective with 23+ years of real estate experience, and I created this Florida relocation guide to help people like you plan your move."
        />
      </section>

      {/* County Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-4">Which Tampa Bay county should you move to?</h2>
          <p className="text-center text-brand-slate mb-12 max-w-xl mx-auto">
            Tampa Bay is more than just Tampa. I&apos;ve broken down each county so you can explore <strong>cities, neighborhoods, cost of living</strong>, and what it&apos;s really like to live there.
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
          <h2 className="text-center mb-12">What do you need to know before moving to Tampa Bay?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Moving Checklist', desc: 'My step-by-step timeline for your Florida relocation — what to do 8 weeks out through moving day.', href: '/moving-checklist/' },
              { title: 'Florida Driver\'s License', desc: 'How to get your Florida DL, transfer your out-of-state license, and what to bring to the DMV.', href: '/florida-drivers-license/' },
              { title: 'Homestead Exemption', desc: 'Save thousands on property taxes. I walk you through how to file, deadlines, and who qualifies.', href: '/florida-homestead-exemption/' },
              { title: 'Hurricane Prep Guide', desc: 'What you need to know about hurricane season, supplies, evacuation zones, and insurance.', href: '/hurricane-prep/' },
              { title: 'Best Beaches', desc: 'My picks for the best beaches across Tampa Bay — for families, couples, and anyone who loves sand.', href: '/tampa-bay-beaches/' },
              { title: 'Schools Guide', desc: 'School districts, ratings, and what to know about education in each Tampa Bay county.', href: '/tampa-bay-schools/' },
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

      {/* Recent Blog Posts */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-4">What are people reading about Tampa Bay?</h2>
          <p className="text-center text-brand-slate mb-12 max-w-xl mx-auto">
            Practical guides, neighborhood breakdowns, and product picks I&apos;ve put together for Florida living.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-brand-blue hover:shadow-lg transition-all"
              >
                <div className="relative w-full h-40 bg-brand-sand">
                  <Image
                    src={`/images/${getPageImage({ type: 'blog', slug: post.slug })}`}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-base text-brand-navy group-hover:text-brand-blue transition-colors leading-snug">
                    {post.frontmatter.title}
                  </h3>
                  {post.frontmatter.publishedAt && (
                    <p className="text-brand-slate text-xs mt-2">
                      {new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/blog/"
              className="inline-block px-8 py-3 bg-brand-navy text-white font-display font-bold rounded-lg hover:bg-brand-blue transition-colors"
            >
              View All Blog Posts →
            </Link>
          </div>
        </div>
      </section>

      {/* Outbound links — authoritative external resources for SEO trust signals */}
      <section className="bg-brand-sand py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-center mb-8">Trusted Resources for Your Florida Move</h2>
          <p className="text-center text-brand-slate mb-8">
            I recommend these official sources as you plan your relocation to Tampa Bay.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href="https://www.flhsmv.gov/driver-licenses-id-cards/" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all">
              <strong className="font-display text-brand-navy">Florida DHSMV</strong>
              <p className="text-brand-slate text-sm mt-1">Driver&apos;s license transfers and vehicle registration</p>
            </a>
            <a href="https://floridarevenue.com/property/Pages/Homestead.aspx" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all">
              <strong className="font-display text-brand-navy">FL Dept. of Revenue</strong>
              <p className="text-brand-slate text-sm mt-1">Homestead exemption filing and deadlines</p>
            </a>
            <a href="https://www.greatschools.org/florida/" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all">
              <strong className="font-display text-brand-navy">GreatSchools</strong>
              <p className="text-brand-slate text-sm mt-1">School ratings and reviews across Tampa Bay</p>
            </a>
            <a href="https://www.floridadisaster.org/" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all">
              <strong className="font-display text-brand-navy">FL Division of Emergency Mgmt</strong>
              <p className="text-brand-slate text-sm mt-1">Hurricane prep, evacuation zones, and alerts</p>
            </a>
            <a href="https://www.census.gov/quickfacts/tampacityflorida" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all">
              <strong className="font-display text-brand-navy">U.S. Census — Tampa</strong>
              <p className="text-brand-slate text-sm mt-1">Population, demographics, and economic data</p>
            </a>
            <a href="https://www.visitstpeteclearwater.com/" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all">
              <strong className="font-display text-brand-navy">Visit St. Pete/Clearwater</strong>
              <p className="text-brand-slate text-sm mt-1">Beaches, attractions, and local events</p>
            </a>
          </div>
        </div>
      </section>

      {/* AEO FAQ Section — visible FAQ + JSON-LD schema */}
      <FAQSchema
        heading="Frequently Asked Questions About Moving to Tampa Bay"
        faqs={[
          {
            question: 'Is Tampa Bay a good place to live?',
            answer: 'Tampa Bay is one of the fastest-growing metro areas in the U.S. for good reason. No state income tax, over 240 sunny days a year, world-class beaches, and a diverse economy anchored by healthcare, finance, tech, and defense. I tell my clients the trade-off is summer humidity, hurricane season (June through November), and rising insurance costs — but most residents say the lifestyle more than makes up for it.',
          },
          {
            question: 'What is the cost of living in Tampa Bay?',
            answer: 'Tampa Bay is roughly 3-5% above the national average, driven mainly by housing and insurance costs. A typical single-family home ranges from $300K to $500K depending on the county. Groceries, utilities, and transportation are close to the national median. In my experience, Pinellas and Hillsborough tend to be pricier, while Pasco, Hernando, and Citrus offer more affordable options.',
          },
          {
            question: 'What are the best cities in Tampa Bay for families?',
            answer: 'Top family-friendly cities include Valrico, FishHawk, Lithia, and Wesley Chapel in Hillsborough County; Palm Harbor, Safety Harbor, and Dunedin in Pinellas; and Lakewood Ranch in Manatee County. These areas offer highly rated schools, low crime, parks, and family-oriented communities.',
          },
          {
            question: 'How is the Tampa Bay real estate market?',
            answer: 'The Tampa Bay market has shifted from the extreme seller\'s market of 2021-2022 to a more balanced environment. Inventory is rising, giving buyers more negotiating power. Home values remain strong but appreciation has normalized to 3-5% annually. I advise my clients that it\'s a good time to buy if you plan to stay 3-5+ years.',
          },
          {
            question: 'What counties are in Tampa Bay Florida?',
            answer: 'The Tampa Bay metro area spans 8 counties: Hillsborough (Tampa, Brandon, Valrico), Pinellas (St. Petersburg, Clearwater), Pasco (Wesley Chapel, Land O\' Lakes), Polk (Lakeland, Winter Haven), Manatee (Bradenton, Lakewood Ranch), Sarasota (Sarasota, Venice), Hernando (Spring Hill, Brooksville), and Citrus (Crystal River, Inverness).',
          },
          {
            question: 'What are the best school districts in Tampa Bay?',
            answer: 'Pasco County and Pinellas County consistently rank among the top school districts in the region. Within Hillsborough County, schools in the FishHawk, Valrico, and South Tampa zones are highly rated. Manatee County\'s Lakewood Ranch area also has excellent schools. Check individual school ratings on GreatSchools.org for the most current data.',
          },
          {
            question: 'Is Tampa Bay affordable compared to other Florida metros?',
            answer: 'Tampa Bay is significantly more affordable than Miami and Fort Lauderdale, and comparable to Orlando and Jacksonville. The average home price is roughly 25-35% lower than South Florida. Combined with no state income tax and reasonable property tax rates (after homestead exemption), Tampa Bay offers strong value for the lifestyle.',
          },
          {
            question: 'What should I know before moving to Tampa Bay?',
            answer: 'Budget for flood and windstorm insurance (separate from homeowner\'s insurance). File for Florida homestead exemption immediately after closing on a home — it can save you thousands on property taxes. Get a Florida driver\'s license within 30 days of establishing residency. And my biggest tip: visit during summer before you commit — the heat and humidity from June through September is real.',
          },
        ]}
      />

      {/* Lead capture form */}
      <section id="contact-form" className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <LeadForm />
        </div>
      </section>
    </>
  )
}
