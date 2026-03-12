import Link from 'next/link'
import { generateBreadcrumbSchema } from '@/lib/schema'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: 'Home', href: '/' }, ...items]
  const schemaItems = allItems.map(item => ({ name: item.label, url: item.href }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(schemaItems)) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-brand-slate mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && <span className="text-gray-300">/</span>}
              {index === allItems.length - 1 ? (
                <span className="text-brand-navy font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-brand-blue transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
