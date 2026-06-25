import { createClient } from "@sanity/client";
import { SANITY_READ_TOKEN } from "$env/static/private";
import { getPublicSanityConfig } from "./env";

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
