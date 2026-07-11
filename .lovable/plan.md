This build implements the CitiTour master brief in a prioritized sequence so the visual overhaul lands first, then new SEO pages, then admin dashboard.

## 1. Design system redesign (global, one pass)

Rewrite `src/index.css` and `tailwind.config.ts` tokens to the West-African urban-lux palette:

- Light (default): background `#FAF7F1`, card `#FFFFFF`, border `#E8E0D4`, ink `#1C1710`, muted `#6B6255`, primary marigold `#D9891F`, coral `#D9422E`, palm green `#146B5E`.
- Dark: background `#0B0E14`, card `#12161F`, text `#F4EFE6`, gold `#F2A93B`, coral `#E85B45`, palm `#1B7A6E`.
- Typography: pair a bold geometric display font (Fraunces or Bricolage Grotesque) for H1/H2 with Inter for body. Load via `<link>` in `index.html`.
- Rebuild button variants (primary = solid marigold with ink text; cta = solid coral; success = palm). Remove all blue→purple gradient utilities from components (`HeroSlider`, `CategoryGrid`, `SideMenu`, landing page, listing/detail/wallet pages).
- Unify card component: `rounded-xl`, `border-border`, `shadow-card`, consistent padding, applied via a shared `Card` variant.
- Update `ThemeContext` to expose Light / Dark / System with `localStorage` persistence; add toggle in `SettingsPage`. Light is default.

## 2. Homepage additions (`LandingPage.tsx`)

- Full header nav: Hotels, Restaurants, Events, Split It, List Your Business, Blog + Sign In.
- Manual state picker dropdown (searchable) using the existing `RegionContext`, works when GPS is denied.
- Distinct "For Businesses" CTA block.
- FAQ section (8 Q&As) with `FAQPage` JSON-LD via `SEO.tsx`.
- Rich footer sitemap: state links, company, legal, socials.

## 3. New public pages

- `/nigeria/:stateSlug` — reusable `StatePage` template. Data source: static array of first-tier states (Lagos, Abuja, Port Harcourt, Enugu, Kano, Ibadan, Calabar, Uyo) with unique 100–150 word intros + per-city FAQ. Sections pull existing listing cards filtered by state; JSON-LD for `LocalBusiness`, `Hotel`, `Restaurant`, `Event`. Unpopulated states emit `<meta name="robots" content="noindex, follow">`.
- `/split-it` — hero, 4-step how-it-works, use-case grid, FAQ.
- `/list-your-business` — value prop, steps, plan tiers, CTA linking to existing `/business-listing`.
- `/host-an-event` — value prop, ticketing flow, CTA to `/event-tickets`.
- `/blog` + `/blog/:slug` — static array of 3 seed posts, MDX-lite (markdown string rendered with basic paragraph/heading formatter), internal links to state/feature pages.
- All new routes registered as public routes in `src/App.tsx` (above the `ProtectedRoutes` catch-all).

## 4. Technical SEO

- Extend `SEO.tsx` to accept canonical, OG, Twitter, robots, and JSON-LD props; use it on every new public page.
- Add `public/robots.txt` allowing `/`, `/nigeria/*`, `/split-it`, `/list-your-business`, `/host-an-event`, `/blog*`, disallowing `/explore`, `/profile`, `/wallet`, `/settings`, `/admin*`.
- Generate `public/sitemap.xml` listing only the live (populated) pages.
- Pre-rendering: this stack is Vite SPA. Install `vite-plugin-prerender` (or `react-snap` fallback) and register the public marketing routes so build emits static HTML shells with meta tags and content. Note this in `README.md` — dashboard routes stay CSR.
- Every image gets descriptive `alt`; add `loading="lazy"` below the fold.

## 5. Admin dashboard (`admin-dashboard/`)

- Mirror the same tokens in `admin-dashboard/src/index.css` and `tailwind.config.js` (ivory bg, marigold accents, ink text, palm/coral status colors).
- Replace generic blue/green stat-card colors in `DashboardPage.tsx` with semantic tokens (`bg-primary`, `bg-success`, `bg-accent`).
- Update `Layout.tsx` sidebar to marigold active state, ink text on ivory.
- Unify `card`, `btn-primary`, `input` classes in `index.css` so every admin page picks up the new look without per-page edits.

## Technical notes

- No backend changes. Lovable Cloud is not enabled and not required for this pass.
- Fonts loaded via Google Fonts `<link>` (no npm add).
- Prerender plugin adds a build-time step only; dev server unaffected.
- Blog and state-page content is authored in-repo (`src/content/blog/*.ts`, `src/content/states/*.ts`) so it's crawlable after prerender.
- Existing routes, auth flow, wallet, and listing pages are preserved — only styling and new routes added.

## Out of scope for this pass

- Real photography (placeholders stay; treatments only per brief).
- Populating >2 blog posts or all 36 states.
- Custom domain / GSC submission (deployment step).
- Migrating to a true SSR framework (prerender covers the SEO need).