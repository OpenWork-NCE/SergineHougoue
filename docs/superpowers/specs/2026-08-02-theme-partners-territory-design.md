# Design: Theme clair/sombre, territoire, expertise, partenaires

**Date**: 2026-08-02  
**Project**: Sergine Hougoue Immo (`sergine-hougoue-immo`)  
**Status**: Approved in brainstorming (Approach A) — ready for implementation planning  
**Related**: `docs/superpowers/specs/2026-06-24-sergine-hougoue-immo-design.md`, `DESIGN.md`

## 1. Purpose

Improve visual comfort and conversion clarity with a set of focused product changes:

1. **Light/dark theme** — light (warm cream) by default; dark remains available.
2. **Larger wordmark** — same Fraunces family, bigger in the nav.
3. **Optional contact message** — appointment/contact form no longer requires a message.
4. **Expanded expertise** — add property flip and property rental on About.
5. **Quebec coverage** — home section listing all 17 administrative regions.
6. **Dedicated Team & partners page** — Sergine + partner network; partners removed from Transactions.

Business goal unchanged: convert Quebec prospects into booked appointments.

## 2. Decisions (locked)

| Topic | Decision |
| ----- | -------- |
| Approach | **A — targeted pack** (extend existing stack; no SVG map, no rich partner bios) |
| Default theme | **Light** (warm cream) on first visit |
| Light canvas | Cream/beige `#F5F2EC` (existing design-token family) |
| Brand accents | Burgundy `#6E1F2E` and gold `#C9A24A` unchanged in both themes |
| Theme persistence | `localStorage`; optional later respect of OS only as non-default enhancement — **not required** for v1 |
| Logo font | Keep **Fraunces**; increase size |
| Contact message | **Optional** (client + server) |
| Expertise location | About page section « Mon expertise » / « My expertise » |
| Territory placement | **Home** section (not blog-only) |
| Partners IA | **New dedicated nav page**; remove partners block from Transactions |
| Team on new page | **Sergine** (primary `teamMember` / fallback) **+ partners by category** |
| Mortgage brokers | New partner category `courtier-hypothecaire` |

## 3. Theme system

### 3.1 Tokens

Keep dual-theme CSS variables on `:root` / `[data-theme="dark"]` (or `html.dark` — pick one mechanism and use it consistently; **recommended: `data-theme="light" | "dark"` on `<html>`**).

**Light (default)**

| Role | Value (target) |
| ---- | -------------- |
| `--bg-canvas` | `#F5F2EC` |
| `--bg-surface` | slightly warmer/darker cream (e.g. `#EDE8DF`) |
| `--bg-elevated` | near-white cream (e.g. `#FFFcf7` or `#FAF7F2`) |
| `--text-primary` | `#0E0E0E` |
| `--text-secondary` | warm grey |
| `--text-muted` | softer grey |
| `--border-hairline` | `rgba(14,14,14,0.08)` |
| `--accent` | bone/cream highlight as needed for light |
| `--brand-burgundy` / `--brand-gold` | unchanged |

**Dark**

Preserve current dark editorial tokens (`#0E0E0E` canvas, cream text, etc.).

Tailwind color aliases (`canvas`, `surface`, `primary`, `burgundy`, …) already map to CSS variables — they should pick up theme changes without per-component hardcoding. Audit hardcoded `border-white/10`, `bg-white/5`, `text-white` utilities and replace with theme-aware tokens/utilities where contrast breaks in light mode.

### 3.2 Behavior

1. **Default**: light when no stored preference.
2. **Toggle**: control in primary nav next to language toggle.
3. **Persistence**: `localStorage` key e.g. `sergine_theme` = `light` | `dark`.
4. **Anti-FOUC**: small inline script in `app.html` (or equivalent) reads storage and sets `data-theme` on `<html>` before first paint.
5. **Studio** (`/studio`): no public chrome; theme toggle not required. Studio may stay unthemed / system-default.
6. **A11y**: bilingual `aria-label`; visible focus; honor `prefers-reduced-motion` for any theme transition.

### 3.3 Components

- New: `src/lib/components/layout/ThemeToggle.svelte`
- Wire into `Nav.svelte`
- Unit/component tests for toggle + persistence behavior (jsdom + localStorage mock)

## 4. Logo / wordmark

- Component: `Nav.svelte` wordmark « Sergine Hougoue »
- Font: **Fraunces** (`font-display`)
- Size: increase to roughly `text-2xl` mobile / `text-3xl`–`text-4xl` desktop (exact Tailwind steps chosen for no wrap breakage on common mobile widths)
- Keep burgundy initial « S »
- Hit target height ≥ 44px
- Contrast valid in both themes

## 5. Contact form — optional message

### 5.1 UX

- Label: « Message (optionnel) » / « Message (optional) »
- Remove required asterisk and client min-length error for empty message
- Intent, name, phone, email remain required

### 5.2 Validation

| Layer | Rule |
| ----- | ---- |
| Client `validateContactForm` | message may be empty; if present, optional max length (e.g. 2000) |
| Server `contactFormSchema` (Zod) | `message: z.string().trim().max(2000).optional()` or empty string allowed |
| API | Accept missing/empty message |
| Resend HTML | If empty, omit body line or show localized placeholder « (aucun message) » |

### 5.3 Tests

- Unit: schema accepts empty message; rejects invalid email/phone still
- Component: form submits without message
- E2E contact: happy path without filling message

## 6. Expertise (About)

Section `copy.about.expertise` currently has 3 cards. Add two:

| FR title | FR description (intent) | EN title |
| -------- | ----------------------- | -------- |
| Flip immobilier | Accompagnement achat–rénovation–revente / stratégie de flip | Property flip |
| Location de propriétés | Mise en location, bailleurs, accompagnement locatif | Property rentals |

Keep existing three: Premiers acheteurs, Investisseurs, Vente de propriétés (or current copy).

Layout: responsive grid (e.g. 1 col mobile, 2–3 desktop). Five cards is fine without accordion.

**Note:** Page `/services` accordion is separate (`getServices`). This change is **only** About « Mon expertise » unless a later task aligns Services — **out of scope** here.

## 7. Territory — Quebec regions (Home)

### 7.1 Placement

New section on **home** (`+page.svelte`), after featured properties / testimonials or before final CTA — prefer after hero/featured block so coverage is visible without scrolling past the whole page; implementer may place after featured properties, before final CTA.

### 7.2 Content

Intro (i18n), e.g.:

- FR: « J’opère partout au Québec »
- EN: « I work across Quebec »

Then a compact grid/list of the **17 administrative regions** (fixed list in code, not CMS):

1. Bas-Saint-Laurent  
2. Saguenay–Lac-Saint-Jean  
3. Capitale-Nationale  
4. Mauricie  
5. Estrie  
6. Montréal  
7. Outaouais  
8. Abitibi-Témiscamingue  
9. Côte-Nord  
10. Nord-du-Québec  
11. Gaspésie–Îles-de-la-Madeleine  
12. Chaudière-Appalaches  
13. Laval  
14. Lanaudière  
15. Laurentides  
16. Montérégie  
17. Centre-du-Québec  

Use correct French typography (accents, en-dashes) in FR; EN can use the same official names or standard English equivalents where commonly used — prefer official French names in both locales for geographic accuracy unless copy review requests English forms.

### 7.3 Implementation

- Prefer `src/lib/i18n/regions.ts` (or section under `copy.ts`) exporting ordered region labels + section title/intro
- Presentational component optional: `TerritoryGrid.svelte` if it keeps `+page.svelte` thin
- No filtering of listings by region in this scope
- No interactive map

## 8. Team & partners page

### 8.1 Routing & nav

| Item | Value |
| ---- | ----- |
| Path (after locale strip) | `/equipe-partenaires` |
| Public URLs | `/fr/equipe-partenaires`, `/en/equipe-partenaires` |
| Nav FR | Équipe et partenaires |
| Nav EN | Team & partners |
| Suggested nav order | Home, Services, Listings, Transactions, Blog, **Team & partners**, About, Contact |

Files:

- `src/routes/equipe-partenaires/+page.server.ts`
- `src/routes/equipe-partenaires/+page.svelte`

Locale `reroute` already strips `/fr|/en` — no duplicate tree.

### 8.2 Page structure

1. **PageHeader** — eyebrow/title/intro from `getCopy`
2. **Team block** — Sergine:
   - Load `teamMembers` via existing CMS patterns; display primary member (order asc, first)
   - Fallback photo `/Profil.png`, name/role from copy or siteSettings if CMS empty
3. **Partners block** — group by category (same card/logo pattern as current Transactions partners section)

### 8.3 Partner categories

Extend Sanity `partner` schema enum and TypeScript `PartnerCategory`:

| Value | FR label | EN label |
| ----- | -------- | -------- |
| `preteur` | Prêteurs | Lenders |
| `courtier-hypothecaire` | Courtiers hypothécaires | Mortgage brokers |
| `notaire` | Notaires | Notaries |
| `inspecteur` | Inspecteurs | Inspectors |
| `autre` | Autres partenaires | Other partners |

Display order: preteur → courtier-hypothecaire → notaire → inspecteur → autre. Hide empty groups.

### 8.4 Transactions page

- Remove partners section and partner-related load UI
- `loadCmsTransactionsData` may stop fetching partners **or** keep fetching unused — prefer **stop fetching** to keep the loader honest
- Copy keys for partner headings on transactions can move under a new `teamPartners` (or `partnersPage`) copy namespace

### 8.5 SEO / sitemap

- Layout title derivation: add path branch for `/equipe-partenaires`
- `sitemap.xml` `STATIC_PATHS`: add `equipe-partenaires`
- E2E: new smoke + a11y for the page

### 8.6 CMS loaders

Add e.g. `loadCmsTeamPartnersData(lang)` → `{ teamMembers, partners }` reusing `teamMembersQuery` + `partnersQuery`.

## 9. Architecture summary

```
Theme:  app.html (anti-FOUC) → data-theme on <html> → CSS variables → Tailwind aliases
        ThemeToggle → localStorage

Copy:   getCopy / forms / regions i18n modules

Contact: ContactForm → /api/contact → Zod (optional message) → Resend

Home:   + territory section (regions list)

About:  + 2 expertise cards

New:    /equipe-partenaires ← teamMember[0] + partners by category

Transactions: sold properties only
```

### Dependencies

- No new npm packages required for theme or territory
- Sanity schema change for partner category (content authors may re-tag docs; existing `preteur` remains valid)

### Error handling

- CMS empty: team fallback + empty partners (page still renders header + empty state copy if needed)
- Theme storage unavailable: stay on light default
- Contact without message: 200 + email sent

## 10. Testing plan

| Area | Tests |
| ---- | ----- |
| Theme tokens / toggle | component + optional unit for storage helper |
| Nav | larger logo present; ThemeToggle; new link |
| Contact schema/form/e2e | optional message |
| About | five expertise titles (FR/EN as applicable) |
| Home e2e | territory heading + sample regions visible |
| Team page e2e | loads, team block, partner groups when fixture/CMS data present |
| Transactions e2e | partners section **absent** |
| Sitemap unit/e2e | includes equipe-partenaires |
| load-cms / schema | new category + loader |

## 11. Out of scope (YAGNI)

- Interactive Quebec SVG map
- Partner bios, phone numbers, rich profiles
- Filtering blog or listings by region
- Aligning `/services` accordion with new expertise items
- Mobile hamburger nav (still deferred)
- GA4 / cookie analytics changes
- Changing brand burgundy/gold
- Defaulting theme from `prefers-color-scheme` (manual toggle + light default only)

## 12. Success criteria

1. First visit shows **light cream** theme.
2. Theme toggle switches light ↔ dark and **persists** across reload.
3. Wordmark is **visibly larger**, still Fraunces, readable on mobile.
4. Contact/appointment form can be submitted **without** a message.
5. About expertise shows **five** areas including flip and rentals.
6. Home shows coverage intro + **all 17** regions.
7. Nav includes **Équipe et partenaires**; page shows Sergine + partners by category.
8. Transactions no longer lists partners.
9. Existing test suite updated; new coverage for the above; `npm test` and relevant e2e green.

## 13. Implementation notes for planner

Suggested task breakdown (for `writing-plans`):

1. Theme tokens + anti-FOUC + ThemeToggle + Nav integration + audit light-mode contrast  
2. Wordmark size tweak (can merge with 1)  
3. Optional contact message (schema, form, resend, tests)  
4. Expertise copy FR/EN  
5. Territory i18n + Home section  
6. Partner category schema/types/copy + Team page route + nav/sitemap/SEO + strip Transactions partners  
7. Cross-cutting e2e + polish  

Order: theme first (unblocks visual QA), then small content fixes, then new page last (depends on partner category + loaders).
