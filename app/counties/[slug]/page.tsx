import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import { getPageImage, getPageImageUrl } from '@/lib/images'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'
import HeroImage from '@/components/HeroImage'

// Generate static pages for all county markdown files
export function generateStaticParams() {
  return getContentSlugs('counties').map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getContentPage('counties', params.slug)
  if (!page) return {}
  const imageUrl = getPageImageUrl({ type: 'county', slug: params.slug, frontmatterImage: page.frontmatter.image })
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
    openGraph: { images: [{ url: imageUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [imageUrl] },
  }
}

export default function CountyPage({ params }: { params: { slug: string } }) {
  const page = getContentPage('counties', params.slug)
  if (!page) notFound()

  const schema = generateWebPageSchema({
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription || '',
    url: `/counties/${params.slug}/`,
    publishedAt: page.frontmatter.publishedAt,
    updatedAt: page.frontmatter.updatedAt,
  })

  const heroSrc = getPageImage({ type: 'county', slug: params.slug, frontmatterImage: page.frontmatter.image })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <HeroImage src={heroSrc} title={page.frontmatter.title} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[
          { label: 'Counties', href: '/counties/' },
          { label: page.frontmatter.title, href: `/counties/${params.slug}/` },
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
