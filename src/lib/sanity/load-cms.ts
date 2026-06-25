import type { Locale } from "$i18n/locales";
import { createSanityClient } from "./client";
import { isSanityConfigured } from "./env";
import {
  allPropertiesQuery,
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
};

export type CmsListingsData = {
  properties: Property[];
};

export type CmsTransactionsData = {
  soldProperties: Property[];
  partners: Partner[];
};

export type CmsPostsData = {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const EMPTY_HOME: CmsHomeData = {
  siteSettings: null,
  featuredProperties: [],
  testimonials: [],
};

const EMPTY_ABOUT: CmsAboutData = {
  teamMembers: [],
};

const EMPTY_LISTINGS: CmsListingsData = {
  properties: [],
};

const EMPTY_TRANSACTIONS: CmsTransactionsData = {
  soldProperties: [],
  partners: [],
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
    const teamMembers = await client.fetch<TeamMember[]>(teamMembersQuery, {
      lang,
    });

    return {
      teamMembers: teamMembers ?? [],
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
    const [soldProperties, partners] = await Promise.all([
      client.fetch<Property[]>(soldPropertiesQuery, { lang }),
      client.fetch<Partner[]>(partnersQuery, { lang }),
    ]);

    return {
      soldProperties: soldProperties ?? [],
      partners: partners ?? [],
    };
  } catch {
    return EMPTY_TRANSACTIONS;
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
