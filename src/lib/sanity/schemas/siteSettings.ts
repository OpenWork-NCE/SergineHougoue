import { defineField, defineType } from "sanity";
import type { DocumentOptions } from "sanity";

const singletonDocumentOptions = {
  singleton: true,
} as DocumentOptions & { singleton: boolean };

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  options: singletonDocumentOptions,
  fields: [
    defineField({
      name: "brandName",
      title: "Brand name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      description: "E.164 format without + (e.g. 14384626015)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hoursOfOperation",
      title: "Hours of operation",
      type: "text",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
      ],
    }),
    defineField({
      name: "defaultSEO",
      title: "Default SEO",
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
    defineField({
      name: "cookieConsentCopy",
      title: "Cookie consent copy",
      type: "text",
    }),
  ],
});
