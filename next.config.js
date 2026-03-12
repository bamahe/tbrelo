/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for maximum speed + easy deployment
  // Remove this line if you need server-side features later
  output: 'export',
  
  // Clean URLs: /hillsborough instead of /hillsborough.html
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
