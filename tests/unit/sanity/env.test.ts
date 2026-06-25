import { describe, it, expect } from "vitest";
import {
  REQUIRED_PUBLIC_ENV_KEYS,
  REQUIRED_SERVER_ENV_KEYS,
  parseSanityProjectId,
} from "$sanity/env";

describe("sanity env", () => {
  it("lists all required public env keys", () => {
    expect(REQUIRED_PUBLIC_ENV_KEYS).toEqual([
      "PUBLIC_SANITY_PROJECT_ID",
      "PUBLIC_SANITY_DATASET",
      "PUBLIC_SITE_URL",
    ]);
  });

  it("lists all required server env keys", () => {
    expect(REQUIRED_SERVER_ENV_KEYS).toEqual([
      "SANITY_API_TOKEN",
      "SANITY_READ_TOKEN",
      "RESEND_API_KEY",
      "CONTACT_TO_EMAIL",
      "GA4_MEASUREMENT_ID",
      "CAL_COM_LINK",
    ]);
  });

  it("parseSanityProjectId rejects empty string", () => {
    expect(() => parseSanityProjectId("")).toThrow(/project id/i);
  });

  it("parseSanityProjectId accepts non-empty trimmed id", () => {
    expect(parseSanityProjectId("  abc123  ")).toBe("abc123");
  });
});
