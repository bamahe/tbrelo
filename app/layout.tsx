import './globals.css'
import { Metadata } from 'next'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { siteConfig } from '@/lib/config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyCTA from '@/components/StickyCTA'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicons — consistent across all browsers */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />

        {/* Google AdSense site verification */}
        <meta name="google-adsense-account" content="ca-pub-2033173419526042" />
        <meta name="impact-site-verification" content="bb623f40-9653-4312-9ca8-bf35b957a10c" />

        {/* Google AdSense verification script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2033173419526042"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        
        {/* Google tag (gtag.js) — tbrelo.com */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TD87S02SLM"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TD87S02SLM');
          `}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Sitewide WebSite + Organization schema for SEO/AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': 'https://tbrelo.com/#website',
                name: 'TB Relo — Tampa Bay Relocation Guide',
                url: 'https://tbrelo.com',
                description: 'Comprehensive relocation guides for Tampa Bay, Florida. Covering 8 counties, 100+ cities, cost of living, schools, and everything you need to know about moving to Tampa Bay.',
                publisher: { '@id': 'https://tbrelo.com/#org' },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: { '@type': 'EntryPoint', urlTemplate: 'https://tbrelo.com/blog/?q={search_term_string}' },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': 'https://tbrelo.com/#org',
                name: 'TB Relo',
                url: 'https://tbrelo.com',
                sameAs: [
                  'https://nowtb.com',
                  'https://valricoagent.com',
                  'https://parrishagent.com',
                  'https://www.facebook.com/BarrettHenryREALTOR/',
                  'https://www.instagram.com/thenowteam',
                  'https://www.youtube.com/@nowtampa',
                ],
              },
            ])
          }}
        />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyCTA />
        <SpeedInsights />
      </body>
    </html>
  )
}
