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

  it("renders accented French copy in nav.about", () => {
    expect(getCopy("fr").nav.about).toBe("À propos");
  });

  it("renders accented French copy in cookie.title", () => {
    expect(getCopy("fr").cookie.title).toBe("Cookies et confidentialité");
  });

  it("uses an em-dash (not a curly quote) in French footer tagline", () => {
    expect(getCopy("fr").footer.tagline).toContain("—");
    expect(getCopy("fr").footer.tagline).not.toContain("”");
  });

  it("uses an em-dash (not a curly quote) in English footer tagline", () => {
    expect(getCopy("en").footer.tagline).toContain("—");
    expect(getCopy("en").footer.tagline).not.toContain("”");
  });

  it("exposes hero copy in both languages", () => {
    expect(getCopy("fr").hero.title).toBe(
      "Construisons votre avenir immobilier",
    );
    expect(getCopy("en").hero.title).toBe(
      "Let's build your real estate future",
    );
  });
});
