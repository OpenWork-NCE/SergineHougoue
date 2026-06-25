# Task 1.2 — Install + configure Tailwind CSS with brand tokens (Brief)

> **Source of truth:** `docs/superpowers/plans/2026-06-24-sergine-hougoue-immo.md`,
> Task 1.2.

## Where this fits

Task 1.2 builds directly on the Task 1.1 scaffold commit `4451c7a`.
It adds Tailwind CSS, the DESIGN.md dark-editorial token layer, and Sergine's
brand burgundy/gold tokens. It also wires global CSS into the root layout and
updates the home page to prove the tokens are live.

## Current state

- Working dir: `C:\Users\AM\Documents\Workspace\DHC\immo`
- Branch: `feat/phase-1-foundation`
- HEAD: `4451c7a chore: scaffold SvelteKit + TypeScript project`
- Task 1.1 complete and ledgered.
- Carry-forward minor note: `src/app.html` references `favicon.svg`, which is
  planned for Task 1.12. Do not solve that in this task unless it is required
  to complete Task 1.2.

## Steps (from the plan)

1. **Install Tailwind + PostCSS**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo && npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
```

Expected: `tailwindcss`, `postcss`, `autoprefixer` added to `package.json`
devDependencies.

2. **Create `tailwind.config.ts`**

Write:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,svelte,ts,js}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
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

3. **Create `postcss.config.js`**

Write:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

4. **Create `src/app.css` with Tailwind layers + DESIGN.md tokens + new brand tokens**

Write:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
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

5. **Wire `app.css` into the root layout**

Modify `src/routes/+layout.svelte` to:

```svelte
<script lang="ts">
  import '../app.css';
</script>

<slot />
```

6. **Verify Tailwind works — update Home page**

Modify `src/routes/+page.svelte` to:

```svelte
<main class="container-editorial py-24">
  <p class="eyebrow mb-4">01 / Courtier immobilier</p>
  <h1 class="font-display text-5xl md:text-6xl text-balance text-primary">
    Construisons votre avenir immobilier
  </h1>
  <p class="mt-6 text-secondary text-lg max-w-2xl">
      Bootstrap OK — Tailwind tokens loaded.
  </p>
</main>
```

7. **Run dev server to verify**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run dev
```

Expected: open `http://localhost:5173`; see a dark canvas with cream serif H1
and burgundy eyebrow text (note: eyebrow is currently `--text-secondary`, will
become gold later). Stop the server.

8. **Verify TypeScript**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo && npm run check
```

Expected: `0 errors, 0 warnings`.

9. **Commit**

Run:

```bash
cd C:\Users\AM\Documents\Workspace\DHC\immo
git add -A
git commit -m "feat: add Tailwind CSS with DESIGN.md tokens + Sergine brand colors"
```

## Constraints

- Follow the task exactly; do not pull in Task 1.3 work.
- Do not touch `DESIGN.md`, `docs/`, `Utilities to Brainstorm/`, or `.claude/`.
- Use the same Windows `.cmd` wrapper pattern for commands that need arguments.
- Verification evidence must be written to `.superpowers/sdd/task-1.2-report.md`.

## Report

Write the full report to:
`C:\Users\AM\Documents\Workspace\DHC\immo\.superpowers\sdd\task-1.2-report.md`

Include:

- Status
- Step-by-step outcomes
- install/check/dev evidence
- final commit short SHA + message
- concerns, if any

Return only:

- Status
- Commits created
- One-line test summary
- Concerns if any
- Report file path
