import { describe, it, expect } from "vitest";
import {
  DOCUMENT_I18N_LANGUAGE_FIELD,
  featuredPropertiesQuery,
  siteSettingsQuery,
  teamMembersQuery,
  testimonialsQuery,
} from "$sanity/queries";

describe("sanity GROQ queries", () => {
  it("siteSettingsQuery filters singleton siteSettings document", () => {
    expect(siteSettingsQuery).toContain('_type == "siteSettings"');
    expect(siteSettingsQuery).toContain("[0]");
  });

  it("featuredPropertiesQuery filters by type, language, and featured flag", () => {
    expect(featuredPropertiesQuery).toContain('_type == "property"');
    expect(featuredPropertiesQuery).toContain("featured == true");
    expect(featuredPropertiesQuery).toContain("$lang");
    expect(featuredPropertiesQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(featuredPropertiesQuery).toContain("order(publishedAt desc)");
  });

  it("testimonialsQuery filters by type and language, orders by display order", () => {
    expect(testimonialsQuery).toContain('_type == "testimonial"');
    expect(testimonialsQuery).toContain("$lang");
    expect(testimonialsQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(testimonialsQuery).toContain("order(order asc)");
  });

  it("teamMembersQuery filters by type and language, orders by display order", () => {
    expect(teamMembersQuery).toContain('_type == "teamMember"');
    expect(teamMembersQuery).toContain("$lang");
    expect(teamMembersQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(teamMembersQuery).toContain("order(order asc)");
  });
});
