import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";

type AxeBuilderOptions = ConstructorParameters<typeof AxeBuilder>[0];

test.describe("transactions routes", () => {
  test("/fr/transactions returns 200 with page header", async ({ page }) => {
    const copy = getCopy("fr");
    const response = await page.goto("/fr/transactions");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: copy.transactions.title }),
    ).toBeVisible();
    await expect(page.getByText(copy.transactions.intro)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: copy.transactions.soldHeading }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /partenaires de confiance/i }),
    ).toHaveCount(0);
    // Sold cards come from Sanity; if CMS is empty, page still renders shell
    const soldCard = page.getByText("Condo vendu à Montréal");
    if ((await soldCard.count()) > 0) {
      await expect(soldCard).toBeVisible();
      await expect(page.getByText("Vendu").first()).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: copy.transactions.soldHeading }),
      ).toBeVisible();
    }
  });


  test("/en/transactions returns 200 with English page header", async ({
    page,
  }) => {
    const copy = getCopy("en");
    const response = await page.goto("/en/transactions");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: copy.transactions.title }),
    ).toBeVisible();
  });

  test("/fr/transactions has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/fr/transactions");

    const accessibilityScanResults = await new AxeBuilder({
      page: page as unknown as AxeBuilderOptions["page"],
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});