import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const SITE_URL =
    (import.meta.env.PUBLIC_SITE_URL as string) || "http://localhost:5173";
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
