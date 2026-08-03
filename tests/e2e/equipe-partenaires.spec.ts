import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";

test.describe("equipe-partenaires routes", () => {
  test("/fr/equipe-partenaires returns 200", async ({ page }) => {
    const copy = getCopy("fr");
    const res = await page.goto("/fr/equipe-partenaires");
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: copy.teamPartners.title }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: copy.teamPartners.teamHeading }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: copy.teamPartners.networkHeading }),
    ).toBeVisible();
    await expect(page.getByText("Steve Djeuga")).toBeVisible();
    await expect(page.getByText("Sara", { exact: true })).toBeVisible();
    await expect(page.getByText("Guy", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: copy.teamPartners.partnersHeading }),
    ).toBeVisible();
  });

  test("/en/equipe-partenaires returns 200 with English page header", async ({
    page,
  }) => {
    const copy = getCopy("en");
    const res = await page.goto("/en/equipe-partenaires");
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: copy.teamPartners.title }),
    ).toBeVisible();
  });
});
