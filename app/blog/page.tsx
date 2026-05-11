import { Metadata } from 'next'
import { getContentByType } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'
import BlogSearch from '@/components/BlogSearch'

// SEO metadata for the blog index page
export const metadata: Metadata = {
  title: 'Tampa Bay Relocation Blog — Tips, Guides & Local Insight | TB Relo',
  description: 'Practical tips and guides for moving to Tampa Bay. Florida driver\'s license, homestead exemption, neighborhoods, cost of living, and more.',
}

export default function BlogIndex() {
  // Get all blog posts, sorted newest first by publishedAt date
  const posts = getContentByType('blog').sort((a, b) => {
    const dateA = a.frontmatter.publishedAt || ''
    const dateB = b.frontmatter.publishedAt || ''
    return dateB.localeCompare(dateA)
  })

  const schema = generateWebPageSchema({
    title: 'Tampa Bay Relocation Blog',
    description: 'Practical tips and guides for moving to Tampa Bay.',
    url: '/blog/',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[{ label: 'Blog', href: '/blog/' }]} />

        <h1 className="mb-4">Tampa Bay Relocation Blog</h1>
        <p className="text-brand-slate mb-10 max-w-2xl">
          Practical guides and local insight for anyone moving to the Tampa Bay area.
        </p>

        {/* Searchable, filterable blog grid */}
        <BlogSearch posts={posts} />
      </div>
    </>
  )
}
