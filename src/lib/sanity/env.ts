/** Sanity + site env accessors. Copy .env.example → .env.local and fill values. */

import { env as publicEnv } from "$env/dynamic/public";

// Prefer $env/dynamic/* (SvelteKit) over import.meta.env / process.env —
// private and public vars from .env.local are not reliably on import.meta.env.

export const REQUIRED_PUBLIC_ENV_KEYS = [
  "PUBLIC_SANITY_PROJECT_ID",
  "PUBLIC_SANITY_DATASET",
  "PUBLIC_SITE_URL",
] as const;

export const REQUIRED_SERVER_ENV_KEYS = [
  "SANITY_API_TOKEN",
  "SANITY_READ_TOKEN",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "GA4_MEASUREMENT_ID",
  "CAL_COM_LINK",
] as const;

export type PublicEnvKey = (typeof REQUIRED_PUBLIC_ENV_KEYS)[number];
export type ServerEnvKey = (typeof REQUIRED_SERVER_ENV_KEYS)[number];

function readPublic(key: string): string {
  // 1) import.meta.env — populated by Vite and vi.stubEnv in tests
  // 2) $env/dynamic/public — reliable in SvelteKit server runtime for .env.local
  const fromVite = (import.meta.env as Record<string, string | undefined>)[key];
  if (typeof fromVite === "string" && fromVite.trim()) {
    return fromVite.trim();
  }
  const fromSvelte = (publicEnv as Record<string, string | undefined>)[key];
  if (typeof fromSvelte === "string" && fromSvelte.trim()) {
    return fromSvelte.trim();
  }
  return "";
}

export function parseSanityProjectId(raw: string): string {
  const id = raw.trim();
  if (!id) throw new Error("Sanity project id is required");
  return id;
}

export function isSanityConfigured(): boolean {
  const projectId = readPublic("PUBLIC_SANITY_PROJECT_ID");
  return projectId.length > 0 && projectId !== "your_project_id";
}

export function getPublicSanityConfig(): {
  projectId: string;
  dataset: string;
} {
  const projectId = parseSanityProjectId(
    readPublic("PUBLIC_SANITY_PROJECT_ID"),
  );
  const dataset = readPublic("PUBLIC_SANITY_DATASET") || "production";
  return { projectId, dataset };
}

export function getPublicSiteUrl(): string {
  return readPublic("PUBLIC_SITE_URL") || "http://localhost:5173";
}
