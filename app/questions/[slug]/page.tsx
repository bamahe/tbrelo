import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateWebPageSchema, generateFAQSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'
import QASection from '@/components/QASection'

// Generate static pages for all question markdown files
export function generateStaticParams() {
  return getContentSlugs('questions').map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getContentPage('questions', params.slug)
  if (!page) return {}
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
  }
}

export default function QuestionPage({ params }: { params: { slug: string } }) {
  const page = getContentPage('questions', params.slug)
  if (!page) notFound()

  // Build schemas — WebPage + FAQ (auto-extracted from content)
  const schemas: Record<string, any>[] = [
    generateWebPageSchema({
      title: page.frontmatter.metaTitle || page.frontmatter.title,
      description: page.frontmatter.metaDescription || '',
      url: `/questions/${params.slug}/`,
    }),
  ]

  // Add FAQ schema if questions are detected
  if (page.faqs.length > 0) {
    schemas.push(generateFAQSchema(page.faqs))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[
          { label: 'Questions', href: '/questions/' },
          { label: page.frontmatter.category || 'General', href: '/questions/' },
        ]} />

        <h1 className="mb-2">{page.frontmatter.title}</h1>

        {page.frontmatter.category && (
          <p className="text-brand-slate text-sm mb-8">
            Category: {page.frontmatter.category} · Answered by Barrett Henry, REALTOR®
          </p>
        )}

        <AdSlot slot="top" />

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        <AdSlot slot="mid" />

        <CTABox type="realtor" />

        <AdSlot slot="bottom" />

        {/* Interactive Q&A — users can ask follow-up questions */}
        <QASection blogSlug={`questions-${params.slug}`} />
      </article>
    </>
  )
}
