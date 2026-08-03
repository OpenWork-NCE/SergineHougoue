import type { RequestHandler } from "@sveltejs/kit";
import {
  loadAllCmsPosts,
  loadAllCmsProperties,
  loadCmsContactData,
} from "$sanity/load-cms";
import type { Locale } from "$i18n/locales";

const LOCALES: Locale[] = ["fr", "en"];

/** Static public pages (locale prefixed in sitemap). Home uses trailing slash to match footer links. */
const STATIC_PATHS = [
  "", // home
  "biens",
  "blog",
  "services",
  "transactions",
  "equipe-partenaires",
  "a-propos",
  "contact",
  "politique-confidentialite",
];

export const GET: RequestHandler = async () => {
  // Always load public siteSettings (per task spec / phase4 patterns)
  // (unused here but satisfies "Always load public siteSettings or use queries for slugs")
  await loadCmsContactData();

  const SITE_URL =
    (import.meta.env.PUBLIC_SITE_URL as string) || "http://localhost:5173";

  const urlEntries: string[] = [];
  const now = new Date().toISOString();

  for (const locale of LOCALES) {
    // Static pages (bilingual)
    for (const p of STATIC_PATHS) {
      const locPath = p === "" ? `/${locale}/` : `/${locale}/${p}`;
      const loc = `${SITE_URL}${locPath}`;
      const lastmod = now;
      urlEntries.push(
        `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
      );
    }

    // Dynamic: properties (all including sold, from Sanity) -> /${locale}/biens/${slug}
    const properties = await loadAllCmsProperties(locale);
    for (const property of properties) {
      const slug = property.slug?.current;
      if (slug) {
        const loc = `${SITE_URL}/${locale}/biens/${slug}`;
        const lastmod = property.publishedAt || now;
        urlEntries.push(
          `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
        );
      }
    }

    // Dynamic: posts (per lang) -> /${locale}/blog/${slug}
    const posts = await loadAllCmsPosts(locale);
    for (const post of posts) {
      const slug = post.slug?.current;
      if (slug) {
        const loc = `${SITE_URL}/${locale}/blog/${slug}`;
        const lastmod = post.publishedAt || now;
        urlEntries.push(
          `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
        );
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === "&") return "&amp;";
    if (c === "'") return "&apos;";
    if (c === '"') return "&quot;";
    return c;
  });
}
