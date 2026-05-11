// ============================================================
// QUICK ANSWER — AEO component for answer-engine snippets
// ============================================================
// Navy background box that surfaces a direct Q&A for AI crawlers
// and answer engines (Google AI Overview, ChatGPT, Perplexity).
// Server component — no 'use client' needed.
// ============================================================

interface QuickAnswerProps {
  /** The question AI engines will match against */
  question: string
  /** 40-60 word direct answer — front-loaded with the key fact */
  answer: string
}

export default function QuickAnswer({ question, answer }: QuickAnswerProps) {
  return (
    <section
      className="bg-[#0B2545] text-white rounded-xl p-6 md:p-8 my-8"
      role="region"
      aria-label="Quick Answer"
    >
      {/* Question heading — matches what users type into search / AI */}
      <h2 className="font-display font-bold text-xl md:text-2xl mb-3 text-white">
        {question}
      </h2>
      {/* Direct answer — 40-60 words, optimized for snippet extraction */}
      <p className="text-gray-200 leading-relaxed text-base md:text-lg">
        {answer}
      </p>
    </section>
  )
}
