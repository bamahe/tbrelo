import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateArticleSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'

// Generate static pages for all blog markdown files
export function generateStaticParams() {
  return getContentSlugs('blog').map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getContentPage('blog', params.slug)
  if (!page) return {}
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const page = getContentPage('blog', params.slug)
  if (!page) notFound()

  // Blog posts use Article schema instead of WebPage
  const schema = generateArticleSchema({
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription || '',
    url: `/blog/${params.slug}/`,
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
          { label: 'Blog', href: '/blog/' },
          { label: page.frontmatter.title, href: `/blog/${params.slug}/` },
        ]} />

        <h1 className="mb-6">{page.frontmatter.title}</h1>

        {/* Published date for blog posts */}
        {page.frontmatter.publishedAt && (
          <p className="text-brand-slate text-sm mb-8">
            Published {new Date(page.frontmatter.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

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
