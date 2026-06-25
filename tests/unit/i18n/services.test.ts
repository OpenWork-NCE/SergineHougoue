import { describe, it, expect } from "vitest";
import { getServices } from "$i18n/services";

describe("getServices", () => {
  it("returns 4 categories for French locale", () => {
    const services = getServices("fr");
    expect(services).toHaveLength(4);
  });

  it("returns 4 categories for English locale", () => {
    const services = getServices("en");
    expect(services).toHaveLength(4);
  });

  it("each category has a title and 3–4 bullet points in French", () => {
    for (const category of getServices("fr")) {
      expect(category.title).toBeTruthy();
      expect(category.bullets.length).toBeGreaterThanOrEqual(3);
      expect(category.bullets.length).toBeLessThanOrEqual(4);
    }
  });

  it("each category has a title and 3–4 bullet points in English", () => {
    for (const category of getServices("en")) {
      expect(category.title).toBeTruthy();
      expect(category.bullets.length).toBeGreaterThanOrEqual(3);
      expect(category.bullets.length).toBeLessThanOrEqual(4);
    }
  });

  it("returns localized titles for first-time buyers category", () => {
    expect(getServices("fr")[0].title).toMatch(/premiers acheteurs/i);
    expect(getServices("en")[0].title).toMatch(/first-time buyers/i);
  });

  it("returns localized titles for seller evaluation category", () => {
    expect(getServices("fr")[2].title).toMatch(/évaluation/i);
    expect(getServices("en")[2].title).toMatch(/evaluation/i);
  });
});
