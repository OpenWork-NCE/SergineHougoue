import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";
import { getServices } from "../../src/lib/i18n/services";

type AxeBuilderOptions = ConstructorParameters<typeof AxeBuilder>[0];

test.describe("services routes", () => {
  test("/fr/services returns 200 with page header and accordion", async ({
    page,
  }) => {
    const copy = getCopy("fr");
    const services = getServices("fr");
    const response = await page.goto("/fr/services");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: copy.services.title }),
    ).toBeVisible();
    await expect(page.getByText(copy.services.intro)).toBeVisible();
    await expect(
      page.getByRole("button", { name: new RegExp(services[0].title, "i") }),
    ).toBeVisible();
  });

  test("/en/services returns 200 with English page header", async ({
    page,
  }) => {
    const copy = getCopy("en");
    const response = await page.goto("/en/services");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: copy.services.title }),
    ).toBeVisible();
  });

  test("/fr/services has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/fr/services");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({
      page: page as unknown as AxeBuilderOptions["page"],
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
