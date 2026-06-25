import { describe, it, expect } from "vitest";
import { getSeedDocuments } from "$sanity/seed-data";
import { SITE_SETTINGS_DOCUMENT_ID } from "$sanity/structure";

describe("getSeedDocuments", () => {
  const documents = getSeedDocuments();

  it("returns at least 13 documents", () => {
    expect(documents.length).toBeGreaterThanOrEqual(13);
  });

  it("includes required document types", () => {
    const types = new Set(documents.map((doc) => doc._type));
    expect(types.size).toBeGreaterThanOrEqual(4);
    expect(types).toContain("siteSettings");
    expect(types).toContain("property");
    expect(types).toContain("testimonial");
    expect(types).toContain("teamMember");
  });

  it("uses the siteSettings singleton document id", () => {
    const siteSettings = documents.find((doc) => doc._type === "siteSettings");
    expect(siteSettings).toBeDefined();
    expect(siteSettings?._id).toBe(SITE_SETTINGS_DOCUMENT_ID);
  });

  it("seeds bilingual FR and EN variants for i18n document types", () => {
    const i18nTypes = ["property", "testimonial", "teamMember"] as const;

    for (const type of i18nTypes) {
      const docs = documents.filter((doc) => doc._type === type);
      const languages = new Set(
        docs.map((doc) => doc.language).filter(Boolean),
      );
      expect(languages).toContain("fr");
      expect(languages).toContain("en");
    }
  });

  it("marks at least two properties as featured", () => {
    const featuredCount = documents.filter(
      (doc) => doc._type === "property" && doc.featured === true,
    ).length;
    expect(featuredCount).toBeGreaterThanOrEqual(2);
  });

  it("assigns a stable _id to every document", () => {
    const ids = documents.map((doc) => doc._id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(
      true,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
