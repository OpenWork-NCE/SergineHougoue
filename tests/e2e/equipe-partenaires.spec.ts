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
    await expect(
      page.getByRole("heading", { name: "Steve Djeuga" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Sara-Tamika Bruno" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Guy Merlin Kuigoua" }),
    ).toBeVisible();
    await expect(page.getByText("Xperto Hypothèques", { exact: true })).toBeVisible();
    await expect(page.getByText("TD Canada Trust", { exact: true })).toBeVisible();
    await expect(page.getByText(/AIBQ.*22185/)).toBeVisible();
    await expect(page.getByRole("link", { name: "438-225-4003" })).toBeVisible();
    await expect(page.getByRole("link", { name: "438-867-4995" })).toBeVisible();
    await expect(page.getByRole("link", { name: "438-936-8779" })).toBeVisible();
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
