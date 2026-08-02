# Media inventory

Generated assets live in **`static/`** (site root URLs: `/hero-home.webp`, etc.).

See **[IMAGE-PROMPTS.md](./IMAGE-PROMPTS.md)** for original generation prompts and usage notes.

## Status (2026-08-02) — complete

| File | Path | Dimensions | Status |
| ---- | ---- | ---------- | ------ |
| hero-home | `/hero-home.webp` | 2400×1350 architecture | ✅ |
| hero-home-portrait | `/hero-home-portrait.webp` | 2400×1350 environmental portrait option | ✅ |
| team-sergine-portrait | `/team-sergine-portrait.webp` | **1600×2000 (4:5)** | ✅ |
| og-default | `/og-default.webp` | 1200×630 | ✅ |
| home-why | `/home-why.webp` | 1200×1500 | ✅ |
| services-ambient | `/services-ambient.webp` | 1920×1080 | ✅ |
| about-journey | `/about-journey.webp` | 2400×1600 | ✅ |
| property-01…06 | `/property-0N.webp` | 1200×900 | ✅ |
| blog-01…03 | `/blog-0N.webp` | 1200×675 | ✅ |
| contact-map-soft | `/contact-map-soft.webp` | 1920×1080 | ✅ |
| Profil | `/Profil.png` | 1254×1254 legacy fallback | ✅ optional |

## Code paths to use in the redesign

```ts
export const MEDIA = {
  heroHome: "/hero-home.webp",
  /** Optional hero variant (environmental portrait of Sergine). */
  heroHomePortrait: "/hero-home-portrait.webp",
  teamPortrait: "/team-sergine-portrait.webp",
  ogDefault: "/og-default.webp",
  homeWhy: "/home-why.webp",
  servicesAmbient: "/services-ambient.webp",
  aboutJourney: "/about-journey.webp",
  contactMap: "/contact-map-soft.webp",
  properties: [
    "/property-01.webp",
    "/property-02.webp",
    "/property-03.webp",
    "/property-04.webp",
    "/property-05.webp",
    "/property-06.webp",
  ],
  blogs: ["/blog-01.webp", "/blog-02.webp", "/blog-03.webp"],
} as const;
```
