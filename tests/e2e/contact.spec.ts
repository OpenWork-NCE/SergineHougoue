import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { getCopy } from "../../src/lib/i18n/copy";
import { getFormCopy } from "../../src/lib/i18n/forms";

type AxeBuilderOptions = ConstructorParameters<typeof AxeBuilder>[0];

async function fillBoundInput(
  page: Page,
  selector: string,
  value: string,
) {
  const field = page.locator(selector);
  await field.scrollIntoViewIfNeeded();
  await field.evaluate((element, nextValue) => {
    const input = element as HTMLInputElement | HTMLTextAreaElement;
    input.value = nextValue;
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  }, value);
}

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

  test("/fr/contact submits form and shows success with mocked API", async ({
    page,
  }) => {
    const formCopy = getFormCopy("fr");

    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem("sergine_cookie_consent", "accepted");
    });

    await page.goto("/fr/contact");
    await expect(page.locator("#contact-name")).toBeEditable({ timeout: 15_000 });

    await fillBoundInput(page, "#contact-name", "Jane Doe");
    await fillBoundInput(page, "#contact-phone", "4384626015");
    await fillBoundInput(page, "#contact-email", "jane@example.com");
    await page.locator("#contact-intent").evaluate((select) => {
      const element = select as HTMLSelectElement;
      element.value = "buy";
      element.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await fillBoundInput(
      page,
      "#contact-message",
      "Je souhaite acheter une propriété à Montréal.",
    );

    const submitButton = page.locator('form button[type="submit"]');
    await submitButton.scrollIntoViewIfNeeded();
    await submitButton.click();

    await expect(page.getByTestId("contact-form-success")).toBeVisible();
    await expect(page.getByTestId("contact-form-success")).toHaveText(
      formCopy.success,
    );
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