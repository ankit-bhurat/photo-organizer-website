# Photo Organizer Website

Marketing website for Photo Organizer - a cross-platform desktop app for managing photos locally with AI-powered semantic search.

## Tech Stack
- **Framework**: Astro 5 + React (islands) + TypeScript
- **Styling**: Tailwind CSS 3 with custom dark theme
- **Animations**: GSAP
- **Hosting**: GitHub Pages (static output)
- **CI/CD**: GitHub Actions (auto-deploy on push to main)

## Project Structure
```
src/
  layouts/       - Base HTML layouts (Layout.astro)
  pages/         - File-based routing (index, downloads, waitlist, docs/)
  components/    - Reusable components (Navbar, Footer, Hero, Features, etc.)
  styles/        - Global CSS (global.css with Tailwind)
  assets/        - Static assets processed by Vite
public/          - Static files served as-is (favicon, images)
```

## Design System
- **Theme**: Dark with vibrant accents (Linear/Raycast aesthetic)
- **Colors**: brand-* (blue), surface-* (dark grays), accent-* (purple, pink, cyan, green, orange)
- **Typography**: Inter (sans), JetBrains Mono (mono)
- **Components**: card, card-hover, btn-primary, btn-secondary, btn-ghost, gradient-text

## Pages
- `/` - Landing page (hero, features, comparison, CTA)
- `/downloads` - Platform-specific download with Mac install animation
- `/waitlist` - Email signup for early access
- `/docs/` - Documentation hub
- `/docs/getting-started` - Setup guide
- `/docs/faq` - Frequently asked questions

## Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Key Decisions
- Product spec lives at /Users/Kabir/_Dev/photo-organizer/PRODUCT_SPEC.md (DO NOT modify)
- DO NOT modify anything in /Users/Kabir/_Dev/photo-organizer/ directory
- Newsletter/waitlist forms POST to "#" as placeholder (backend TBD)
- GitHub Pages deployment via GitHub Actions on push to main
