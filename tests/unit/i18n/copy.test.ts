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

  it("keeps French footer tagline free of em dashes and curly quotes", () => {
    expect(getCopy("fr").footer.tagline).not.toContain("—");
    expect(getCopy("fr").footer.tagline).not.toContain("”");
    expect(getCopy("fr").footer.tagline).toMatch(/VENDIRECT/);
  });

  it("keeps English footer tagline free of em dashes and curly quotes", () => {
    expect(getCopy("en").footer.tagline).not.toContain("—");
    expect(getCopy("en").footer.tagline).not.toContain("”");
    expect(getCopy("en").footer.tagline).toMatch(/VENDIRECT/);
  });

  it("credits Digital House Compagny in the footer", () => {
    expect(getCopy("fr").footer.designedBy).toBe(
      "Site conçu par Digital House Compagny",
    );
  });

  it("exposes hero copy in both languages", () => {
    expect(getCopy("fr").hero.title).toBe(
      "Construisons votre avenir immobilier",
    );
    expect(getCopy("en").hero.title).toBe(
      "Let's build your real estate future",
    );
  });

  it("frames the blog as Quebec-wide, not only Montreal / North Shore", () => {
    const fr = getCopy("fr").blog.intro;
    const en = getCopy("en").blog.intro;

    expect(fr).toMatch(/partout au Québec/i);
    expect(fr).toMatch(/17 régions administratives/i);
    expect(fr).not.toMatch(/Rive-Nord/);
    expect(en).toMatch(/across Quebec/i);
    expect(en).toMatch(/17 administrative regions/i);
    expect(en).not.toMatch(/North Shore/);
  });

  it("exposes blog regions marquee labels in both languages", () => {
    expect(getCopy("fr").blog.regionsAriaLabel).toMatch(
      /17 régions administratives/i,
    );
    expect(getCopy("en").blog.regionsAriaLabel).toMatch(
      /17 administrative regions/i,
    );
  });
});


