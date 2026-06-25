import { expect, test } from "@playwright/test";

test("home page renders the bootstrap heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Construisons votre avenir immobilier" }),
  ).toBeVisible();
});
