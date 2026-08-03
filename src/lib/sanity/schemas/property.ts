import { defineField, defineType } from "sanity";
import { enumField, portableTextField } from "./fields";

const propertyStatuses = [
  { title: "À vendre", value: "a-vendre" },
  { title: "Vendu", value: "vendu" },
  { title: "En primeur", value: "en-primeur" },
] as const;

const propertyTypes = [
  { title: "Unifamiliale", value: "unifamiliale" },
  { title: "Plex", value: "plex" },
  { title: "Condo", value: "condo" },
  { title: "Duplex", value: "duplex" },
  { title: "Triplex", value: "triplex" },
  { title: "Quadruplex", value: "quadruplex" },
  { title: "Quintuplex", value: "quintuplex" },
  { title: "Commercial", value: "commercial" },
] as const;

export const property = defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
    }),
    enumField({
      name: "status",
      title: "Status",
      values: [...propertyStatuses],
    }),
    defineField({
      name: "price",
      title: "Price (CAD)",
      type: "number",
      description:
        "Required for active listings. Optional for sold portfolio when undisclosed.",
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          const status = (context.document as { status?: string } | undefined)
            ?.status;
          if (status === "vendu") return true;
          if (typeof value === "number" && Number.isFinite(value)) return true;
          return "Price is required for active listings";
        }),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      description:
        "Required for active listings. Optional for sold portfolio when undisclosed.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const status = (context.document as { status?: string } | undefined)
            ?.status;
          if (status === "vendu") return true;
          if (typeof value === "string" && value.trim().length > 0) return true;
          return "Address is required for active listings";
        }),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "neighborhood",
      title: "Neighborhood",
      type: "string",
    }),
    enumField({
      name: "type",
      title: "Property type",
      values: [...propertyTypes],
    }),
    defineField({
      name: "bedrooms",
      title: "Bedrooms",
      type: "number",
      description: "Optional for sold portfolio when unknown.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "bathrooms",
      title: "Bathrooms",
      type: "number",
      description: "Optional for sold portfolio when unknown.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "area",
      title: "Area (sq ft)",
      type: "number",
      description: "Optional for sold portfolio when unknown.",
      validation: (rule) => rule.min(0),
    }),
    portableTextField({ name: "description", title: "Description" }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        defineField({
          name: "photo",
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              description: "Required for accessibility",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "imagePath",
      title: "Public image path (fallback)",
      type: "string",
      description:
        "Optional path under the site public root when no Sanity photo is set, e.g. /properties/sold/condo.webp. Prefer uploading to Photos.",
      validation: (rule) =>
        rule.custom((value) => {
          if (value == null || value === "") return true;
          if (typeof value === "string" && value.startsWith("/")) return true;
          return "Path must start with /";
        }),
    }),
    defineField({
      name: "imageAlt",
      title: "Fallback image alt text",
      type: "string",
      description: "Used with public image path when photos are empty.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Controls Home carousel",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "city",
      media: "photos.0",
    },
  },
});
