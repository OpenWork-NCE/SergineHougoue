import { createClient } from "@sanity/client";
import { config } from "dotenv";
import {
  buildPropertySeedDocument,
  getPropertySeeds,
  getSeedDocuments,
} from "../src/lib/sanity/seed-data.js";
import { SITE_SETTINGS_DOCUMENT_ID } from "../src/lib/sanity/structure.js";

config({ path: ".env.local" });

const token = process.env.SANITY_API_TOKEN?.trim();

if (!token) {
  console.log("SANITY_API_TOKEN not set — skipping Sanity seed.");
  process.exit(0);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = (process.env.PUBLIC_SANITY_DATASET ?? "production").trim();

if (!projectId) {
  console.error("PUBLIC_SANITY_PROJECT_ID is required to seed Sanity.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const force = process.argv.includes("--force");

async function seedSanity(): Promise<void> {
  const existingSiteSettings = await client.fetch<string | null>(
    `*[_type == "siteSettings" && _id == $id][0]._id`,
    { id: SITE_SETTINGS_DOCUMENT_ID },
  );

  // Base seed (settings, testimonials, team) — skip if already present unless --force.
  if (!existingSiteSettings || force) {
    const documents = getSeedDocuments();
    const nonPropertyDocs = documents.filter((d) => d._type !== "property");
    const transaction = client.transaction();
    for (const document of nonPropertyDocs) {
      transaction.createOrReplace(document);
    }
    await transaction.commit();
    console.log(
      `Seeded ${nonPropertyDocs.length} non-property documents (settings / team / testimonials).`,
    );
  } else {
    console.log(
      `siteSettings (${SITE_SETTINGS_DOCUMENT_ID}) already exists — base seed skipped (use --force to re-seed).`,
    );
  }

  // Always upsert all property documents (active listings + sold portfolio).
  // Image files live under static/; CMS stores imagePath until Studio assets are used.
  const propertySeeds = getPropertySeeds();
  const languages = ["fr", "en"] as const;
  const propertyDocs = propertySeeds.flatMap((seed) =>
    languages.map((language) => buildPropertySeedDocument(seed, language)),
  );

  const chunkSize = 20;
  for (let i = 0; i < propertyDocs.length; i += chunkSize) {
    const chunk = propertyDocs.slice(i, i + chunkSize);
    const transaction = client.transaction();
    for (const document of chunk) {
      transaction.createOrReplace(document);
    }
    await transaction.commit();
  }

  const soldCount = propertySeeds.filter((s) => s.status === "vendu").length;
  const listingCount = propertySeeds.filter((s) => s.status !== "vendu").length;
  console.log(
    `Upserted ${propertyDocs.length} property documents (${listingCount} active, ${soldCount} sold) × 2 langs.`,
  );
}

seedSanity().catch((error: unknown) => {
  console.error("Sanity seed failed:", error);
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("Insufficient permissions") || message.includes("403")) {
    console.error(`
The SANITY_API_TOKEN in .env.local needs Editor (or higher) write permissions
to create/update documents. Create a token at:
  https://www.sanity.io/manage → Project → API → Tokens → Add API token (Editor)
Then re-run: npm run seed:sanity

Alternatively import the NDJSON dump:
  npx sanity dataset import scripts/property-seed.ndjson production --replace
`);
  }
  process.exit(1);
});
