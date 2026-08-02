import { defineField, defineType } from "sanity";
import { enumField, orderField } from "./fields";

const partnerCategories = [
  { title: "Prêteur", value: "preteur" },
  { title: "Courtier hypothécaire", value: "courtier-hypothecaire" },
  { title: "Notaire", value: "notaire" },
  { title: "Inspecteur", value: "inspecteur" },
  { title: "Autre", value: "autre" },
] as const;

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    enumField({
      name: "category",
      title: "Category",
      values: [...partnerCategories],
    }),
    orderField(),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "logo",
    },
  },
});
