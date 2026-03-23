import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import { getPageImage, getPageImageUrl } from '@/lib/images'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'
import HeroImage from '@/components/HeroImage'

// Generate static pages for all city markdown files
export function generateStaticParams() {
  return getContentSlugs('cities').map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getContentPage('cities', params.slug)
  if (!page) return {}
  const imageUrl = getPageImageUrl({ type: 'city', slug: params.slug, frontmatterImage: page.frontmatter.image, county: page.frontmatter.county })
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
    openGraph: { images: [{ url: imageUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [imageUrl] },
  }
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const page = getContentPage('cities', params.slug)
  if (!page) notFound()

  const imgOpts = { type: 'city' as const, slug: params.slug, frontmatterImage: page.frontmatter.image, county: page.frontmatter.county }
  const heroSrc = getPageImage(imgOpts)

  const schema = generateWebPageSchema({
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription || '',
    url: `/cities/${params.slug}/`,
    publishedAt: page.frontmatter.publishedAt,
    updatedAt: page.frontmatter.updatedAt,
    imageUrl: getPageImageUrl(imgOpts),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <HeroImage src={heroSrc} title={page.frontmatter.title} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[
          { label: 'Cities', href: '/cities/' },
          { label: page.frontmatter.title, href: `/cities/${params.slug}/` },
        ]} />

        <AdSlot slot="top" />

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        <AdSlot slot="mid" />

        <CTABox type="realtor" />
        <CTABox type="handyman" />

        <AdSlot slot="bottom" />
      </article>
    </>
  )
}
