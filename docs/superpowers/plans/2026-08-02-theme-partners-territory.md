# Theme, Territory, Expertise & Team/Partners Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship light-default dual theme, larger Fraunces wordmark, optional contact message, expanded About expertise, Quebec territory grid on Home, and a dedicated Team & partners page (partners removed from Transactions).

**Architecture:** CSS variables switched via `data-theme="light"|"dark"` on `<html>` (default light), with `localStorage` key `sergine_theme` and anti-FOUC script in `app.html`. UI chrome strings stay in `$i18n`; partners/team still load from Sanity. New route `/equipe-partenaires` reuses existing GROQ loaders; partner enum gains `courtier-hypothecaire`.

**Tech Stack:** SvelteKit 2 + Svelte 5, Tailwind 3 + CSS variables, Zod, Sanity schemas/types, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-02-theme-partners-territory-design.md`

## Global Constraints

- Default theme: **light** cream canvas `#F5F2EC`; dark tokens preserved for dark mode.
- Brand accents unchanged: burgundy `#6E1F2E`, gold `#C9A24A`.
- Theme storage key: `sergine_theme` values `light` | `dark`.
- Theme attribute: `data-theme` on `<html>` only (not class-based dual system).
- Logo font: **Fraunces** only; larger size; burgundy initial « S ».
- Contact message: optional client + server; max 2000 chars when present.
- Expertise: About page only (do not change `/services` accordion in this plan).
- Territory: Home section; fixed 17 Quebec administrative regions in code (not CMS).
- New page path: `/equipe-partenaires` (locale-prefixed in public URLs).
- Partners removed from Transactions page and from transactions CMS loader payload.
- No new npm dependencies.
- TDD: write failing tests first; commit after each task is green.
- Follow existing path aliases: `$components`, `$i18n`, `$sanity`, `$server`, `$utils`.
- Do not expand scope to SVG maps, partner bios, hamburger nav, or GA4.

## File map

| Path | Responsibility |
| ---- | -------------- |
| `src/app.html` | Default `data-theme="light"` + anti-FOUC script |
| `src/app.css` | Light/dark CSS variables; theme-aware component borders |
| `src/lib/utils/theme.ts` | `Theme` type, storage get/set, `applyTheme` |
| `src/lib/components/layout/ThemeToggle.svelte` | Toggle control |
| `src/lib/components/layout/Nav.svelte` | Wordmark size, ThemeToggle, team link |
| `src/lib/components/layout/Footer.svelte` | Sitemap link for team page |
| `src/lib/i18n/copy.ts` | Nav, home territory, expertise, teamPartners, theme labels |
| `src/lib/i18n/forms.ts` | Optional message labels + validation |
| `src/lib/i18n/regions.ts` | 17 regions + home territory copy helpers if not all in copy.ts |
| `src/lib/server/contact-schema.ts` | Optional message Zod |
| `src/lib/server/resend.ts` | Empty message handling in HTML |
| `src/lib/components/forms/ContactForm.svelte` | Optional message UX |
| `src/lib/sanity/types.ts` | `PartnerCategory` + `courtier-hypothecaire` |
| `src/lib/sanity/schemas/partner.ts` | Enum values |
| `src/lib/sanity/load-cms.ts` | `loadCmsTeamPartnersData`; slim transactions loader |
| `src/routes/+page.svelte` | Territory section |
| `src/routes/a-propos/+page.svelte` | Renders expertise from copy (no logic change if already loops) |
| `src/routes/equipe-partenaires/+page.server.ts` | Load team + partners |
| `src/routes/equipe-partenaires/+page.svelte` | Page UI |
| `src/routes/transactions/+page.svelte` | Sold only |
| `src/routes/transactions/+page.server.ts` | No partners |
| `src/routes/+layout.svelte` | SEO titles/descriptions for new path |
| `src/routes/sitemap.xml/+server.ts` | Static path entry |
| Tests under `tests/unit`, `tests/component`, `tests/e2e` | Coverage below |

---

### Task 1: Theme utility + dual CSS tokens + anti-FOUC

**Files:**
- Create: `src/lib/utils/theme.ts`
- Create: `tests/unit/utils/theme.test.ts`
- Modify: `src/app.css`
- Modify: `src/app.html`

**Interfaces:**
- Produces:
  - `export type Theme = "light" | "dark"`
  - `export const THEME_STORAGE_KEY = "sergine_theme"`
  - `export function isTheme(value: unknown): value is Theme`
  - `export function getStoredTheme(): Theme | null` (browser-only; returns null on SSR / missing)
  - `export function resolveInitialTheme(): Theme` (stored or `"light"`)
  - `export function applyTheme(theme: Theme): void` (sets `document.documentElement.dataset.theme` + localStorage)

- [ ] **Step 1: Write failing unit tests for theme utils**

```ts
// tests/unit/utils/theme.test.ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getStoredTheme,
  isTheme,
  resolveInitialTheme,
} from "$utils/theme";

describe("theme utils", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("isTheme accepts only light and dark", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("resolveInitialTheme defaults to light when storage empty", () => {
    expect(resolveInitialTheme()).toBe("light");
  });

  it("getStoredTheme reads valid storage", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(getStoredTheme()).toBe("dark");
    expect(resolveInitialTheme()).toBe("dark");
  });

  it("getStoredTheme ignores invalid storage", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "neon");
    expect(getStoredTheme()).toBeNull();
    expect(resolveInitialTheme()).toBe("light");
  });

  it("applyTheme sets data-theme and persists", () => {
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- tests/unit/utils/theme.test.ts
```

Expected: FAIL module not found / exports missing.

- [ ] **Step 3: Implement `src/lib/utils/theme.ts`**

```ts
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "sergine_theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function getStoredTheme(): Theme | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore quota / private mode */
    }
  }
}
```

- [ ] **Step 4: Update `src/app.css` tokens**

Replace the single `:root` dark palette with light defaults and dark override:

```css
@layer base {
  :root,
  [data-theme="light"] {
    --bg-canvas: #f5f2ec;
    --bg-surface: #ede8df;
    --bg-elevated: #faf7f2;
    --text-primary: #0e0e0e;
    --text-secondary: #5c574f;
    --text-muted: #8a847a;
    --border-hairline: rgba(14, 14, 14, 0.08);
    --accent: #6e1f2e;
    --state-hover: rgba(14, 14, 14, 0.06);
    --brand-burgundy: #6e1f2e;
    --brand-gold: #c9a24a;
  }

  [data-theme="dark"] {
    --bg-canvas: #0e0e0e;
    --bg-surface: #161616;
    --bg-elevated: #1f1f1f;
    --text-primary: #f5f2ec;
    --text-secondary: #a8a29a;
    --text-muted: #6b6660;
    --border-hairline: rgba(245, 242, 236, 0.08);
    --accent: #e8dfd0;
    --state-hover: rgba(255, 255, 255, 0.06);
    --brand-burgundy: #6e1f2e;
    --brand-gold: #c9a24a;
  }
}
```

Update shared components that hardcode white borders to use token-friendly borders:

```css
.card {
  @apply bg-surface border border-[color:var(--border-hairline)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5;
}

.filter-pill {
  @apply px-4 py-1.5 text-sm font-medium rounded-full border border-[color:var(--border-hairline)] text-secondary transition-all duration-200 hover:border-burgundy hover:text-burgundy cursor-pointer;
}

.input {
  @apply w-full px-4 py-3 rounded-lg bg-elevated border border-[color:var(--border-hairline)] text-primary placeholder:text-muted transition-all duration-200 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy;
}
```

Keep `html { background-color: var(--bg-canvas); color: var(--text-primary); ... }` as today.

- [ ] **Step 5: Update `src/app.html` default + anti-FOUC**

```html
<!doctype html>
<html lang="%sveltekit.lang%" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <title>Sergine Hougoue Immo</title>
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      (function () {
        try {
          var key = "sergine_theme";
          var t = localStorage.getItem(key);
          if (t === "light" || t === "dark") {
            document.documentElement.setAttribute("data-theme", t);
          } else {
            document.documentElement.setAttribute("data-theme", "light");
          }
        } catch (e) {
          document.documentElement.setAttribute("data-theme", "light");
        }
      })();
    </script>
    <!-- existing font links + %sveltekit.head% -->
```

- [ ] **Step 6: Run unit tests — expect PASS**

```bash
npm test -- tests/unit/utils/theme.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/utils/theme.ts tests/unit/utils/theme.test.ts src/app.css src/app.html
git commit -m "feat(theme): dual light/dark CSS tokens and theme utils"
```

---

### Task 2: ThemeToggle + larger wordmark + Nav/Footer wiring

**Files:**
- Create: `src/lib/components/layout/ThemeToggle.svelte`
- Create: `tests/component/ThemeToggle.test.ts`
- Modify: `src/lib/components/layout/Nav.svelte`
- Modify: `tests/component/Nav.test.ts`
- Modify: `src/lib/i18n/copy.ts` (nav.teamPartners + theme labels)
- Modify: `src/lib/components/layout/Footer.svelte` (team link; larger brand optional)

**Interfaces:**
- Consumes: `applyTheme`, `resolveInitialTheme`, `Theme` from `$utils/theme`
- Produces: `<ThemeToggle locale={Locale} />`
- Copy additions on `NavCopy`: `teamPartners: string`
- Copy additions: `theme: { toggleToLight: string; toggleToDark: string }` on `SiteCopy` (or nest under nav)

- [ ] **Step 1: Extend copy types and FR/EN strings first (needed by components)**

In `src/lib/i18n/copy.ts`:

```ts
// NavCopy
export interface NavCopy {
  home: string;
  services: string;
  listings: string;
  transactions: string;
  blog: string;
  teamPartners: string;
  about: string;
  contact: string;
  cta: string;
}

// On SiteCopy
export interface ThemeCopy {
  toLight: string;
  toDark: string;
}

export interface SiteCopy {
  // ...existing
  theme: ThemeCopy;
}

// fr.nav.teamPartners = "Équipe et partenaires"
// en.nav.teamPartners = "Team & partners"
// fr.theme = { toLight: "Passer en mode clair", toDark: "Passer en mode sombre" }
// en.theme = { toLight: "Switch to light mode", toDark: "Switch to dark mode" }
```

- [ ] **Step 2: Write failing ThemeToggle component test**

```ts
// tests/component/ThemeToggle.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import ThemeToggle from "$components/layout/ThemeToggle.svelte";
import { THEME_STORAGE_KEY } from "$utils/theme";

describe("<ThemeToggle>", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
  });

  it("toggles theme from light to dark and persists", async () => {
    render(ThemeToggle, { props: { locale: "fr" } });
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("exposes an accessible label", () => {
    render(ThemeToggle, { props: { locale: "en" } });
    expect(screen.getByRole("button").getAttribute("aria-label")).toBeTruthy();
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

```bash
npm test -- tests/component/ThemeToggle.test.ts
```

- [ ] **Step 4: Implement ThemeToggle**

```svelte
<!-- src/lib/components/layout/ThemeToggle.svelte -->
<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import {
    applyTheme,
    resolveInitialTheme,
    type Theme,
  } from "$utils/theme";
  import { onMount } from "svelte";

  interface Props {
    locale: Locale;
  }
  let { locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  let theme = $state<Theme>("light");

  onMount(() => {
    theme = resolveInitialTheme();
    applyTheme(theme);
  });

  function toggle() {
    theme = theme === "light" ? "dark" : "light";
    applyTheme(theme);
  }

  const label = $derived(
    theme === "light" ? copy.theme.toDark : copy.theme.toLight,
  );
</script>

<button
  type="button"
  class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-secondary hover:text-primary hover:bg-[var(--state-hover)] transition-colors"
  aria-label={label}
  aria-pressed={theme === "dark"}
  onclick={toggle}
>
  {#if theme === "light"}
    <!-- moon icon (simple SVG) -->
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </svg>
  {:else}
    <!-- sun icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  {/if}
</button>
```

- [ ] **Step 5: Update Nav — wordmark, ThemeToggle, team link**

```svelte
<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import LangToggle from "./LangToggle.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  interface Props {
    currentPath: string;
    locale: Locale;
  }
  let { currentPath, locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  const base = $derived(`/${locale}`);

  const links = $derived([
    { href: `${base}/`, label: copy.nav.home },
    { href: `${base}/services`, label: copy.nav.services },
    { href: `${base}/biens`, label: copy.nav.listings },
    { href: `${base}/transactions`, label: copy.nav.transactions },
    { href: `${base}/blog`, label: copy.nav.blog },
    { href: `${base}/equipe-partenaires`, label: copy.nav.teamPartners },
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact },
  ]);
</script>

<nav
  class="sticky top-0 z-50 w-full border-b border-[color:var(--border-hairline)] bg-canvas/95 backdrop-blur-xl"
  aria-label="Primary"
>
  <div class="container-editorial flex h-16 md:h-20 items-center justify-between gap-4">
    <a
      href={`${base}/`}
      class="font-display text-2xl md:text-3xl lg:text-4xl tracking-tight text-primary flex items-center min-h-11"
    >
      <span class="text-burgundy">S</span>ergine Hougoue
    </a>

    <div class="hidden md:flex items-center gap-2">
      <ul class="flex items-center gap-1 text-sm font-medium">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-[var(--state-hover)] transition-all duration-200 {currentPath === link.href || currentPath === link.href.replace(/\/$/, '') ? 'text-primary bg-[var(--state-hover)]' : ''}"
              aria-current={currentPath === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>

      <div class="ml-2 flex items-center gap-2">
        <ThemeToggle {locale} />
        <LangToggle {currentPath} currentLocale={locale} />
        <a href={`${base}/contact`} class="btn-primary text-sm px-5 py-2">
          {copy.nav.cta}
        </a>
      </div>
    </div>

    <div class="md:hidden flex items-center gap-2">
      <ThemeToggle {locale} />
      <a href={`${base}/contact`} class="btn-primary text-sm px-4 py-2">
        {copy.nav.cta}
      </a>
    </div>
  </div>
</nav>
```

- [ ] **Step 6: Update Footer sitemap array** to include team partners link (same href/label as nav). Replace `border-white/10` with `border-[color:var(--border-hairline)]` on footer.

- [ ] **Step 7: Extend Nav tests**

```ts
it("renders team partners link and larger wordmark", () => {
  render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
  expect(
    screen.getByRole("link", { name: "Équipe et partenaires" }),
  ).toHaveAttribute("href", "/fr/equipe-partenaires");
  const brand = screen.getByRole("link", { name: /Sergine Hougoue/i });
  expect(brand.className).toMatch(/text-2xl/);
});

it("renders theme toggle", () => {
  render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
  expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
});
```

- [ ] **Step 8: Run component tests**

```bash
npm test -- tests/component/ThemeToggle.test.ts tests/component/Nav.test.ts tests/component/Footer.test.ts
```

Expected: PASS (update Footer tests if they assert exact link count).

- [ ] **Step 9: Commit**

```bash
git add src/lib/components/layout/ThemeToggle.svelte src/lib/components/layout/Nav.svelte src/lib/components/layout/Footer.svelte src/lib/i18n/copy.ts tests/component/ThemeToggle.test.ts tests/component/Nav.test.ts tests/component/Footer.test.ts
git commit -m "feat(nav): theme toggle, larger wordmark, team partners link"
```

---

### Task 3: Light-mode contrast audit (hardcoded white borders)

**Files:**
- Modify pages/components that use `border-white/10`, `border-white/15`, `bg-white/[0.02]`, `hover:bg-white/5` to theme-aware borders/hover:
  - `src/routes/+page.svelte`
  - `src/routes/a-propos/+page.svelte`
  - `src/routes/biens/+page.svelte`
  - `src/routes/biens/[slug]/+page.svelte`
  - `src/routes/blog/+page.svelte`
  - `src/routes/blog/[slug]/+page.svelte`
  - `src/routes/transactions/+page.svelte`
  - `src/lib/components/content/PageHeader.svelte`
  - `src/lib/components/content/Hero.svelte`
  - `src/lib/components/content/TestimonialChip.svelte`
  - `src/lib/components/content/PropertyCarousel.svelte` (use `border-[color:var(--border-hairline)]` and remove hard-coded ring-offset dark hex)
  - `src/lib/components/forms/ContactForm.svelte` if borders assume dark elevated only

**Rule:** Prefer `border-[color:var(--border-hairline)]` and `hover:bg-[var(--state-hover)]` over white-alpha utilities.

- [ ] **Step 1: Grep remaining white-alpha borders**

```bash
rg -n "border-white|bg-white/|ring-offset-\[#" src --glob '*.{svelte,css}'
```

- [ ] **Step 2: Replace systematically** (no behavior change in dark if variables correct).

- [ ] **Step 3: Run unit + component suite smoke**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add src
git commit -m "fix(theme): replace hardcoded white borders with theme tokens"
```

---

### Task 4: Optional contact message

**Files:**
- Modify: `src/lib/server/contact-schema.ts`
- Modify: `src/lib/i18n/forms.ts`
- Modify: `src/lib/server/resend.ts`
- Modify: `src/lib/components/forms/ContactForm.svelte` (labels only if driven by copy)
- Modify: `tests/unit/server/contact-schema.test.ts`
- Modify: `tests/unit/server/contact-handler.test.ts` if it asserts min message
- Modify: `tests/component/ContactForm.test.ts`
- Modify: `tests/e2e/contact.spec.ts`

**Interfaces:**
- `message` field: `z.string().trim().max(2000).optional()` or allow `""` then normalize to `""` in output
- Prefer schema:

```ts
message: z
  .string()
  .trim()
  .max(2000, "Message is too long")
  .optional()
  .transform((v) => v ?? ""),
```

Or keep always-string:

```ts
message: z.string().trim().max(2000),
// empty string OK — no .min(10)
```

Client `createContactFormSchema`:

```ts
message: z.string().trim().max(2000),
// remove .min(10, validation.messageMin)
```

Copy:

```ts
// FR
message: "Message (optionnel)",
// EN
message: "Message (optional)",
// validation.messageMax optional; remove reliance on messageMin for empty
```

Resend:

```ts
const messageBody =
  data.message.trim().length > 0
    ? escapeHtml(data.message).replaceAll("\n", "<br />")
    : "(no message)";
```

- [ ] **Step 1: Update failing unit test expectations**

Replace `rejects a message shorter than 10 characters` with:

```ts
it("accepts an empty message", () => {
  const result = contactFormSchema.safeParse({
    ...validPayload,
    message: "",
  });
  expect(result.success).toBe(true);
});

it("accepts a missing message by coercing if schema uses optional", () => {
  const { message: _m, ...rest } = validPayload;
  const result = contactFormSchema.safeParse({ ...rest, message: "" });
  expect(result.success).toBe(true);
});

it("rejects a message longer than 2000 characters", () => {
  const result = contactFormSchema.safeParse({
    ...validPayload,
    message: "a".repeat(2001),
  });
  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Run — expect FAIL on empty message still rejected**

```bash
npm test -- tests/unit/server/contact-schema.test.ts
```

- [ ] **Step 3: Implement schema + forms.ts + resend**

`contact-schema.ts`:

```ts
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(10, "Phone must be at least 10 characters"),
  email: z.string().trim().email("Invalid email address"),
  intent: z.enum(contactIntents),
  message: z.string().trim().max(2000, "Message is too long").default(""),
});
```

Mirror max-only rule in `forms.ts` `createContactFormSchema`. Update FR/EN field labels to include (optionnel)/(optional). Keep `messageMin` key unused or replace with `messageMax` if you surface max errors.

- [ ] **Step 4: Update component/e2e**

Component: assert label contains optionnel/optional; submit without message succeeds when fetch mocked.

E2E: add test that fills name/phone/email/intent only (leave message empty), expects success.

```ts
test("/fr/contact submits without message", async ({ page }) => {
  // same mock + cookie init as existing submit test
  await page.goto("/fr/contact");
  await page.locator("#contact-name").fill("Jane Doe");
  await page.locator("#contact-phone").fill("4384626015");
  await page.locator("#contact-email").fill("jane@example.com");
  await page.locator("#contact-intent").selectOption("buy");
  // do not fill message
  await page.locator("form").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
  });
  await expect(page.getByTestId("contact-form-success")).toBeVisible({
    timeout: 15_000,
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test -- tests/unit/server/contact-schema.test.ts tests/unit/server/contact-handler.test.ts tests/component/ContactForm.test.ts
npx playwright test tests/e2e/contact.spec.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/contact-schema.ts src/lib/server/resend.ts src/lib/i18n/forms.ts src/lib/components/forms/ContactForm.svelte tests/unit/server/contact-schema.test.ts tests/unit/server/contact-handler.test.ts tests/component/ContactForm.test.ts tests/e2e/contact.spec.ts
git commit -m "feat(contact): make message field optional"
```

---

### Task 5: Expand About expertise (flip + location)

**Files:**
- Modify: `src/lib/i18n/copy.ts` (`about.expertise` FR + EN arrays)
- Create or modify: `tests/unit/i18n/copy-expertise.test.ts` (or extend existing i18n tests if present)

**Interfaces:**
- `about.expertise` length becomes **5**
- New items (exact titles locked):

FR:

```ts
{
  title: "Flip immobilier",
  description:
    "Stratégie d'achat, de rénovation et de revente pour maximiser la plus-value sur des projets de flip résidentiels.",
},
{
  title: "Location de propriétés",
  description:
    "Accompagnement des propriétaires bailleurs : mise en location, critères locataires et optimisation de la rentabilité locative.",
},
```

EN:

```ts
{
  title: "Property flip",
  description:
    "Buy–renovate–resell strategy to maximize value on residential flip projects.",
},
{
  title: "Property rentals",
  description:
    "Support for landlord owners: listing for rent, tenant criteria, and rental yield optimization.",
},
```

Append after existing three cards (order: first-time buyers, investors, selling, flip, rentals).

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { getCopy } from "$i18n/copy";

describe("about expertise", () => {
  it("includes flip and rentals in FR", () => {
    const titles = getCopy("fr").about.expertise.map((e) => e.title);
    expect(titles).toHaveLength(5);
    expect(titles).toContain("Flip immobilier");
    expect(titles).toContain("Location de propriétés");
  });

  it("includes flip and rentals in EN", () => {
    const titles = getCopy("en").about.expertise.map((e) => e.title);
    expect(titles).toHaveLength(5);
    expect(titles).toContain("Property flip");
    expect(titles).toContain("Property rentals");
  });
});
```

- [ ] **Step 2: Run FAIL → implement copy → PASS**

```bash
npm test -- tests/unit/i18n/copy-expertise.test.ts
```

About page already loops `copy.about.expertise` — no page change required unless grid needs `md:grid-cols-2 lg:grid-cols-3` for five cards (recommended tweak on `a-propos/+page.svelte`).

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n/copy.ts src/routes/a-propos/+page.svelte tests/unit/i18n/copy-expertise.test.ts
git commit -m "feat(about): add flip and rental expertise cards"
```

---

### Task 6: Quebec territory section on Home

**Files:**
- Create: `src/lib/i18n/regions.ts`
- Create: `tests/unit/i18n/regions.test.ts`
- Create (optional): `src/lib/components/content/TerritoryGrid.svelte`
- Create: `tests/component/TerritoryGrid.test.ts` (if component extracted)
- Modify: `src/lib/i18n/copy.ts` — `HomeCopy` gains `territoryTitle`, `territoryIntro`
- Modify: `src/routes/+page.svelte`
- Modify: `tests/e2e/home.spec.ts`

**Interfaces:**

```ts
// src/lib/i18n/regions.ts
export const QUEBEC_REGIONS = [
  "Bas-Saint-Laurent",
  "Saguenay–Lac-Saint-Jean",
  "Capitale-Nationale",
  "Mauricie",
  "Estrie",
  "Montréal",
  "Outaouais",
  "Abitibi-Témiscamingue",
  "Côte-Nord",
  "Nord-du-Québec",
  "Gaspésie–Îles-de-la-Madeleine",
  "Chaudière-Appalaches",
  "Laval",
  "Lanaudière",
  "Laurentides",
  "Montérégie",
  "Centre-du-Québec",
] as const;

export type QuebecRegion = (typeof QUEBEC_REGIONS)[number];

export function getQuebecRegions(): readonly QuebecRegion[] {
  return QUEBEC_REGIONS;
}
```

Home copy FR:

```ts
territoryTitle: "Partout au Québec",
territoryIntro:
  "J'accompagne acheteurs et vendeurs dans les 17 régions administratives du Québec.",
```

EN:

```ts
territoryTitle: "Across Quebec",
territoryIntro:
  "I support buyers and sellers across Quebec's 17 administrative regions.",
```

- [ ] **Step 1: Unit test regions count + accents**

```ts
import { describe, expect, it } from "vitest";
import { QUEBEC_REGIONS, getQuebecRegions } from "$i18n/regions";

describe("QUEBEC_REGIONS", () => {
  it("lists exactly 17 administrative regions", () => {
    expect(getQuebecRegions()).toHaveLength(17);
    expect(QUEBEC_REGIONS).toContain("Montréal");
    expect(QUEBEC_REGIONS).toContain("Gaspésie–Îles-de-la-Madeleine");
    expect(QUEBEC_REGIONS).toContain("Saguenay–Lac-Saint-Jean");
  });
});
```

- [ ] **Step 2: Implement regions module + copy fields**

- [ ] **Step 3: Add Territory section to Home** (after featured properties / before testimonials or before final CTA):

```svelte
<script lang="ts">
  // existing imports...
  import { getQuebecRegions } from "$i18n/regions";
  const regions = getQuebecRegions();
</script>

<section
  class="container-editorial py-14 md:py-20 border-t border-[color:var(--border-hairline)]"
  aria-labelledby="territory-heading"
>
  <h2 id="territory-heading" class="font-display text-3xl text-primary mb-3">
    {copy.home.territoryTitle}
  </h2>
  <p class="text-secondary max-w-2xl mb-8">{copy.home.territoryIntro}</p>
  <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {#each regions as region}
      <li
        class="rounded-lg border border-[color:var(--border-hairline)] bg-surface px-3 py-2 text-sm text-primary"
      >
        {region}
      </li>
    {/each}
  </ul>
</section>
```

- [ ] **Step 4: E2E home assertion**

```ts
test("home shows Quebec territory regions", async ({ page }) => {
  await page.goto("/fr/");
  await expect(
    page.getByRole("heading", { name: /Partout au Québec/i }),
  ).toBeVisible();
  await expect(page.getByText("Montréal")).toBeVisible();
  await expect(page.getByText("Montérégie")).toBeVisible();
});
```

- [ ] **Step 5: Run tests + commit**

```bash
npm test -- tests/unit/i18n/regions.test.ts
npx playwright test tests/e2e/home.spec.ts
git add src/lib/i18n/regions.ts src/lib/i18n/copy.ts src/routes/+page.svelte tests/unit/i18n/regions.test.ts tests/e2e/home.spec.ts
git commit -m "feat(home): Quebec territory coverage grid"
```

---

### Task 7: Partner category `courtier-hypothecaire` + types + schema tests

**Files:**
- Modify: `src/lib/sanity/types.ts`
- Modify: `src/lib/sanity/schemas/partner.ts`
- Modify: `tests/unit/sanity/schemas.test.ts`
- Modify: `src/lib/i18n/copy.ts` — introduce `teamPartners` copy namespace with categories; remove partner fields from `TransactionsCopy` if no longer used

**Interfaces:**

```ts
export type PartnerCategory =
  | "preteur"
  | "courtier-hypothecaire"
  | "notaire"
  | "inspecteur"
  | "autre";
```

Schema:

```ts
const partnerCategories = [
  { title: "Prêteur", value: "preteur" },
  { title: "Courtier hypothécaire", value: "courtier-hypothecaire" },
  { title: "Notaire", value: "notaire" },
  { title: "Inspecteur", value: "inspecteur" },
  { title: "Autre", value: "autre" },
] as const;
```

Copy:

```ts
export interface TeamPartnersCopy {
  eyebrow: string;
  title: string;
  intro: string;
  teamHeading: string;
  partnersHeading: string;
  emptyPartners: string;
  partnerCategories: Record<PartnerCategory, string>;
}

// Remove partnersHeading + partnerCategories from TransactionsCopy
// transactions.intro can stay sales-focused only
```

FR categories:

```ts
preteur: "Prêteurs",
"courtier-hypothecaire": "Courtiers hypothécaires",
notaire: "Notaires",
inspecteur: "Inspecteurs",
autre: "Autres partenaires",
```

EN:

```ts
preteur: "Lenders",
"courtier-hypothecaire": "Mortgage brokers",
notaire: "Notaries",
inspecteur: "Inspectors",
autre: "Other partners",
```

- [ ] **Step 1: Update schema test expectations** to include courtier value

```ts
expect(list).toEqual(
  expect.arrayContaining([
    { title: "Courtier hypothécaire", value: "courtier-hypothecaire" },
  ]),
);
```

- [ ] **Step 2: Implement type + schema + copy**

- [ ] **Step 3: Fix any TS breakages** (transactions page still importing partnerCategories — fixed in Task 8)

```bash
npm test -- tests/unit/sanity/schemas.test.ts
npx svelte-check --tsconfig ./tsconfig.json
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/sanity/types.ts src/lib/sanity/schemas/partner.ts src/lib/i18n/copy.ts tests/unit/sanity/schemas.test.ts
git commit -m "feat(cms): add mortgage broker partner category"
```

---

### Task 8: Team & partners page + strip Transactions partners

**Files:**
- Modify: `src/lib/sanity/load-cms.ts` — add `loadCmsTeamPartnersData`; remove partners from transactions loader
- Modify: `tests/unit/sanity/load-cms.test.ts`
- Create: `src/routes/equipe-partenaires/+page.server.ts`
- Create: `src/routes/equipe-partenaires/+page.svelte`
- Modify: `src/routes/transactions/+page.svelte` — remove partners section/imports
- Modify: `src/routes/transactions/+page.server.ts` if types change
- Modify: `src/routes/+layout.svelte` — SEO for `/equipe-partenaires`
- Modify: `src/routes/sitemap.xml/+server.ts` — add path
- Create: `tests/e2e/equipe-partenaires.spec.ts`
- Modify: `tests/e2e/transactions.spec.ts` — assert partners heading absent

**Interfaces:**

```ts
export type CmsTeamPartnersData = {
  teamMembers: TeamMember[];
  partners: Partner[];
};

export async function loadCmsTeamPartnersData(
  lang: Locale,
): Promise<CmsTeamPartnersData> {
  // same empty-fallback + isSanityConfigured pattern as loadCmsAboutData
  // fetch teamMembersQuery + partnersQuery in parallel
}

export type CmsTransactionsData = {
  soldProperties: Property[];
  // partners removed
};
```

`+page.server.ts`:

```ts
import { loadCmsTeamPartnersData } from "$sanity/load-cms";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  return loadCmsTeamPartnersData(locale);
};
```

Page UI pattern (mirror former transactions partners + about photo):

```svelte
<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import { getCopy } from "$i18n/copy";
  import { urlFor } from "$sanity/image";
  import type { Partner, PartnerCategory } from "$sanity/types";
  import type { PageData } from "./$types";

  const PARTNER_CATEGORY_ORDER: PartnerCategory[] = [
    "preteur",
    "courtier-hypothecaire",
    "notaire",
    "inspecteur",
    "autre",
  ];

  let { data }: { data: PageData } = $props();
  const copy = $derived(getCopy(data.locale));
  const member = $derived(data.teamMembers[0]);
  // partnersByCategory derived like former transactions page
  // photoUrl fallback /Profil.png
</script>

<PageHeader
  eyebrow={copy.teamPartners.eyebrow}
  title={copy.teamPartners.title}
  intro={copy.teamPartners.intro}
/>

<section class="container-editorial pb-16">
  <h2 class="eyebrow text-burgundy mb-6">{copy.teamPartners.teamHeading}</h2>
  <!-- member photo + name + role -->
</section>

<section class="container-editorial border-t border-[color:var(--border-hairline)] py-16">
  <h2 class="eyebrow text-burgundy mb-8">{copy.teamPartners.partnersHeading}</h2>
  <!-- category grids with logo cards -->
</section>
```

SEO in `+layout.svelte` `effectiveTitle` / `effectiveDescription`:

```ts
if (p.startsWith("/equipe-partenaires"))
  return `${copy.teamPartners.title}${brand ? ` | ${brand}` : ""}`;
// description: copy.teamPartners.intro
```

Sitemap `STATIC_PATHS` add `"equipe-partenaires"`.

- [ ] **Step 1: Update load-cms tests**

- Transactions loader: expect `partners` not in result; mock only sold properties.
- New test: `loadCmsTeamPartnersData` fetches team + partners with locale.

- [ ] **Step 2: Implement loader + page + strip transactions**

- [ ] **Step 3: E2E**

```ts
// tests/e2e/equipe-partenaires.spec.ts
test("/fr/equipe-partenaires returns 200", async ({ page }) => {
  const copy = getCopy("fr");
  const res = await page.goto("/fr/equipe-partenaires");
  expect(res?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: copy.teamPartners.title }),
  ).toBeVisible();
});
```

Transactions e2e: ensure former partners heading is not visible (use previous FR string if removed from transactions copy — assert `getByRole('heading', { name: /partenaires de confiance/i })` count 0 **or** navigate and check sold heading only).

- [ ] **Step 4: Run**

```bash
npm test -- tests/unit/sanity/load-cms.test.ts
npx playwright test tests/e2e/equipe-partenaires.spec.ts tests/e2e/transactions.spec.ts
npm run check
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/sanity/load-cms.ts src/routes/equipe-partenaires src/routes/transactions src/routes/+layout.svelte src/routes/sitemap.xml/+server.ts tests
git commit -m "feat(routes): team & partners page; remove partners from transactions"
```

---

### Task 9: Full verification pass

**Files:** none new — regression only.

- [ ] **Step 1: Format + lint + typecheck + unit**

```bash
npm run format
npm run check
npm test
```

Expected: all unit/component tests pass.

- [ ] **Step 2: E2E suite**

```bash
npx playwright test
```

Expected: green (or only pre-existing environmental flakes documented).

- [ ] **Step 3: Manual smoke checklist**

1. Open `/fr/` — cream light background by default  
2. Toggle theme — dark applies; reload keeps dark  
3. Wordmark larger  
4. Home shows 17 regions  
5. `/fr/a-propos` — 5 expertise cards  
6. `/fr/contact` — submit without message (API mock or staging)  
7. `/fr/equipe-partenaires` — team + partner groups  
8. `/fr/transactions` — no partner logos section  
9. `/en/...` paths for nav labels  

- [ ] **Step 4: Final commit if fixes needed**

```bash
git add -A
git commit -m "fix: polish theme-partners-territory verification findings"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
| ---------------- | ---- |
| Light default + dark toggle + localStorage + anti-FOUC | 1–2 |
| Cream tokens + brand accents unchanged | 1 |
| Theme-aware borders audit | 3 |
| Larger Fraunces wordmark | 2 |
| Optional contact message client/server/email | 4 |
| Expertise flip + location | 5 |
| 17 regions on Home | 6 |
| `/equipe-partenaires` Sergine + partners | 8 |
| Category courtier-hypothecaire | 7 |
| Partners removed from Transactions | 8 |
| Nav/footer/sitemap/SEO | 2, 8 |
| Tests | every task + 9 |
| Out of scope (map, bios, hamburger, GA4) | not scheduled |

**Placeholder scan:** none intentional.  
**Type consistency:** `PartnerCategory` includes `courtier-hypothecaire` from Task 7 before page order in Task 8; `CmsTransactionsData` drops `partners` in Task 8; `copy.teamPartners` introduced Task 7 for Task 8 consumers; `copy.nav.teamPartners` Task 2 (nav can link before page exists — 404 until Task 8; acceptable or defer nav link addition to Task 8 if preferred — **prefer adding link in Task 2 as spec nav order**, page lands Task 8).

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-02-theme-partners-territory.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration (`superpowers:subagent-driven-development`)
2. **Inline Execution** — this session with `superpowers:executing-plans`, batch execution + checkpoints

Which approach?
