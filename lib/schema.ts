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
    '@type': 'RealEstateAgent',
    name: 'Barrett Henry — The NOW Team at REMAX Collective',
    telephone: '(813) 733-7907',
    email: 'barrett@nowtb.com',
    url: 'https://nowtb.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tampa',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: [
      'Hillsborough County, FL',
      'Pinellas County, FL',
      'Pasco County, FL',
      'Hernando County, FL',
      'Polk County, FL',
      'Manatee County, FL',
      'Sarasota County, FL',
      'Citrus County, FL',
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
  }
}

// Combine multiple schemas into a single script tag
export function schemasToJsonLd(schemas: Record<string, any>[]): string {
  if (schemas.length === 1) {
    return JSON.stringify(schemas[0])
  }
  return JSON.stringify(schemas)
}
