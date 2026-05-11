// ============================================================
// FAQ SCHEMA — Visible FAQ section + JSON-LD structured data
// ============================================================
// Renders a visible accordion-style FAQ and injects FAQPage
// schema markup for Google rich results and AI answer engines.
// Server component — no 'use client' needed.
// ============================================================

interface FAQ {
  question: string
  answer: string
}

interface FAQSchemaProps {
  /** Array of question/answer pairs */
  faqs: FAQ[]
  /** Optional heading above the FAQ list */
  heading?: string
}

export default function FAQSchema({ faqs, heading = 'Frequently Asked Questions' }: FAQSchemaProps) {
  // Build FAQPage JSON-LD for search engines and AI crawlers
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="py-12 md:py-16">
      {/* JSON-LD schema injected into head for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-center mb-8">{heading}</h2>

        {/* Visible FAQ list — each item is a question-format H3 + answer */}
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <h3 className="font-display font-bold text-lg text-brand-navy mb-2">
                {faq.question}
              </h3>
              <p className="text-brand-slate leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
