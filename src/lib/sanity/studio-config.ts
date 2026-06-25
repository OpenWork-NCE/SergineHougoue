import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { getPublicSanityConfig } from "./env";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

export const STUDIO_SUPPORTED_LANGUAGES = [
  { id: "fr", title: "Français" },
  { id: "en", title: "English" },
] as const;

export const STUDIO_I18N_SCHEMA_TYPES = [
  "property",
  "post",
  "teamMember",
  "testimonial",
  "partner",
] as const;

export function getStudioSanityConfig(): {
  projectId: string;
  dataset: string;
} {
  try {
    return getPublicSanityConfig();
  } catch {
    return { projectId: "placeholder", dataset: "production" };
  }
}

const { projectId, dataset } = getStudioSanityConfig();

const studioConfig = defineConfig({
  name: "default",
  title: "Sergine Hougoue Immo",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [...STUDIO_SUPPORTED_LANGUAGES],
      schemaTypes: [...STUDIO_I18N_SCHEMA_TYPES],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});

export default studioConfig;
