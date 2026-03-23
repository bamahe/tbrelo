// ============================================================
// HERO IMAGE BANNER
// ============================================================
// Full-width banner with background image, dark overlay, and page title.
// Used on all content pages (pillar, county, city, blog, moving-from).
// The image fills the container, and text is overlaid for readability.
// ============================================================

import Image from 'next/image'

interface HeroImageProps {
  src: string    // Path relative to /images/, e.g. "heroes/hillsborough.jpg"
  title: string  // Page title displayed over the image
  subtitle?: string // Optional subtitle below the title
}

export default function HeroImage({ src, title, subtitle }: HeroImageProps) {
  return (
    <section className="relative w-full h-[200px] md:h-[300px] overflow-hidden bg-brand-navy">
      {/* Background image — fills the container */}
      <Image
        src={`/images/${src}`}
        alt={title}
        fill
        className="object-cover"
        unoptimized
        priority
      />
      {/* Dark overlay so white text is readable on any image */}
      <div className="absolute inset-0 bg-brand-navy/60" />
      {/* Title text centered over the image */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-white text-3xl md:text-5xl font-display font-extrabold leading-tight max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 text-lg mt-3 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
