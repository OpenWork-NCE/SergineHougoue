import type { Locale } from "$i18n/locales";
import { createSanityClient } from "./client";
import { isSanityConfigured } from "./env";
import {
  featuredPropertiesQuery,
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

const EMPTY_HOME: CmsHomeData = {
  siteSettings: null,
  featuredProperties: [],
  testimonials: [],
};

const EMPTY_ABOUT: CmsAboutData = {
  teamMembers: [],
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
