import { describe, expect, it } from "vitest";
import {
  getStaticSoldProperties,
  getStaticSoldPropertyBySlug,
  getStaticSoldSlugs,
} from "$lib/properties/sold-static";

describe("static sold properties", () => {
  it("returns eight sold listings without fake prices", () => {
    const sold = getStaticSoldProperties("fr");
    expect(sold).toHaveLength(8);
    expect(sold.every((p) => p.status === "vendu")).toBe(true);
    expect(sold.every((p) => p.source === "static")).toBe(true);
    expect(sold.every((p) => p.price == null)).toBe(true);
    expect(sold.every((p) => p.staticImageSrc?.startsWith("/properties/sold/"))).toBe(
      true,
    );
  });

  it("localizes titles", () => {
    const fr = getStaticSoldPropertyBySlug("fr", "condo-vendu-montreal");
    const en = getStaticSoldPropertyBySlug("en", "condo-vendu-montreal");
    expect(fr?.title).toMatch(/Montréal/);
    expect(en?.title).toMatch(/Montreal/);
  });

  it("exposes slugs for routing", () => {
    expect(getStaticSoldSlugs()).toContain("duplex-vendu-chateauguay");
  });
});
