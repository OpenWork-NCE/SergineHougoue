import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

type AxeBuilderOptions = ConstructorParameters<typeof AxeBuilder>[0];

test("home page renders the bootstrap heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Construisons votre avenir immobilier" }),
  ).toBeVisible();
});

test("home page has no critical accessibility violations", async ({ page }) => {
  // Stable theme for contrast checks (avoid dark/light residue from other tests)
  await page.addInitScript(() => {
    localStorage.setItem("sergine_theme", "light");
    localStorage.setItem("sergine_cookie_consent", "accepted");
  });
  await page.goto("/fr/");
  await page.locator("html").evaluate((el) => {
    el.setAttribute("data-theme", "light");
    // Instantly finish scroll-reveals (no mid-transition opacity) before contrast checks
    document.querySelectorAll(".reveal").forEach((node) => {
      const el = node as HTMLElement;
      el.style.transition = "none";
      el.classList.add("is-visible");
    });
  });

  // AxeBuilder currently types `page` against a newer playwright-core version.
  const accessibilityScanResults = await new AxeBuilder({
    page: page as unknown as AxeBuilderOptions["page"],
  }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test("home shows Quebec territory regions", async ({ page }) => {
  await page.goto("/fr/");
  await expect(
    page.getByRole("heading", { name: /Partout au Québec/i }),
  ).toBeVisible();
  const territory = page.locator('section[aria-labelledby="territory-heading"]');
  await expect(territory.getByText("Montréal", { exact: true })).toBeVisible();
  await expect(territory.getByText("Montérégie", { exact: true })).toBeVisible();
});
