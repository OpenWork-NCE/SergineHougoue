import { describe, it, expect } from "vitest";
import { detectLocale, translatePath } from "$i18n/detectLocale";

describe("detectLocale", () => {
  it("returns fr for /fr/services", () => {
    expect(detectLocale("/fr/services")).toBe("fr");
  });

  it("returns en for /en/services", () => {
    expect(detectLocale("/en/services")).toBe("en");
  });

  it("returns fr for root / when no Accept-Language header", () => {
    expect(detectLocale("/")).toBe("fr");
  });

  it("returns fr for root / even with Accept-Language en", () => {
    // Path prefix wins over Accept-Language
    expect(detectLocale("/", "en-US,en;q=0.9")).toBe("fr");
  });

  it("returns en for /en/ when Accept-Language is fr", () => {
    expect(detectLocale("/en/contact", "fr-CA,fr;q=0.9")).toBe("en");
  });

  it("strips query string before checking", () => {
    expect(detectLocale("/en/blog?utm=foo")).toBe("en");
  });
});

describe("translatePath", () => {
  it("switches /fr/services to /en/services", () => {
    expect(translatePath("/fr/services", "fr", "en")).toBe("/en/services");
  });

  it("switches /en/blog/foo to /fr/blog/foo", () => {
    expect(translatePath("/en/blog/foo", "en", "fr")).toBe("/fr/blog/foo");
  });

  it("returns /en/ for root /", () => {
    expect(translatePath("/", "fr", "en")).toBe("/en/");
  });

  it("leaves already-prefixed path alone if same locale", () => {
    expect(translatePath("/fr/a-propos", "fr", "fr")).toBe("/fr/a-propos");
  });
});
