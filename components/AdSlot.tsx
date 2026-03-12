// ============================================================
// AD SLOT — Drop this anywhere to place an ad
// ============================================================
// Usage: <AdSlot slot="top" /> or <AdSlot slot="mid" /> or <AdSlot slot="sidebar" />
// Renders nothing if AdSense isn't enabled yet.
// ============================================================

import { siteConfig } from '@/lib/config'

interface AdSlotProps {
  slot: 'top' | 'mid' | 'bottom' | 'sidebar'
  className?: string
}

export default function AdSlot({ slot, className = '' }: AdSlotProps) {
  // Don't render anything if AdSense isn't enabled
  if (!siteConfig.adsense.enabled) return null

  const slotStyles: Record<string, string> = {
    top: 'ad-slot',
    mid: 'ad-slot',
    bottom: 'ad-slot',
    sidebar: 'ad-slot-sidebar',
  }

  return (
    <div className={`${slotStyles[slot]} ${className}`}>
      {/* AdSense auto ad — Google handles placement optimization */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={siteConfig.adsense.clientId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
