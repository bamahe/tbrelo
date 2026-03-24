import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { replaceAffiliateLinks } from './affiliates'

// ============================================================
// CONTENT LOADER
// ============================================================
// Reads markdown files from /content directory.
// Each subdirectory = a content type (counties, cities, blog, etc.)
// Frontmatter = page metadata (title, description, schema, etc.)
// Body = page content with {{affiliate}} placeholders auto-replaced.
// ============================================================

const contentDirectory = path.join(process.cwd(), 'content')

// Convert raw markdown string to HTML using remark
function markdownToHtml(markdown: string): string {
  const result = remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).processSync(markdown)
  return String(result)
}

export interface ContentPage {
  slug: string
  frontmatter: {
    title: string
    metaTitle: string
    metaDescription: string
    county?: string
    type: 'county' | 'city' | 'pillar' | 'moving-from' | 'comparison' | 'blog' | 'utility' | 'page'
    publishedAt?: string
    updatedAt?: string
    schema?: Record<string, any>
    [key: string]: any
  }
  content: string
  faqs: { question: string; answer: string }[]
}

// Extract FAQ pairs from raw markdown
// Looks for ## FAQ section, then **Question?** / Answer text pattern
function extractFaqs(markdown: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []

  // Find the FAQ section (## FAQ or ## Frequently Asked Questions)
  const faqMatch = markdown.match(/## (?:FAQ|Frequently Asked Questions)\s*\n([\s\S]*?)(?=\n## |\n---|$)/)
  if (!faqMatch) return faqs

  const faqSection = faqMatch[1]

  // Match both formats:
  // Blog posts:   **Question?** followed by answer text
  // Pillar pages: ### Question? followed by answer text
  const regex = /(?:\*\*(.+?\?)\*\*|### (.+?\?))\s*\n([\s\S]*?)(?=\n\*\*|\n### |\n## |$)/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(faqSection)) !== null) {
    const question = (match[1] || match[2]).trim()
    // Clean markdown from answer: strip links, bold, etc. for plain text schema
    const answer = match[3].trim()
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [text](url) → text
      .replace(/\*\*([^*]+)\*\*/g, '$1')          // **bold** → bold
      .replace(/\*([^*]+)\*/g, '$1')               // *italic* → italic
      .replace(/\n+/g, ' ')                        // collapse newlines
      .trim()

    if (question && answer) {
      faqs.push({ question, answer })
    }
  }

  return faqs
}

// Get all markdown files from a content subdirectory
export function getContentByType(type: string): ContentPage[] {
  const dir = path.join(contentDirectory, type)
  
  if (!fs.existsSync(dir)) return []
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
  
  return files.map(filename => {
    const filePath = path.join(dir, filename)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      slug: filename.replace('.md', ''),
      frontmatter: data as ContentPage['frontmatter'],
      content: markdownToHtml(replaceAffiliateLinks(content)),
      faqs: extractFaqs(content),
    }
  }).sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''))
}

// Get a single page by type and slug
export function getContentPage(type: string, slug: string): ContentPage | null {
  const filePath = path.join(contentDirectory, type, `${slug}.md`)
  
  if (!fs.existsSync(filePath)) return null
  
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)
  
  return {
    slug,
    frontmatter: data as ContentPage['frontmatter'],
    content: markdownToHtml(replaceAffiliateLinks(content)),
    faqs: extractFaqs(content),
  }
}

// Get all content across all types (for sitemap generation)
export function getAllContent(): ContentPage[] {
  if (!fs.existsSync(contentDirectory)) return []
  
  const types = fs.readdirSync(contentDirectory).filter(f => 
    fs.statSync(path.join(contentDirectory, f)).isDirectory()
  )
  
  return types.flatMap(type => 
    getContentByType(type).map(page => ({
      ...page,
      slug: `${type}/${page.slug}`,
    }))
  )
}

// Get all slugs for a content type (for static path generation)
export function getContentSlugs(type: string): string[] {
  const dir = path.join(contentDirectory, type)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
}
