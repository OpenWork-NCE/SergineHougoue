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

import {
  loadCmsHomeData,
  loadCmsListingsData,
  loadCmsPropertyBySlug,
} from "$sanity/load-cms";

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

describe("loadCmsListingsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSanityClient.mockReturnValue({ fetch: mockFetch });
  });

  it("returns empty properties when Sanity is not configured", async () => {
    mockIsSanityConfigured.mockReturnValue(false);

    await expect(loadCmsListingsData("fr")).resolves.toEqual({
      properties: [],
    });

    expect(mockCreateSanityClient).not.toHaveBeenCalled();
  });

  it("fetches all active properties with locale", async () => {
    mockIsSanityConfigured.mockReturnValue(true);

    const properties = [
      {
        _id: "property-1",
        _type: "property",
        title: "Duplex lumineux",
        slug: { current: "duplex-rosemont" },
        status: "a-vendre",
        price: 749_000,
        address: "4521 rue Saint-Dominique",
        city: "Montréal",
        type: "duplex",
        bedrooms: 4,
        bathrooms: 2,
        area: 1_850,
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ] satisfies Property[];

    mockFetch.mockResolvedValueOnce(properties);

    await expect(loadCmsListingsData("fr")).resolves.toEqual({ properties });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('status != "vendu"'),
      { lang: "fr" },
    );
  });

  it("returns empty properties when Sanity fetch fails", async () => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockFetch.mockRejectedValue(new Error("network error"));

    await expect(loadCmsListingsData("en")).resolves.toEqual({
      properties: [],
    });
  });
});

describe("loadCmsPropertyBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSanityClient.mockReturnValue({ fetch: mockFetch });
  });

  it("returns null when Sanity is not configured", async () => {
    mockIsSanityConfigured.mockReturnValue(false);

    await expect(
      loadCmsPropertyBySlug("fr", "duplex-rosemont"),
    ).resolves.toBeNull();

    expect(mockCreateSanityClient).not.toHaveBeenCalled();
  });

  it("fetches a single property by slug and locale", async () => {
    mockIsSanityConfigured.mockReturnValue(true);

    const property = {
      _id: "property-duplex-rosemont",
      _type: "property",
      title: "Duplex lumineux à Rosemont",
      slug: { current: "duplex-rosemont" },
      status: "a-vendre",
      price: 749_000,
      address: "4521 rue Saint-Dominique",
      city: "Montréal",
      type: "duplex",
      bedrooms: 4,
      bathrooms: 2,
      area: 1_850,
      description: [
        { _type: "block", children: [{ _type: "span", text: "Description" }] },
      ],
      features: ["Cour arrière privée"],
      publishedAt: "2026-01-01T00:00:00.000Z",
    } satisfies Property;

    mockFetch.mockResolvedValueOnce(property);

    await expect(
      loadCmsPropertyBySlug("fr", "duplex-rosemont"),
    ).resolves.toEqual(property);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("slug.current == $slug"),
      { lang: "fr", slug: "duplex-rosemont" },
    );
  });

  it("returns null when Sanity fetch fails", async () => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockFetch.mockRejectedValue(new Error("network error"));

    await expect(
      loadCmsPropertyBySlug("en", "missing-slug"),
    ).resolves.toBeNull();
  });
});
