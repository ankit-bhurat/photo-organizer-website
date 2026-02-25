# CullVue Website — Remaining Tasks

## High Priority (Pre-Launch Blockers)

- [ ] **New logo** — Current logo is a placeholder. Need final crystalline aperture design in high resolution.
- [ ] **Set Pro pricing** — `$XX` placeholder on `/pricing` needs a real price.
- [ ] **Terms of Service page** — Content drafted in `TERMS_OF_SERVICE.md`. Needs to be turned into an `.astro` page at `/terms` and linked from the footer.
- [ ] **Enable analytics** — Uncomment Plausible script in `Layout.astro` (line ~78). Confirm domain is `cullvue.com`.
- [x] **Fix broken Hero CTAs** — Changed `#waitlist` → `/waitlist` (links to dedicated waitlist page) and `#how-it-works` → `#features` (scrolls to features section).
- [x] **Fix "download now" vs "Coming soon" conflict** — Changed "or download now" to "or see download options" in `WaitlistCTA.astro`.

## Medium Priority (Post-Launch OK)

- [ ] **Blog content** — `/blog` is a "Coming Soon" placeholder. Write 1-2 launch posts (e.g., "Why we built CullVue", "How AI search works locally").
- [ ] **Changelog entries** — `/changelog` has only a single beta entry. Populate as features ship.
- [ ] **OG image** — Regenerate `og-image.png` once the final logo is ready.
- [ ] **Lazy loading** — Add `loading="lazy"` and `decoding="async"` to non-critical images for performance.
- [ ] **Favicon regeneration** — Regenerate all favicon variants once final logo is ready.
- [x] **Fix skip-to-content link** — Made `#main-content` div wrap the `<slot />` content in `Layout.astro` so the skip link lands on actual page content.

## Low Priority (Nice to Have)

- [ ] **Add `fetchpriority="high"` to hero images** — LCP optimization.
- [x] **Breadcrumbs on docs pages** — Verified: all 6 doc subpages already have consistent breadcrumbs; hub page correctly has none.
- [ ] **Social media accounts** — Verify GitHub (`github.com/cullvue`) and X (`x.com/cullvue`) accounts exist and match footer links.
- [ ] **Custom email domain** — Set up `support@cullvue.com` for the contact page.
- [x] **Clean up Navbar/Footer event binding** — Simplified to `astro:page-load` only (handles both initial load and SPA navigations).

## Done

- [x] All 17+ pages built and styled
- [x] Dark/light theme with toggle and anti-flash
- [x] Contrast audit — all pages pass in both themes
- [x] Form backends (newsletter, waitlist, contact) via Cloudflare Workers
- [x] SEO (meta tags, OG, Twitter cards, JSON-LD, sitemap, robots.txt, canonical URLs)
- [x] Accessibility (skip nav, aria labels, focus states, semantic HTML)
- [x] Mobile responsiveness
- [x] 404 page
- [x] Favicons, manifest.json, CNAME
- [x] GitHub Actions CI/CD
- [x] Privacy policy
- [x] FAQ structured data
- [x] Google Fonts (Inter, JetBrains Mono)
- [x] Branding renamed to CullVue
- [x] 14-day trial changed to 30-day trial
