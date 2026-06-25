import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";

test("/en/ shows English hero title from getCopy", async ({ page }) => {
  await page.goto("/en/");
  await expect(
    page.getByRole("heading", { name: getCopy("en").hero.title }),
  ).toBeVisible();
});

test("/fr/politique-confidentialite renders FR privacy heading", async ({
  page,
}) => {
  await page.goto("/fr/politique-confidentialite");
  await expect(
    page.getByRole("heading", { name: "Politique de confidentialité" }),
  ).toBeVisible();
});

test("/en/politique-confidentialite renders EN privacy heading", async ({
  page,
}) => {
  await page.goto("/en/politique-confidentialite");
  await expect(
    page.getByRole("heading", { name: "Privacy policy" }),
  ).toBeVisible();
});
