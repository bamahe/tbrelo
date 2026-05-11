'use client'

import { useState, useEffect } from 'react'

// Sticky mobile CTA bar — shows after scrolling 500px
// Phone call button + "Free Guide" button
export default function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed || !visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-brand-navy border-t border-white/10 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3">
        {/* Call button */}
        <a
          href="tel:8137337907"
          className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white text-sm font-semibold py-2.5 rounded-lg"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          Call Barrett
        </a>
        {/* Contact link */}
        <a
          href="#contact-form"
          className="flex-1 flex items-center justify-center gap-2 bg-white text-brand-navy text-sm font-semibold py-2.5 rounded-lg"
          onClick={() => {
            // Scroll to the contact form if on page
            const el = document.getElementById('contact-form')
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' })
              setDismissed(true)
            }
          }}
        >
          Get Free Guide
        </a>
        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="text-white/50 hover:text-white p-1"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    </div>
  )
}
