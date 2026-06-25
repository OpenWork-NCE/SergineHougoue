# Sergine Hougoue — Real Estate Web Application Design

**Date**: 2026-06-24
**Client**: Sergine Hougoue, OACIQ-certified real estate broker, VENDIRECT agency, Quebec
**Working directory**: `C:\Users\AM\Documents\Workspace\DHC\immo`
**Status**: Approved by client — ready for implementation planning

## 1. Purpose & Goals

Sergine Hougoue is launching a new web presence to develop her real estate brokerage in Quebec. The current site is no longer available, so this project is greenfield.

**Primary business goal**: Acquire at least one new client per month that converts to a transaction (buy, sell, or rent).

**Secondary goals**:

- Reposition Sergine's existing Facebook page (~5,000 followers) from a previous writing/chronicles audience to a real estate audience.
- Establish a professional, trustworthy web identity that converts Quebec prospects into booked appointments.
- Provide a foundation the team can maintain (CMS-driven content, bilingual, SEO-friendly).
- Enable measurable lead tracking so the team can see whether "1 client/month" is being achieved and from which channels.

**Out of scope (handled separately, not in this spec)**:

- Social media account creation and management (TikTok, Instagram) — handled by the marketing team.
- Facebook page repositioning and ongoing content — handled by the marketing team.
- Sponsored Facebook ad campaigns — handled by the marketing team.
- Real estate photography — professional photos will be supplied later; placeholders ship first.
- Custom CRM integration beyond email + sheet logging — not needed at launch.

## 2. Decisions Summary

| #   | Decision             | Choice                                                                                                                                   |
| --- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Visual foundation    | Existing `DESIGN.md` (Lesse Studio dark editorial) as base; supplement from nlandurealestate/marioconte/guillou only where it adds value |
| 2   | Scope                | All 7 pages at launch with modest depth                                                                                                  |
| 3   | Listings data source | Hand-curated showcase (managed via Sanity)                                                                                               |
| 4   | CMS                  | Sanity (free tier, embedded studio)                                                                                                      |
| 5   | Language             | Bilingual FR + EN with full route-level toggle                                                                                           |
| 6   | Contact delivery     | Email (Resend) + click-to-WhatsApp buttons                                                                                               |
| 7   | Booking              | Cal.com embedded widget on Contact page                                                                                                  |
| 8   | Hosting              | Vercel                                                                                                                                   |
| 9   | Framework            | SvelteKit 2 + Svelte 5 + TypeScript + Tailwind                                                                                           |
| 10  | SEO                  | Baseline SEO + blog-driven content SEO                                                                                                   |
| 11  | Analytics            | Google Analytics 4 + Quebec Law 25 cookie consent                                                                                        |

## 3. Architecture & Stack

### Tech stack

| Layer          | Choice                                                | Rationale                                                                                          |
| -------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Framework      | SvelteKit 2 + Svelte 5 + TypeScript                   | Fast, low-JS, great SEO, idiomatic with existing DESIGN.md tokens                                  |
| Bundler        | Vite (via SvelteKit)                                  | Default, fast HMR                                                                                  |
| Styling        | Tailwind CSS + CSS variables                          | Existing DESIGN.md tokens live as `:root` variables; Tailwind utility classes consume them         |
| CMS            | Sanity (free tier)                                    | Real-time collaboration, generous free tier, first-class i18n plugin, embedded Studio at `/studio` |
| Hosting        | Vercel                                                | Free tier covers this scale, auto-deploys from Git, serverless functions for form handler          |
| Email delivery | Resend (free tier, 100/day)                           | Simple API, modern DX, generous free quota                                                         |
| Booking        | Cal.com (free cloud tier)                             | Open source, embeddable, syncs to Google/Outlook                                                   |
| WhatsApp       | Click-to-`wa.me` links (no paid API)                  | Free, works today, what most Quebec brokers do                                                     |
| Analytics      | Google Analytics 4                                    | Industry standard for marketing attribution                                                        |
| Cookie consent | Custom lightweight banner                             | Quebec Law 25 / GDPR-compliant, no third-party dependency                                          |
| SEO            | Per-page meta, OG, structured data, hreflang, sitemap | Baseline + blog content strategy                                                                   |

### Design tokens

The existing DESIGN.md defines a dark editorial palette. We extend it with two brand tokens sampled from Sergine's business card:

```css
:root {
  /* Existing DESIGN.md tokens (unchanged) */
  --bg-canvas: #0e0e0e;
  --bg-surface: #161616;
  --bg-elevated: #1f1f1f;
  --text-primary: #f5f2ec;
  --text-secondary: #a8a29a;
  --text-muted: #6b6660;
  --border-hairline: rgba(245, 242, 236, 0.08);
  --accent: #e8dfd0; /* bone — neutral highlights */
  --state-hover: rgba(255, 255, 255, 0.06);

  /* NEW — Sergine brand tokens (sampled from business card) */
  --brand-burgundy: #6e1f2e; /* primary CTA fills, active states, dividers */
  --brand-gold: #c9a24a; /* secondary accents, eyebrow text, "En Primeur" tag, link arrows */
}
```

**Token usage rules**:

- **Burgundy** — primary CTA fills, active nav state, section dividers, "Vendu" badge
- **Gold** — secondary accents, eyebrow text, "En Primeur" tag, inline link arrows, key highlight bars
- **Bone (`--accent`)** — neutral highlights, testimonial chips, focus rings, decorative hairlines
- **Dark/cream (`--bg-canvas` / `--text-primary`)** — page canvas and primary text, unchanged

### Typography (per DESIGN.md)

- **Display / headings**: Fraunces (Google Fonts), italic weights 300/500
- **Body**: Inter, weights 300/400/500
- Both preloaded in `+layout.svelte` via `<link rel="preload">` for the woff2 files

### Motion (per DESIGN.md)

- Default transition: `700ms cubic-bezier(0.22, 1, 0.36, 1)`
- Scroll-reveal: IntersectionObserver adds `.is-visible` class (fade + translateY 24px)
- `prefers-reduced-motion: reduce` disables scroll-reveal and any auto-advance carousels
- Carousel auto-advance: every 6 seconds, pause on hover/focus

## 4. Information Architecture

### Routes

```
src/routes/
├── +layout.svelte                    (Nav, Footer, LangToggle, CookieBanner)
├── +layout.server.ts                 (load locale from cookie/URL)
├── +layout.ts                        (set <html lang>)
├── +page.svelte                      (Home / Accueil)
├── a-propos/+page.svelte             (About / storytelling)
├── services/+page.svelte             (Services for buyers & sellers)
├── biens/+page.svelte                (Listings grid)
├── biens/[slug]/+page.svelte         (Single listing detail)
├── transactions/+page.svelte         (Closed deals + partners)
├── blog/+page.svelte                 (Blog index, paginated)
├── blog/[slug]/+page.svelte          (Blog post)
├── contact/+page.svelte              (Contact + Cal.com embed + form)
├── api/contact/+server.ts            (POST handler → Resend)
├── api/og/+server.ts                 (dynamic OG image generator)
└── studio/[[...index]]/+page.svelte  (embedded Sanity Studio)
```

### Locale handling

- Default locale: French
- All public routes are served under a locale prefix: `/fr/...` and `/en/...`
- Requests to a non-prefixed path (e.g. `/services`) are redirected by `hooks.server.ts` middleware to the FR-prefixed version (`/fr/services`)
- Language toggle preserves the current path (`/fr/services` ↔ `/en/services`)
- Sanity Studio uses `@sanity/document-internationalization` plugin for content authors

### Page-by-page intent

| Route          | Purpose                        | Key sections                                                                                                                    |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Home           | Convert — capture leads fast   | Hero (Sergine photo, H1, CTA, WhatsApp), 3 value-prop cards, featured listings carousel (3), testimonial chips, CTA strip       |
| About          | Build trust via storytelling   | Two-column editorial photo + long-form bio from `Texts utilities.txt`, 5-pillar values block                                    |
| Services       | Explain offerings              | Numbered accordion with 4 categories (Buyers first-time / Buyers investment / Sellers evaluation / Sellers strategy)            |
| Listings       | Show inventory                 | Hand-curated grid of ~6–12 featured properties, each card: photo, price, address, beds/baths/area, type, "Voir le détail" arrow |
| Listing detail | Convert on a specific property | Full gallery (Svelte lightbox), specs table, description, map embed, contact CTA strip                                          |
| Transactions   | Social proof                   | Closed-deals grid (tagged "Vendu"), partners section (lenders, notaries, inspectors) when logos provided                        |
| Blog           | SEO + education                | Index with 3 latest featured + paginated older posts; each post: hero image, 5-min read, FR + EN versions                       |
| Contact        | Capture + book                 | Phone/email/WhatsApp buttons, Cal.com inline embed, contact form (name, phone, email, intent, message), hours, coverage map     |

### Cross-cutting

- **Nav**: sticky transparent on hero, becomes solid dark on scroll. Logo left, links right (Accueil, Services, Biens, Transactions, Blog, À propos, Contact), language toggle (FR | EN), primary CTA "Prendre rendez-vous".
- **Footer**: 3 columns (sitemap, contact info, social icons) + small print + privacy policy link.
- **WhatsApp FAB**: floating bottom-right on every page, opens `wa.me/14384626015?text=Bonjour Sergine, ...` with locale-aware pre-fill.
- **Cookie banner**: bottom strip, persists choice in `localStorage`, blocks GA4 until accepted.

## 5. Sanity Content Model

All schemas live in `src/lib/sanity/schemas/` and are mounted via `sanity.config.ts`.

### Document types

#### `property` (listing)

| Field          | Type                        | Notes                                                                                                        |
| -------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `title`        | localized string            | FR + EN                                                                                                      |
| `slug`         | slug                        | auto from title                                                                                              |
| `status`       | enum                        | `a-vendre` \| `vendu` \| `en-primeur`                                                                        |
| `price`        | number (CAD)                |                                                                                                              |
| `address`      | localized string            |                                                                                                              |
| `city`         | localized string            |                                                                                                              |
| `neighborhood` | localized string (optional) |                                                                                                              |
| `type`         | enum                        | `unifamiliale` \| `plex` \| `condo` \| `duplex` \| `triplex` \| `quadruplex` \| `quintuplex` \| `commercial` |
| `bedrooms`     | number                      |                                                                                                              |
| `bathrooms`    | number                      |                                                                                                              |
| `area`         | number (sq ft)              |                                                                                                              |
| `description`  | localized portable text     |                                                                                                              |
| `features`     | array of localized strings  | parking, pool, year built, etc.                                                                              |
| `photos`       | array of image + alt text   | alt required for accessibility                                                                               |
| `publishedAt`  | datetime                    |                                                                                                              |
| `featured`     | boolean                     | controls Home carousel                                                                                       |

#### `post` (blog article)

| Field         | Type                          | Notes                                                            |
| ------------- | ----------------------------- | ---------------------------------------------------------------- |
| `title`       | localized string              |                                                                  |
| `slug`        | slug                          |                                                                  |
| `excerpt`     | localized string (≤160 chars) |                                                                  |
| `coverImage`  | image + alt                   |                                                                  |
| `body`        | localized portable text       |                                                                  |
| `category`    | enum                          | `acheter` \| `vendre` \| `investir` \| `mode-de-vie` \| `marche` |
| `author`      | reference → `teamMember`      |                                                                  |
| `publishedAt` | datetime                      |                                                                  |
| `seo`         | object                        | metaTitle, metaDescription, ogImage (all localized)              |

#### `teamMember`

| Field   | Type                    | Notes         |
| ------- | ----------------------- | ------------- |
| `name`  | string                  |               |
| `role`  | localized string        |               |
| `photo` | image + alt             |               |
| `bio`   | localized portable text |               |
| `order` | number                  | display order |

#### `testimonial`

| Field           | Type                   | Notes                              |
| --------------- | ---------------------- | ---------------------------------- |
| `quote`         | localized text         |                                    |
| `authorName`    | string                 |                                    |
| `authorContext` | localized string       | e.g., "Premier acheteur, Montréal" |
| `photo`         | image + alt (optional) |                                    |
| `rating`        | number (1–5)           |                                    |
| `order`         | number                 |                                    |

#### `partner`

| Field      | Type   | Notes                                             |
| ---------- | ------ | ------------------------------------------------- |
| `name`     | string |                                                   |
| `logo`     | image  |                                                   |
| `url`      | url    |                                                   |
| `category` | enum   | `preteur` \| `notaire` \| `inspecteur` \| `autre` |
| `order`    | number |                                                   |

#### `siteSettings` (singleton)

| Field               | Type             | Notes                                           |
| ------------------- | ---------------- | ----------------------------------------------- |
| `brandName`         | string           |                                                 |
| `tagline`           | localized string |                                                 |
| `contactEmail`      | string           | serginehougoue@gmail.com                        |
| `contactPhone`      | string           | 438-462-6015                                    |
| `whatsappNumber`    | string           | 14384626015 (E.164, no `+`)                     |
| `hoursOfOperation`  | localized text   |                                                 |
| `socialLinks`       | object           | facebook, instagram, tiktok, linkedin           |
| `defaultSEO`        | object           | metaTitle, metaDescription, ogImage (localized) |
| `cookieConsentCopy` | localized text   |                                                 |

### Localization

- All user-facing string fields have FR (default) and EN variants via `@sanity/document-internationalization`.
- Studio language toggle in the top-right of the Studio UI.
- Public site locale resolved from URL prefix; `hooks.server.ts` middleware sets `event.locals.locale`.

## 6. Component Architecture

All components live in `src/lib/components/`. Each is single-responsibility, testable, and has clear props.

### Layout components

| Component          | Purpose                        | Key props                      |
| ------------------ | ------------------------------ | ------------------------------ |
| `<Nav />`          | Sticky transparent → solid nav | `currentPath`, `locale`        |
| `<Footer />`       | 3-column footer + social row   | `locale`                       |
| `<LangToggle />`   | FR/EN route-preserving toggle  | `currentPath`, `currentLocale` |
| `<CookieBanner />` | Quebec Law 25 consent banner   | `copy`                         |
| `<WhatsAppFab />`  | Floating bottom-right button   | `phone`, `locale`              |

### Content components

| Component                  | Purpose                            | Key props                                                      |
| -------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `<Hero />`                 | Full-bleed hero for Home           | `eyebrow`, `title`, `subtitle`, `ctaHref`, `ctaLabel`, `image` |
| `<PageHeader />`           | Smaller hero for inner pages       | `eyebrow`, `title`, `intro`                                    |
| `<PropertyCard />`         | Image + price + address + specs    | `property`                                                     |
| `<PropertyGrid />`         | Responsive grid wrapper            | `properties[]`                                                 |
| `<PropertyCarousel />`     | Horizontal carousel                | `properties[]`                                                 |
| `<ServiceAccordion />`     | Numbered accordion                 | `services[]`                                                   |
| `<TestimonialChip />`      | Quote + author + rating            | `testimonial`                                                  |
| `<TeamMember />`           | Photo + name + role + bio          | `member`                                                       |
| `<BlogCard />`             | Cover + category + title + excerpt | `post`                                                         |
| `<CtaStrip />`             | Full-width burgundy CTA strip      | `title`, `ctaHref`, `ctaLabel`                                 |
| `<PortableTextRenderer />` | Sanity portable text renderer      | `blocks`, `locale`                                             |

### Form components

| Component         | Purpose                              | Key props                 |
| ----------------- | ------------------------------------ | ------------------------- |
| `<ContactForm />` | Name/phone/email/intent/message form | `copy` (localized labels) |
| `<CalEmbed />`    | Cal.com inline widget                | `calLink`                 |

### SEO components

| Component     | Purpose                     | Key props                                           |
| ------------- | --------------------------- | --------------------------------------------------- |
| `<SeoHead />` | Meta + OG + structured data | `title`, `description`, `ogImage`, `locale`, `path` |

### Server-side

| Endpoint / module          | Purpose                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| `/api/contact/+server.ts`  | POST handler — Zod-validates body, sends via Resend to serginehougoue@gmail.com |
| `/api/og/+server.ts`       | Dynamic OG image generation via Satori + satori-html                            |
| `src/lib/server/sanity.ts` | Server-only typed Sanity client                                                 |
| `src/lib/sanity/client.ts` | Browser Sanity client (preview mode)                                            |
| `src/hooks.server.ts`      | Locale resolution middleware                                                    |

## 7. Testing Strategy

### Unit tests (Vitest)

- Form validation logic (`/api/contact/+server.ts` Zod schema)
- Slug generation utility
- OG image generation (`/api/og/+server.ts`)
- Resend adapter (mocked)
- Locale routing middleware

### Component tests (@testing-library/svelte)

- `<ContactForm />` — renders all fields, shows validation errors, submits cleanly
- `<LangToggle />` — toggles locale, preserves path
- `<ServiceAccordion />` — keyboard accessible, `aria-expanded` toggles correctly
- `<CookieBanner />` — accepts/rejects, persists choice
- `<PropertyCard />` — renders all fields, link goes to correct slug

### End-to-end tests (Playwright)

Critical user flows:

1. Submit contact form → email arrives in test inbox (use Resend test mode or Mailtrap)
2. Switch language FR → EN → content updates correctly, URL changes correctly
3. Cal.com embed loads, slot selection is visible
4. WhatsApp FAB opens with correct prefilled message in current locale
5. Mobile nav toggle works at 375px width
6. Cookie banner accepts → GA4 loads; rejects → GA4 blocked
7. Listings grid → click card → detail page renders gallery + specs
8. Blog index → click post → post page renders

### Accessibility tests (axe-core in Playwright)

- Every page passes axe-core with zero violations
- Verify focus rings (2px bone, 2px offset) on every interactive element
- Verify alt text present on all images
- Verify color contrast: burgundy on dark, gold on dark, bone on dark — all meet WCAG AA

### Visual regression (Playwright)

- Screenshot of each page on desktop (1440px) and mobile (375px) breakpoints
- Diff against baseline; allow intentional updates via `npx playwright test --update-snapshots`

### Performance (Lighthouse in CI)

- Target ≥95 Performance, ≥95 Accessibility, ≥95 Best Practices, ≥95 SEO on Home page
- Run in CI on every PR

### Bilingual parity check (Playwright)

- Automated test that every public route has both `/fr/...` and `/en/...` versions
- `<html lang>` attribute matches the URL prefix on every page

## 8. Deployment

### GitHub & Vercel

- **GitHub repo**: `DHC/immo` (the working directory)
- **Vercel project**: connected to GitHub, auto-deploy on push to `main`, preview deploys on every PR
- **Custom domain**: `serginehougoue.ca` (assumed) — DNS setup, Vercel auto-issues SSL
- **Sanity Studio**: hosted at `/studio` route on the same Vercel deploy (free tier)

### Environment variables (managed in Vercel dashboard, never committed)

| Variable             | Value                                       |
| -------------------- | ------------------------------------------- |
| `SANITY_PROJECT_ID`  | from Sanity dashboard                       |
| `SANITY_DATASET`     | `production`                                |
| `SANITY_API_TOKEN`   | read-only for public site, write for studio |
| `RESEND_API_KEY`     | from Resend dashboard                       |
| `CONTACT_TO_EMAIL`   | serginehougoue@gmail.com                    |
| `GA4_MEASUREMENT_ID` | from GA4 admin                              |
| `CAL_COM_LINK`       | Sergine's Cal.com username                  |

### Rollout phases

| Phase               | Weeks | Deliverable                                                                                                                                                                               |
| ------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Foundation       | 1–2   | SvelteKit scaffold, Tailwind, brand tokens, base layout (Nav, Footer, LangToggle), dark editorial home page with placeholder content                                                      |
| 2. Sanity + content | 2–3   | Sanity schemas, embedded studio, populated with starter content (3 properties, 2 testimonials, 1 blog post, About copy from `Texts utilities.txt`). Home and About page pulling from CMS. |
| 3. All pages        | 3–4   | Services, Listings + detail, Transactions, Blog + post, Contact with Cal.com + form + Resend                                                                                              |
| 4. Polish & launch  | 4–5   | SEO meta + structured data, GA4 + cookie banner, performance pass, accessibility pass, visual regression baseline, mobile QA, custom domain + SSL, swap real photos when they arrive      |
| 5. Post-launch      | 6+    | Monitor analytics, write first 2–3 blog posts targeting long-tail keywords, iterate based on what's working                                                                               |

## 9. Risks & Mitigations

| Risk                                                | Mitigation                                                                                                                                                                                                                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Professional photography not yet available          | Use well-composed placeholders (architectural interiors, neighborhood shots). Hero photo of Sergine from business card used temporarily; swap when pro photos arrive. Document a `PLACEHOLDERS.md` so the team knows what to replace.                                        |
| No content yet                                      | Populate with copy already in `Texts utilities.txt` and the long-form text in `PROJET_IMMOBILIER.docx`. Write 3 sample blog posts around topics Sergine already mentioned (premier acheteur, investir dans un plex, marché 2026) as starter content.                         |
| Sanity Studio learning curve for non-technical team | Short Loom video walkthrough (~5 min) on adding a listing, writing a blog post, updating hours. Documented in a `TEAM_GUIDE.md`.                                                                                                                                             |
| Quebec Law 25 / GDPR compliance                     | Cookie consent banner + privacy policy page with clear FR + EN copy. Document data handling in the privacy policy.                                                                                                                                                           |
| Cal.com adoption by Sergine                         | If Sergine doesn't want Cal.com, fall back to "No booking widget" (option C from original brainstorm): just call/WhatsApp/email buttons + contact form. Sergine handles scheduling manually. Implementation plan should treat Cal.com as the default but flag this fallback. |

## 10. Open Questions

These were not fully resolved during brainstorming and are flagged for the implementation-planning phase:

1. **Custom domain name** — assumed `serginehougoue.ca`. Need confirmation and DNS access.
2. **Cal.com setup** — does Sergine want Cal.com, or should we fall back to manual scheduling? See Risks table.
3. **Professional photos timeline** — when will the team deliver real photos? Affects the launch date and whether Phase 4 ships with placeholders or final assets.
4. **Initial inventory** — how many listings does Sergine want at launch? Spec assumes 6–12 featured. If she has 30+, the grid design needs pagination/filtering.
5. **Starter blog posts** — who writes them? The implementation plan should include 3 posts as part of Phase 2.
6. **GA4 vs Plausible revisited** — GA4 was chosen, but Plausible's privacy-friendly nature is appealing for Quebec. Spec stays with GA4 + cookie consent as decided.

## 11. References

- Existing visual foundation: `DESIGN.md` (Lesse Studio clone, dark editorial, SvelteKit + Tailwind)
- Client brief: `Utilities to Brainstorm/Objective.txt`
- Long-form client copy: `Utilities to Brainstorm/PROJET_IMMOBILIER.docx` (extracted to `Utilities to Brainstorm/PROJET_IMMOBILIER.txt`)
- Approved storytelling text: `Utilities to Brainstorm/Texts utilities.txt`
- Client visual identity: business card photo (burgundy + gold palette, "SERGINE HOUGOUE" wordmark with house icon)
- Reference sites: https://nlandurealestate.com/, https://www.marioconte.com/, https://www.guillou.ca/

## 12. Approval

- All 5 design sections approved by user on 2026-06-24
- Ready for the writing-plans skill to produce the implementation plan
