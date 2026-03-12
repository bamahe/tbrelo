import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'

// Catch-all for top-level pages — reads from content/pillar/ and content/pages/
// Pillar pages are long-form guides, pages are standard static pages (about, etc.)

// Helper: find a page by slug across pillar and pages directories
function findPage(slug: string) {
  return getContentPage('pillar', slug) || getContentPage('pages', slug)
}

// Generate static pages for all pillar + pages markdown files
export function generateStaticParams() {
  const pillarSlugs = getContentSlugs('pillar')
  const pageSlugs = getContentSlugs('pages')
  // Combine both, deduplicate (pillar takes priority if slug exists in both)
  const allSlugs = Array.from(new Set([...pillarSlugs, ...pageSlugs]))
  return allSlugs.map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = findPage(params.slug)
  if (!page) return {}
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
  }
}

export default function TopLevelPage({ params }: { params: { slug: string } }) {
  const page = findPage(params.slug)
  if (!page) notFound()

  const schema = generateWebPageSchema({
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription || '',
    url: `/${params.slug}/`,
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
          { label: page.frontmatter.title, href: `/${params.slug}/` },
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
