/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server mode — needed for API routes (lead capture, FUB integration)
  // Vercel handles this natively with serverless functions
  trailingSlash: true,

  // Increase static generation timeout for pages with lots of content
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig
