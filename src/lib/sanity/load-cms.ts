import type { Locale } from "$i18n/locales";
import { createSanityClient } from "./client";
import { isSanityConfigured } from "./env";
import {
  allPropertiesQuery,
  featuredPropertiesQuery,
  propertyBySlugQuery,
  siteSettingsQuery,
  teamMembersQuery,
  testimonialsQuery,
} from "./queries";
import type { Property, SiteSettings, TeamMember, Testimonial } from "./types";

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
