import { createClient } from "@sanity/client";
import { getPublicSanityConfig } from "./env";

// Private env - use process.env to avoid "not exported" build errors when vars not set at build time
const SANITY_READ_TOKEN = process.env.SANITY_READ_TOKEN || "";

export function createSanityClient() {
  const { projectId, dataset } = getPublicSanityConfig();

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
    token: SANITY_READ_TOKEN,
  });
}
