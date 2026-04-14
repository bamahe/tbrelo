import Link from 'next/link'
import { Metadata } from 'next'
import { getContentByType } from '@/lib/content'
import { generateWebPageSchema } from '@/lib/schema'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'Tampa Bay Relocation Questions — 1,500+ Answered by a Local REALTOR® | TB Relo',
  description: 'Got questions about moving to Tampa Bay? Browse 1,500+ questions answered by Barrett Henry, a REALTOR® with 23+ years of real estate experience.',
}

export default function QuestionsIndex() {
  const questions = getContentByType('questions')

  // Group by category from frontmatter
  const byCategory: Record<string, typeof questions> = {}
  for (const q of questions) {
    const category = q.frontmatter.category || 'General'
    if (!byCategory[category]) byCategory[category] = []
    byCategory[category].push(q)
  }

  // Sort categories alphabetically
  const sortedCategories = Object.keys(byCategory).sort()

  // Count total questions (each page has ~30)
  const totalQuestions = questions.length * 30

  const schema = generateWebPageSchema({
    title: 'Tampa Bay Relocation Questions — Answered by a Local REALTOR®',
    description: 'Browse 1,500+ questions about moving to Tampa Bay, answered by Barrett Henry.',
    url: '/questions/',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb items={[{ label: 'Questions', href: '/questions/' }]} />

        <h1 className="mb-4">Tampa Bay Relocation Questions</h1>
        <p className="text-brand-slate mb-10 max-w-2xl">
          {totalQuestions.toLocaleString()}+ questions about moving to Tampa Bay, answered by Barrett Henry — a REALTOR® and Broker Associate with 23+ years of real estate experience. Browse by topic below.
        </p>

        {/* Category grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {sortedCategories.map(category => (
            <div key={category} className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-display font-bold text-lg text-brand-navy mb-3">
                {category}
              </h2>
              <div className="space-y-1.5">
                {byCategory[category].map(q => (
                  <Link
                    key={q.slug}
                    href={`/questions/${q.slug}/`}
                    className="block text-sm text-brand-slate hover:text-brand-blue transition-colors"
                  >
                    {q.frontmatter.title} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
