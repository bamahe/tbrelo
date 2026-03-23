import './globals.css'
import { Metadata } from 'next'
import Script from 'next/script'
import { siteConfig } from '@/lib/config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
        {/* Google AdSense site verification */}
        <meta name="google-adsense-account" content="ca-pub-2033173419526042" />
        <meta name="impact-site-verification" content="bb623f40-9653-4312-9ca8-bf35b957a10c" />

        {/* Google AdSense verification script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2033173419526042"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        
        {/* Google Analytics — uncomment when set up */}
        {/* <script async src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.gaId}`}></script> */}
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
