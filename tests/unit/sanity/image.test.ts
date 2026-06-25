import { describe, it, expect, afterEach, vi } from "vitest";

const { mockPublicEnv } = vi.hoisted(() => ({
  mockPublicEnv: {
    PUBLIC_SANITY_PROJECT_ID: "",
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

import { urlFor } from "$sanity/image";

describe("sanity image builder", () => {
  const originalProjectId = mockPublicEnv.PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = mockPublicEnv.PUBLIC_SANITY_DATASET;

  afterEach(() => {
    mockPublicEnv.PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    mockPublicEnv.PUBLIC_SANITY_DATASET = originalDataset;
  });

  it("urlFor returns a CDN URL containing the Sanity project id", () => {
    mockPublicEnv.PUBLIC_SANITY_PROJECT_ID = "test-project-id";
    mockPublicEnv.PUBLIC_SANITY_DATASET = "production";

    const image = {
      _type: "image" as const,
      asset: {
        _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
        _type: "reference" as const,
      },
    };

    const url = urlFor(image).width(800).url();

    expect(url).toContain("test-project-id");
    expect(url).toContain("cdn.sanity.io");
    expect(url).toContain("w=800");
  });
});