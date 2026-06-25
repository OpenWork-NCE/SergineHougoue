# DESIGN.md: Lesse Studio

## Source

- URL: https://lessestudio.com/
- Capture date: 2026-06-24
- Evidence: page markdown via r.jina.ai proxy, raw HTML inspect, image URL catalog, sibling /contact page for nav/footer; supplement with `firecrawl scrape --format branding,images --full-page-screenshot` when the CLI is available.

## Reference Screenshot

![Full-page screenshot of Lesse Studio](./.firecrawl/lessestudio-screenshot.png)

Generate locally with:

```bash
firecrawl scrape "https://lessestudio.com/" --full-page-screenshot -o .firecrawl/lessestudio-screenshot.png
```

Use this screenshot as the visual source of truth for layout, hierarchy, density, and feel. Tokens below describe the same page in machine-readable form.

## Design Summary

Lesse Studio is a premium Italian design + technology agency. The visual language is **dark-mode-first editorial**: near-black canvas with off-white type, oversized hero photography, a single white wordmark, and a restrained warm-neutral accent. Content is organized in long, slow-scrolling sections with cinematic full-bleed imagery, generous vertical rhythm, and minimal chrome. Tone is confident, calm, and European-luxury — short declarative copy, sentence-case headings, no exclamation, "Start a Project" as the only primary CTA.

Tech stack inferred from HTML: **SvelteKit** (asset paths under `/_app/immutable/assets/`) + **Tailwind CSS** (arbitrary variants like `[&>svg]:h-full`, `[&>svg]:w-auto`).

## Design Tokens

### Colors

| Role                                         | Value                                | Source                                                     |
| -------------------------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| `--bg-canvas` (page background)              | `#0E0E0E` (near-black)               | inferred — logo is shipped as **white SVG** for dark theme |
| `--bg-surface` (cards, footer dark sections) | `#161616`                            | inferred                                                   |
| `--bg-elevated` (testimonial chips, inputs)  | `#1F1F1F`                            | inferred                                                   |
| `--text-primary`                             | `#F5F2EC` (warm off-white / "cream") | inferred from logo contrast + agency genre                 |
| `--text-secondary`                           | `#A8A29A` (warm grey)                | inferred                                                   |
| `--text-muted`                               | `#6B6660`                            | inferred                                                   |
| `--border-hairline`                          | `rgba(245,242,236,0.08)`             | inferred                                                   |
| `--accent`                                   | `#E8DFD0` (warm bone)                | inferred — minimal-luxury accent                           |
| `--state-hover`                              | `rgba(255,255,255,0.06)` overlay     | inferred                                                   |
| Section counter text                         | `#E8DFD0` on `#0E0E0E`               | inferred from "01 / 03 Brand Identity" hero badge          |

Light sections (form area, footer column heads) flip to `--bg-canvas: #F5F2EC` with `--text-primary: #0E0E0E`.

> Confidence: **medium**. Hex values are inferred from logo inversion (white-on-dark), copy patterns, and the genre conventions of high-end Italian studio sites. Run `firecrawl scrape --format branding` to confirm exact tokens before publishing.

### Typography

- **Display / headings**: a single humanist serif or neo-grotesque sans (e.g. `Fraunces`, `GT Sectra`, or `Söhne`). When the actual `@font-face` is not exposed, use a **system fallback stack**: `"Fraunces", "GT Sectra", ui-serif, Georgia, serif` for headings, or `"Inter", "Söhne", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for body if the site is sans-led.
- **Body**: same family at lighter weight, sentence-case.
- **Eyebrow / labels** ("01 / 03 Brand Identity", section counters, footer column heads): all-caps, tracked `+0.08em`, 11–13px.

Scale (inferred, mobile-first → desktop):

- `text-xs` 12px / 1.4 — eyebrow, meta
- `text-sm` 14px / 1.5 — body small, captions
- `text-base` 16px / 1.55 — body
- `text-lg` 18px / 1.5 — lead paragraph
- `text-xl` 22px / 1.35 — subheading
- `text-2xl` 30px / 1.2 — section heading
- `text-3xl` 44px / 1.1 — H2
- `text-4xl` 56px / 1.05 — H1 mobile
- `text-5xl` 80px / 1.0 — H1 desktop
- `text-display` 120px+ / 0.95 — hero wordmark on inner pages

Weights used: 300 (light body), 400 (regular), 500 (medium), 600 (semibold for headings). Italic available for editorial pull-quotes.

### Spacing And Layout

- Section vertical rhythm: `py-24 md:py-32 lg:py-40` (96–160px)
- Container: `max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16`
- Page gutters: 24px mobile, 40px tablet, 64px desktop
- Grid gaps: `gap-6 md:gap-10` for service cards
- Form fields stack with `space-y-6`
- Border radius: **near-zero** — `rounded-none` on cards/buttons; `rounded-full` only on circular avatars and pill-shaped tags/eyebrows
- Shadows: minimal; rely on **hairline borders** `1px solid var(--border-hairline)` and `1px solid rgba(255,255,255,0.12)` on dark
- Density: low — average section is 80–120vh with breathing room

## Components

### Top Nav (sticky, transparent over hero, solid on scroll)

- Left: white wordmark logo (`/_app/immutable/assets/logo-white.D2PbM6gr.svg`)
- Center/right: text links — `Services`, `Portfolio`, `About`, `Insights`, `Contact`
- Right: small `Start a project →` pill button + login icon
- Height: 64–72px, `backdrop-blur` when scrolled

### Hero

- Full-viewport (`min-h-screen`) with split layout: oversized editorial image left, copy right
- Image: `https://cnd.lessestudio.com/838ae005-fc2e-43d6-a92b-3b43fa9c7398.webp` (branded bottles — moody, low-key product photography)
- Eyebrow pill: `01 / 03 — Brand Identity` style counter
- H1: "Lesse is a design and technology studio based in Italy. We deliver hollistic brand idendity & digital experiences." (preserve the site's wording if cloning)
- Primary CTA: `Start a Project` (filled, cream pill on dark)
- Secondary CTA: `Scroll` (text + small arrow indicator at bottom)

### Services Accordion / List

- Header counter `01 / 03`, then category heading
- Sub-items listed with `See More →` affordance
- Categories visible: **Brand Strategy / Brand Identity / User Experience Design / Visual Content / Web Development / eCommerce / Web & Mobile Applications / Embedded & Hardware** (each with 3–7 sub-services)
- Service count badge e.g. `/6 services`

### Approach & Values

- Two-column: copy left, full-bleed image right
- Image: collage (`https://cnd.lessestudio.com/be81029e-7e11-4068-826e-8ee48c967e43.webp`) or animated GIF (`https://cnd.lessestudio.com/9f75a1bc-35f8-41ef-be3a-56ead44686f0.gif`) — muted greys with selective accent
- Body: "We combine creativity, strategic ideas and technology to create bespoke solutions that drive your success."

### Latest Work (case studies)

- Vertical case-study cards with full-bleed cover image, project name (large), then long-form description
- Example observed: **Duo Nutrition** — "DUO NUTRITION is a brand that redefines pet food as a celebration of the equal, unspoken partnership between humans and their dogs. … a simple yet powerful oval, split evenly down the middle."
- Pattern: image-on-top, title beneath, narrative paragraph, subtle "View case →" link

### Testimonials Carousel

- Three visible at desktop, swipe on mobile
- Card: large quote (serif, 22–28px), circular avatar, name, role/company
- Avatars hosted at `cnd.lessestudio.com/...svg` (e.g. `b915dfc2-95a1-437f-b026-b7b9dc170c84.svg`, `6dc48285-0f58-4406-8064-0059ed94fc01.svg`, `02a83412-deca-40f0-b3fd-eed1d48c2213.svg`, `be1a44c9-a699-4a61-a8d1-5d1737e45962.webp`)
- Dot pagination + auto-advance
- Closing CTA inside carousel: `Let's work together →`

### Latest News

- Compact list: title (left), date (right), hairline divider
- Items observed: "Building Brands from Within — April 6", "How to Choose a Brand Name That Lasts — April 6"
- Footer link: `View all news →`

### Contact Form ("Ready to get started?")

- Two-column on desktop, stacked on mobile
- Fields: Name*, Email*, Phone (optional), Tell us about your project\*, Services interested in (checkbox group: Brand Strategy, Brand Identity, User Experience Design, Visual Content, Web Development, eCommerce, Web & Mobile Applications, Embedded & Hardware), Website, Send Message
- Inputs: dark surface `#1F1F1F`, 1px hairline border, no rounded corners, focus ring in cream accent

### Footer

- Two-column mega footer on light cream background
- Left column: services listed across two sub-columns (Visual and Marketing / Technology), each with category + sub-bullets
- Right column or bottom row: social text links — `INSTAGRAM`, `LINKEDIN`, `DRIBBBLE`, `MAIL` (uppercase, tracked)
- Background: cream `#F5F2EC` to invert the dark page — the site ends on a light beat

### Buttons

| Variant           | Style                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| Primary           | Filled cream pill, dark text, `px-6 py-3 rounded-full`, hover inverts to filled dark w/ cream border |
| Secondary / Ghost | 1px cream border on dark, transparent fill, hover fills cream                                        |
| Text link         | Inline arrow `Label →`, slides arrow on hover                                                        |
| Pill tag          | `rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest`                    |

## Page Patterns

Section order (canonical):

1. Sticky transparent nav
2. Hero (full-bleed image + split copy + CTA + scroll cue)
3. Services accordion with three numbered categories and "Explore All Services" footer link
4. Approach & values (split copy + image)
5. Latest work (vertical case-study stack)
6. Testimonials carousel
7. Latest news (compact list)
8. Contact form ("Ready to get started?")
9. Footer mega-nav with social row

Responsive behavior:

- Single-column stack under 768px
- Hero copy drops below image on mobile
- Service list collapses accordion-style
- Testimonials become swipeable single card
- Footer columns stack to one
- Type scale clamps down ~30% on mobile, line-height stays generous

## Content Style

- **Voice**: confident, calm, European-editorial. First person plural ("We deliver…"). No exclamation points.
- **Headings**: sentence case, no period. Examples: "Our services", "Our approach and values", "Latest Work", "Testimonials", "Latest news", "Ready to get started?"
- **CTA vocabulary**: `Start a Project`, `See More`, `View case`, `Let's work together`, `Get in touch`, `Send Message`, `View all news`
- **Copy density**: low. One paragraph per section max, ~25–60 words.
- **Eyebrows**: numbered counters (`01 / 03`) or all-caps tracked labels — give the page a quiet editorial spine.

## Agent Build Instructions

1. **Stack**: scaffold a SvelteKit app (`npm create svelte@latest`), add Tailwind, drop the dark base.
2. **Theme tokens**: copy the `--bg-canvas / --text-primary / --accent` palette above into `app.css` as CSS variables on `:root`.
3. **Typography**: load **Fraunces** (display, italic 300/500) + **Inter** (body 300/400/500) from Google Fonts; wire to Tailwind `fontFamily`.
4. **Logo**: import `logo-white.D2PbM6gr.svg` as the nav lockup; render at ~110×24px.
5. **Hero**: build a `min-h-screen` split — left `<img>` of the bottles photograph (`838ae005...webp`), right column with eyebrow pill, H1, primary CTA, scroll arrow. Add subtle parallax on the image (`transform: translateY(scrollY*0.1)`).
6. **Services**: render the accordion with three top-level categories. Each sub-service is a `<li>`; the whole panel is keyboard-accessible with `<button aria-expanded>`.
7. **Case studies**: vertical `<article>` per project, image-on-top, then `<h2>` + paragraph + arrow link. Use `loading="lazy"` and a blurhash/LQIP placeholder.
8. **Testimonials**: implement with `embla-carousel-svelte` or Svelte's `tweened` + a translateX. Three-up desktop, single mobile. Auto-advance every 6s, pause on hover.
9. **Footer**: cream `#F5F2EC` background, two-column grid, hairline `1px solid rgba(0,0,0,0.08)` divider above the social row. Social links uppercase tracked.
10. **Motion**: keep it slow and editorial — `transition: all 700ms cubic-bezier(0.22,1,0.36,1)`. Reveal sections on scroll with `IntersectionObserver` adding a `.is-visible` class that fades + translates up 24px.
11. **Forms**: dark surface inputs, no rounded corners, cream focus ring. Validate with `zod` + `superforms` if using SvelteKit.
12. **Accessibility**: every interactive element has a focus ring (2px cream, 2px offset); `prefers-reduced-motion` disables the scroll-reveal and carousel auto-advance.

## Rerun Inputs

workflow: firecrawl-website-design-clone
source_url: https://lessestudio.com/
target_stack: sveltekit + tailwind
output: DESIGN.md
