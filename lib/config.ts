// ============================================================
// SITE CONFIG — Central settings for tbrelo.com
// ============================================================

export const siteConfig = {
  name: 'TB Relo',
  tagline: 'Your Complete Guide to Moving to Tampa Bay',
  url: 'https://tbrelo.com',
  description: 'Comprehensive relocation guides for Tampa Bay, Florida. Covering 8 counties, 100+ cities, cost of living, moving logistics, neighborhoods, schools, and everything you need to know about moving to the Tampa Bay area.',
  
  // Barrett's contact info (for CTAs)
  contact: {
    name: 'Barrett Henry',
    title: 'REALTOR® & Broker Associate',
    company: 'RE/MAX Collective',
    phone: '(813) 733-7907',
    email: 'barrett@nowtb.com',
    website: 'https://nowtb.com',
  },
  
  // Counties covered
  counties: [
    'Hillsborough',
    'Pinellas',
    'Pasco',
    'Hernando',
    'Polk',
    'Manatee',
    'Sarasota',
    'Citrus',
  ],
  
  // Social links
  social: {
    tiktok: 'https://www.tiktok.com/@thenowteam',
    facebook: 'https://www.facebook.com/thenowteam',
  },
  
  // AdSense
  adsense: {
    clientId: '', // ADD YOUR ADSENSE CLIENT ID: ca-pub-XXXXXXXXXXXXXXXX
    enabled: false, // Set to true once AdSense is approved
  },
  
  // Google Analytics
  analytics: {
    gaId: '', // ADD YOUR GA4 MEASUREMENT ID: G-XXXXXXXXXX
    enabled: false, // Set to true once GA is set up
  },
}
