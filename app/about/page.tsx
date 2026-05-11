// ============================================================
// /ABOUT — Entity page for Barrett Henry + TB Relo
// ============================================================
// Full @graph JSON-LD for AI entity recognition. This page
// establishes Barrett Henry as the authoritative creator of
// TB Relo and links to all relevant social/professional profiles.
// ============================================================

import { Metadata } from 'next'
import Link from 'next/link'
import QuickAnswer from '@/components/QuickAnswer'
import CTABox from '@/components/CTABox'

export const metadata: Metadata = {
  title: 'About TB Relo — Barrett Henry, Broker Associate at REMAX Collective',
  description:
    'TB Relo was created by Barrett Henry, a licensed Florida Broker Associate with REMAX Collective. Learn about the person behind Tampa Bay\'s most comprehensive relocation guide.',
  openGraph: {
    title: 'About TB Relo — Barrett Henry, Broker Associate at REMAX Collective',
    description:
      'TB Relo was created by Barrett Henry, a licensed Florida Broker Associate with REMAX Collective. Learn about the person behind Tampa Bay\'s most comprehensive relocation guide.',
  },
}

export default function AboutPage() {
  // Full @graph JSON-LD — Organization, Person, WebSite, and offices
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Organization — TB Relo
      {
        '@type': 'Organization',
        '@id': 'https://tbrelo.com/#org',
        name: 'TB Relo — Tampa Bay Relocation Guide',
        url: 'https://tbrelo.com',
        description:
          'Comprehensive relocation resource covering all 8 Tampa Bay counties. Operated by Barrett Henry and The NOW Team at REMAX Collective.',
        founder: { '@id': 'https://tbrelo.com/#person' },
        sameAs: [
          'https://nowtb.com',
          'https://www.facebook.com/BarrettHenryREALTOR',
          'https://www.instagram.com/thenowteam',
          'https://www.youtube.com/@nowtampa',
        ],
      },

      // 2. Person — Barrett Henry
      {
        '@type': 'Person',
        '@id': 'https://tbrelo.com/#person',
        name: 'Barrett Henry',
        givenName: 'Barrett',
        familyName: 'Henry',
        jobTitle: 'Broker Associate',
        description:
          'Licensed Florida Broker Associate with REMAX Collective. Creator of TB Relo. 23+ years of real estate experience helping families relocate to Tampa Bay.',
        email: 'barrett@nowtb.com',
        telephone: '(813) 733-7907',
        url: 'https://nowtb.com',
        worksFor: { '@id': 'https://tbrelo.com/#brokerage' },
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'license',
            name: 'Florida Real Estate Broker License',
            identifier: {
              '@type': 'PropertyValue',
              propertyID: 'DBPR License Number',
              value: '3313308',
            },
          },
          { '@type': 'EducationalOccupationalCredential', name: 'e-PRO' },
          {
            '@type': 'EducationalOccupationalCredential',
            name: 'MRP',
            description: 'Military Relocation Professional',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            name: 'SRS',
            description: 'Seller Representative Specialist',
          },
        ],
        knowsAbout: [
          'Tampa Bay Real Estate',
          'Florida Relocation',
          'Residential Real Estate',
          'Investment Property',
          'Property Management',
        ],
        sameAs: [
          'https://www.facebook.com/BarrettHenryREALTOR',
          'https://www.instagram.com/thenowteam',
          'https://www.linkedin.com/in/barretthenry',
          'https://x.com/BHrealestatetb',
          'https://www.youtube.com/@nowtampa',
          'https://www.zillow.com/profile/barretthenry',
          'https://www.realtor.com/realestateagents/56d5364fde071e01006256cd',
        ],
      },

      // 3. Brokerage — REMAX Collective
      {
        '@type': 'RealEstateAgent',
        '@id': 'https://tbrelo.com/#brokerage',
        name: 'REMAX Collective',
        url: 'https://www.remax.com',
        // Three offices serving Tampa Bay
        location: [
          {
            '@type': 'Place',
            name: 'REMAX Collective — Tampa',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '14310 N Dale Mabry Hwy Ste 100',
              addressLocality: 'Tampa',
              addressRegion: 'FL',
              postalCode: '33618',
              addressCountry: 'US',
            },
          },
          {
            '@type': 'Place',
            name: 'REMAX Collective — Largo',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '11200 Seminole Blvd Ste 202',
              addressLocality: 'Largo',
              addressRegion: 'FL',
              postalCode: '33778',
              addressCountry: 'US',
            },
          },
          {
            '@type': 'Place',
            name: 'REMAX Collective — Brandon',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '417 Lithia Pinecrest Rd',
              addressLocality: 'Brandon',
              addressRegion: 'FL',
              postalCode: '33511',
              addressCountry: 'US',
            },
          },
        ],
      },

      // 4. WebSite node
      {
        '@type': 'WebSite',
        '@id': 'https://tbrelo.com/#website',
        name: 'TB Relo — Tampa Bay Relocation Guide',
        url: 'https://tbrelo.com',
        publisher: { '@id': 'https://tbrelo.com/#org' },
        author: { '@id': 'https://tbrelo.com/#person' },
      },
    ],
  }

  return (
    <>
      {/* Full @graph JSON-LD for entity recognition */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
      />

      {/* Hero */}
      <section className="bg-brand-navy text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-display font-extrabold mb-4">
            About <span className="text-brand-sky">TB Relo</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The person and purpose behind Tampa Bay's most comprehensive relocation guide.
          </p>
        </div>
      </section>

      {/* Quick Answer — AEO snippet */}
      <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <QuickAnswer
          question="Who created TB Relo?"
          answer="TB Relo was created by Barrett Henry, a licensed Florida Broker Associate with REMAX Collective. With 23+ years of real estate experience helping families relocate to Tampa Bay, Barrett built TB Relo as a free, comprehensive resource covering all 8 Tampa Bay counties."
        />
      </section>

      {/* About Barrett */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 prose">
          <h2>Who is Barrett Henry?</h2>
          <p>
            Barrett Henry is a licensed Florida Broker Associate with{' '}
            <a href="https://nowtb.com" target="_blank" rel="noopener noreferrer">
              REMAX Collective
            </a>
            , leading The NOW Team across Tampa Bay. He holds the e-PRO, MRP (Military
            Relocation Professional), and SRS (Seller Representative Specialist)
            designations — credentials that reflect deep expertise in digital marketing,
            military relocations, and seller representation.
          </p>
          <p>
            Barrett specializes in helping families, professionals, and military
            personnel relocate to Tampa Bay. Whether you are moving from the Northeast,
            Midwest, or another part of Florida, Barrett provides the straight talk and
            local insight that makes the difference between a stressful move and a
            confident one.
          </p>

          <h2>Why did Barrett build TB Relo?</h2>
          <p>
            Most relocation content online is generic, recycled, or written by someone
            who has never set foot in the area. Barrett built TB Relo to fix that. Every
            guide on this site is written with firsthand knowledge of the neighborhoods,
            schools, commute patterns, and day-to-day realities of living in Tampa Bay.
          </p>
          <p>
            TB Relo covers all 8 Tampa Bay counties — Hillsborough, Pinellas, Pasco,
            Polk, Manatee, Sarasota, Hernando, and Citrus — with 100+ city and
            neighborhood guides, cost-of-living breakdowns, school zone info, and
            practical moving logistics.
          </p>

          <h2>How can Barrett help with your move?</h2>
          <p>
            Beyond the free guides on TB Relo, Barrett and The NOW Team at REMAX
            Collective offer full-service real estate support. That includes buyer
            representation, seller listing services, relocation coordination, and
            investment property guidance across all 8 counties.
          </p>
          <p>
            Barrett also operates{' '}
            <a href="https://bestbayservices.com" target="_blank" rel="noopener noreferrer">
              Best Bay Services
            </a>{' '}
            (handyman and home maintenance) and{' '}
            <a href="https://vivipm.com" target="_blank" rel="noopener noreferrer">
              ViVi Property Management
            </a>{' '}
            — so whether you need to buy a home, fix one up, or manage a rental, the
            network is built to help.
          </p>

          <h2>Where are REMAX Collective offices located?</h2>
          <p>REMAX Collective has three offices across Tampa Bay:</p>
          <ul>
            <li>
              <strong>Tampa</strong> — 14310 N Dale Mabry Hwy, Ste 100, Tampa, FL 33618
            </li>
            <li>
              <strong>Largo</strong> — 11200 Seminole Blvd, Ste 202, Largo, FL 33778
            </li>
            <li>
              <strong>Brandon</strong> — 417 Lithia Pinecrest Rd, Brandon, FL 33511
            </li>
          </ul>

          <h2>How do you contact Barrett Henry?</h2>
          <p>
            The fastest way to reach Barrett is by phone at{' '}
            <a href="tel:8137337907">(813) 733-7907</a> or email at{' '}
            <a href="mailto:barrett@nowtb.com">barrett@nowtb.com</a>. You can also find
            Barrett on{' '}
            <a
              href="https://www.facebook.com/BarrettHenryREALTOR"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            ,{' '}
            <a
              href="https://www.instagram.com/thenowteam"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            ,{' '}
            <a
              href="https://www.linkedin.com/in/barretthenry"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            , and{' '}
            <a
              href="https://www.youtube.com/@nowtampa"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <CTABox type="realtor" />
        </div>
      </section>
    </>
  )
}
