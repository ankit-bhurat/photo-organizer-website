# Photo Organizer Website

Marketing website for Photo Organizer - a cross-platform desktop app for managing photos locally with AI-powered semantic search.

**Repo**: `https://github.com/ankit-bhurat/photo-organizer-website` (private)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5 + React (islands) + TypeScript |
| Styling | Tailwind CSS 3 with custom design system |
| Animations | GSAP (download page interactions) |
| Fonts | Inter (sans), JetBrains Mono (mono) — loaded via Google Fonts |
| Hosting | GitHub Pages (static output) |
| CI/CD | GitHub Actions — auto-deploy on push to `main` |
| Screenshots | Puppeteer (installed in `/tmp/node_modules` for dev previews) |

## Project Structure

```
src/
  layouts/
    Layout.astro          - Base HTML layout (meta, global CSS import, anti-flash theme script)
  pages/
    index.astro           - Landing page (hero, features, comparison, CTA)
    downloads.astro       - Download page with platform selection
    waitlist.astro        - Waitlist signup with form, social proof, FAQ
    docs/
      index.astro         - Documentation hub (card grid linking to sections)
      getting-started.astro - Step-by-step setup guide with sticky sidebar TOC
      faq.astro           - Accordion FAQ using <details>/<summary> (zero JS)
  components/
    Navbar.astro          - Fixed navbar with scroll-aware blur, mobile hamburger, theme toggle
    Footer.astro          - Newsletter signup, 4-column nav, gradient top border
    Hero.astro            - Full-height hero with mock app window showing AI search
    Features.astro        - Bento grid (6 cards, AI Search is hero card spanning 2x2)
    Comparison.astro      - Feature comparison table vs Google/Apple/Lightroom
    WaitlistCTA.astro     - Bottom CTA section with gradient glow
    DownloadSection.tsx   - React component: platform cards + GSAP animated install steps
  styles/
    global.css            - Tailwind layers, custom utilities, light/dark theme overrides
  assets/                 - Static assets processed by Vite (currently empty)
public/
  favicon.svg             - Blue photo/mountain icon
```

## Design System

### Theme Support
- **Dark mode** (default): Deep navy/charcoal backgrounds with vibrant blue accents
- **Light mode**: White/light gray backgrounds with same brand accents
- Toggle: Sun/moon button in navbar top-right, persisted to `localStorage`
- Anti-flash: Inline `<script>` in `<head>` reads `localStorage` before paint
- CSS approach: `[data-theme="light"]` overrides in `global.css` (not Tailwind dark: prefix)

### Color Tokens (tailwind.config.mjs)
- **brand-50..950**: Blue tones (brand-600 `#1e6ff5` is primary action color)
- **surface-50..950**: Dark grays (surface-950 `#0e0e14` is darkest background)
- **accent-purple** `#a855f7`, **accent-pink** `#ec4899`, **accent-cyan** `#06b6d4`, **accent-green** `#10b981`, **accent-orange** `#f97316`

### CSS Utility Classes (defined in global.css)
- `.card` — `bg-surface-900 border border-surface-800 rounded-2xl`
- `.card-hover` — card + transition hover effects
- `.btn-primary` — Blue filled button with shadow
- `.btn-secondary` — Dark outline button
- `.btn-ghost` — Transparent text button
- `.gradient-text` — Blue-to-cyan gradient text (`from-brand-400 to-accent-cyan`)
- `.gradient-text-warm` — Blue-purple-pink gradient text
- `.container-narrow` — `max-w-5xl mx-auto px-6`
- `.container-wide` — `max-w-7xl mx-auto px-6`
- `.section-spacing` — `py-24 md:py-32`
- `.grid-bg` — Subtle grid background pattern on body

### Important Styling Notes
- **Use solid backgrounds** — never use opacity on surface backgrounds (e.g. use `bg-surface-900` not `bg-surface-900/50`). Transparent backgrounds cause washed-out contrast issues.
- **Light theme overrides** are in `global.css` using `[data-theme="light"]` selectors. Any new dark-themed component needs corresponding light overrides added there.
- **Blur glow blobs** (decorative radial gradients) are hidden in light mode via `opacity: 0 !important`.

## Pages Detail

### Landing Page (`/`)
Composed of: Navbar → Hero → Features → Comparison → WaitlistCTA → Footer

- **Hero**: "Find any photo in seconds. Without the cloud." + mock macOS app window with AI search bar, folder sidebar, and colored photo thumbnail grid
- **Features**: Bento grid layout — AI Search (2x2 hero card with mini search mockup), Blazing Fast (stats), Privacy (checklist), Smart Organization (tag pills), EXIF Viewer (mono readout), Cross-Platform (OS icons)
- **Comparison**: Table comparing Photo Organizer vs Google Photos, Apple Photos, Lightroom across 9 features

### Downloads Page (`/downloads`)
- React component (`DownloadSection.tsx`) with `client:load` hydration
- 4 platform cards: Mac Apple Silicon, Mac Intel, Windows, Linux
- GSAP-animated install visualization per platform (Mac shows .dmg drag-to-Applications flow)

### Waitlist Page (`/waitlist`)
- Email signup form (name + email), POST to `#` placeholder
- Client-side JS shows success state on submit
- Social proof bar ("500+ photographers"), product highlights grid, FAQ accordion

### Docs (`/docs/*`)
- Hub page with 4 card links (Getting Started, Features Guide, AI Search, FAQ)
- Getting started: 5-step guide with sticky sidebar, prose typography
- FAQ: 8 questions using native `<details>/<summary>` (zero JavaScript)

## Development

```bash
npm run dev      # Start dev server (http://localhost:4321)
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build
```

### Taking Screenshots (for design review)
```bash
# Puppeteer is installed in /tmp/node_modules
node -e "
const puppeteer = require('/tmp/node_modules/puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/tmp/screenshot.png', fullPage: true });
  await browser.close();
})();
"
```

## Key Rules

- **Product spec** lives at `/Users/Kabir/_Dev/photo-organizer/PRODUCT_SPEC.md` — DO NOT modify
- **DO NOT modify** anything in `/Users/Kabir/_Dev/photo-organizer/` directory
- **Newsletter/waitlist forms** POST to `#` as placeholder (backend TBD)
- **GitHub Pages** deployment via GitHub Actions on push to `main`
- **Domain** not yet configured — `site` in `astro.config.mjs` is placeholder `https://photoorganizer.app`
- **No accounts/auth** — static site only, no backend yet

## Git History

1. `75111f9` — Initial project setup: Astro 5 + React + Tailwind, all 6 pages, components, GitHub Actions CI/CD
2. `60d17c8` — Add dark/light theme toggle, fix contrast issues (solid backgrounds, global.css import fix, 326 lines of light theme overrides)
