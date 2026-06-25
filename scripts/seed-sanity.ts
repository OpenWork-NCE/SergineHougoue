import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { getSeedDocuments } from "../src/lib/sanity/seed-data.js";
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

async function seedSanity(): Promise<void> {
  const existingSiteSettings = await client.fetch<string | null>(
    `*[_type == "siteSettings" && _id == $id][0]._id`,
    { id: SITE_SETTINGS_DOCUMENT_ID },
  );

  if (existingSiteSettings) {
    console.log(
      `siteSettings (${SITE_SETTINGS_DOCUMENT_ID}) already exists — skipping seed.`,
    );
    return;
  }

  const documents = getSeedDocuments();
  const transaction = client.transaction();

  for (const document of documents) {
    transaction.createOrReplace(document);
  }

  await transaction.commit();

  const counts = documents.reduce<Record<string, number>>((acc, document) => {
    acc[document._type] = (acc[document._type] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Seeded ${documents.length} documents:`);
  for (const [type, count] of Object.entries(counts)) {
    console.log(`  - ${type}: ${count}`);
  }
}

seedSanity().catch((error: unknown) => {
  console.error("Sanity seed failed:", error);
  process.exit(1);
});
