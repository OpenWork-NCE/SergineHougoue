import { describe, it, expect } from "vitest";
import type { FieldDefinition, SchemaTypeDefinition } from "sanity";
import { schemaTypes } from "$sanity/schemas";
import { imageWithAlt, orderField } from "$sanity/schemas/fields";

type DocumentSchema = SchemaTypeDefinition & {
  fields?: FieldDefinition[];
  options?: { singleton?: boolean };
};

function findSchema(name: string): DocumentSchema {
  const schema = schemaTypes.find((t) => t.name === name);
  if (!schema) throw new Error(`Schema "${name}" not found`);
  return schema as DocumentSchema;
}

function findField(schema: DocumentSchema, fieldName: string): FieldDefinition {
  const field = schema.fields?.find((f) => f.name === fieldName);
  if (!field)
    throw new Error(`Field "${fieldName}" not found on ${schema.name}`);
  return field;
}

function createMockRule() {
  const calls: string[] = [];
  const rule = {
    required: () => {
      calls.push("required");
      return rule;
    },
    min: (n: number) => {
      calls.push(`min:${n}`);
      return rule;
    },
    max: (n: number) => {
      calls.push(`max:${n}`);
      return rule;
    },
    email: () => {
      calls.push("email");
      return rule;
    },
  };
  return { rule, calls };
}

function runValidation(
  field: FieldDefinition,
): ReturnType<typeof createMockRule>["calls"] {
  const { rule, calls } = createMockRule();
  if (typeof field.validation === "function") {
    field.validation(rule as never);
  }
  return calls;
}

describe("sanity schemas", () => {
  it("exports six schema types with expected names", () => {
    expect(schemaTypes).toHaveLength(6);
    expect(schemaTypes.map((t) => t.name)).toEqual([
      "siteSettings",
      "teamMember",
      "testimonial",
      "partner",
      "property",
      "post",
    ]);
  });

  it("imageWithAlt requires alt text", () => {
    const field = imageWithAlt({ name: "photo", title: "Photo" });
    expect(field.type).toBe("image");

    const altField = field.fields?.find((f) => f.name === "alt");
    expect(altField).toBeDefined();
    expect(altField?.type).toBe("string");
    expect(runValidation(altField!)).toContain("required");
  });

  it("marks siteSettings as a singleton", () => {
    const schema = findSchema("siteSettings");
    expect(schema.options?.singleton).toBe(true);
  });

  it("siteSettings includes required contact and branding fields", () => {
    const schema = findSchema("siteSettings");
    const fieldNames = schema.fields?.map((f) => f.name);
    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "brandName",
        "tagline",
        "contactEmail",
        "contactPhone",
        "whatsappNumber",
        "hoursOfOperation",
        "socialLinks",
        "defaultSEO",
        "cookieConsentCopy",
      ]),
    );

    expect(runValidation(findField(schema, "brandName"))).toContain("required");
    expect(runValidation(findField(schema, "contactEmail"))).toEqual(
      expect.arrayContaining(["required", "email"]),
    );
  });

  it("teamMember uses imageWithAlt for photo and portable text for bio", () => {
    const schema = findSchema("teamMember");
    const photo = findField(schema, "photo");
    expect(photo.type).toBe("image");
    expect(photo.fields?.some((f) => f.name === "alt")).toBe(true);

    const bio = findField(schema, "bio");
    expect(bio.type).toBe("array");
    expect(bio.of).toEqual(expect.arrayContaining([{ type: "block" }]));

    const order = findField(schema, "order");
    expect(order.name).toBe("order");
    expect(order.type).toBe("number");
    expect(runValidation(order)).toEqual(
      expect.arrayContaining(["required", "min:0"]),
    );
    expect(orderField().name).toBe("order");
  });

  it("testimonial constrains rating between 1 and 5", () => {
    const schema = findSchema("testimonial");
    const rating = findField(schema, "rating");
    expect(rating.type).toBe("number");
    expect(runValidation(rating)).toEqual(
      expect.arrayContaining(["required", "min:1", "max:5"]),
    );

    const photo = findField(schema, "photo");
    const altField = photo.fields?.find((f) => f.name === "alt");
    expect(altField).toBeDefined();
    expect(runValidation(altField!)).not.toContain("required");
  });

  it("partner category is a required enum", () => {
    const schema = findSchema("partner");
    const category = findField(schema, "category");
    expect(category.type).toBe("string");
    expect(runValidation(category)).toContain("required");
    expect(category.options?.list).toEqual(
      expect.arrayContaining([
        { title: "Prêteur", value: "preteur" },
        { title: "Notaire", value: "notaire" },
        { title: "Inspecteur", value: "inspecteur" },
        { title: "Autre", value: "autre" },
      ]),
    );
  });

  it("property constrains status and type enums and requires photo alt text", () => {
    const schema = findSchema("property");

    const status = findField(schema, "status");
    expect(status.type).toBe("string");
    expect(runValidation(status)).toContain("required");
    expect(status.options?.list).toEqual(
      expect.arrayContaining([
        { title: "À vendre", value: "a-vendre" },
        { title: "Vendu", value: "vendu" },
        { title: "En primeur", value: "en-primeur" },
      ]),
    );

    const type = findField(schema, "type");
    expect(type.type).toBe("string");
    expect(runValidation(type)).toContain("required");
    expect(type.options?.list).toHaveLength(8);
    expect(type.options?.list).toEqual(
      expect.arrayContaining([
        { title: "Unifamiliale", value: "unifamiliale" },
        { title: "Plex", value: "plex" },
        { title: "Condo", value: "condo" },
        { title: "Duplex", value: "duplex" },
        { title: "Triplex", value: "triplex" },
        { title: "Quadruplex", value: "quadruplex" },
        { title: "Quintuplex", value: "quintuplex" },
        { title: "Commercial", value: "commercial" },
      ]),
    );

    const photos = findField(schema, "photos");
    expect(photos.type).toBe("array");
    const photoItem = photos.of?.[0];
    expect(photoItem?.type).toBe("image");
    const altField = photoItem?.fields?.find((f) => f.name === "alt");
    expect(altField).toBeDefined();
    expect(runValidation(altField!)).toContain("required");

    const slug = findField(schema, "slug");
    expect(slug.type).toBe("slug");
    expect(slug.options?.source).toBe("title");

    const neighborhood = findField(schema, "neighborhood");
    expect(neighborhood.type).toBe("string");
    expect(runValidation(neighborhood)).not.toContain("required");

    const description = findField(schema, "description");
    expect(description.type).toBe("array");
    expect(description.of).toEqual(expect.arrayContaining([{ type: "block" }]));
  });

  it("post constrains excerpt, category, author reference, and seo fields", () => {
    const schema = findSchema("post");

    const excerpt = findField(schema, "excerpt");
    expect(excerpt.type).toBe("string");
    expect(runValidation(excerpt)).toEqual(
      expect.arrayContaining(["required", "max:160"]),
    );

    const category = findField(schema, "category");
    expect(category.type).toBe("string");
    expect(runValidation(category)).toContain("required");
    expect(category.options?.list).toEqual(
      expect.arrayContaining([
        { title: "Acheter", value: "acheter" },
        { title: "Vendre", value: "vendre" },
        { title: "Investir", value: "investir" },
        { title: "Mode de vie", value: "mode-de-vie" },
        { title: "Marché", value: "marche" },
      ]),
    );

    const author = findField(schema, "author");
    expect(author.type).toBe("reference");
    expect(author.to).toEqual([{ type: "teamMember" }]);
    expect(runValidation(author)).toContain("required");

    const coverImage = findField(schema, "coverImage");
    expect(coverImage.type).toBe("image");
    const coverAlt = coverImage.fields?.find((f) => f.name === "alt");
    expect(coverAlt).toBeDefined();
    expect(runValidation(coverAlt!)).toContain("required");

    const seo = findField(schema, "seo");
    expect(seo.type).toBe("object");
    const seoFieldNames = seo.fields?.map((f) => f.name);
    expect(seoFieldNames).toEqual(
      expect.arrayContaining(["metaTitle", "metaDescription", "ogImage"]),
    );
    const ogImage = seo.fields?.find((f) => f.name === "ogImage");
    expect(ogImage?.type).toBe("image");
  });
});
