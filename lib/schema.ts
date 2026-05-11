// ============================================================
// SCHEMA MARKUP — Baked into every page for SEO + AEO
// ============================================================
// Google, ChatGPT, Perplexity all use structured data.
// This generates JSON-LD schema for each page type.
// ============================================================

export function generateWebPageSchema(page: {
  title: string
  description: string
  url: string
  type?: string
  publishedAt?: string
  updatedAt?: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: `https://tbrelo.com${page.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'TB Relo — Tampa Bay Relocation Guide',
      url: 'https://tbrelo.com',
    },
    author: generatePersonSchema(),
    ...(page.publishedAt && { datePublished: page.publishedAt }),
    ...(page.updatedAt && { dateModified: page.updatedAt }),
    ...(page.imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: page.imageUrl,
      }
    }),
  }
}

export function generateArticleSchema(page: {
  title: string
  description: string
  url: string
  publishedAt?: string
  updatedAt?: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    url: `https://tbrelo.com${page.url}`,
    author: generatePersonSchema(),
    publisher: {
      '@type': 'Organization',
      name: 'TB Relo',
      url: 'https://tbrelo.com',
    },
    ...(page.publishedAt && { datePublished: page.publishedAt }),
    ...(page.updatedAt && { dateModified: page.updatedAt }),
    ...(page.imageUrl && { 
      image: {
        '@type': 'ImageObject',
        url: page.imageUrl,
      }
    }),
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    '@id': 'https://tbrelo.com/#agent',
    name: 'Barrett Henry, REALTOR®',
    givenName: 'Barrett',
    familyName: 'Henry',
    jobTitle: 'Broker Associate',
    description: 'Barrett Henry is a licensed Broker Associate with REMAX Collective specializing in Tampa Bay real estate and relocation. 23+ years of experience across 8 counties.',
    telephone: '(813) 733-7907',
    email: 'barrett@nowtb.com',
    url: 'https://nowtb.com',
    priceRange: '$',
    slogan: 'MOVE WITH CONFIDENCE. Straight Talk. Smart Strategy.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '14310 N Dale Mabry Hwy Ste 100',
      addressLocality: 'Tampa',
      addressRegion: 'FL',
      postalCode: '33618',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.9506,
      longitude: -82.4572,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Hillsborough County, FL' },
      { '@type': 'AdministrativeArea', name: 'Pinellas County, FL' },
      { '@type': 'AdministrativeArea', name: 'Pasco County, FL' },
      { '@type': 'AdministrativeArea', name: 'Hernando County, FL' },
      { '@type': 'AdministrativeArea', name: 'Polk County, FL' },
      { '@type': 'AdministrativeArea', name: 'Manatee County, FL' },
      { '@type': 'AdministrativeArea', name: 'Sarasota County, FL' },
      { '@type': 'AdministrativeArea', name: 'Citrus County, FL' },
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'license', name: 'Florida Real Estate Broker License', identifier: { '@type': 'PropertyValue', propertyID: 'DBPR License Number', value: '3313308' } },
      { '@type': 'EducationalOccupationalCredential', name: 'e-PRO' },
      { '@type': 'EducationalOccupationalCredential', name: 'MRP', description: 'Military Relocation Professional' },
      { '@type': 'EducationalOccupationalCredential', name: 'SRS', description: 'Seller Representative Specialist' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '85',
    },
    worksFor: { '@type': 'Organization', name: 'REMAX Collective' },
    memberOf: { '@type': 'Organization', name: 'Suncoast Tampa Association of REALTORS' },
    sameAs: [
      'https://nowtb.com',
      'https://valricoagent.com',
      'https://parrishagent.com',
      'https://valrico.blog',
      'https://bestbayservices.com',
      'https://vivipm.com',
      'https://www.facebook.com/BarrettHenryREALTOR/',
      'https://www.instagram.com/thenowteam',
      'https://www.linkedin.com/in/barretthenry/',
      'https://www.youtube.com/@nowtampa',
      'https://www.zillow.com/profile/barretthenry',
      'https://www.remax.com/real-estate-agents/barrett-henry-city-state/100112059',
    ],
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://tbrelo.com${item.url}`,
    })),
  }
}

function generatePersonSchema() {
  return {
    '@type': 'Person',
    name: 'Barrett Henry',
    jobTitle: 'REALTOR® & Broker Associate',
    url: 'https://nowtb.com',
    worksFor: {
      '@type': 'Organization',
      name: 'REMAX Collective',
    },
    knowsAbout: [
      'Tampa Bay Real Estate',
      'Florida Relocation',
      'Residential Real Estate',
      'Investment Property',
      'Property Management',
    ],
  }
}

// Combine multiple schemas into a single script tag
export function schemasToJsonLd(schemas: Record<string, any>[]): string {
  if (schemas.length === 1) {
    return JSON.stringify(schemas[0])
  }
  return JSON.stringify(schemas)
}
