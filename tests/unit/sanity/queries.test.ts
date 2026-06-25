import { describe, it, expect } from "vitest";
import {
  DOCUMENT_I18N_LANGUAGE_FIELD,
  allPropertiesQuery,
  featuredPropertiesQuery,
  partnersQuery,
  postBySlugQuery,
  postsCountQuery,
  postsQuery,
  propertyBySlugQuery,
  siteSettingsQuery,
  soldPropertiesQuery,
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

  it("allPropertiesQuery filters by type, language, and excludes sold listings", () => {
    expect(allPropertiesQuery).toContain('_type == "property"');
    expect(allPropertiesQuery).toContain("$lang");
    expect(allPropertiesQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(allPropertiesQuery).toContain('status != "vendu"');
    expect(allPropertiesQuery).toContain("order(publishedAt desc)");
  });

  it("soldPropertiesQuery filters by type, language, and sold status", () => {
    expect(soldPropertiesQuery).toContain('_type == "property"');
    expect(soldPropertiesQuery).toContain("$lang");
    expect(soldPropertiesQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(soldPropertiesQuery).toContain('status == "vendu"');
    expect(soldPropertiesQuery).toContain("order(publishedAt desc)");
  });

  it("partnersQuery filters by type and language, orders by display order", () => {
    expect(partnersQuery).toContain('_type == "partner"');
    expect(partnersQuery).toContain("$lang");
    expect(partnersQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(partnersQuery).toContain("order(order asc)");
    expect(partnersQuery).toContain("logo");
    expect(partnersQuery).toContain("category");
  });

  it("propertyBySlugQuery filters by type, language, and slug", () => {
    expect(propertyBySlugQuery).toContain('_type == "property"');
    expect(propertyBySlugQuery).toContain("$lang");
    expect(propertyBySlugQuery).toContain("$slug");
    expect(propertyBySlugQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(propertyBySlugQuery).toContain("slug.current == $slug");
    expect(propertyBySlugQuery).toContain("[0]");
    expect(propertyBySlugQuery).toContain("description");
    expect(propertyBySlugQuery).toContain("features");
    expect(propertyBySlugQuery).toContain("photos");
  });

  it("postsQuery filters by type and language with pagination slice", () => {
    expect(postsQuery).toContain('_type == "post"');
    expect(postsQuery).toContain("$lang");
    expect(postsQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(postsQuery).toContain("order(publishedAt desc)");
    expect(postsQuery).toContain("[$start...$end]");
    expect(postsQuery).toContain("excerpt");
    expect(postsQuery).toContain("coverImage");
    expect(postsQuery).toContain("author->");
  });

  it("postsCountQuery counts posts by language", () => {
    expect(postsCountQuery).toContain("count(");
    expect(postsCountQuery).toContain('_type == "post"');
    expect(postsCountQuery).toContain("$lang");
    expect(postsCountQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
  });

  it("postBySlugQuery filters by type, language, and slug", () => {
    expect(postBySlugQuery).toContain('_type == "post"');
    expect(postBySlugQuery).toContain("$lang");
    expect(postBySlugQuery).toContain("$slug");
    expect(postBySlugQuery).toContain(
      `${DOCUMENT_I18N_LANGUAGE_FIELD} == $lang`,
    );
    expect(postBySlugQuery).toContain("slug.current == $slug");
    expect(postBySlugQuery).toContain("[0]");
    expect(postBySlugQuery).toContain("body");
    expect(postBySlugQuery).toContain("author->");
    expect(postBySlugQuery).toContain("seo");
  });
});
