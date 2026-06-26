import type { SiteSettings } from "$sanity/types";

export function mockSiteSettings(
  overrides: Partial<SiteSettings> = {},
): SiteSettings {
  return {
    _id: "siteSettings",
    _type: "siteSettings",
    brandName: "Sergine Hougoue",
    contactEmail: "serginehougoue@gmail.com",
    contactPhone: "438-462-6015",
    whatsappNumber: "14384626015",
    tagline: "Courtier immobilier Montréal & Rive-Nord",
    defaultSEO: {
      metaTitle: "Sergine Hougoue | Courtier immobilier Montréal & Rive-Nord",
      metaDescription:
        "Achat, vente et investissement immobilier avec Sergine Hougoue. Accompagnement personnalisé pour premiers acheteurs et propriétaires au Québec.",
    },
    ...overrides,
  } satisfies SiteSettings;
}
