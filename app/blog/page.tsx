import Link from 'next/link'
import { Metadata } from 'next'
import { getContentByType } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'

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

        {/* Blog post list */}
        <div className="space-y-6">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-blue hover:shadow-lg transition-all"
            >
              <h2 className="font-display font-bold text-xl text-brand-navy group-hover:text-brand-blue transition-colors">
                {post.frontmatter.title}
              </h2>
              {post.frontmatter.publishedAt && (
                <p className="text-brand-slate text-sm mt-1">
                  {new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              {post.frontmatter.metaDescription && (
                <p className="text-brand-slate text-sm mt-2">
                  {post.frontmatter.metaDescription}
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* Empty state if no posts yet */}
        {posts.length === 0 && (
          <p className="text-brand-slate text-center py-12">
            No blog posts yet. Check back soon!
          </p>
        )}
      </div>
    </>
  )
}
