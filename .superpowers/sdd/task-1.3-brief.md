# Task 1.3 brief (auto-generated fallback)

Source: docs/superpowers/plans/2026-06-24-sergine-hougoue-immo.md lines 577-737

--- BEGIN PLAN EXCERPT ---

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

--- END PLAN EXCERPT ---
