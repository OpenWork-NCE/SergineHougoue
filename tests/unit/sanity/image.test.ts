import { describe, it, expect, afterEach } from "vitest";
import { urlFor } from "$sanity/image";

describe("sanity image builder", () => {
  const originalProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = import.meta.env.PUBLIC_SANITY_DATASET;

  afterEach(() => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    import.meta.env.PUBLIC_SANITY_DATASET = originalDataset;
  });

  it("urlFor returns a CDN URL containing the Sanity project id", () => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = "test-project-id";
    import.meta.env.PUBLIC_SANITY_DATASET = "production";

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
