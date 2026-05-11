import Link from 'next/link'

interface Post {
  slug: string
  frontmatter: {
    title?: string
    metaDescription?: string
    publishedAt?: string
    category?: string
  }
}

interface RelatedPostsProps {
  posts: Post[]
  title?: string
}

// Shows 3 related blog posts as cards
export default function RelatedPosts({ posts, title = 'Keep Reading' }: RelatedPostsProps) {
  if (!posts.length) return null

  return (
    <section className="mt-12 pt-10 border-t border-gray-200">
      <h2 className="font-display font-bold text-xl text-brand-navy mb-6">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}/`}
            className="group block rounded-lg border border-gray-200 p-5 hover:border-brand-blue hover:shadow-md transition-all"
          >
            {post.frontmatter.category && (
              <span className="inline-block text-xs font-semibold text-brand-blue bg-blue-50 px-2 py-0.5 rounded mb-2">
                {post.frontmatter.category}
              </span>
            )}
            <h3 className="font-display font-bold text-brand-navy text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
              {post.frontmatter.title}
            </h3>
            {post.frontmatter.metaDescription && (
              <p className="text-xs text-brand-slate mt-2 line-clamp-2">
                {post.frontmatter.metaDescription}
              </p>
            )}
            {post.frontmatter.publishedAt && (
              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
