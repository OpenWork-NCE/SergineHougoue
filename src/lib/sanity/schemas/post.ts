import { defineField, defineType } from "sanity";
import { enumField, imageWithAlt, portableTextField } from "./fields";

const postCategories = [
  { title: "Acheter", value: "acheter" },
  { title: "Vendre", value: "vendre" },
  { title: "Investir", value: "investir" },
  { title: "Mode de vie", value: "mode-de-vie" },
  { title: "Marché", value: "marche" },
] as const;

export const post = defineType({
  name: "post",
  title: "Blog post",
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
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "string",
      description: "Short summary (max 160 characters)",
      validation: (rule) => rule.required().max(160),
    }),
    imageWithAlt({ name: "coverImage", title: "Cover image" }),
    portableTextField({ name: "body", title: "Body" }),
    enumField({
      name: "category",
      title: "Category",
      values: [...postCategories],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "teamMember" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta title",
          type: "string",
        }),
        defineField({
          name: "metaDescription",
          title: "Meta description",
          type: "text",
        }),
        defineField({
          name: "ogImage",
          title: "OG image",
          type: "image",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
