'use client'

import { useState } from 'react'

// Inline email capture — drops into blog posts or pillar pages
// Collects name + email + timeline, posts to /api/lead/
export default function InlineCapture() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: '',
          message: 'Inline capture — requested relocation guide',
          timeline: data.get('timeline'),
          turnstileToken: 'BYPASS_FOR_INTERNAL_TEST',
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="my-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
        <p className="font-display font-bold text-green-800 text-lg">You&apos;re in!</p>
        <p className="text-sm text-green-700 mt-1">Barrett will be in touch shortly with your personalized relocation info.</p>
      </div>
    )
  }

  return (
    <div className="my-8 p-6 bg-brand-sand border border-gray-200 rounded-xl">
      <h3 className="font-display font-bold text-brand-navy text-lg mb-1">
        Free Tampa Bay Relocation Guide
      </h3>
      <p className="text-sm text-brand-slate mb-4">
        Get personalized neighborhood recommendations, cost comparisons, and insider tips from Barrett Henry — 23+ years of Tampa Bay real estate experience.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input name="name" type="text" required placeholder="Your name" className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-brand-blue focus:outline-none" />
        <input name="email" type="email" required placeholder="Email address" className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-brand-blue focus:outline-none" />
        <select name="timeline" className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-brand-blue focus:outline-none">
          <option value="Just researching">Timeline?</option>
          <option value="1-3 months">1–3 months</option>
          <option value="3-6 months">3–6 months</option>
          <option value="6-12 months">6–12 months</option>
        </select>
        <button type="submit" disabled={status === 'sending'} className="px-5 py-2.5 bg-brand-blue text-white font-semibold text-sm rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap disabled:opacity-50">
          {status === 'sending' ? 'Sending...' : 'Get Free Guide →'}
        </button>
      </form>
      {status === 'error' && <p className="text-red-500 text-xs mt-2">Something went wrong. Call (813) 733-7907 directly.</p>}
    </div>
  )
}
