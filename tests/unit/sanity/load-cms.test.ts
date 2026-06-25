import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Property, SiteSettings, Testimonial } from "$sanity/types";

const { mockFetch, mockCreateSanityClient, mockIsSanityConfigured } =
  vi.hoisted(() => ({
    mockFetch: vi.fn(),
    mockCreateSanityClient: vi.fn(),
    mockIsSanityConfigured: vi.fn(),
  }));

vi.mock("$sanity/client", () => ({
  createSanityClient: mockCreateSanityClient,
}));

vi.mock("$sanity/env", () => ({
  isSanityConfigured: mockIsSanityConfigured,
}));

import { loadCmsHomeData } from "$sanity/load-cms";

describe("loadCmsHomeData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSanityClient.mockReturnValue({ fetch: mockFetch });
  });

  it("returns empty data when Sanity is not configured", async () => {
    mockIsSanityConfigured.mockReturnValue(false);

    await expect(loadCmsHomeData("fr")).resolves.toEqual({
      siteSettings: null,
      featuredProperties: [],
      testimonials: [],
    });

    expect(mockCreateSanityClient).not.toHaveBeenCalled();
  });

  it("fetches site settings, featured properties, and testimonials with locale", async () => {
    mockIsSanityConfigured.mockReturnValue(true);

    const siteSettings = {
      _id: "siteSettings",
      _type: "siteSettings",
      brandName: "Sergine Hougoue",
      contactEmail: "serginehougoue@gmail.com",
      contactPhone: "438-462-6015",
      whatsappNumber: "14384626015",
      tagline: "Votre partenaire immobilier",
    } satisfies SiteSettings;

    const featuredProperties = [
      {
        _id: "property-1",
        _type: "property",
        title: "Duplex lumineux",
        slug: { current: "duplex" },
        status: "a-vendre",
        price: 749_000,
        address: "4521 rue Saint-Dominique",
        city: "Montréal",
        type: "duplex",
        bedrooms: 4,
        bathrooms: 2,
        area: 1_850,
        publishedAt: "2026-01-01T00:00:00.000Z",
        featured: true,
      },
    ] satisfies Property[];

    const testimonials = [
      {
        _id: "testimonial-1",
        _type: "testimonial",
        quote: "Un accompagnement exceptionnel.",
        authorName: "Marie L.",
        authorContext: "Première acheteuse",
        rating: 5,
        order: 0,
      },
    ] satisfies Testimonial[];

    mockFetch
      .mockResolvedValueOnce(siteSettings)
      .mockResolvedValueOnce(featuredProperties)
      .mockResolvedValueOnce(testimonials);

    await expect(loadCmsHomeData("fr")).resolves.toEqual({
      siteSettings,
      featuredProperties,
      testimonials,
    });

    expect(mockCreateSanityClient).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('_type == "property"'),
      { lang: "fr" },
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('_type == "testimonial"'),
      { lang: "fr" },
    );
  });

  it("returns empty data when Sanity fetch fails", async () => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockFetch.mockRejectedValue(new Error("network error"));

    await expect(loadCmsHomeData("en")).resolves.toEqual({
      siteSettings: null,
      featuredProperties: [],
      testimonials: [],
    });
  });
});
