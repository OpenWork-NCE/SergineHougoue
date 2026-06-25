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
  it("exports four schema types with expected names", () => {
    expect(schemaTypes).toHaveLength(4);
    expect(schemaTypes.map((t) => t.name)).toEqual([
      "siteSettings",
      "teamMember",
      "testimonial",
      "partner",
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
});
