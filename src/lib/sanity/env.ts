/** Sanity + site env accessors. Copy .env.example → .env.local and fill values. */

// Use import.meta.env (Vite) which is populated from process.env / Vercel env at build time.
// Using direct access avoids strict named export errors from $env/static/public when vars are missing.
const PUBLIC_SANITY_PROJECT_ID = (import.meta.env.PUBLIC_SANITY_PROJECT_ID as string) || "";
const PUBLIC_SANITY_DATASET = (import.meta.env.PUBLIC_SANITY_DATASET as string) || "production";
const PUBLIC_SITE_URL = (import.meta.env.PUBLIC_SITE_URL as string) || "";

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

export function parseSanityProjectId(raw: string): string {
  const id = raw.trim();
  if (!id) throw new Error("Sanity project id is required");
  return id;
}

export function isSanityConfigured(): boolean {
  const projectId = (PUBLIC_SANITY_PROJECT_ID ?? "").trim();
  return projectId.length > 0 && projectId !== "your_project_id";
}

export function getPublicSanityConfig(): {
  projectId: string;
  dataset: string;
} {
  const projectId = parseSanityProjectId(PUBLIC_SANITY_PROJECT_ID ?? "");
  const dataset = (PUBLIC_SANITY_DATASET ?? "production").trim();
  return { projectId, dataset };
}
