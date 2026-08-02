import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";
import { GET as sitemapGET } from "../../../src/routes/sitemap.xml/+server";
import { GET as robotsGET } from "../../../src/routes/robots.txt/+server";
import { mockProperty } from "../../fixtures/property";
import { mockPost } from "../../fixtures/post";

vi.mock("$sanity/load-cms", () => ({
  loadCmsContactData: vi.fn(),
  loadAllCmsProperties: vi.fn(),
  loadAllCmsPosts: vi.fn(),
}));

import {
  loadCmsContactData,
  loadAllCmsProperties,
  loadAllCmsPosts,
} from "$sanity/load-cms";

function makeGetEvent(path = "/sitemap.xml"): RequestEvent {
  const url = new URL(`http://localhost:5173${path}`);
  return {
    url,
    request: new Request(url),
  } as unknown as RequestEvent;
}

describe("GET /sitemap.xml", () => {
  beforeEach(() => {
    vi.mocked(loadCmsContactData).mockResolvedValue({ siteSettings: null });
    vi.mocked(loadAllCmsProperties).mockResolvedValue([]);
    vi.mocked(loadAllCmsPosts).mockResolvedValue([]);
  });

  it("returns 200 with application/xml content-type", async () => {
    const response = await sitemapGET(makeGetEvent());
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/xml");
  });

  it("includes all static locale-prefixed routes for fr and en (at minimum)", async () => {
    const response = await sitemapGET(makeGetEvent());
    const xml = await response.text();

    // home
    expect(xml).toContain("<loc>http://localhost:5173/fr/</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/en/</loc>");
    // key sections
    expect(xml).toContain("<loc>http://localhost:5173/fr/biens</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/en/biens</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/fr/blog</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/en/blog</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/fr/services</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/en/services</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/fr/transactions</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/en/transactions</loc>");
    expect(xml).toContain(
      "<loc>http://localhost:5173/fr/equipe-partenaires</loc>",
    );
    expect(xml).toContain(
      "<loc>http://localhost:5173/en/equipe-partenaires</loc>",
    );
    expect(xml).toContain("<loc>http://localhost:5173/fr/a-propos</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/en/a-propos</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/fr/contact</loc>");
    expect(xml).toContain("<loc>http://localhost:5173/en/contact</loc>");
    expect(xml).toContain(
      "<loc>http://localhost:5173/fr/politique-confidentialite</loc>",
    );
    expect(xml).toContain(
      "<loc>http://localhost:5173/en/politique-confidentialite</loc>",
    );
  });

  it("includes lastmod for static entries (uses ISO date)", async () => {
    const response = await sitemapGET(makeGetEvent());
    const xml = await response.text();
    // At least one lastmod present (for statics use current or constant)
    expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}/);
  });

  it("includes dynamic property and post URLs with their slugs when CMS data present (bilingual)", async () => {
    const frProp = mockProperty({
      slug: { current: "duplex-rosemont" },
      publishedAt: "2026-01-10T00:00:00.000Z",
    });
    const enProp = mockProperty({
      slug: { current: "duplex-rosemont-en" },
      publishedAt: "2026-01-11T00:00:00.000Z",
    });
    const frPost = mockPost({
      slug: { current: "acheter-plex-montreal" },
      publishedAt: "2026-01-15T00:00:00.000Z",
    });

    // Simulate per-locale calls from impl
    vi.mocked(loadAllCmsProperties).mockImplementation(async (lang: any) =>
      lang === "fr" ? [frProp] : lang === "en" ? [enProp] : [],
    );
    vi.mocked(loadAllCmsPosts).mockImplementation(async (lang: any) =>
      lang === "fr" ? [frPost] : [],
    );

    const response = await sitemapGET(makeGetEvent());
    const xml = await response.text();

    expect(xml).toContain(
      "<loc>http://localhost:5173/fr/biens/duplex-rosemont</loc>",
    );
    expect(xml).toContain(
      "<loc>http://localhost:5173/en/biens/duplex-rosemont-en</loc>",
    );
    expect(xml).toContain(
      "<loc>http://localhost:5173/fr/blog/acheter-plex-montreal</loc>",
    );
    expect(xml).toContain("<lastmod>2026-01-10"); // from prop
    expect(xml).toContain("<lastmod>2026-01-15"); // from post
  });

  it("is graceful when no CMS data (still has statics, no crash)", async () => {
    vi.mocked(loadAllCmsProperties).mockResolvedValue([]);
    vi.mocked(loadAllCmsPosts).mockResolvedValue([]);

    const response = await sitemapGET(makeGetEvent());
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(xml).toContain("<loc>http://localhost:5173/fr/</loc>");
    expect(xml).not.toContain("/biens/duplex"); // no dynamic
  });
});

describe("GET /robots.txt", () => {
  beforeEach(() => {
    // robots does not depend on cms loads
  });

  it("returns 200 with text/plain content-type", async () => {
    const response = await robotsGET(makeGetEvent("/robots.txt"));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/plain");
  });

  it("contains User-agent: *, Allow: / and Sitemap: .../sitemap.xml using PUBLIC_SITE_URL", async () => {
    const response = await robotsGET(makeGetEvent("/robots.txt"));
    const txt = await response.text();

    expect(txt).toContain("User-agent: *");
    expect(txt).toContain("Allow: /");
    expect(txt).toMatch(/Sitemap: http:\/\/localhost:5173\/sitemap\.xml/);
  });
});
