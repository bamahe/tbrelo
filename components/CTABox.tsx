// ============================================================
// CTA BOX — Reusable call-to-action for Barrett's businesses
// ============================================================
// Usage: <CTABox type="realtor" /> or <CTABox type="handyman" /> or <CTABox type="pm" />
// Drop these into any page content area.
// ============================================================

interface CTABoxProps {
  type: 'realtor' | 'handyman' | 'pm' | 'mortgage'
}

const ctas = {
  realtor: {
    headline: 'Moving to Tampa Bay? Get a Local Expert.',
    body: 'Barrett Henry is a Broker Associate with REMAX Collective and over 23 years of real estate experience. Straight talk, smart strategy, no pressure.',
    cta: 'Contact Barrett',
    url: 'https://nowtb.com',
    phone: '(813) 733-7907',
    variant: 'primary' as const,
  },
  handyman: {
    headline: 'Need Help Setting Up Your New Home?',
    body: 'Best Bay Services handles handyman work, home repairs, and maintenance for your new Tampa Bay home. Local, licensed, and trusted.',
    cta: 'Get a Quote',
    url: 'https://bestbayservices.com',
    phone: '(813) 416-8676',
    variant: 'default' as const,
  },
  pm: {
    headline: 'Own Investment Property in Tampa Bay?',
    body: 'ViVi Property Management handles tenant placement, maintenance, and everything in between. Full-service, hassle-free.',
    cta: 'Learn More',
    url: 'https://vivipm.com',
    phone: null,
    variant: 'default' as const,
  },
  mortgage: {
    headline: 'Need a Mortgage for Your Tampa Bay Home?',
    body: 'Priority Funding offers competitive rates and fast closings. Local lender who understands the Tampa Bay market.',
    cta: 'Get Pre-Approved',
    url: 'https://priorityfunding.com',
    phone: null,
    variant: 'default' as const,
  },
}

export default function CTABox({ type }: CTABoxProps) {
  const cta = ctas[type]
  const isPrimary = cta.variant === 'primary'

  return (
    <div className={isPrimary ? 'cta-box-primary' : 'cta-box'}>
      <h3 className={`font-display font-bold text-xl mb-2 ${isPrimary ? 'text-white' : 'text-brand-navy'}`}>
        {cta.headline}
      </h3>
      <p className={`text-sm mb-4 ${isPrimary ? 'text-white' : 'text-brand-slate'}`}>
        {cta.body}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={cta.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center px-5 py-2.5 font-semibold text-sm rounded-lg transition-colors ${
            isPrimary
              ? 'bg-brand-blue text-white hover:bg-blue-600'
              : 'bg-brand-navy text-white hover:bg-brand-dark'
          }`}
        >
          {cta.cta} →
        </a>
        {cta.phone && (
          <a href={`tel:${cta.phone.replace(/\D/g, '')}`} className={`text-sm ${isPrimary ? 'text-white' : 'text-brand-blue'}`}>
            {cta.phone}
          </a>
        )}
      </div>
    </div>
  )
}
