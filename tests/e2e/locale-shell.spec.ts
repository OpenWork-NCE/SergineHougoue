import { expect, test } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";
import type { Locale } from "../../src/lib/i18n/locales";

const LOCALES: Locale[] = ["fr", "en"];

test.describe("locale shell chrome", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  for (const locale of LOCALES) {
    test(`/${locale}/ shows nav, footer, WhatsApp FAB, and cookie banner from getCopy`, async ({
      page,
    }) => {
      const copy = getCopy(locale);
      await page.goto(`/${locale}/`);

      await expect(
        page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("link", { name: copy.nav.services }),
      ).toBeVisible();

      await expect(page.getByText(copy.footer.tagline)).toBeVisible();

      const whatsappLink = page.locator('a[href*="wa.me/14384626015"]').first();
      await expect(whatsappLink).toBeVisible();
      await expect(whatsappLink).toHaveAttribute(
        "href",
        expect.stringContaining("wa.me/14384626015"),
      );

      await expect(
        page.getByRole("button", { name: copy.cookie.accept }),
      ).toBeVisible();
    });
  }
});

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
