import { describe, expect, it } from "vitest";
import { getCopy } from "$i18n/copy";

describe("about expertise", () => {
  it("includes flip and rentals in FR", () => {
    const titles = getCopy("fr").about.expertise.map((e) => e.title);
    expect(titles).toHaveLength(5);
    expect(titles).toContain("Flip immobilier");
    expect(titles).toContain("Location de propriétés");
  });

  it("includes flip and rentals in EN", () => {
    const titles = getCopy("en").about.expertise.map((e) => e.title);
    expect(titles).toHaveLength(5);
    expect(titles).toContain("Property flip");
    expect(titles).toContain("Property rentals");
  });
});
