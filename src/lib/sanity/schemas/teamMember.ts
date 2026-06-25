import { defineField, defineType } from "sanity";
import { imageWithAlt, orderField, portableTextField } from "./fields";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt({ name: "photo", title: "Photo" }),
    portableTextField({ name: "bio", title: "Bio" }),
    orderField(),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "photo",
    },
  },
});
