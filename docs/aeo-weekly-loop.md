# AEO Weekly Loop — tbrelo.com

Run this checklist every Monday to monitor search performance and AI citation presence.

## Google Search Console (GSC)

- [ ] Check **Performance > Search Results** for the past 7 days
- [ ] Note top 10 queries by impressions — are any new question queries appearing?
- [ ] Check CTR for FAQ-format queries (questions starting with "what", "how", "is")
- [ ] Review **Pages** tab — are /about, homepage, and county pages getting impressions?
- [ ] Check **Coverage/Indexing** for any new errors or warnings
- [ ] Submit any new pages via URL Inspection if not yet indexed

## AI Citation Checks

Run these queries in each AI engine and note whether tbrelo.com is cited:

### ChatGPT
- [ ] "What is the best guide for moving to Tampa Bay?"
- [ ] "What counties are in Tampa Bay Florida?"
- [ ] "Is Tampa Bay a good place to live?"

### Perplexity
- [ ] "Tampa Bay relocation guide"
- [ ] "cost of living Tampa Bay Florida"
- [ ] "best cities in Tampa Bay for families"

### Google AI Overview
- [ ] "moving to Tampa Bay"
- [ ] "Tampa Bay counties"
- [ ] "Tampa Bay vs Orlando cost of living"

## Actions Based on Findings

- If a query is getting impressions but low CTR: improve the meta description or add a QuickAnswer for that topic
- If an AI engine cites a competitor instead: create or improve the page targeting that query
- If a new question query appears in GSC: consider adding it to the FAQ schema on the relevant page
- If /about or homepage drops in rankings: check that schema is valid at https://search.google.com/test/rich-results

## Schema Validation

- [ ] Run homepage through Rich Results Test: https://search.google.com/test/rich-results
- [ ] Run /about through Rich Results Test
- [ ] Check for any schema errors or warnings

## Monthly (First Monday)

- [ ] Update FAQ answers if any data has changed (cost of living, market stats)
- [ ] Add new FAQs based on GSC query data
- [ ] Review llms.txt — add any new key pages
- [ ] Check that all AI bot user-agents are still allowed in robots.txt
