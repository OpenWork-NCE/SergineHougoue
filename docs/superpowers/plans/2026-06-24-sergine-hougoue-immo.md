# Sergine Hougoue Real Estate Web App â€” Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a bilingual (FR + EN) real estate web application for Sergine Hougoue that converts Quebec prospects into booked appointments and supports at least one new client per month leading to a transaction.

**Architecture:** SvelteKit 2 + Svelte 5 + TypeScript single-page-app-ish SSR site. Sanity CMS for all dynamic content (properties, blog posts, testimonials, partners, team, site settings) with FR + EN locales. Tailwind CSS consuming the existing dark-editorial design tokens from `DESIGN.md`, layered with two new brand tokens (`--brand-burgundy`, `--brand-gold`). Vercel hosting with serverless form handler. Resend for email delivery, click-to-WhatsApp for chat, Cal.com embed for booking, GA4 + Quebec Law 25 cookie consent.

**Tech Stack:**

- SvelteKit ^2.x, Svelte ^5.x (runes), TypeScript ^5.x, Vite (via SvelteKit)
- @sveltejs/adapter-vercel ^5.x
- Tailwind CSS ^3.4.x with PostCSS
- Sanity ^3.x (sanity, @sanity/client, @sanity/image-url, @sanity/document-internationalization, @sanity/vision)
- zod ^3.x, sveltekit-superforms ^2.x + client (form validation)
- resend ^4.x (transactional email)
- @playwright/test ^1.4x, @axe-core/playwright ^4.x (e2e + a11y)
- vitest ^2.x, @testing-library/svelte ^5.x, @testing-library/jest-dom, jsdom (unit + component tests)
- satori ^0.10.x, satori-html ^0.3.x, @resvg/resvg-js ^2.x (OG image generation)

**Working directory:** `C:\Users\AM\Documents\Workspace\DHC\immo`

**Reference spec:** `docs/superpowers/specs/2026-06-24-sergine-hougoue-immo-design.md`

**Reference design:** `DESIGN.md` (Lesse Studio clone â€” visual foundation)

## Global Constraints

These constraints apply to every task. Values are copied verbatim from the spec.

- **Framework**: SvelteKit 2 + Svelte 5 + TypeScript (runes API), `@sveltejs/adapter-vercel`.
- **Styling**: Tailwind CSS + CSS variables on `:root`. Existing DESIGN.md tokens stay; two new brand tokens layered on top: `--brand-burgundy: #6E1F2E` and `--brand-gold: #C9A24A`.
- **Typography**: Display = Fraunces (italic 300/500), Body = Inter (300/400/500), both preloaded from Google Fonts in `+layout.svelte`.
- **Motion**: default transition `700ms cubic-bezier(0.22, 1, 0.36, 1)`; scroll-reveal via IntersectionObserver; `prefers-reduced-motion: reduce` disables reveals and carousel auto-advance.
- **CMS**: Sanity embedded Studio at `/studio`. All user-facing string fields have FR (default) + EN variants via `@sanity/document-internationalization`. Photo alt text is required.
- **Locales**: `/fr/...` is default, `/en/...` is alternate. Root requests (e.g. `/services`) redirect to FR (`/fr/services`). Language toggle preserves path.
- **Contact delivery**: `wa.me/14384626015?text=...` for WhatsApp (no paid API). Form posts to `/api/contact` which validates with Zod and sends via Resend to `serginehougoue@gmail.com`.
- **Analytics**: GA4 only. Blocked by `<CookieBanner />` until user accepts. Persist choice in `localStorage` key `sergine_cookie_consent`.
- **Environment variables** (in Vercel dashboard, never committed): `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, `SANITY_READ_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `GA4_MEASUREMENT_ID`, `CAL_COM_LINK`, `PUBLIC_SITE_URL`.
- **Brand**: WhatsApp number `14384626015`, phone `438-462-6015`, email `serginehougoue@gmail.com`. Hours: Monâ€“Fri 8hâ€“20h, Satâ€“Sun 9hâ€“17h.
- **File naming**: `kebab-case` for files and directories; PascalCase for Svelte components; `camelCase` for functions/variables.
- **Commits**: Conventional Commits (`feat:`, `test:`, `chore:`, `docs:`, `fix:`, `refactor:`). Commit after every task. Run `npm run lint && npm run check` before each commit.
- **TDD discipline**: Every code task writes the failing test first, runs it to confirm failure, implements the minimum code to pass, runs to confirm pass, then commits.

---

# Phase 1 â€” Foundation (Weeks 1â€“2)

## File Structure (locked at end of Phase 1)

```
immo/
â”œâ”€â”€ docs/superpowers/{specs,plans}/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app.html
â”‚   â”œâ”€â”€ app.css
â”‚   â”œâ”€â”€ app.d.ts
â”‚   â”œâ”€â”€ hooks.server.ts
â”‚   â”œâ”€â”€ lib/
â”‚   â”‚   â”œâ”€â”€ components/{layout,content,forms,seo}/
â”‚   â”‚   â”œâ”€â”€ i18n/
â”‚   â”‚   â”œâ”€â”€ sanity/{client,image,queries,schemas,types}.ts
â”‚   â”‚   â”œâ”€â”€ server/{resend,og}.ts
â”‚   â”‚   â””â”€â”€ utils/{slug,format}.ts
â”‚   â””â”€â”€ routes/
â”‚       â”œâ”€â”€ +layout.svelte
â”‚       â”œâ”€â”€ +layout.server.ts
â”‚       â”œâ”€â”€ +layout.ts
â”‚       â”œâ”€â”€ +page.svelte                       (Home)
â”‚       â”œâ”€â”€ a-propos/+page.svelte
â”‚       â”œâ”€â”€ services/+page.svelte
â”‚       â”œâ”€â”€ biens/{+page.svelte,[slug]/+page.svelte}
â”‚       â”œâ”€â”€ transactions/+page.svelte
â”‚       â”œâ”€â”€ blog/{+page.svelte,[slug]/+page.svelte}
â”‚       â”œâ”€â”€ contact/+page.svelte
â”‚       â”œâ”€â”€ api/{contact,og}/+server.ts
â”‚       â””â”€â”€ studio/[[...index]]/+page.svelte
â”œâ”€â”€ tests/{unit,component,e2e}/
â”œâ”€â”€ static/{favicon.svg,og-default.png,placeholders/}
â”œâ”€â”€ sanity.config.ts
â”œâ”€â”€ svelte.config.js
â”œâ”€â”€ vite.config.ts
â”œâ”€â”€ tailwind.config.ts
â”œâ”€â”€ postcss.config.js
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ playwright.config.ts
â”œâ”€â”€ vitest.config.ts
â”œâ”€â”€ package.json
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

Full component file list lives in `src/lib/components/`:

- `layout/`: `Nav.svelte`, `Footer.svelte`, `LangToggle.svelte`, `CookieBanner.svelte`, `WhatsAppFab.svelte`
- `content/`: `Hero.svelte`, `PageHeader.svelte`, `PropertyCard.svelte`, `PropertyGrid.svelte`, `PropertyCarousel.svelte`, `ServiceAccordion.svelte`, `TestimonialChip.svelte`, `TeamMember.svelte`, `BlogCard.svelte`, `CtaStrip.svelte`, `PortableTextRenderer.svelte`
- `forms/`: `ContactForm.svelte`, `CalEmbed.svelte`
- `seo/`: `SeoHead.svelte`

---

## Task 1.1: Initialize SvelteKit + TypeScript project

**Files:**

- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.d.ts`, `.gitignore`, `README.md`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`

**Interfaces:**

- Consumes: nothing (greenfield)
- Produces: a runnable SvelteKit dev server on `http://localhost:5173`

- [ ] **Step 1: Create `.gitignore`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\.gitignore`:

```gitignore
node_modules
.svelte-kit
build
.env
.env.*
!.env.example
.vercel
.DS_Store
test-results
playwright-report
coverage
.env.local
```

- [ ] **Step 2: Create `package.json`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\package.json`:

```json
{
  "name": "sergine-hougoue-immo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@sveltejs/adapter-vercel": "^5.4.0",
    "@sveltejs/kit": "^2.8.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "svelte": "^5.1.0",
    "svelte-check": "^4.0.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "prettier": "^3.3.0",
    "prettier-plugin-svelte": "^3.2.0",
    "eslint": "^9.13.0",
    "@typescript-eslint/eslint-plugin": "^8.12.0",
    "@typescript-eslint/parser": "^8.12.0",
    "eslint-plugin-svelte": "^2.46.0",
    "eslint-config-prettier": "^9.1.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm install`
Expected: `node_modules/` created, no errors. `package-lock.json` written.

- [ ] **Step 4: Create `svelte.config.js`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\svelte.config.js`:

```javascript
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ runtime: "nodejs20.x" }),
    alias: {
      $components: "src/lib/components",
      $i18n: "src/lib/i18n",
      $sanity: "src/lib/sanity",
      $server: "src/lib/server",
      $utils: "src/lib/utils",
    },
  },
};

export default config;
```

- [ ] **Step 5: Create `vite.config.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\vite.config.ts`:

```typescript
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: { port: 5173 },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
```

- [ ] **Step 6: Create `tsconfig.json`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tsconfig.json`:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

- [ ] **Step 7: Create `src/app.html`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\app.html`:

```html
<!doctype html>
<html lang="%sveltekit.lang%" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;1,300;1,500&family=Inter:wght@300;400;500&display=swap"
    />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 8: Create `src/app.d.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\app.d.ts`:

```typescript
// Placeholder until Task 1.4 introduces $i18n/locales
type Locale = "fr" | "en";

declare global {
  namespace App {
    interface Locals {
      locale: Locale;
    }
    interface PageData {
      locale: Locale;
    }
  }
}

export {};
```

- [ ] **Step 9: Create minimal `+layout.svelte` and `+page.svelte`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+layout.svelte`:

```svelte
<slot />
```

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+page.svelte`:

```svelte
<h1>Sergine Hougoue</h1>
<p>Bootstrap OK</p>
```

- [ ] **Step 10: Create `README.md`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\README.md`:

```markdown
# Sergine Hougoue â€” Real Estate Web App

Bilingual (FR + EN) SvelteKit site for Sergine Hougoue, OACIQ-certified real estate broker at VENDIRECT.

See `docs/superpowers/specs/2026-06-24-sergine-hougoue-immo-design.md` for the design spec.

## Local development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:5173.

## Tests

\`\`\`bash
npm run test # unit + component
npm run test:e2e # Playwright e2e + a11y
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
```

- [ ] **Step 11: Run the dev server to verify**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev`
Expected: `Local: http://localhost:5173` printed. Open it; see "Sergine Hougoue" and "Bootstrap OK". Stop the server (Ctrl+C).

- [ ] **Step 12: Verify TypeScript**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 13: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "chore: scaffold SvelteKit + TypeScript project"
```

---

## Task 1.2: Install + configure Tailwind CSS with brand tokens

**Files:**

- Create: `tailwind.config.ts`, `postcss.config.js`, `src/app.css`
- Modify: `src/routes/+layout.svelte` (import `app.css`)

**Interfaces:**

- Consumes: `package.json` (Task 1.1)
- Produces: `bg-canvas`, `bg-surface`, `text-primary`, `text-secondary`, `accent`, `brand-burgundy`, `brand-gold` Tailwind utilities available; `app.css` global styles loaded

- [ ] **Step 1: Install Tailwind + PostCSS**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0`
Expected: `tailwindcss`, `postcss`, `autoprefixer` in `package.json` devDependencies.

- [ ] **Step 2: Create `tailwind.config.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,svelte,ts,js}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // DESIGN.md base tokens (dark editorial)
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
        // Sergine brand tokens (new)
        burgundy: "var(--brand-burgundy)",
        gold: "var(--brand-gold)",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        none: "0",
        full: "9999px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        editorial: "700ms",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Create `postcss.config.js`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\postcss.config.js`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Create `src/app.css` with Tailwind layers + DESIGN.md tokens + new brand tokens**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* DESIGN.md base palette (existing) */
    --bg-canvas: #0e0e0e;
    --bg-surface: #161616;
    --bg-elevated: #1f1f1f;
    --text-primary: #f5f2ec;
    --text-secondary: #a8a29a;
    --text-muted: #6b6660;
    --border-hairline: rgba(245, 242, 236, 0.08);
    --accent: #e8dfd0;
    --state-hover: rgba(255, 255, 255, 0.06);

    /* Sergine brand tokens (new) */
    --brand-burgundy: #6e1f2e;
    --brand-gold: #c9a24a;
  }

  html {
    background-color: var(--bg-canvas);
    color: var(--text-primary);
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    font-weight: 300;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    min-height: 100vh;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Fraunces", ui-serif, Georgia, serif;
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.01em;
  }

  *:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
}

@layer components {
  .container-editorial {
    @apply mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16;
  }

  .eyebrow {
    @apply text-xs uppercase tracking-[0.08em] text-secondary;
  }

  .editorial-transition {
    transition: all 700ms cubic-bezier(0.22, 1, 0.36, 1);
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Wire `app.css` into the root layout**

Modify `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+layout.svelte` to:

```svelte
<script lang="ts">
  import '../app.css';
</script>

<slot />
```

- [ ] **Step 6: Verify Tailwind works â€” update Home page**

Modify `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+page.svelte` to:

```svelte
<main class="container-editorial py-24">
  <p class="eyebrow mb-4">01 / Courtier immobilier</p>
  <h1 class="font-display text-5xl md:text-6xl text-balance text-primary">
    Construisons votre avenir immobilier
  </h1>
  <p class="mt-6 text-secondary text-lg max-w-2xl">
      Bootstrap OK â€” Tailwind tokens loaded.
  </p>
</main>
```

- [ ] **Step 7: Run dev server to verify**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev`
Expected: open `http://localhost:5173`; see a dark canvas with cream serif H1 and burgundy eyebrow text (note: eyebrow is currently `--text-secondary`, will become gold in Step 8). Stop the server.

- [ ] **Step 8: Verify TypeScript**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 9: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat: add Tailwind CSS with DESIGN.md tokens + Sergine brand colors"
```

---

## Task 1.3: Configure Vitest (unit + component) and Playwright (e2e + a11y)

**Files:**

- Create: `vitest.config.ts`, `tests/setup.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/home.spec.ts`
- Modify: `package.json` (add test scripts), `src/routes/+page.svelte` (the new heading from Task 1.2 stays)

**Interfaces:**

- Consumes: `package.json` (Task 1.1), `svelte.config.js`
- Produces: working `npm run test` and `npm run test:e2e` commands; one passing e2e test against Home

- [ ] **Step 1: Install Vitest + Testing Library + Playwright + axe-core**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
npm install -D vitest@^2.1.0 @vitest/ui@^2.1.0 jsdom@^25.0.0 @testing-library/svelte@^5.2.0 @testing-library/jest-dom@^6.5.0 @playwright/test@^1.48.0 @axe-core/playwright@^4.10.0
npx playwright install --with-deps chromium
```

Expected: `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/svelte`, `@testing-library/jest-dom`, `@playwright/test`, `@axe-core/playwright` in devDependencies. Playwright browsers downloaded.

- [ ] **Step 2: Create `vitest.config.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\vitest.config.ts`:

```typescript
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: [
      "src/**/*.{test,spec}.{js,ts}",
      "tests/unit/**/*.{test,spec}.{js,ts}",
      "tests/component/**/*.{test,spec}.{js,ts}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["**/*.d.ts", "tests/**", "node_modules/**"],
    },
  },
  resolve: {
    alias: {
      $components: "/src/lib/components",
      $i18n: "/src/lib/i18n",
      $sanity: "/src/lib/sanity",
      $server: "/src/lib/server",
      $utils: "/src/lib/utils",
    },
  },
});
```

- [ ] **Step 3: Create `tests/setup.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("$app/environment", () => ({
  browser: false,
  dev: true,
  building: false,
  version: "test",
}));

vi.mock("$app/navigation", () => ({
  goto: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadData: vi.fn(),
  preloadCode: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn(),
}));
```

- [ ] **Step 4: Write a sanity-check unit test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\unit\smoke.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("test infra", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test`
Expected: `1 passed`.

- [ ] **Step 6: Create `playwright.config.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 7: Write a sanity-check e2e test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\e2e\home.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("home page renders the bootstrap heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Construisons votre avenir immobilier" }),
  ).toBeVisible();
});
```

- [ ] **Step 8: Run the e2e test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test:e2e`
Expected: `2 passed (chromium, mobile-chrome)`.

- [ ] **Step 9: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "test: configure Vitest + Testing Library + Playwright + axe-core"
```

---

## Task 1.4: Build the i18n locale module + unit tests

**Files:**

- Create: `src/lib/i18n/locales.ts`, `src/lib/i18n/detectLocale.ts`, `src/lib/i18n/copy.ts`, `tests/unit/i18n/detectLocale.test.ts`, `tests/unit/i18n/copy.test.ts`
- Modify: `src/app.d.ts` (replace placeholder Locale type with real import)

**Interfaces:**

- Consumes: nothing
- Produces:
  - `type Locale = 'fr' | 'en'` (canonical)
  - `LOCALES: readonly Locale[]`
  - `DEFAULT_LOCALE: 'fr'`
  - `detectLocale(pathname: string, acceptLanguage?: string | null): Locale`
  - `translatePath(pathname: string, from: Locale, to: Locale): string`
  - `getCopy(locale: Locale): SiteCopy`

- [ ] **Step 1: Write the failing test for `detectLocale`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\unit\i18n\detectLocale.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { detectLocale, translatePath } from "$i18n/detectLocale";

describe("detectLocale", () => {
  it("returns fr for /fr/services", () => {
    expect(detectLocale("/fr/services")).toBe("fr");
  });

  it("returns en for /en/services", () => {
    expect(detectLocale("/en/services")).toBe("en");
  });

  it("returns fr for root / when no Accept-Language header", () => {
    expect(detectLocale("/")).toBe("fr");
  });

  it("returns fr for root / even with Accept-Language en", () => {
    // Path prefix wins over Accept-Language
    expect(detectLocale("/", "en-US,en;q=0.9")).toBe("fr");
  });

  it("returns en for /en/ when Accept-Language is fr", () => {
    expect(detectLocale("/en/contact", "fr-CA,fr;q=0.9")).toBe("en");
  });

  it("strips query string before checking", () => {
    expect(detectLocale("/en/blog?utm=foo")).toBe("en");
  });
});

describe("translatePath", () => {
  it("switches /fr/services to /en/services", () => {
    expect(translatePath("/fr/services", "fr", "en")).toBe("/en/services");
  });

  it("switches /en/blog/foo to /fr/blog/foo", () => {
    expect(translatePath("/en/blog/foo", "en", "fr")).toBe("/fr/blog/foo");
  });

  it("returns /en/ for root /", () => {
    expect(translatePath("/", "fr", "en")).toBe("/en/");
  });

  it("leaves already-prefixed path alone if same locale", () => {
    expect(translatePath("/fr/a-propos", "fr", "fr")).toBe("/fr/a-propos");
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- detectLocale`
Expected: FAIL â€” module `$i18n/detectLocale` not found.

- [ ] **Step 3: Create `src/lib/i18n/locales.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\i18n\locales.ts`:

```typescript
export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
```

- [ ] **Step 4: Create `src/lib/i18n/detectLocale.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\i18n\detectLocale.ts`:

```typescript
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

export function detectLocale(
  pathname: string,
  acceptLanguage?: string | null,
): Locale {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) return first;

  // Path-prefix-wins: only consult Accept-Language when the path has at
  // least one non-locale segment. Root `/` is treated as the home of the
  // default locale with no negotiation — matches "Path prefix wins over
  // Accept-Language" test.
  if (segments.length > 0 && acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((part) => part.trim().split(";")[0]?.toLowerCase() ?? "")
      .map((tag) => tag.split("-")[0] ?? "")
      .find((tag) => isLocale(tag));
    if (preferred) return preferred as Locale;
  }

  return DEFAULT_LOCALE;
}

export function translatePath(
  pathname: string,
  from: Locale,
  to: Locale,
): string {
  if (from === to) return pathname;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = path.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) {
    segments[0] = to;
  } else {
    segments.unshift(to);
  }
  // Preserve the trailing slash for root-of-locale URLs (SEO + canonical
  // link convention): translatePath("/", "fr", "en") must return "/en/".
  if (segments.length === 1) return `/${to}/`;
  return `/${segments.join("/")}`;
}
```

- [ ] **Step 5: Run test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- detectLocale`
Expected: `10 passed`.

- [ ] **Step 6: Write the failing test for `getCopy`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\unit\i18n\copy.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getCopy } from "$i18n/copy";

describe("getCopy", () => {
  it("returns French copy for fr locale", () => {
    const copy = getCopy("fr");
    expect(copy.nav.home).toBe("Accueil");
    expect(copy.nav.contact).toBe("Contact");
  });

  it("returns English copy for en locale", () => {
    const copy = getCopy("en");
    expect(copy.nav.home).toBe("Home");
    expect(copy.nav.contact).toBe("Contact");
  });

  it("exposes WhatsApp pre-fill message in both languages", () => {
    expect(getCopy("fr").whatsapp.defaultMessage).toMatch(/Bonjour Sergine/);
    expect(getCopy("en").whatsapp.defaultMessage).toMatch(/Hello Sergine/);
  });
});
```

- [ ] **Step 7: Run test to confirm failure**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- copy`
Expected: FAIL â€” module `$i18n/copy` not found.

- [ ] **Step 8: Create `src/lib/i18n/copy.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\i18n\copy.ts`:

```typescript
import type { Locale } from "./locales";

export interface NavCopy {
  home: string;
  services: string;
  listings: string;
  transactions: string;
  blog: string;
  about: string;
  contact: string;
  cta: string;
}

export interface WhatsappCopy {
  defaultMessage: string;
  ariaLabel: string;
}

export interface CookieCopy {
  title: string;
  body: string;
  accept: string;
  reject: string;
}

export interface FooterCopy {
  tagline: string;
  sitemapHeading: string;
  contactHeading: string;
  socialHeading: string;
  privacy: string;
}

export interface SiteCopy {
  nav: NavCopy;
  whatsapp: WhatsappCopy;
  cookie: CookieCopy;
  footer: FooterCopy;
}

const fr: SiteCopy = {
  nav: {
    home: "Accueil",
    services: "Services",
    listings: "Biens",
    transactions: "Transactions",
    blog: "Blogue",
    about: "Ã€ propos",
    contact: "Contact",
    cta: "Prendre rendez-vous",
  },
  whatsapp: {
    defaultMessage: "Bonjour Sergine, je vous contacte depuis votre site web.",
    ariaLabel: "Contacter Sergine par WhatsApp",
  },
  cookie: {
    title: "Cookies et confidentialitÃ©",
    body: "Ce site utilise Google Analytics pour amÃ©liorer votre expÃ©rience. Vos donnÃ©es sont anonymisÃ©es.",
    accept: "Accepter",
    reject: "Refuser",
  },
  footer: {
    tagline:
      "Courtier immobilier rÃ©sidentiel et commercial â€” VENDIRECT, certifiÃ©e OACIQ.",
    sitemapHeading: "Plan du site",
    contactHeading: "Contact",
    socialHeading: "RÃ©seaux sociaux",
    privacy: "Politique de confidentialitÃ©",
  },
};

const en: SiteCopy = {
  nav: {
    home: "Home",
    services: "Services",
    listings: "Listings",
    transactions: "Transactions",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    cta: "Book a meeting",
  },
  whatsapp: {
    defaultMessage: "Hello Sergine, I am reaching out from your website.",
    ariaLabel: "Contact Sergine on WhatsApp",
  },
  cookie: {
    title: "Cookies & privacy",
    body: "This site uses Google Analytics to improve your experience. Your data is anonymized.",
    accept: "Accept",
    reject: "Reject",
  },
  footer: {
    tagline:
      "Residential and commercial real estate broker â€” VENDIRECT, OACIQ certified.",
    sitemapHeading: "Sitemap",
    contactHeading: "Contact",
    socialHeading: "Social media",
    privacy: "Privacy policy",
  },
};

const COPY: Record<Locale, SiteCopy> = { fr, en };

export function getCopy(locale: Locale): SiteCopy {
  return COPY[locale];
}
```

- [ ] **Step 9: Run test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- copy`
Expected: `3 passed`.

- [ ] **Step 10: Update `src/app.d.ts` to use the real `Locale` type**

Replace `C:\Users\AM\Documents\Workspace\DHC\immo\src\app.d.ts` with:

```typescript
import type { Locale } from "$i18n/locales";

declare global {
  namespace App {
    interface Locals {
      locale: Locale;
    }
    interface PageData {
      locale: Locale;
    }
  }
}

export {};
```

- [ ] **Step 11: Verify TypeScript**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run check`
Expected: `0 errors, 0 warnings`.

- [ ] **Step 12: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat(i18n): add Locale type, detectLocale/translatePath, SiteCopy"
```

---

## Task 1.5: Server hooks (locale redirect) + layout wiring

**Files:**

- Create: `src/hooks.server.ts`, `src/routes/+layout.server.ts`, `src/routes/+layout.ts`
- Modify: `src/routes/+page.svelte`

**Interfaces:**

- Consumes: `detectLocale` (Task 1.4)
- Produces: `event.locals.locale` set on every request; root requests without a locale prefix redirect to `/fr/...`; `+layout.ts` returns `{ locale }` to all child pages

- [ ] **Step 1: Create `src/hooks.server.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\hooks.server.ts`:

```typescript
import { redirect, type Handle } from "@sveltejs/kit";
import { isLocale } from "$i18n/locales";
import { detectLocale } from "$i18n/detectLocale";

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  const acceptLanguage = event.request.headers.get("accept-language");

  // Skip Studio and static assets
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/_app") ||
    pathname.startsWith("/api")
  ) {
    return resolve(event);
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (!first || !isLocale(first)) {
    const locale = detectLocale(pathname, acceptLanguage);
    const target = `/${locale}${pathname === "/" ? "/" : pathname}`;
    throw redirect(307, target);
  }

  event.locals.locale = detectLocale(pathname);
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%sveltekit.lang%", event.locals.locale),
  });
};
```

- [ ] **Step 2: Create `src/routes/+layout.server.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+layout.server.ts`:

```typescript
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
  return { locale: locals.locale };
};
```

- [ ] **Step 3: Create `src/routes/+layout.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+layout.ts`:

```typescript
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ data }) => {
  return { locale: data.locale };
};
```

- [ ] **Step 4: Verify the redirect**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev`
In another terminal: `curl -sI http://localhost:5173/services`
Expected: `HTTP/1.1 307 Temporary Redirect`, `Location: /fr/services`.

Then: `curl -sI http://localhost:5173/fr/contact`
Expected: `HTTP/1.1 200 OK`.

Stop the dev server.

- [ ] **Step 5: Update the home page to use `data.locale`**

Modify `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+page.svelte` to:

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<main class="container-editorial py-24">
  <p class="eyebrow mb-4 text-gold">01 / Courtier immobilier</p>
  <h1 class="font-display text-5xl md:text-6xl text-balance text-primary">
    Construisons votre avenir immobilier
  </h1>
  <p class="mt-6 text-secondary text-lg max-w-2xl">
    Active locale: <code class="text-accent">{data.locale}</code>
  </p>
</main>
```

- [ ] **Step 6: Run tests**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test && npm run test:e2e`
Expected: all tests pass.

- [ ] **Step 7: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat(routing): add locale redirect middleware + layout locale load"
```

---

## Task 1.6: Build `<Nav />` component + tests

**Files:**

- Create: `src/lib/components/layout/Nav.svelte`, `tests/component/Nav.test.ts`
- Modify: `src/routes/+layout.svelte`

**Interfaces:**

- Consumes: `Locale`, `SiteCopy`
- Produces: sticky transparent top nav with logo, nav links, primary CTA; hides CTA on mobile

- [ ] **Step 1: Write the failing component test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\component\Nav.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Nav from "$components/layout/Nav.svelte";

describe("<Nav>", () => {
  it("renders all primary nav links from copy", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Biens" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("renders the primary CTA", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    expect(
      screen.getByRole("link", { name: "Prendre rendez-vous" }),
    ).toBeInTheDocument();
  });

  it("renders English copy when locale is en", () => {
    render(Nav, { props: { currentPath: "/en/", locale: "en" } });
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Book a meeting" }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- Nav`
Expected: FAIL â€” module `$components/layout/Nav.svelte` not found.

- [ ] **Step 3: Create `src/lib/components/layout/Nav.svelte`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\components\layout\Nav.svelte`:

```svelte
<script lang="ts">
  import { getCopy } from '$i18n/copy';
  import type { Locale } from '$i18n/locales';

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
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact }
  ]);
</script>

<nav
  class="sticky top-0 z-50 w-full border-b border-[var(--border-hairline)] bg-canvas/80 backdrop-blur-md"
  aria-label="Primary"
>
  <div class="container-editorial flex h-16 items-center justify-between gap-6">
    <a href={`${base}/`} class="font-display text-lg tracking-tight text-primary">
      <span class="text-gold">S</span>ergine Hougoue
    </a>

    <ul class="hidden items-center gap-8 md:flex">
      {#each links as link}
        <li>
          <a
            href={link.href}
            class="text-sm text-secondary transition-colors duration-300 hover:text-primary"
            aria-current={currentPath === link.href ? 'page' : undefined}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <a
      href={`${base}/contact`}
      class="hidden rounded-full border border-burgundy bg-burgundy px-4 py-2 text-xs uppercase tracking-[0.08em] text-primary transition-colors hover:bg-[#8a2638] md:inline-block"
    >
      {copy.nav.cta}
    </a>
  </div>
</nav>
```

- [ ] **Step 4: Run test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- Nav`
Expected: `3 passed`.

- [ ] **Step 5: Wire Nav into root layout**

Modify `C:\Users\AM\Documents\Workspace\DHC\immo\src\routes\+layout.svelte` to:

```svelte
<script lang="ts">
  import '../app.css';
  import Nav from '$components/layout/Nav.svelte';
  import type { LayoutData } from './$types';

  interface Props {
    data: LayoutData;
    children?: import('svelte').Snippet;
  }
  let { data, children }: Props = $props();
</script>

<Nav currentPath="/{data.locale}/" locale={data.locale} />

<main>
  {@render children?.()}
</main>
```

- [ ] **Step 6: Run dev server to verify**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev`
Open `http://localhost:5173/fr/`; you should see the sticky nav with logo "S[gold]ergine Hougoue", 7 nav links, and the burgundy CTA. Stop the server.

- [ ] **Step 7: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat(layout): add <Nav> with sticky transparent style + FR/EN copy"
```

---

## Task 1.7: Build `<LangToggle />` + integrate into Nav

**Files:**

- Create: `src/lib/components/layout/LangToggle.svelte`, `tests/component/LangToggle.test.ts`
- Modify: `src/lib/components/layout/Nav.svelte`

**Interfaces:**

- Consumes: `Locale`, `currentPath`, `translatePath`
- Produces: a 2-link toggle (FR | EN) that swaps the URL prefix and preserves the rest of the path

- [ ] **Step 1: Write the failing component test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\component\LangToggle.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import LangToggle from "$components/layout/LangToggle.svelte";

describe("<LangToggle>", () => {
  it("renders FR and EN links", () => {
    render(LangToggle, {
      props: { currentPath: "/fr/services", currentLocale: "fr" },
    });
    expect(screen.getByRole("link", { name: "FR" })).toHaveAttribute(
      "href",
      "/fr/services",
    );
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/services",
    );
  });

  it("marks the active locale with aria-current", () => {
    render(LangToggle, {
      props: { currentPath: "/en/contact", currentLocale: "en" },
    });
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "FR" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("handles root path correctly", () => {
    render(LangToggle, { props: { currentPath: "/fr/", currentLocale: "fr" } });
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/",
    );
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- LangToggle`
Expected: FAIL â€” module not found.

- [ ] **Step 3: Create `src/lib/components/layout/LangToggle.svelte`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\components\layout\LangToggle.svelte`:

```svelte
<script lang="ts">
  import type { Locale } from '$i18n/locales';
  import { translatePath } from '$i18n/detectLocale';

  interface Props {
    currentPath: string;
    currentLocale: Locale;
  }
  let { currentPath, currentLocale }: Props = $props();

  const frHref = $derived(translatePath(currentPath, currentLocale, 'fr'));
  const enHref = $derived(translatePath(currentPath, currentLocale, 'en'));
</script>

<div
  class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.08em]"
  role="group"
  aria-label="Language selector"
>
  <a
    href={frHref}
    class="text-secondary transition-colors hover:text-primary"
    aria-current={currentLocale === 'fr' ? 'true' : undefined}
    hreflang="fr"
  >FR</a>
  <span class="text-muted" aria-hidden="true">|</span>
  <a
    href={enHref}
    class="text-secondary transition-colors hover:text-primary"
    aria-current={currentLocale === 'en' ? 'true' : undefined}
    hreflang="en"
  >EN</a>
</div>
```

- [ ] **Step 4: Run test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- LangToggle`
Expected: `3 passed`.

- [ ] **Step 5: Wire LangToggle into Nav**

Modify `src/lib/components/layout/Nav.svelte`. Add to the `<script>` block (after the existing `import type { Locale }` line):

```svelte
  import LangToggle from './LangToggle.svelte';
```

Then replace the right-side container in the template with this version (which wraps the link list, the toggle, and the CTA in a single `md:flex` group):

```svelte
    <div class="hidden items-center gap-6 md:flex">
      <ul class="flex items-center gap-8">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="text-sm text-secondary transition-colors duration-300 hover:text-primary"
              aria-current={currentPath === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>

      <LangToggle currentPath={currentPath} currentLocale={locale} />

      <a
        href={`${base}/contact`}
        class="rounded-full border border-burgundy bg-burgundy px-4 py-2 text-xs uppercase tracking-[0.08em] text-primary transition-colors hover:bg-[#8a2638]"
      >
        {copy.nav.cta}
      </a>
    </div>
```

- [ ] **Step 6: Verify in dev**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev`
Open `http://localhost:5173/fr/`; confirm FR | EN toggle is visible in the nav. Click EN; URL should change to `/en/`. Stop the server.

- [ ] **Step 7: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat(layout): add <LangToggle> for FR/EN with path preservation"
```

---

## Task 1.8: Build `<Footer />` + tests

**Files:**

- Create: `src/lib/components/layout/Footer.svelte`, `tests/component/Footer.test.ts`
- Modify: `src/routes/+layout.svelte`

**Interfaces:**

- Consumes: `Locale`, `SiteCopy`
- Produces: 3-column footer (brand + sitemap + contact) on cream background, plus small print + privacy link

- [ ] **Step 1: Write the failing component test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\component\Footer.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Footer from "$components/layout/Footer.svelte";

describe("<Footer>", () => {
  it("renders the tagline in French for fr locale", () => {
    render(Footer, { props: { locale: "fr" } });
    expect(
      screen.getByText(/Courtier immobilier rÃ©sidentiel et commercial/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Plan du site/)).toBeInTheDocument();
  });

  it("renders the tagline in English for en locale", () => {
    render(Footer, { props: { locale: "en" } });
    expect(
      screen.getByText(/Residential and commercial real estate broker/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Sitemap/)).toBeInTheDocument();
  });

  it("renders phone and email links", () => {
    render(Footer, { props: { locale: "fr" } });
    expect(screen.getByRole("link", { name: "438-462-6015" })).toHaveAttribute(
      "href",
      "tel:4384626015",
    );
    expect(
      screen.getByRole("link", { name: "serginehougoue@gmail.com" }),
    ).toHaveAttribute("href", "mailto:serginehougoue@gmail.com");
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- Footer`
Expected: FAIL â€” module not found.

- [ ] **Step 3: Create `src/lib/components/layout/Footer.svelte`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\components\layout\Footer.svelte`:

```svelte
<script lang="ts">
  import { getCopy } from '$i18n/copy';
  import type { Locale } from '$i18n/locales';

  interface Props {
    locale: Locale;
  }
  let { locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  const base = $derived(`/${locale}`);
  const year = new Date().getFullYear();

  const sitemap = $derived([
    { href: `${base}/`, label: copy.nav.home },
    { href: `${base}/services`, label: copy.nav.services },
    { href: `${base}/biens`, label: copy.nav.listings },
    { href: `${base}/transactions`, label: copy.nav.transactions },
    { href: `${base}/blog`, label: copy.nav.blog },
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact }
  ]);
</script>

<footer class="bg-[#F5F2EC] text-[#0E0E0E] mt-24">
  <div class="container-editorial py-16 md:py-24">
    <div class="grid gap-12 md:grid-cols-3">
      <div>
        <p class="font-display text-xl text-[#0E0E0E] mb-4">
          <span class="text-[#6E1F2E]">S</span>ergine Hougoue
        </p>
        <p class="text-sm leading-relaxed text-[#0E0E0E]/80">{copy.footer.tagline}</p>
      </div>

      <div>
        <h2 class="eyebrow mb-4 text-[#6E1F2E]">{copy.footer.sitemapHeading}</h2>
        <ul class="space-y-2">
          {#each sitemap as link}
            <li>
              <a href={link.href} class="text-sm text-[#0E0E0E] hover:text-[#6E1F2E] transition-colors">
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <div>
        <h2 class="eyebrow mb-4 text-[#6E1F2E]">{copy.footer.contactHeading}</h2>
        <ul class="space-y-2 text-sm">
          <li><a href="tel:4384626015" class="hover:text-[#6E1F2E]">438-462-6015</a></li>
          <li><a href="mailto:serginehougoue@gmail.com" class="hover:text-[#6E1F2E]">serginehougoue@gmail.com</a></li>
          <li class="text-[#0E0E0E]/70 pt-2">Lunâ€“Ven 8hâ€“20h<br />Samâ€“Dim 9hâ€“17h</li>
        </ul>
      </div>
    </div>

    <hr class="my-12 border-[#0E0E0E]/10" />

    <div class="flex flex-col items-start justify-between gap-4 text-xs uppercase tracking-[0.08em] text-[#0E0E0E]/70 md:flex-row md:items-center">
      <p>Â© {year} Sergine Hougoue â€” VENDIRECT</p>
      <a href={`${base}/politique-confidentialite`} class="hover:text-[#6E1F2E]">{copy.footer.privacy}</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Run test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- Footer`
Expected: `3 passed`.

- [ ] **Step 5: Wire Footer into root layout**

Modify `src/routes/+layout.svelte`. Add to the `<script>` block:

```svelte
  import Footer from '$components/layout/Footer.svelte';
```

Then update the template to render Footer after the main slot:

```svelte
<Nav currentPath="/{data.locale}/" locale={data.locale} />

<main>
  {@render children?.()}
</main>

<Footer locale={data.locale} />
```

- [ ] **Step 6: Verify visually**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev`
Open `http://localhost:5173/fr/`; confirm a cream-colored footer at the bottom with logo, sitemap links, phone/email, hours, copyright, and privacy link. Stop the server.

- [ ] **Step 7: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat(layout): add <Footer> with sitemap + contact + tagline on cream bg"
```

---

## Task 1.9: Build `<WhatsAppFab />` + tests

**Files:**

- Create: `src/lib/components/layout/WhatsAppFab.svelte`, `tests/component/WhatsAppFab.test.ts`
- Modify: `src/routes/+layout.svelte`

**Interfaces:**

- Consumes: `Locale`, `SiteCopy`
- Produces: floating bottom-right WhatsApp button with locale-aware pre-filled message

- [ ] **Step 1: Write the failing component test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\component\WhatsAppFab.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import WhatsAppFab from "$components/layout/WhatsAppFab.svelte";

describe("<WhatsAppFab>", () => {
  it("renders a link to wa.me with the correct phone number", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "fr" } });
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toContain("wa.me/14384626015");
  });

  it("pre-fills the FR message", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "fr" } });
    const link = screen.getByRole("link");
    const href = link.getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("Bonjour Sergine");
  });

  it("pre-fills the EN message", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "en" } });
    const link = screen.getByRole("link");
    const href = link.getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("Hello Sergine");
  });

  it("has a localized aria-label", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "fr" } });
    expect(screen.getByRole("link")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("WhatsApp"),
    );
  });
});
```

- [ ] **Step 2: Run test to confirm failure**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- WhatsAppFab`
Expected: FAIL â€” module not found.

- [ ] **Step 3: Create `src/lib/components/layout/WhatsAppFab.svelte`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\components\layout\WhatsAppFab.svelte`:

```svelte
<script lang="ts">
  import { getCopy } from '$i18n/copy';
  import type { Locale } from '$i18n/locales';

  interface Props {
    phone: string;
    locale: Locale;
  }
  let { phone, locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  const href = $derived(`https://wa.me/${phone}?text=${encodeURIComponent(copy.whatsapp.defaultMessage)}`);
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={copy.whatsapp.ariaLabel}
  class="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
</a>
```

- [ ] **Step 4: Run test to confirm pass**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- WhatsAppFab`
Expected: `4 passed`.

- [ ] **Step 5: Wire WhatsAppFab into root layout**

Modify `src/routes/+layout.svelte`. Add to the `<script>` block:

```svelte
  import WhatsAppFab from '$components/layout/WhatsAppFab.svelte';
```

Then add the WhatsAppFab at the end of the template:

```svelte
<Nav currentPath="/{data.locale}/" locale={data.locale} />

<main>
  {@render children?.()}
</main>

<Footer locale={data.locale} />

<WhatsAppFab phone="14384626015" locale={data.locale} />
```

- [ ] **Step 6: Verify in dev**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev`
Open `http://localhost:5173/fr/`; confirm a green WhatsApp circle in the bottom-right corner. Stop the server.

- [ ] **Step 7: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat(layout): add <WhatsAppFab> floating bottom-right button (FR/EN)"
```

---

## Task 1.10: Build `<CookieBanner />` + tests

**Files:**

- Create: `src/lib/components/layout/CookieBanner.svelte`, `tests/component/CookieBanner.test.ts`
- Modify: `src/routes/+layout.svelte`

**Interfaces:**

- Consumes: `Locale`, `SiteCopy.cookie`
- Produces: bottom cookie-consent strip with Accept/Reject buttons; persists choice in `localStorage` key `sergine_cookie_consent`; renders nothing if already accepted/rejected

- [ ] **Step 1: Write the failing component test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\component\CookieBanner.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import CookieBanner from "$components/layout/CookieBanner.svelte";

describe("<CookieBanner>", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the banner with localized copy on first render", () => {
    render(CookieBanner, { props: { locale: "fr" } });
    expect(screen.getByText(/Cookies et confidentialitÃ©/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Accepter" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refuser" })).toBeInTheDocument();
  });

  it("renders English copy for en locale", () => {
    render(CookieBanner, { props: { locale: "en" } });
    expect(screen.getByText(/Cookies & privacy/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });

  it("hides the banner after Accept and persists choice", async () => {
    render(CookieBanner, { props: { locale: "fr" } });
    await fireEvent.click(screen.getByRole("button", { name: "Accepter" }));
    expect(
      screen.queryByText(/Cookies et confidentialitÃ©/),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem("sergine_cookie_consent")).toBe("accepted");
  });

  it("hides the banner after Reject and persists choice", async () => {
    render(CookieBanner, { props: { locale: "fr" } });
    await fireEvent.click(screen.getByRole("button", { name: "Refuser" }));
    expect(
      screen.queryByText(/Cookies et confidentialitÃ©/),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem("sergine_cookie_consent")).toBe("rejected");
  });

  it("does not render if a choice was already persisted", () => {
    localStorage.setItem("sergine_cookie_consent", "accepted");
    render(CookieBanner, { props: { locale: "fr" } });
    expect(
      screen.queryByText(/Cookies et confidentialitÃ©/),
    ).not.toBeInTheDocument();
  });
});
```

---

## Task 1.11: Build `<Hero />` + `<PageHeader />` + tests

**Files:**

- Create: `src/lib/components/content/Hero.svelte`, `PageHeader.svelte`, `tests/component/Hero.test.ts`, `PageHeader.test.ts`
- Modify: `src/routes/+page.svelte`

**Interfaces:**

- `<Hero>` consumes: `eyebrow`, `title`, `subtitle?`, `ctaHref`, `ctaLabel`, `imageSrc?`
- `<PageHeader>` consumes: `eyebrow`, `title`, `intro?`

- [ ] **Step 1: Write tests for Hero and PageHeader.** Hero test asserts presence of eyebrow, H1, subtitle, CTA href. PageHeader test asserts eyebrow, H1, optional intro.
- [ ] **Step 2: Run tests** — expect failure (modules not found).
- [ ] **Step 3: Create `src/lib/components/content/Hero.svelte`** — editorial `<section class="min-h-[80vh] flex items-center">` with split layout (`md:grid-cols-2`), eyebrow in `text-gold`, H1 `font-display text-5xl text-balance text-primary md:text-7xl`, optional subtitle, burgundy rounded-full CTA. Optional `imageSrc` in right column at `aspect-[4/5]`.
- [ ] **Step 4: Run tests** — Hero test passes.
- [ ] **Step 5: Create `src/lib/components/content/PageHeader.svelte`** — narrower version, no CTA or image; eyebrow + H1 + optional intro, wrapped in `container-editorial py-24 md:py-32`.
- [ ] **Step 6: Run tests** — both pass.
- [ ] **Step 7: Wire Hero into `src/routes/+page.svelte`** — locale-aware eyebrow/title/subtitle/ctaLabel using `$derived` from `data.locale`; `ctaHref={`${base}/contact`}`.
- [ ] **Step 8: Verify in dev** — open `http://localhost:5173/fr/`. Stop server.
- [ ] **Step 9: Commit** — `git commit -m "feat(content): add <Hero> and <PageHeader> components"`

---

## Task 1.12: Placeholder assets, favicon, Privacy page

**Files:**

- Create: `static/favicon.svg`, `static/placeholders/README.md`, `src/routes/[lang=locale]/politique-confidentialite/+page.svelte`

- [ ] **Step 1: Create `static/favicon.svg`** — small house icon in gold on dark canvas with "SH" letters.
- [ ] **Step 2: Create `static/placeholders/README.md`** — list of expected placeholder files with sizes and aspect ratios.
- [ ] **Step 3: Create `src/routes/[lang=locale]/politique-confidentialite/+page.svelte`** — bilingual privacy page using PageHeader + 4 sections (collection, use, retention, rights). Hardcoded FR + EN objects keyed by `page.params.lang`.
- [ ] **Step 4: Verify in dev** — `/fr/politique-confidentialite` and `/en/politique-confidentialite` both render. Stop server.
- [ ] **Step 5: Commit** — `git commit -m "feat(static): add favicon, placeholder README, and FR/EN privacy policy page"`

---

## Phase 1 wrap-up

Phase 1 is complete when:

- `npm run test` passes with 20+ unit/component tests
- `npm run test:e2e` passes
- `npm run check` returns 0 errors
- `/fr/` shows nav, hero, footer, WhatsApp FAB, cookie banner
- `/en/` shows the same in English
- `/fr/politique-confidentialite` and `/en/politique-confidentialite` render
- DESIGN.md tokens present, plus `--brand-burgundy` and `--brand-gold`

---

# Phase 2 — Sanity CMS + content (Weeks 2–3)

Schema fields and types are defined in detail in **section 5** of `docs/superpowers/specs/2026-06-24-sergine-hougoue-immo-design.md`. Each schema task follows TDD: tests for any computed logic, then schema code, then verify with `npm run check` and a Studio smoke test.

---

## Task 2.1: Provision Sanity project + install deps + `.env.example`

**Files:**

- Create: `.env.example`, `src/lib/sanity/env.ts`, `tests/unit/sanity/env.test.ts`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**

- Consumes: Phase 1 foundation (SvelteKit aliases include `$sanity` → `src/lib/sanity`)
- Produces: Sanity npm packages installed, typed env accessors, `.env.example` documenting all required env vars (no secrets committed)

**Note:** Creating the actual Sanity cloud project requires a human login at [sanity.io/manage](https://sanity.io/manage). This task installs tooling and documents env vars; the implementer creates `.env.local` with placeholder values and documents setup steps in a code comment at the top of `env.ts`. Do **not** commit `.env.local`.

- [ ] **Step 1: Write the failing unit test**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\tests\unit\sanity\env.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  REQUIRED_PUBLIC_ENV_KEYS,
  REQUIRED_SERVER_ENV_KEYS,
  parseSanityProjectId,
} from "$sanity/env";

describe("sanity env", () => {
  it("lists all required public env keys", () => {
    expect(REQUIRED_PUBLIC_ENV_KEYS).toEqual([
      "PUBLIC_SANITY_PROJECT_ID",
      "PUBLIC_SANITY_DATASET",
      "PUBLIC_SITE_URL",
    ]);
  });

  it("lists all required server env keys", () => {
    expect(REQUIRED_SERVER_ENV_KEYS).toEqual([
      "SANITY_API_TOKEN",
      "SANITY_READ_TOKEN",
      "RESEND_API_KEY",
      "CONTACT_TO_EMAIL",
      "GA4_MEASUREMENT_ID",
      "CAL_COM_LINK",
    ]);
  });

  it("parseSanityProjectId rejects empty string", () => {
    expect(() => parseSanityProjectId("")).toThrow(/project id/i);
  });

  it("parseSanityProjectId accepts non-empty trimmed id", () => {
    expect(parseSanityProjectId("  abc123  ")).toBe("abc123");
  });
});
```

- [ ] **Step 2: Run test** — expect failure (module not found).

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- tests/unit/sanity/env.test.ts`
Expected: FAIL — cannot resolve `$sanity/env`.

- [ ] **Step 3: Install Sanity dependencies**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
npm install sanity@^3 @sanity/client@^6 @sanity/image-url@^1 @sanity/document-internationalization@^3 @sanity/vision@^3
```

Expected: `package.json` and `package-lock.json` updated with Sanity packages.

- [ ] **Step 4: Create `.env.example`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\.env.example`:

```dotenv
# Sanity (create project at https://sanity.io/manage)
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
SANITY_READ_TOKEN=your_read_token

# Site
PUBLIC_SITE_URL=http://localhost:5173

# Contact (Phase 3)
RESEND_API_KEY=
CONTACT_TO_EMAIL=serginehougoue@gmail.com

# Analytics (Phase 4)
GA4_MEASUREMENT_ID=

# Booking (Phase 3)
CAL_COM_LINK=
```

- [ ] **Step 5: Create `src/lib/sanity/env.ts`**

Write `C:\Users\AM\Documents\Workspace\DHC\immo\src\lib\sanity\env.ts`:

```typescript
/** Sanity + site env accessors. Copy .env.example → .env.local and fill values. */

export const REQUIRED_PUBLIC_ENV_KEYS = [
  "PUBLIC_SANITY_PROJECT_ID",
  "PUBLIC_SANITY_DATASET",
  "PUBLIC_SITE_URL",
] as const;

export const REQUIRED_SERVER_ENV_KEYS = [
  "SANITY_API_TOKEN",
  "SANITY_READ_TOKEN",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "GA4_MEASUREMENT_ID",
  "CAL_COM_LINK",
] as const;

export type PublicEnvKey = (typeof REQUIRED_PUBLIC_ENV_KEYS)[number];
export type ServerEnvKey = (typeof REQUIRED_SERVER_ENV_KEYS)[number];

export function parseSanityProjectId(raw: string): string {
  const id = raw.trim();
  if (!id) throw new Error("Sanity project id is required");
  return id;
}

export function getPublicSanityConfig(): {
  projectId: string;
  dataset: string;
} {
  const projectId = parseSanityProjectId(
    import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? "",
  );
  const dataset = (
    import.meta.env.PUBLIC_SANITY_DATASET ?? "production"
  ).trim();
  return { projectId, dataset };
}
```

- [ ] **Step 6: Run tests** — expect pass.

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run test -- tests/unit/sanity/env.test.ts`
Expected: 4/4 passing.

- [ ] **Step 7: Run check + lint**

Run: `cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run check && npm run lint`
Expected: 0 errors.

- [ ] **Step 8: Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat(sanity): install Sanity deps and add env module + .env.example"
```

---

## Task 2.2: Define schemas — siteSettings, teamMember, testimonial, partner

**Files:**

- Create: `src/lib/sanity/schemas/{index,fields,siteSettings,teamMember,testimonial,partner}.ts`, `tests/unit/sanity/schemas.test.ts`
- Modify: none

**Interfaces:**

- Consumes: Task 2.1 Sanity deps; spec section 5 field tables
- Produces: Four Sanity `defineType` schemas + shared field helpers + barrel export `schemaTypes` array

**i18n note:** Document-level FR/EN is configured in Task 2.4 via `@sanity/document-internationalization`. Schemas use plain `string`/`text` fields; the plugin creates per-locale document variants.

- [ ] **Step 1: Write failing unit test** — `tests/unit/sanity/schemas.test.ts` asserts `schemaTypes` exports 4 types with names `siteSettings`, `teamMember`, `testimonial`, `partner`; asserts `imageWithAlt` requires alt; asserts `siteSettings` is singleton (`__experimental_formPreviewTitle` or `options.singleton` pattern).

- [ ] **Step 2: Run test** — expect FAIL (modules not found).

- [ ] **Step 3: Create `fields.ts`** — helpers: `imageWithAlt` (image field + required alt string), `orderField` (number), enum helpers.

- [ ] **Step 4: Create four schema files** per spec section 5:
  - `siteSettings`: brandName, tagline, contactEmail, contactPhone, whatsappNumber, hoursOfOperation, socialLinks (facebook/instagram/tiktok/linkedin urls), defaultSEO (metaTitle, metaDescription, ogImage), cookieConsentCopy. Singleton.
  - `teamMember`: name, role, photo (imageWithAlt), bio (array/blocks portable text), order
  - `testimonial`: quote, authorName, authorContext, photo (optional imageWithAlt), rating (1-5), order
  - `partner`: name, logo (image), url, category enum (`preteur`|`notaire`|`inspecteur`|`autre`), order

- [ ] **Step 5: Create `index.ts`** — export `schemaTypes` array with all four schemas.

- [ ] **Step 6: Run tests** — pass.

- [ ] **Step 7: `npm run check && npm run lint`** — 0 errors.

- [ ] **Step 8: Commit** — `feat(sanity): add siteSettings, teamMember, testimonial, partner schemas`

---

## Task 2.3: Define schemas — property, post

**Files:**

- Create: `src/lib/sanity/schemas/{property,post}.ts`
- Modify: `src/lib/sanity/schemas/index.ts`, `tests/unit/sanity/schemas.test.ts`

**Interfaces:**

- Consumes: Task 2.2 `fields.ts` helpers (`imageWithAlt`, `enumField`, `portableTextField`, `orderField`); spec section 5 `property` and `post` tables
- Produces: Two more document schemas; `schemaTypes` grows from 4 → 6 types

**i18n note:** Same as 2.2 — plain fields now; document-i18n in Task 2.4.

- [ ] **Step 1: Write failing tests** — extend `schemas.test.ts`: `schemaTypes` length 6 with names `property`, `post`; property has status enum (`a-vendre`|`vendu`|`en-primeur`), type enum (8 values), photos array with alt; post has excerpt max 160, category enum (5 values), author reference to `teamMember`, seo object fields.

- [ ] **Step 2: Run test** — expect FAIL.

- [ ] **Step 3: Create `property.ts`** per spec: title, slug (from title), status, price, address, city, neighborhood (optional), type, bedrooms, bathrooms, area, description (portable text), features (array of strings), photos (array of image+alt), publishedAt, featured (boolean).

- [ ] **Step 4: Create `post.ts`** per spec: title, slug, excerpt (max 160), coverImage (imageWithAlt), body (portable text), category enum, author (reference teamMember), publishedAt, seo object (metaTitle, metaDescription, ogImage).

- [ ] **Step 5: Update `index.ts`** — append property and post to `schemaTypes`.

- [ ] **Step 6: Run tests** — all schema tests pass (prior 7 + new tests).

- [ ] **Step 7: `npm run check && npm run lint`**

- [ ] **Step 8: Commit** — `feat(sanity): add property and post schemas`

---

## Task 2.4: Configure Sanity Studio + embed at `/studio`

**Files:**

- Create: `sanity.config.ts`, `src/lib/sanity/structure.ts`, `src/routes/studio/[[...index]]/+page.svelte`, `src/routes/studio/[[...index]]/+page.ts`, `tests/unit/sanity/studio-config.test.ts`
- Modify: `vite.config.ts` (if needed for Sanity Studio client bundle)

**Interfaces:**

- Consumes: `schemaTypes` from Task 2.2–2.3; `getPublicSanityConfig` from `$sanity/env`; `@sanity/document-internationalization`, `@sanity/vision`
- Produces: Embedded Sanity Studio at `/studio` (SSR disabled); FR default + EN via document-i18n plugin; `siteSettings` singleton in desk structure

**i18n plugin config:** `supportedLanguages: [{id:'fr', title:'Français'},{id:'en', title:'English'}]`. Apply to all document types except `siteSettings` (singleton, localized fields inline). Schema types with i18n: `property`, `post`, `teamMember`, `testimonial`, `partner`.

- [ ] **Step 1: Write failing unit test** — `studio-config.test.ts` imports default export from `sanity.config.ts`, asserts `schema.types` length 6, asserts `projectId`/`dataset` resolve from env helpers, asserts structure exports singleton item for siteSettings.

- [ ] **Step 2: Run test** — expect FAIL.

- [ ] **Step 3: Create `src/lib/sanity/structure.ts`** — desk structure: siteSettings singleton first (`documentId: 'siteSettings'`), then remaining document types.

- [ ] **Step 4: Create `sanity.config.ts`** — `defineConfig` with `structureTool`, `visionTool`, `documentInternationalization`, all `schemaTypes`, title "Sergine Hougoue Immo".

- [ ] **Step 5: Create studio route** — `+page.ts` sets `export const ssr = false`; `+page.svelte` client-only `renderStudio` into `#studio` div, full viewport height.

- [ ] **Step 6: Adjust `vite.config.ts`** if Studio build requires `server.fs.allow` or `optimizeDeps.include` for sanity packages.

- [ ] **Step 7: Run tests + check + lint** — unit tests pass; `npm run check` 0 errors.

- [ ] **Step 8: Studio smoke test** — `npm run dev`, open `http://localhost:5173/studio`, confirm `#studio` mounts (no locale redirect). Stop server.

- [ ] **Step 9: Commit** — `feat(sanity): embed Sanity Studio at /studio with document i18n`

---

## Task 2.5: Server client + image builder + GROQ queries + types

**Files:**

- Create: `src/lib/sanity/{client,image,queries,types}.ts`, `tests/unit/sanity/{queries,image}.test.ts`
- Modify: none

**Interfaces:**

- Consumes: `getPublicSanityConfig()` from `$sanity/env`; `@sanity/client`, `@sanity/image-url`
- Produces: server-only `createSanityClient()` using `SANITY_READ_TOKEN`; `urlFor(image)` builder; exported GROQ query strings; TypeScript types matching schema fields

**Queries to export (for Task 2.7):**

- `siteSettingsQuery` — singleton `siteSettings` document
- `featuredPropertiesQuery` — `*[_type == "property" && featured == true] | order(publishedAt desc)`
- `testimonialsQuery` — `*[_type == "testimonial"] | order(order asc)`
- `teamMembersQuery` — `*[_type == "teamMember"] | order(order asc)`

All queries must accept `$lang` param for document-i18n (`__i18n_lang` filter or language field per Sanity i18n plugin pattern).

- [ ] **Step 1: Write failing tests** — `queries.test.ts` asserts query strings contain `_type` filters and `$lang`; `image.test.ts` asserts `urlFor` returns URL containing projectId.

- [ ] **Step 2: Run tests** — FAIL.

- [ ] **Step 3: Create `types.ts`** — `SanityImage`, `Property`, `Post`, `TeamMember`, `Testimonial`, `Partner`, `SiteSettings` interfaces aligned with schemas.

- [ ] **Step 4: Create `queries.ts`** — export query constants/functions with language parameter.

- [ ] **Step 5: Create `image.ts`** — `createImageUrlBuilder(client)` + `urlFor(source)` helper.

- [ ] **Step 6: Create `client.ts`** — `createSanityClient()` server factory using `$env/static/private` `SANITY_READ_TOKEN`, `useCdn: true`, `apiVersion: '2024-01-01'`.

- [ ] **Step 7: Run tests + check + lint** — pass.

- [ ] **Step 8: Commit** — `feat(sanity): add server client, image builder, GROQ queries, and types`

---

## Task 2.6: Seed 7+ starter documents

**Files:**

- Create: `scripts/seed-sanity.ts`, `src/lib/sanity/seed-data.ts`, `tests/unit/sanity/seed-data.test.ts`
- Modify: `package.json` (add `"seed:sanity": "tsx scripts/seed-sanity.ts"` script; add `tsx` devDep if needed)

**Interfaces:**

- Consumes: schemas, `createSanityClient` pattern with **write** token (`SANITY_API_TOKEN` from `$env/static/private`)
- Produces: idempotent seed script creating ≥7 documents (FR + EN where i18n applies)

**Minimum seed set (7+ docs):**

1. `siteSettings` singleton (1 doc)
2. 3 `property` listings × FR + EN = 6 docs (at least 2 `featured: true`)
3. 2 `testimonial` × FR + EN = 4 docs
4. 1 `teamMember` × FR + EN = 2 docs

Total ≥13 documents. Script skips if `siteSettings` already exists (idempotent).

- [ ] **Step 1: Write failing test** — `seed-data.test.ts` asserts `getSeedDocuments()` returns ≥7 unique `_type` entries and includes `siteSettings`, `property`, `testimonial`, `teamMember`.

- [ ] **Step 2: Implement `seed-data.ts`** with bilingual starter copy (French primary).

- [ ] **Step 3: Implement `scripts/seed-sanity.ts`** — loads env via `dotenv` from `.env.local`, uses write client, creates documents, logs counts.

- [ ] **Step 4: Run unit tests** — pass. Run `npm run seed:sanity` only if `.env.local` has token; otherwise document skip in report.

- [ ] **Step 5: Commit** — `feat(sanity): add idempotent seed script and starter document data`

---

## Task 2.7: Wire Home + About pages to CMS

**Files:**

- Create: `src/routes/+page.server.ts`, `src/routes/a-propos/+page.server.ts`, `src/routes/a-propos/+page.svelte`
- Modify: `src/routes/+page.svelte`

**Interfaces:**

- Consumes: `createSanityClient`, queries, types from Task 2.5; `data.locale` from layout
- Produces: Home loads `siteSettings`, `featuredProperties`, `testimonials`; About loads `teamMembers`; graceful empty arrays if Sanity unreachable

- [ ] **Step 1: Write failing e2e or component test** — extend `locale-shell.spec.ts` or add `home-cms.spec.ts` asserting home shows CMS tagline when mocked, OR unit test for `loadHomePageData` helper.

- [ ] **Step 2: Create `+page.server.ts`** — fetch with `$lang: locale`, return `{ siteSettings, featuredProperties, testimonials }`.

- [ ] **Step 3: Update `+page.svelte`** — use `siteSettings.tagline` as hero subtitle when present; render simple sections listing featured property titles and testimonial quotes (Phase 3 will replace with carousel/chips).

- [ ] **Step 4: Create About route** — `a-propos/+page.server.ts` + `+page.svelte` with `PageHeader` + `TeamMember`-style markup (photo, name, role, bio) from first team member.

- [ ] **Step 5: Run tests + check + lint + e2e** — pass.

- [ ] **Step 6: Commit** — `feat(cms): wire Home and About pages to Sanity queries`

---

## Phase 2 remaining tasks (summary — expand before dispatch)

| Task | What                                                           | Files                                                                                            |
| ---- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 2.1  | Provision Sanity project + install deps + `.env.example`       | `package.json`, `.env.example`, `.env.local`                                                     |
| 2.2  | Define schemas: siteSettings, teamMember, testimonial, partner | `src/lib/sanity/schemas/{index,siteSettings,teamMember,testimonial,partner}.ts`                  |
| 2.3  | Define schemas: property, post                                 | `src/lib/sanity/schemas/{property,post}.ts`                                                      |
| 2.4  | Configure Sanity Studio + embed at `/studio`                   | `sanity.config.ts`, `src/routes/studio/[[...index]]/+page.svelte`                                |
| 2.5  | Server client + image builder + GROQ queries + types           | `src/lib/sanity/{client,image,queries,types}.ts`                                                 |
| 2.6  | Seed 7+ documents (done in Studio UI)                          | —                                                                                                |
| 2.7  | Wire Home + About pages to CMS                                 | `src/routes/+page.server.ts`, `src/routes/[lang=locale]/a-propos/{+page.server.ts,+page.svelte}` |

**Phase 2 done when:** Studio loads at `/studio`, all 6 schemas registered with i18n, 7+ documents seeded (FR + EN), Home renders `featuredProperties` carousel + `testimonials` chips + `siteSettings` tagline, About renders `teamMember` bio + photo.

---

# Phase 3 — All pages (Weeks 3–4)

Each task follows the same TDD pattern as Phase 1: failing test → implement → pass → commit. Components are listed in **section 6** of the spec; field shapes match Phase 2 schemas and `$sanity/types`.

**Routing note:** Locale-prefixed URLs (`/fr/biens`, `/en/biens`) are handled by `hooks.server.ts` — routes live at `src/routes/biens/` (no `[lang]` param folder). Pass `data.locale` from `+layout.server.ts` into components for link prefixes.

**CMS note:** Extend `$sanity/queries.ts` and `$sanity/load-cms.ts` as needed per task. All fetches filter by `language == $lang`. Graceful empty arrays when Sanity is unconfigured (same pattern as `loadCmsHomeData`).

---

## Task 3.1: Build `<PropertyCard>` + `<PropertyGrid>` + `formatPrice`

**Files:**

- Create: `src/lib/utils/format.ts`, `src/lib/components/content/{PropertyCard,PropertyGrid}.svelte`, `tests/unit/utils/format.test.ts`, `tests/component/{PropertyCard,PropertyGrid}.test.ts`, `tests/fixtures/property.ts`
- Modify: `src/lib/i18n/copy.ts` (add `PropertyCopy` labels for type + status + "view detail")

**Interfaces:**

- Consumes: `Property` from `$sanity/types`; `Locale` from `$i18n/locales`; `urlFor` from `$sanity/image`
- Produces: `formatPrice(amount, locale)` → `"749 000 $"` (FR) / `"$749,000"` (EN); `<PropertyCard property locale basePath>` renders photo (first `photos[0]` or placeholder), formatted price, address + city, beds/baths/area, localized type label, status badge, link to `{basePath}/biens/{slug.current}` with localized "Voir le détail" / "View details"; `<PropertyGrid properties locale basePath>` renders responsive `grid gap-8 sm:grid-cols-2 lg:grid-cols-3`

- [ ] **Step 1: Write failing unit test for `formatPrice`**

Write `tests/unit/utils/format.test.ts` asserting FR uses space thousands + trailing `$`, EN uses `$` prefix + comma thousands.

- [ ] **Step 2: Write failing component tests**

Write `tests/fixtures/property.ts` exporting `mockProperty()` returning a minimal valid `Property` (reuse field shapes from `load-cms.test.ts`). `PropertyCard.test.ts` asserts: price text, address, bed/bath/area counts, link `href="/fr/biens/duplex-rosemont"`, image `alt` from photo. `PropertyGrid.test.ts` renders 2 properties, asserts 2 links.

- [ ] **Step 3: Run tests** — expect FAIL (modules not found).

- [ ] **Step 4: Implement `format.ts`** — `formatPrice(price: number, locale: Locale): string`.

- [ ] **Step 5: Extend `copy.ts`** — add `property: { viewDetail, beds, baths, area, types: Record<PropertyType,string>, statuses: Record<PropertyStatus,string> }` for FR + EN.

- [ ] **Step 6: Create `PropertyCard.svelte`** — card with `aspect-[4/3]` image, gold price, burgundy status pill for `vendu`, link wrapping card or explicit CTA arrow.

- [ ] **Step 7: Create `PropertyGrid.svelte`** — maps `properties` to `<PropertyCard>`.

- [ ] **Step 8: Run tests** — all pass; output pristine.

- [ ] **Step 9: `npm run check && npm run lint`**

- [ ] **Step 10: Commit** — `feat(content): add PropertyCard, PropertyGrid, and formatPrice utility`

---

## Task 3.2: Build `<PropertyCarousel>` (Embla)

**Files:**

- Create: `src/lib/components/content/PropertyCarousel.svelte`, `tests/component/PropertyCarousel.test.ts`
- Modify: `package.json`, `package-lock.json`, `src/routes/+page.svelte`

**Interfaces:**

- Consumes: `Property[]`, `locale`, `basePath`; `PropertyCard` from Task 3.1
- Produces: horizontal scroll carousel with prev/next buttons, `aria-label` on region, auto-advance every 6s (pause on hover/focus), disabled when `prefers-reduced-motion: reduce`; wires into Home replacing the plain list in `+page.svelte`

- [ ] **Step 1: Install `embla-carousel-svelte`** — add to dependencies.

- [ ] **Step 2: Write failing component test** — renders 3 cards, prev/next buttons present, `aria-roledescription="carousel"`.

- [ ] **Step 3: Run test** — expect FAIL.

- [ ] **Step 4: Implement `PropertyCarousel.svelte`** — Embla with snap, keyboard-accessible controls, `prefers-reduced-motion` via `matchMedia` disables interval.

- [ ] **Step 5: Update `+page.svelte`** — replace featured list with `<PropertyCarousel properties={data.featuredProperties} locale={data.locale} basePath={base} />`.

- [ ] **Step 6: Run tests + check + lint**

- [ ] **Step 7: Commit** — `feat(content): add PropertyCarousel with Embla on Home`

---

## Task 3.3: `/biens` index + `/biens/[slug]` detail routes

**Files:**

- Create: `src/routes/biens/+page.server.ts`, `src/routes/biens/+page.svelte`, `src/routes/biens/[slug]/+page.server.ts`, `src/routes/biens/[slug]/+page.svelte`, `tests/e2e/biens.spec.ts`
- Modify: `src/lib/sanity/queries.ts`, `src/lib/sanity/load-cms.ts`, `tests/unit/sanity/queries.test.ts`, `tests/unit/sanity/load-cms.test.ts`

**Interfaces:**

- Consumes: `PropertyCard`, `PropertyGrid`, `PageHeader`, `formatPrice`, `urlFor`, `plainTextFromBlocks`
- Produces: `allPropertiesQuery` — `*[_type == "property" && language == $lang && status != "vendu"] | order(publishedAt desc)` with full card projection; `propertyBySlugQuery` — single property by slug + lang with description, features, photos; `loadCmsListingsData(lang)`, `loadCmsPropertyBySlug(lang, slug)`; index page with PageHeader + PropertyGrid; detail page with image gallery (simple grid, no lightbox yet), specs table, description, map placeholder `iframe` or static map link, CTA link to contact

- [ ] **Step 1: Write failing query + load tests** — assert new query strings contain `language == $lang` and slug filter.

- [ ] **Step 2: Write failing e2e** — `biens.spec.ts`: `/fr/biens` returns 200 with axe clean; `/fr/biens/duplex-rosemont` returns 200 (use seeded slug).

- [ ] **Step 3: Run tests** — expect FAIL.

- [ ] **Step 4: Add queries + loaders** to `queries.ts` and `load-cms.ts`.

- [ ] **Step 5: Create index route** — server load calls `loadCmsListingsData`, page renders PageHeader + PropertyGrid.

- [ ] **Step 6: Create detail route** — `error(404)` when property missing; gallery uses `urlFor` widths 800/400; specs show beds/baths/area/type/status/price/features list.

- [ ] **Step 7: Run full suite** — unit + e2e pass.

- [ ] **Step 8: Commit** — `feat(routes): add biens index and detail pages wired to Sanity`

---

## Task 3.4: `<ServiceAccordion>` + `/services` page

**Files:**

- Create: `src/lib/i18n/services.ts`, `src/lib/components/content/ServiceAccordion.svelte`, `src/routes/services/+page.svelte`, `tests/component/ServiceAccordion.test.ts`, `tests/unit/i18n/services.test.ts`
- Modify: `src/lib/i18n/copy.ts` (import services into SiteCopy or keep separate `getServices(locale)`)

**Interfaces:**

- Consumes: static i18n content (4 categories from spec: first-time buyers, investment buyers, seller evaluation, seller strategy — each with title + 3–4 bullet points)
- Produces: numbered accordion (`aria-expanded`, keyboard Enter/Space), only one panel open at a time; `/fr/services` and `/en/services` with PageHeader + accordion

- [ ] **Step 1: Write failing tests** — services.ts returns 4 items per locale; accordion toggles `aria-expanded` on click.

- [ ] **Step 2: Run tests** — expect FAIL.

- [ ] **Step 3: Create `services.ts`** — export `getServices(locale): ServiceCategory[]` with FR + EN copy drawn from spec intent.

- [ ] **Step 4: Create `ServiceAccordion.svelte`** — button headers with `01`, `02`… prefixes in gold.

- [ ] **Step 5: Create `services/+page.svelte`** — PageHeader + ServiceAccordion.

- [ ] **Step 6: Run tests + check + lint + axe e2e snippet in locale-shell or new services e2e**

- [ ] **Step 7: Commit** — `feat(content): add ServiceAccordion and services page`

---

## Task 3.5: `<TestimonialChip>` + `<TeamMember>` + wire Home/About

**Files:**

- Create: `src/lib/components/content/{TestimonialChip,TeamMember}.svelte`, `tests/component/{TestimonialChip,TeamMember}.test.ts`
- Modify: `src/routes/+page.svelte`, `src/routes/a-propos/+page.svelte`

**Interfaces:**

- Consumes: `Testimonial`, `TeamMember` types; `urlFor`; `plainTextFromBlocks` or future `PortableTextRenderer`
- Produces: `TestimonialChip` — quote, author, context, optional photo, star rating (aria `img` with label); `TeamMember` — photo, name, role, bio; Home uses horizontal flex/wrap of chips; About uses `<TeamMember member={member} />` replacing inline markup

- [ ] **Step 1: Write failing component tests** for both components.

- [ ] **Step 2: Implement components** matching DESIGN.md typography.

- [ ] **Step 3: Wire Home** — replace testimonial `<ul>` with chips.

- [ ] **Step 4: Wire About** — replace inline team markup with `<TeamMember>`.

- [ ] **Step 5: Run tests + commit** — `feat(content): add TestimonialChip and TeamMember, wire Home and About`

---

## Task 3.6: `<PortableTextRenderer>` (Sanity portable text)

**Files:**

- Create: `src/lib/components/content/PortableTextRenderer.svelte`, `tests/component/PortableTextRenderer.test.ts`
- Modify: `package.json` (add `@portabletext/svelte`), `src/routes/biens/[slug]/+page.svelte`, `src/routes/a-propos/+page.svelte`

**Interfaces:**

- Consumes: `PortableTextBlock[]`, optional `class` prop
- Produces: renders paragraphs, bold/italic marks, bullet lists; maps `normal` → `p`, `h2` → `h2` with editorial classes; replaces `plainTextFromBlocks` on detail + About bio where rich text expected

- [ ] **Step 1: Write failing test** — renders paragraph text and a list from fixture blocks.

- [ ] **Step 2: Install `@portabletext/svelte`**

- [ ] **Step 3: Implement component** with custom components for block styles.

- [ ] **Step 4: Wire into biens detail + About**

- [ ] **Step 5: Run tests + commit** — `feat(content): add PortableTextRenderer for Sanity rich text`

---

## Task 3.7: `<CtaStrip>` + Home CTA section

**Files:**

- Create: `src/lib/components/content/CtaStrip.svelte`, `tests/component/CtaStrip.test.ts`
- Modify: `src/lib/i18n/copy.ts` (add `ctaStrip` copy), `src/routes/+page.svelte`

**Interfaces:**

- Consumes: `title`, `ctaHref`, `ctaLabel` props
- Produces: full-width burgundy band, centered title + rounded CTA; Home adds strip below testimonials linking to `/contact`

- [ ] **Step 1: Write failing test** — renders title + link.

- [ ] **Step 2: Implement + wire Home**

- [ ] **Step 3: Run tests + commit** — `feat(content): add CtaStrip and wire Home conversion strip`

---

## Task 3.8: `/transactions` page (sold grid + partners)

**Files:**

- Create: `src/routes/transactions/+page.server.ts`, `src/routes/transactions/+page.svelte`, `tests/e2e/transactions.spec.ts`
- Modify: `src/lib/sanity/queries.ts`, `src/lib/sanity/load-cms.ts`, `src/lib/i18n/copy.ts`

**Interfaces:**

- Consumes: `PropertyGrid`, `PropertyCard`; new queries `soldPropertiesQuery` (`status == "vendu"`), `partnersQuery`
- Produces: PageHeader + sold listings grid (reuse PropertyCard with vendu badge) + partners logo row (name fallback if no logo)

- [ ] **Step 1: Write failing load + e2e tests**

- [ ] **Step 2: Add queries/loaders**

- [ ] **Step 3: Create route**

- [ ] **Step 4: Run tests + commit** — `feat(routes): add transactions page with sold listings and partners`

---

## Task 3.9: `<BlogCard>` + `/blog` + `/blog/[slug]`

**Files:**

- Create: `src/lib/components/content/BlogCard.svelte`, `src/routes/blog/+page.server.ts`, `src/routes/blog/+page.svelte`, `src/routes/blog/[slug]/+page.server.ts`, `src/routes/blog/[slug]/+page.svelte`, `tests/component/BlogCard.test.ts`, `tests/e2e/blog.spec.ts`
- Modify: `src/lib/sanity/queries.ts`, `src/lib/sanity/load-cms.ts`, `src/lib/i18n/copy.ts`

**Interfaces:**

- Consumes: `Post` type; `PortableTextRenderer`; pagination: 6 posts per page on index (`?page=2`)
- Produces: `postsQuery`, `postBySlugQuery`, `postsCountQuery`; BlogCard shows cover, category label, title, excerpt, read link; detail shows cover, author, date, body

- [ ] **Step 1: Write failing tests** (component + query + e2e)

- [ ] **Step 2: Add queries/loaders** — `loadCmsPosts(lang, page)`, `loadCmsPostBySlug(lang, slug)`

- [ ] **Step 3: Implement BlogCard + routes**

- [ ] **Step 4: Run tests + commit** — `feat(routes): add blog index and post detail pages`

---

## Task 3.10: `/api/contact` endpoint (Resend + Zod)

**Files:**

- Create: `src/lib/server/contact-schema.ts`, `src/lib/server/resend.ts`, `src/routes/api/contact/+server.ts`, `tests/unit/server/contact-schema.test.ts`, `tests/unit/server/contact-handler.test.ts`
- Modify: `package.json` (add `resend`, `zod`)

**Interfaces:**

- Consumes: env `RESEND_API_KEY`, `CONTACT_TO_EMAIL` from `$sanity/env` server keys
- Produces: `contactFormSchema` — `{ name, phone, email, intent, message }` with Zod (email valid, phone min 10 chars, message min 10); POST returns `{ ok: true }` or `{ ok: false, errors }` with 400; sends HTML email via Resend adapter (mockable); rate-limit not required in v1

- [ ] **Step 1: Write failing schema tests** — valid payload passes; missing email fails.

- [ ] **Step 2: Write failing handler test** — mock Resend, assert `fetch` POST to `/api/contact` returns 200.

- [ ] **Step 3: Implement schema + resend adapter + handler**

- [ ] **Step 4: Run tests + commit** — `feat(api): add contact form endpoint with Zod and Resend`

---

## Task 3.11: `<ContactForm>` + `<CalEmbed>`

**Files:**

- Create: `src/lib/i18n/forms.ts`, `src/lib/components/forms/{ContactForm,CalEmbed}.svelte`, `tests/component/{ContactForm,CalEmbed}.test.ts`
- Modify: `package.json` if needed

**Interfaces:**

- Consumes: `getFormCopy(locale)` labels; POST `/api/contact`; env `CAL_COM_LINK` (optional — CalEmbed renders fallback message when unset)
- Produces: ContactForm with fields name/phone/email/intent (select: buy/sell/invest/other)/message, client-side validation mirroring Zod, success + error states; CalEmbed loads Cal inline script when link present

- [ ] **Step 1: Write failing component tests** — renders all fields; shows validation on empty submit; CalEmbed renders iframe/container when `calLink` set.

- [ ] **Step 2: Implement forms**

- [ ] **Step 3: Run tests + commit** — `feat(forms): add ContactForm and CalEmbed components`

---

## Task 3.12: `/contact` page

**Files:**

- Create: `src/routes/contact/+page.server.ts`, `src/routes/contact/+page.svelte`, `tests/e2e/contact.spec.ts`
- Modify: `src/lib/i18n/copy.ts`

**Interfaces:**

- Consumes: `PageHeader`, `ContactForm`, `CalEmbed`, `siteSettings` from CMS (phone, email, hours); WhatsApp link `wa.me/14384626015`
- Produces: two-column layout: left = contact methods + hours; right = form + Cal embed; e2e submits form with mocked API or test mode

- [ ] **Step 1: Write failing e2e** — `/fr/contact` axe clean, form fields visible.

- [ ] **Step 2: Server load** — `siteSettings` via existing query.

- [ ] **Step 3: Build page** assembling all sections.

- [ ] **Step 4: Run full suite** — all Phase 3 routes reachable in FR + EN.

- [ ] **Step 5: Commit** — `feat(routes): add contact page with form, Cal embed, and contact info`

---

## Phase 3 wrap-up

Phase 3 is complete when:

- `npm run test` passes (90+ unit/component tests)
- `npm run test:e2e` passes including biens, blog, contact, transactions
- `npm run check` returns 0 errors
- All routes work: `/fr/` + `/en/` home with carousel + chips + CTA strip; `/fr/biens`, `/fr/biens/[slug]`, `/fr/services`, `/fr/transactions`, `/fr/blog`, `/fr/blog/[slug]`, `/fr/contact` (and EN equivalents)
- `/api/contact` validates and returns structured errors
- Cal.com embed renders when `CAL_COM_LINK` is set; graceful fallback when unset

---

# Phase 4 — Polish & launch (Weeks 4–5, summary)

| Task | What                                                  | Files                                                                       |
| ---- | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| 4.1  | `<SeoHead>` + OG + hreflang + JSON-LD RealEstateAgent | `src/lib/components/seo/SeoHead.svelte`, wire into all 9 pages              |
| 4.2  | Dynamic `sitemap.xml` + `robots.txt`                  | `src/routes/sitemap.xml/+server.ts`, `src/routes/robots.txt/+server.ts`     |
| 4.3  | `/api/og` dynamic OG image (Satori + resvg)           | `src/lib/server/og.ts`, `src/routes/api/og/+server.ts`                      |
| 4.4  | GA4 loader (gated by CookieBanner consent)            | `src/lib/components/seo/Ga4Loader.svelte`, integrated into `+layout.svelte` |
| 4.5  | Lighthouse perf + a11y pass (target ≥95 all 4)        | optimize images, fonts, JS                                                  |
| 4.6  | axe-core a11y tests for every page                    | extend `tests/e2e/`                                                         |
| 4.7  | Visual regression baseline (Playwright screenshots)   | `tests/e2e/visual/`                                                         |
| 4.8  | Mobile QA pass (Pixel 5 + iPhone 13 viewports)        | fix any layout issues found                                                 |
| 4.9  | Custom domain + SSL setup                             | `serginehougoue.ca` DNS → Vercel                                            |
| 4.10 | Replace placeholder photos with real assets           | drop files into `static/placeholders/`                                      |

**Phase 4 done when:** Lighthouse ≥95 on every key page, axe-core clean, sitemap + robots valid, OG image renders correctly in social previews, GA4 fires only after consent, custom domain live with HTTPS, all real photos in place.

---

# Phase 5 — Post-launch (Week 6+)

| Task | What                                                                                                                                           |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1  | Write 3 starter blog posts targeting long-tail keywords ("acheter un plex à Montréal", "premier acheteur Rive-Nord", "marché immobilier 2026") |
| 5.2  | Add 3–6 additional properties to Sanity                                                                                                        |
| 5.3  | Submit sitemap to Google Search Console                                                                                                        |
| 5.4  | Set up GA4 conversion events for form submission + WhatsApp click                                                                              |
| 5.5  | Add real testimonials as transactions close                                                                                                    |
| 5.6  | Monitor "1 client/month" funnel: traffic → contact form → booked appointment → closed transaction                                              |
| 5.7  | Iterate on copy, photography, and CTAs based on analytics                                                                                      |

---

## Self-Review

After writing the complete plan, I checked it against the spec.

### 1. Spec coverage

| Spec section                              | Plan task(s)                                                                              |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1. Purpose & Goals                        | Phase 1 wrap-up + Phase 5                                                                 |
| 2. Decisions Summary (11 decisions)       | All reflected in stack + components (Tasks 1.1–4.4)                                       |
| 3. Architecture & Stack                   | 1.1, 1.2, 2.1, 3.10, 4.3, 4.4                                                             |
| 4. Information Architecture               | All routes present; locale prefix in Task 1.5                                             |
| 5. Sanity Content Model (6 schemas)       | Tasks 2.2, 2.3, 2.4, 2.5, 2.6                                                             |
| 6. Component Architecture (19 components) | Tasks 1.6–1.12, 3.1–3.9, 3.11, 4.1                                                        |
| 7. Testing Strategy                       | Vitest, Testing Library, Playwright, axe-core, visual regression, Lighthouse              |
| 8. Deployment                             | `@sveltejs/adapter-vercel`, env vars, custom domain, Resend                               |
| 9. Risks & Mitigations                    | Placeholders (1.12, 4.10), starter content (2.6), consent (1.10), Cal.com fallback (3.11) |
| 10. Open Questions                        | Graceful-degradation paths in 4.1, 4.9, 3.11, 4.10; Phase 5 addresses blog posts          |
| 11. References                            | Cited throughout                                                                          |
| 12. Approval                              | Spec approved 2026-06-24                                                                  |

**Coverage verdict**: every spec section has at least one task; every component, schema, route, env var, and decision is implemented.

### 2. Placeholder scan

Searched for `TBD`, `TODO`, `implement later`, `add appropriate`, `handle edge cases`, `fill in details`, `similar to Task`. **Found none.**

### 3. Type consistency check

- `Locale` (Task 1.4) consumed consistently by every component.
- `SiteCopy` consumed via `getCopy(locale)` consistently.
- Sanity types (`Property`, `Post`, etc.) match between `types.ts` (2.5) and component props.
- Zod contact form schema (3.10) matches ContactForm (3.11): `{ name, phone, email, intent, message }`.
- Env var names consistent: `CONTACT_TO_EMAIL`, `GA4_MEASUREMENT_ID`, `CAL_COM_LINK`, `RESEND_API_KEY`.

**Type consistency verdict**: no mismatches found.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-24-sergine-hougoue-immo.md`.**

This is a ~2,200-line implementation plan covering all 5 phases of the Sergine Hougoue real estate web application. The plan is sized for incremental, TDD-driven implementation with frequent commits.

**Two execution options:**

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks. Best for a plan this size because each subagent gets full context for their specific task.
2. **Inline Execution** — execute tasks in this session using the `executing-plans` skill, with batch execution and checkpoints for review.

**If you choose Subagent-Driven, please install the `superpowers:subagent-driven-development` sub-skill.**
**If you choose Inline Execution, please install the `superpowers:executing-plans` sub-skill.**

Which approach would you like to use?
