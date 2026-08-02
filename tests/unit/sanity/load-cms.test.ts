import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  Partner,
  Post,
  Property,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "$sanity/types";

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
  loadCmsPostBySlug,
  loadCmsPosts,
  loadCmsPropertyBySlug,
  loadCmsTeamPartnersData,
  loadCmsTransactionsData,
  POSTS_PER_PAGE,
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

describe("loadCmsTransactionsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSanityClient.mockReturnValue({ fetch: mockFetch });
  });

  it("returns empty data when Sanity is not configured", async () => {
    mockIsSanityConfigured.mockReturnValue(false);

    await expect(loadCmsTransactionsData("fr")).resolves.toEqual({
      soldProperties: [],
    });

    expect(mockCreateSanityClient).not.toHaveBeenCalled();
  });

  it("fetches sold properties with locale and omits partners", async () => {
    mockIsSanityConfigured.mockReturnValue(true);

    const soldProperties = [
      {
        _id: "property-sold-1",
        _type: "property",
        title: "Condo vendu",
        slug: { current: "condo-vendu" },
        status: "vendu",
        price: 499_000,
        address: "123 rue Example",
        city: "Montréal",
        type: "condo",
        bedrooms: 2,
        bathrooms: 1,
        area: 900,
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ] satisfies Property[];

    mockFetch.mockResolvedValueOnce(soldProperties);

    const result = await loadCmsTransactionsData("fr");

    expect(result).toEqual({ soldProperties });
    expect(result).not.toHaveProperty("partners");

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('status == "vendu"'),
      { lang: "fr" },
    );
  });

  it("returns empty data when Sanity fetch fails", async () => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockFetch.mockRejectedValue(new Error("network error"));

    await expect(loadCmsTransactionsData("en")).resolves.toEqual({
      soldProperties: [],
    });
  });
});

describe("loadCmsTeamPartnersData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSanityClient.mockReturnValue({ fetch: mockFetch });
  });

  it("returns empty data when Sanity is not configured", async () => {
    mockIsSanityConfigured.mockReturnValue(false);

    await expect(loadCmsTeamPartnersData("fr")).resolves.toEqual({
      teamMembers: [],
      partners: [],
    });

    expect(mockCreateSanityClient).not.toHaveBeenCalled();
  });

  it("fetches team members and partners with locale", async () => {
    mockIsSanityConfigured.mockReturnValue(true);

    const teamMembers = [
      {
        _id: "team-member-1",
        _type: "teamMember",
        name: "Sergine Hougoue",
        role: "Courtier immobilier résidentiel",
        photo: {
          asset: { _ref: "image-team-1", _type: "reference" },
        },
        order: 0,
      },
    ] satisfies TeamMember[];

    const partners = [
      {
        _id: "partner-1",
        _type: "partner",
        name: "Banque Exemple",
        logo: {
          asset: { _ref: "image-partner-1", _type: "reference" },
        },
        url: "https://example.com",
        category: "preteur",
        order: 0,
      },
      {
        _id: "partner-2",
        _type: "partner",
        name: "Courtier Hypo",
        logo: {
          asset: { _ref: "image-partner-2", _type: "reference" },
        },
        url: "https://hypo.example.com",
        category: "courtier-hypothecaire",
        order: 1,
      },
    ] satisfies Partner[];

    mockFetch
      .mockResolvedValueOnce(teamMembers)
      .mockResolvedValueOnce(partners);

    await expect(loadCmsTeamPartnersData("fr")).resolves.toEqual({
      teamMembers,
      partners,
    });

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('_type == "teamMember"'),
      { lang: "fr" },
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('_type == "partner"'),
      { lang: "fr" },
    );
  });

  it("returns empty data when Sanity fetch fails", async () => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockFetch.mockRejectedValue(new Error("network error"));

    await expect(loadCmsTeamPartnersData("en")).resolves.toEqual({
      teamMembers: [],
      partners: [],
    });
  });
});

describe("loadCmsPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSanityClient.mockReturnValue({ fetch: mockFetch });
  });

  it("returns empty paginated data when Sanity is not configured", async () => {
    mockIsSanityConfigured.mockReturnValue(false);

    await expect(loadCmsPosts("fr", 2)).resolves.toEqual({
      posts: [],
      total: 0,
      page: 2,
      pageSize: POSTS_PER_PAGE,
      totalPages: 0,
    });

    expect(mockCreateSanityClient).not.toHaveBeenCalled();
  });

  it("fetches paginated posts and total count with locale", async () => {
    mockIsSanityConfigured.mockReturnValue(true);

    const posts = [
      {
        _id: "post-1",
        _type: "post",
        title: "Premier acheteur sur la Rive-Nord",
        slug: { current: "premier-acheteur-rive-nord" },
        excerpt: "Conseils pour bien préparer votre premier achat.",
        coverImage: {
          asset: { _ref: "image-post-1", _type: "reference" },
        },
        category: "acheter",
        author: {
          _id: "team-member-1",
          name: "Sergine Hougoue",
          photo: {
            asset: { _ref: "image-author-1", _type: "reference" },
          },
        },
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
    ] satisfies Post[];

    mockFetch.mockResolvedValueOnce(posts).mockResolvedValueOnce(7);

    await expect(loadCmsPosts("fr", 2)).resolves.toEqual({
      posts,
      total: 7,
      page: 2,
      pageSize: POSTS_PER_PAGE,
      totalPages: 2,
    });

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('_type == "post"'),
      { lang: "fr", start: 6, end: 12 },
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("count("),
      { lang: "fr" },
    );
  });

  it("returns empty paginated data when Sanity fetch fails", async () => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockFetch.mockRejectedValue(new Error("network error"));

    await expect(loadCmsPosts("en", 1)).resolves.toEqual({
      posts: [],
      total: 0,
      page: 1,
      pageSize: POSTS_PER_PAGE,
      totalPages: 0,
    });
  });
});

describe("loadCmsPostBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateSanityClient.mockReturnValue({ fetch: mockFetch });
  });

  it("returns null when Sanity is not configured", async () => {
    mockIsSanityConfigured.mockReturnValue(false);

    await expect(
      loadCmsPostBySlug("fr", "acheter-plex-montreal"),
    ).resolves.toBeNull();

    expect(mockCreateSanityClient).not.toHaveBeenCalled();
  });

  it("fetches a single post by slug and locale", async () => {
    mockIsSanityConfigured.mockReturnValue(true);

    const post = {
      _id: "post-acheter-plex-montreal",
      _type: "post",
      title: "Acheter un plex à Montréal",
      slug: { current: "acheter-plex-montreal" },
      excerpt: "Guide pratique pour les investisseurs.",
      coverImage: {
        asset: { _ref: "image-post-cover", _type: "reference" },
      },
      body: [
        { _type: "block", children: [{ _type: "span", text: "Contenu" }] },
      ],
      category: "investir",
      author: {
        _id: "team-member-1",
        name: "Sergine Hougoue",
        photo: {
          asset: { _ref: "image-author-1", _type: "reference" },
        },
      },
      publishedAt: "2026-01-01T00:00:00.000Z",
    } satisfies Post;

    mockFetch.mockResolvedValueOnce(post);

    await expect(
      loadCmsPostBySlug("fr", "acheter-plex-montreal"),
    ).resolves.toEqual(post);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("slug.current == $slug"),
      { lang: "fr", slug: "acheter-plex-montreal" },
    );
  });

  it("returns null when Sanity fetch fails", async () => {
    mockIsSanityConfigured.mockReturnValue(true);
    mockFetch.mockRejectedValue(new Error("network error"));

    await expect(
      loadCmsPostBySlug("en", "missing-slug"),
    ).resolves.toBeNull();
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
