import { describe, it, expect } from "vitest";
import { getCopy } from "$i18n/copy";

describe("getCopy", () => {
  it("returns French copy for fr locale", () => {
    const copy = getCopy("fr");
    expect(copy.nav.home).toBe("Accueil");
    expect(copy.nav.contact).toBe("Contact");
  });

  it("returns English copy for en locale", () => {
    const copy = getCopy("en");
    expect(copy.nav.home).toBe("Home");
    expect(copy.nav.contact).toBe("Contact");
  });

  it("exposes WhatsApp pre-fill message in both languages", () => {
    expect(getCopy("fr").whatsapp.defaultMessage).toMatch(/Bonjour Sergine/);
    expect(getCopy("en").whatsapp.defaultMessage).toMatch(/Hello Sergine/);
  });
});
