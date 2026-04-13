import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentPage, getContentSlugs } from '@/lib/content'
import { generateArticleSchema, generateFAQSchema } from '@/lib/schema'
import { getPageImage, getPageImageUrl } from '@/lib/images'
import Breadcrumb from '@/components/Breadcrumb'
import CTABox from '@/components/CTABox'
import AdSlot from '@/components/AdSlot'
import HeroImage from '@/components/HeroImage'
import QASection from '@/components/QASection'

// Generate static pages for all blog markdown files
export function generateStaticParams() {
  return getContentSlugs('blog').map(slug => ({ slug }))
}

// Dynamic metadata from frontmatter
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getContentPage('blog', params.slug)
  if (!page) return {}
  const imageUrl = getPageImageUrl({ type: 'blog', slug: params.slug, frontmatterImage: page.frontmatter.image })
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
    openGraph: { images: [{ url: imageUrl, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', images: [imageUrl] },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const page = getContentPage('blog', params.slug)
  if (!page) notFound()

  const imgOpts = { type: 'blog' as const, slug: params.slug, frontmatterImage: page.frontmatter.image }
  const heroSrc = getPageImage(imgOpts)

  // Blog posts use Article schema instead of WebPage
  const schema = generateArticleSchema({
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription || '',
    url: `/blog/${params.slug}/`,
    publishedAt: page.frontmatter.publishedAt,
    updatedAt: page.frontmatter.updatedAt,
    imageUrl: getPageImageUrl(imgOpts),
  })

  // Build schemas array — Article + FAQ (if post has FAQ section)
  const schemas: Record<string, any>[] = [schema]
  if (page.faqs.length > 0) {
    schemas.push(generateFAQSchema(page.faqs))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <HeroImage src={heroSrc} title={page.frontmatter.title} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[
          { label: 'Blog', href: '/blog/' },
          { label: page.frontmatter.title, href: `/blog/${params.slug}/` },
        ]} />

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

        {/* Q&A Section — users can ask and answer questions */}
        <QASection blogSlug={params.slug} />
      </article>
    </>
  )
}
