import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";

type AxeBuilderOptions = ConstructorParameters<typeof AxeBuilder>[0];

test.describe("biens routes", () => {
  test("/fr/biens returns 200 with page header", async ({ page }) => {
    const copy = getCopy("fr");
    const response = await page.goto("/fr/biens");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: copy.listings.title }),
    ).toBeVisible();
    await expect(page.getByText(copy.listings.intro)).toBeVisible();
  });

  test("/fr/biens has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/fr/biens");

    const accessibilityScanResults = await new AxeBuilder({
      page: page as unknown as AxeBuilderOptions["page"],
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("/fr/biens/duplex-rosemont returns 200", async ({ page }) => {
    const response = await page.goto("/fr/biens/duplex-rosemont");
    const status = response?.status();

    if (status === 404) {
      test.skip(
        true,
        "Sanity not configured / property not seeded",
      );
      return;
    }

    expect(status).toBe(200);
    await expect(
      page.getByRole("heading", { name: /Duplex lumineux/i }),
    ).toBeVisible();
  });
});
