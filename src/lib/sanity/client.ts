import { createClient, type SanityClient } from "@sanity/client";
import { env } from "$env/dynamic/private";
import { getPublicSanityConfig } from "./env";

/**
 * Server-side Sanity client.
 * Uses $env/dynamic/private so tokens from .env.local are available in Vite/SvelteKit
 * (raw process.env is unreliable for private vars in dev).
 */
export function createSanityClient(): SanityClient {
  const { projectId, dataset } = getPublicSanityConfig();
  const token =
    env.SANITY_READ_TOKEN?.trim() ||
    env.SANITY_API_TOKEN?.trim() ||
    undefined;

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    // API (not CDN) so seed / Studio edits show immediately
    useCdn: false,
    token,
  });
}
