import { defineField } from "sanity";
import type { FieldDefinition } from "sanity";

export type ImageWithAltOptions = {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
};

export function imageWithAlt(options: ImageWithAltOptions): FieldDefinition {
  const { name, title, description, required = true } = options;

  return defineField({
    name,
    title,
    type: "image",
    description,
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        description: "Required for accessibility",
        validation: (rule) => (required ? rule.required() : rule),
      }),
    ],
    validation: (rule) => (required ? rule.required() : rule),
  });
}

export function orderField(): FieldDefinition {
  return defineField({
    name: "order",
    title: "Display order",
    type: "number",
    validation: (rule) => rule.required().min(0),
  });
}

export function enumField(options: {
  name: string;
  title: string;
  values: { title: string; value: string }[];
}): FieldDefinition {
  return defineField({
    name: options.name,
    title: options.title,
    type: "string",
    options: {
      list: options.values,
    },
    validation: (rule) => rule.required(),
  });
}

export function portableTextField(options: {
  name: string;
  title: string;
  required?: boolean;
}): FieldDefinition {
  return defineField({
    name: options.name,
    title: options.title,
    type: "array",
    of: [{ type: "block" }],
    validation: (rule) => (options.required === false ? rule : rule.required()),
  });
}
