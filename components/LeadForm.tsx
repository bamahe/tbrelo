'use client'

import { useState, useRef, useEffect } from 'react'

// Cloudflare Turnstile site key
const TURNSTILE_SITE_KEY = '0x4AAAAAADDNl0Hp6UpmQdO0'

interface LeadFormProps {
  /** Heading above the form */
  headline?: string
  /** Subtext below the heading */
  subtext?: string
  /** Compact mode for inline/sidebar use */
  compact?: boolean
}

export default function LeadForm({
  headline = 'Moving to Tampa Bay? Let\u2019s Talk.',
  subtext = 'Barrett Henry — Broker Associate, REMAX Collective. 23+ years of real estate experience. No pressure, just answers.',
  compact = false,
}: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)

  // Load Turnstile script once
  useEffect(() => {
    if (document.getElementById('turnstile-script')) return
    const script = document.createElement('script')
    script.id = 'turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const form = formRef.current!
    const data = new FormData(form)

    // Get turnstile token from the rendered widget
    const turnstileInput = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')
    const turnstileToken = turnstileInput?.value || ''

    const body = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      phone: data.get('phone') as string,
      message: data.get('message') as string,
      timeline: data.get('timeline') as string,
      turnstileToken,
    }

    try {
      const res = await fetch('/api/lead/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Failed to submit')
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Call Barrett directly at (813) 733-7907.')
    }
  }

  if (status === 'sent') {
    return (
      <div className={`${compact ? 'p-6' : 'p-8 md:p-12'} bg-brand-navy text-white rounded-xl text-center`}>
        <div className="text-3xl mb-3">✓</div>
        <h3 className="font-display font-bold text-xl mb-2">Got it!</h3>
        <p className="text-sm opacity-80">Barrett will be in touch shortly. In the meantime, keep exploring — there&apos;s a lot to learn about Tampa Bay.</p>
      </div>
    )
  }

  return (
    <div className={`${compact ? 'p-6' : 'p-8 md:p-12'} bg-brand-navy rounded-xl`}>
      <h3 className={`font-display font-bold text-white ${compact ? 'text-lg mb-1' : 'text-2xl mb-2'}`}>
        {headline}
      </h3>
      <p className={`text-white/70 ${compact ? 'text-xs mb-4' : 'text-sm mb-6'}`}>{subtext}</p>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div className={compact ? '' : 'grid md:grid-cols-2 gap-3'}>
          <input name="name" type="text" required placeholder="Your name" className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:border-brand-sky focus:outline-none text-sm" />
          <input name="email" type="email" required placeholder="Email address" className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:border-brand-sky focus:outline-none text-sm" />
        </div>
        <div className={compact ? '' : 'grid md:grid-cols-2 gap-3'}>
          <input name="phone" type="tel" placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:border-brand-sky focus:outline-none text-sm" />
          <select name="timeline" className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-brand-sky focus:outline-none text-sm">
            <option value="">When are you moving?</option>
            <option value="1-3 months">1–3 months</option>
            <option value="3-6 months">3–6 months</option>
            <option value="6-12 months">6–12 months</option>
            <option value="Just researching">Just researching</option>
          </select>
        </div>
        <textarea name="message" required rows={compact ? 2 : 3} placeholder="What do you want to know about Tampa Bay?" className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/40 border border-white/20 focus:border-brand-sky focus:outline-none text-sm resize-none" />

        {/* Cloudflare Turnstile widget */}
        <div ref={turnstileRef} className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" data-size="compact" />

        {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}

        <button type="submit" disabled={status === 'sending'} className="w-full py-3 px-6 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm">
          {status === 'sending' ? 'Sending...' : 'Get in Touch →'}
        </button>
      </form>
    </div>
  )
}
