import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import { getPageImage, getPageImageUrl } from '@/lib/images'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'
import HeroImage from '@/components/HeroImage'

// Generate static pages for all moving-from markdown files
export function generateStaticParams() {
  return getContentSlugs('moving-from').map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getContentPage('moving-from', params.slug)
  if (!page) return {}
  const imageUrl = getPageImageUrl({ type: 'moving-from', slug: params.slug, frontmatterImage: page.frontmatter.image })
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
    openGraph: { images: [{ url: imageUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [imageUrl] },
  }
}

export default function MovingFromPage({ params }: { params: { slug: string } }) {
  const page = getContentPage('moving-from', params.slug)
  if (!page) notFound()

  const imgOpts = { type: 'moving-from' as const, slug: params.slug, frontmatterImage: page.frontmatter.image }
  const heroSrc = getPageImage(imgOpts)

  const schema = generateWebPageSchema({
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription || '',
    url: `/moving-from/${params.slug}/`,
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
          { label: 'Moving From', href: '/moving-from/' },
          { label: page.frontmatter.title, href: `/moving-from/${params.slug}/` },
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
