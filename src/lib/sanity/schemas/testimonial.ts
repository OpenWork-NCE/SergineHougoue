import { defineField, defineType } from "sanity";
import { imageWithAlt, orderField } from "./fields";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorContext",
      title: "Author context",
      type: "string",
      description: 'e.g. "Premier acheteur, Montréal"',
      validation: (rule) => rule.required(),
    }),
    imageWithAlt({
      name: "photo",
      title: "Author photo",
      required: false,
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5),
    }),
    orderField(),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "quote",
      media: "photo",
    },
  },
});
