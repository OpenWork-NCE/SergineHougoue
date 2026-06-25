import { describe, it, expect, afterEach, vi } from "vitest";

const { mockPublicEnv } = vi.hoisted(() => ({
  mockPublicEnv: {
    PUBLIC_SANITY_PROJECT_ID: "studio-default-project",
    PUBLIC_SANITY_DATASET: "production",
    PUBLIC_SITE_URL: "http://localhost:5173",
  },
}));

vi.mock("$env/static/public", () => ({
  get PUBLIC_SANITY_PROJECT_ID() {
    return mockPublicEnv.PUBLIC_SANITY_PROJECT_ID;
  },
  get PUBLIC_SANITY_DATASET() {
    return mockPublicEnv.PUBLIC_SANITY_DATASET;
  },
  get PUBLIC_SITE_URL() {
    return mockPublicEnv.PUBLIC_SITE_URL;
  },
}));

import config, {
  getStudioSanityConfig,
  STUDIO_I18N_SCHEMA_TYPES,
  STUDIO_SUPPORTED_LANGUAGES,
} from "../../../sanity.config";
import { SITE_SETTINGS_DOCUMENT_ID, structure } from "$sanity/structure";

describe("sanity studio config", () => {
  const originalProjectId = mockPublicEnv.PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = mockPublicEnv.PUBLIC_SANITY_DATASET;

  afterEach(() => {
    mockPublicEnv.PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    mockPublicEnv.PUBLIC_SANITY_DATASET = originalDataset;
  });

  it("registers six schema types", () => {
    expect(config.schema?.types).toHaveLength(6);
    expect(config.schema?.types?.map((type) => type.name)).toEqual([
      "siteSettings",
      "teamMember",
      "testimonial",
      "partner",
      "property",
      "post",
    ]);
  });

  it("resolves projectId and dataset from env helpers", () => {
    mockPublicEnv.PUBLIC_SANITY_PROJECT_ID = "  abc123  ";
    mockPublicEnv.PUBLIC_SANITY_DATASET = " staging ";

    expect(getStudioSanityConfig()).toEqual({
      projectId: "abc123",
      dataset: "staging",
    });
  });

  it("binds projectId and dataset on the default config export", () => {
    expect(typeof config.projectId).toBe("string");
    expect(typeof config.dataset).toBe("string");
    expect(config.projectId.length).toBeGreaterThan(0);
    expect(config.dataset.length).toBeGreaterThan(0);
  });

  it("falls back to placeholder projectId when env is missing", () => {
    mockPublicEnv.PUBLIC_SANITY_PROJECT_ID = "";
    mockPublicEnv.PUBLIC_SANITY_DATASET = "";

    expect(getStudioSanityConfig()).toEqual({
      projectId: "placeholder",
      dataset: "production",
    });
  });

  it("configures document internationalization for content types excluding siteSettings", () => {
    expect(STUDIO_SUPPORTED_LANGUAGES).toEqual([
      { id: "fr", title: "Français" },
      { id: "en", title: "English" },
    ]);
    expect(STUDIO_I18N_SCHEMA_TYPES).toEqual([
      "property",
      "post",
      "teamMember",
      "testimonial",
      "partner",
    ]);
    expect(STUDIO_I18N_SCHEMA_TYPES).not.toContain("siteSettings");
  });

  it("structure includes siteSettings singleton with documentId siteSettings", () => {
    const singletonCalls: Array<{
      schemaType?: string;
      documentId?: string;
    }> = [];
    const listItemCalls: Array<{ id: string; title: string }> = [];

    const mockS = {
      list: () => ({
        title: () => ({
          items: (items: unknown[]) => {
            expect(items).toHaveLength(6);
            return mockS;
          },
        }),
      }),
      listItem: () => ({
        title: (title: string) => ({
          id: (id: string) => {
            listItemCalls.push({ id, title });
            return {
              child: () => ({}),
            };
          },
        }),
      }),
      document: () => ({
        schemaType: (schemaType: string) => ({
          documentId: (documentId: string) => {
            singletonCalls.push({ schemaType, documentId });
            return {};
          },
        }),
      }),
      documentTypeListItems: () => [
        { getId: () => "siteSettings" },
        { getId: () => "teamMember" },
        { getId: () => "testimonial" },
        { getId: () => "partner" },
        { getId: () => "property" },
        { getId: () => "post" },
      ],
    };

    structure(mockS as never);

    expect(listItemCalls).toContainEqual({
      id: SITE_SETTINGS_DOCUMENT_ID,
      title: "Site Settings",
    });
    expect(singletonCalls).toContainEqual({
      schemaType: "siteSettings",
      documentId: SITE_SETTINGS_DOCUMENT_ID,
    });
  });
});