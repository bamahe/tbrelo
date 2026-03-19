# Guide Hub Page — nowtb.com/guides/

## Overview

A single resource hub page at `nowtb.com/guides/` that organizes all 60+ real estate guides into categorized sections. Full grid layout — everything visible on one scroll with jump-nav anchors.

## Deliverable

One HTML file containing raw HTML + inline `<style>` block that Barrett pastes into a new WordPress page (Classic Editor or HTML block). No Kadence blocks, no shortcodes, no JavaScript dependencies.

## Design Decisions

- **Layout:** Option B — Full Grid, everything visible. No collapsing, no tabs.
- **Card style:** Option A — Clean & minimal. Title + one-line description per card. No icons, no images.
- **Navigation:** Jump-nav pills at top link to anchor IDs on each H2 section.
- **CTAs:** Two navy CTA boxes inserted between sections (after Mortgage, after Florida Essentials).

## Style Specs

- **Colors:** Navy #0F172A, white #FFFFFF, light gray #F8F9FA, body text #374151. No other colors.
- **Fonts:** Headings = Outfit (Google Fonts), Body = DM Sans (Google Fonts)
- **Layout:** Max width 840px, wrapped in `<div class="nowtb-post-content">`
- **Headings:** H2/H3 in #0F172A. Anchor IDs on all H2s.
- **Cards:** Light gray background, 1px border #E5E7EB, 8px radius, hover lifts slightly.

## Sections (8 total, in order)

1. **First-Time Buyers** (6 guides)
2. **Home Buying Essentials** (7 guides)
3. **Mortgage & Financing** (10 guides)
4. **[CTA: Schedule a Call]**
5. **Selling Your Home** (10 guides)
6. **Florida Essentials** (10 guides)
7. **[CTA: Free Home Valuation]**
8. **Investing** (6 guides)
9. **Relocating to Tampa Bay** (7 guides)
10. **Neighborhood Comparisons** (18 guides)

## SEO

- Page title: "Tampa Bay Real Estate Guides | The NOW Team"
- Meta description: "60+ free guides covering buying, selling, investing, and relocating in Tampa Bay. Written by Barrett Henry — 23+ years of local experience."
- Every guide link visible on page load (no JavaScript hide/show) for full crawlability.
- Anchor IDs on H2s for jump links and potential featured snippets.

## Source of Truth

All guide URLs pulled from nowtb.com sitemap. The mockup at `.superpowers/brainstorm/9160-1773878663/page-mockup-v3.html` is the design reference.
