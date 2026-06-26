import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import { tick } from "svelte";
import SeoHead from "$components/seo/SeoHead.svelte";
import { mockSiteSettings } from "../fixtures/siteSettings";
import { mockPost } from "../fixtures/post";
import type { Locale } from "$i18n/locales";

describe("<SeoHead>", () => {
  beforeEach(() => {
    // ensure clean head between tests
    document.head.innerHTML = "";
    document.title = "";
  });

  afterEach(() => {
    cleanup();
  });

  it("renders title and meta description from props falling back to siteSettings", async () => {
    const siteSettings = mockSiteSettings();
    render(SeoHead, {
      props: {
        locale: "fr" as Locale,
        path: "/fr",
        siteSettings,
      },
    });
    await tick();

    const titleEl = document.querySelector("title");
    expect(titleEl?.textContent).toBe(
      "Sergine Hougoue | Courtier immobilier Montréal & Rive-Nord",
    );
    const desc = document.querySelector('meta[name="description"]');
    expect(desc).not.toBeNull();
    expect(desc).toHaveAttribute(
      "content",
      "Achat, vente et investissement immobilier avec Sergine Hougoue. Accompagnement personnalisé pour premiers acheteurs et propriétaires au Québec.",
    );
  });

  it("prefers explicit title/description/ogImage over defaults", async () => {
    const siteSettings = mockSiteSettings();
    render(SeoHead, {
      props: {
        title: "Custom Page Title",
        description: "Custom desc here.",
        locale: "en" as Locale,
        path: "/en/biens",
        siteSettings,
        // ogImage omitted -> uses default or fallback
      },
    });
    await tick();

    const titleEl = document.querySelector("title");
    expect(titleEl?.textContent).toBe("Custom Page Title");
    const desc = document.querySelector('meta[name="description"]');
    expect(desc?.getAttribute("content")).toBe("Custom desc here.");
  });

  it("renders hreflang alternates and canonical based on path + locale", async () => {
    render(SeoHead, {
      props: {
        locale: "fr" as Locale,
        path: "/fr/biens/duplex-rosemont",
        siteSettings: mockSiteSettings(),
      },
    });
    await tick();

    const frLink = document.querySelector('link[hreflang="fr"]');
    const enLink = document.querySelector('link[hreflang="en"]');
    const xDefault = document.querySelector('link[hreflang="x-default"]');
    const canonical = document.querySelector('link[rel="canonical"]');

    expect(frLink).toHaveAttribute(
      "href",
      "http://localhost:5173/fr/biens/duplex-rosemont",
    );
    expect(enLink).toHaveAttribute(
      "href",
      "http://localhost:5173/en/biens/duplex-rosemont",
    );
    expect(xDefault).toHaveAttribute(
      "href",
      "http://localhost:5173/fr/biens/duplex-rosemont",
    );
    expect(canonical).toHaveAttribute(
      "href",
      "http://localhost:5173/fr/biens/duplex-rosemont",
    );
  });

  it("renders OG tags and twitter card", async () => {
    const siteSettings = mockSiteSettings();
    render(SeoHead, {
      props: {
        title: "OG Test",
        description: "OG desc",
        ogImage: undefined,
        locale: "fr" as Locale,
        path: "/fr",
        siteSettings,
      },
    });
    await tick();

    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "OG Test",
    );
    expect(
      document.querySelector('meta[property="og:description"]'),
    ).toHaveAttribute("content", "OG desc");
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    expect(ogImageMeta).not.toBeNull();
    expect(ogImageMeta?.getAttribute("content")).toMatch(
      /http:\/\/localhost:5173/,
    ); // fallback or resolved

    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
    expect(document.querySelector('meta[property="og:url"]')).not.toBeNull();

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard).toHaveAttribute("content", "summary_large_image");
  });

  it("renders RealEstateAgent JSON-LD with contact from siteSettings and Quebec address", async () => {
    const siteSettings = mockSiteSettings({
      contactPhone: "438-462-6015",
      contactEmail: "serginehougoue@gmail.com",
    });
    render(SeoHead, {
      props: {
        locale: "fr" as Locale,
        path: "/",
        siteSettings,
      },
    });
    await tick();

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(script!.getAttribute("type")).toBe("application/ld+json");
    const txt = (script!.textContent || "").trim();
    // Use data-json (evaluated attr) to get actual JSON in test env (textContent shows literal expr source due to <script> handling)
    const jsonStr = script!.getAttribute("data-json") || txt;
    const json = JSON.parse(jsonStr);
    expect(json["@type"]).toBe("RealEstateAgent");
    expect(json.telephone).toBe("+14384626015");
    expect(json.email).toBe("serginehougoue@gmail.com");
    expect(json.address).toBeDefined();
    expect(json.address.addressCountry).toBe("CA");
    expect(json.address.addressLocality).toBe("Montréal");
    expect(json.address.addressRegion).toBe("QC");
    expect(json.name).toBe("Sergine Hougoue");
    expect(json.url).toBe("http://localhost:5173");
  });

  it("uses post seo fields when provided via overrides (for blog)", async () => {
    const post = mockPost({
      title: "Plex Guide",
      seo: {
        metaTitle: "Plex SEO Title",
        metaDescription: "Plex SEO desc",
      },
    });
    render(SeoHead, {
      props: {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        locale: "fr" as Locale,
        path: "/fr/blog/acheter-plex-montreal",
        siteSettings: mockSiteSettings(),
      },
    });
    await tick();

    const titleEl = document.querySelector("title");
    expect(titleEl?.textContent).toBe("Plex SEO Title");
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).toBe("Plex SEO desc");
  });
});
