import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'

// Generate static pages for all county markdown files
export function generateStaticParams() {
  return getContentSlugs('counties').map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getContentPage('counties', params.slug)
  if (!page) return {}
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[
          { label: 'Counties', href: '/counties/' },
          { label: page.frontmatter.title, href: `/counties/${params.slug}/` },
        ]} />

        <h1 className="mb-6">{page.frontmatter.title}</h1>

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
