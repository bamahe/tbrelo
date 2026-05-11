'use client'

import { useState, useMemo } from 'react'
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

interface BlogSearchProps {
  posts: Post[]
}

// Category labels for filtering
const CATEGORIES = [
  'All',
  'Real Estate',
  'Lifestyle',
  'Neighborhoods',
  'Moving',
  'Finance',
  'Comparisons',
  'Food & Dining',
  'Things to Do',
  'Home Tips',
]

export default function BlogSearch({ posts }: BlogSearchProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  // Filter posts by search term and category
  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        (post.frontmatter.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (post.frontmatter.metaDescription || '').toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === 'All' ||
        (post.frontmatter.category || '').toLowerCase() === category.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [posts, search, category])

  // Count posts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length }
    posts.forEach((p) => {
      const cat = p.frontmatter.category || 'Uncategorized'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [posts])

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-blue focus:outline-none text-sm"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0
          if (cat !== 'All' && !count) return null
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                category === cat
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-brand-slate hover:bg-gray-200'
              }`}
            >
              {cat} {count ? `(${count})` : ''}
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-brand-slate mb-4">
        {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Post grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, 60).map((post) => (
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

      {/* Load more hint */}
      {filtered.length > 60 && (
        <p className="text-center text-sm text-brand-slate mt-8">
          Showing 60 of {filtered.length} articles. Use search to narrow down.
        </p>
      )}
    </div>
  )
}
