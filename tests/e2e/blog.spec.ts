import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";

type AxeBuilderOptions = ConstructorParameters<typeof AxeBuilder>[0];

test.describe("blog routes", () => {
  test("/fr/blog returns 200 with page header", async ({ page }) => {
    const copy = getCopy("fr");
    const response = await page.goto("/fr/blog");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: copy.blog.title }),
    ).toBeVisible();
    await expect(page.getByText(copy.blog.intro)).toBeVisible();
  });

  test("/en/blog returns 200 with English page header", async ({ page }) => {
    const copy = getCopy("en");
    const response = await page.goto("/en/blog");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: copy.blog.title }),
    ).toBeVisible();
  });

  test("/fr/blog?page=2 returns 200", async ({ page }) => {
    const response = await page.goto("/fr/blog?page=2");

    expect(response?.status()).toBe(200);
  });

  test("/fr/blog has no critical accessibility violations", async ({ page }) => {
    await page.goto("/fr/blog");

    const accessibilityScanResults = await new AxeBuilder({
      page: page as unknown as AxeBuilderOptions["page"],
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});