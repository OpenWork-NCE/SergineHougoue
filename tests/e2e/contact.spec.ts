import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";
import { getFormCopy } from "../../src/lib/i18n/forms";

type AxeBuilderOptions = ConstructorParameters<typeof AxeBuilder>[0];

test.describe("contact routes", () => {
  test("/fr/contact returns 200 with page header and form fields", async ({
    page,
  }) => {
    const copy = getCopy("fr");
    const formCopy = getFormCopy("fr");
    const response = await page.goto("/fr/contact");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: copy.contact.title }),
    ).toBeVisible();
    await expect(page.getByText(copy.contact.intro)).toBeVisible();
    await expect(page.getByLabel(formCopy.fields.name)).toBeVisible();
    await expect(page.getByLabel(formCopy.fields.phone)).toBeVisible();
    await expect(page.getByLabel(formCopy.fields.email)).toBeVisible();
    await expect(page.getByLabel(formCopy.fields.intent)).toBeVisible();
    await expect(page.getByLabel(formCopy.fields.message)).toBeVisible();
  });

  test("/en/contact returns 200 with English page header", async ({ page }) => {
    const copy = getCopy("en");
    const response = await page.goto("/en/contact");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: copy.contact.title }),
    ).toBeVisible();
  });

  test("/fr/contact has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/fr/contact");

    const accessibilityScanResults = await new AxeBuilder({
      page: page as unknown as AxeBuilderOptions["page"],
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});