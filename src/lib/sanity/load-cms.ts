import type { Locale } from "$i18n/locales";
import { createSanityClient } from "./client";
import { isSanityConfigured } from "./env";
import {
  allPropertiesQuery,
  allPostsSitemapQuery,
  allPropertiesSitemapQuery,
  featuredPropertiesQuery,
  partnersQuery,
  postBySlugQuery,
  postsCountQuery,
  postsQuery,
  propertyBySlugQuery,
  soldPropertiesQuery,
  siteSettingsQuery,
  teamMembersQuery,
  testimonialsQuery,
} from "./queries";
import type {
  Partner,
  Post,
  Property,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";

export const POSTS_PER_PAGE = 6;

export type CmsHomeData = {
  siteSettings: SiteSettings | null;
  featuredProperties: Property[];
  testimonials: Testimonial[];
};

export type CmsAboutData = {
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
};

export type CmsListingsData = {
  properties: Property[];
};

export type CmsTransactionsData = {
  soldProperties: Property[];
};

export type CmsTeamPartnersData = {
  teamMembers: TeamMember[];
  partners: Partner[];
};

export type CmsPostsData = {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CmsContactData = {
  siteSettings: SiteSettings | null;
};

const EMPTY_HOME: CmsHomeData = {
  siteSettings: null,
  featuredProperties: [],
  testimonials: [],
};

const EMPTY_ABOUT: CmsAboutData = {
  teamMembers: [],
  testimonials: [],
};

const EMPTY_LISTINGS: CmsListingsData = {
  properties: [],
};

const EMPTY_TRANSACTIONS: CmsTransactionsData = {
  soldProperties: [],
};

const EMPTY_TEAM_PARTNERS: CmsTeamPartnersData = {
  teamMembers: [],
  partners: [],
};

const EMPTY_CONTACT: CmsContactData = {
  siteSettings: null,
};

function emptyPostsData(page: number): CmsPostsData {
  return {
    posts: [],
    total: 0,
    page,
    pageSize: POSTS_PER_PAGE,
    totalPages: 0,
  };
}

export async function loadCmsHomeData(lang: Locale): Promise<CmsHomeData> {
  if (!isSanityConfigured()) {
    return EMPTY_HOME;
  }

  try {
    const client = createSanityClient();
    const [siteSettings, featuredProperties, testimonials] = await Promise.all([
      client.fetch<SiteSettings | null>(siteSettingsQuery),
      client.fetch<Property[]>(featuredPropertiesQuery, { lang }),
      client.fetch<Testimonial[]>(testimonialsQuery, { lang }),
    ]);

    return {
      siteSettings: siteSettings ?? null,
      featuredProperties: featuredProperties ?? [],
      testimonials: testimonials ?? [],
    };
  } catch {
    return EMPTY_HOME;
  }
}

export async function loadCmsAboutData(lang: Locale): Promise<CmsAboutData> {
  if (!isSanityConfigured()) {
    return EMPTY_ABOUT;
  }

  try {
    const client = createSanityClient();
    const [teamMembers, testimonials] = await Promise.all([
      client.fetch<TeamMember[]>(teamMembersQuery, { lang }),
      client.fetch<Testimonial[]>(testimonialsQuery, { lang }),
    ]);

    return {
      teamMembers: teamMembers ?? [],
      testimonials: testimonials ?? [],
    };
  } catch {
    return EMPTY_ABOUT;
  }
}

export async function loadCmsListingsData(
  lang: Locale,
): Promise<CmsListingsData> {
  if (!isSanityConfigured()) {
    return EMPTY_LISTINGS;
  }

  try {
    const client = createSanityClient();
    const properties = await client.fetch<Property[]>(allPropertiesQuery, {
      lang,
    });

    return {
      properties: properties ?? [],
    };
  } catch {
    return EMPTY_LISTINGS;
  }
}

export async function loadCmsTransactionsData(
  lang: Locale,
): Promise<CmsTransactionsData> {
  if (!isSanityConfigured()) {
    return EMPTY_TRANSACTIONS;
  }

  try {
    const client = createSanityClient();
    const soldProperties = await client.fetch<Property[]>(
      soldPropertiesQuery,
      { lang },
    );

    return {
      soldProperties: soldProperties ?? [],
    };
  } catch {
    return EMPTY_TRANSACTIONS;
  }
}

export async function loadCmsTeamPartnersData(
  lang: Locale,
): Promise<CmsTeamPartnersData> {
  if (!isSanityConfigured()) {
    return EMPTY_TEAM_PARTNERS;
  }

  try {
    const client = createSanityClient();
    const [teamMembers, partners] = await Promise.all([
      client.fetch<TeamMember[]>(teamMembersQuery, { lang }),
      client.fetch<Partner[]>(partnersQuery, { lang }),
    ]);

    return {
      teamMembers: teamMembers ?? [],
      partners: partners ?? [],
    };
  } catch {
    return EMPTY_TEAM_PARTNERS;
  }
}

export async function loadCmsPosts(
  lang: Locale,
  page: number,
): Promise<CmsPostsData> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  if (!isSanityConfigured()) {
    return emptyPostsData(safePage);
  }

  try {
    const client = createSanityClient();
    const start = (safePage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    const [posts, total] = await Promise.all([
      client.fetch<Post[]>(postsQuery, { lang, start, end }),
      client.fetch<number>(postsCountQuery, { lang }),
    ]);

    const totalCount = total ?? 0;
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

    return {
      posts: posts ?? [],
      total: totalCount,
      page: safePage,
      pageSize: POSTS_PER_PAGE,
      totalPages,
    };
  } catch {
    return emptyPostsData(safePage);
  }
}

export async function loadCmsPostBySlug(
  lang: Locale,
  slug: string,
): Promise<Post | null> {
  if (!isSanityConfigured()) {
    return null;
  }

  try {
    const client = createSanityClient();
    const post = await client.fetch<Post | null>(postBySlugQuery, {
      lang,
      slug,
    });

    return post ?? null;
  } catch {
    return null;
  }
}

export async function loadCmsContactData(): Promise<CmsContactData> {
  if (!isSanityConfigured()) {
    return EMPTY_CONTACT;
  }

  try {
    const client = createSanityClient();
    const siteSettings = await client.fetch<SiteSettings | null>(
      siteSettingsQuery,
    );

    return {
      siteSettings: siteSettings ?? null,
    };
  } catch {
    return EMPTY_CONTACT;
  }
}

export async function loadCmsPropertyBySlug(
  lang: Locale,
  slug: string,
): Promise<Property | null> {
  if (!isSanityConfigured()) {
    return null;
  }

  try {
    const client = createSanityClient();
    const property = await client.fetch<Property | null>(propertyBySlugQuery, {
      lang,
      slug,
    });

    return property ?? null;
  } catch {
    return null;
  }
}

/**
 * Load ALL properties for sitemap (includes sold; sold still have public /biens/[slug] detail pages).
 * Follows same graceful empty + isSanityConfigured pattern as other loaders.
 */
export async function loadAllCmsProperties(lang: Locale): Promise<Property[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const client = createSanityClient();
    const properties = await client.fetch<Property[]>(
      allPropertiesSitemapQuery,
      { lang },
    );

    return properties ?? [];
  } catch {
    return [];
  }
}

/**
 * Load ALL posts (unpaginated) for sitemap. Posts are always language specific.
 */
export async function loadAllCmsPosts(lang: Locale): Promise<Post[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const client = createSanityClient();
    const posts = await client.fetch<Post[]>(allPostsSitemapQuery, { lang });

    return posts ?? [];
  } catch {
    return [];
  }
}
