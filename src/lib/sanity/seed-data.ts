import type { PortableTextBlock } from "@portabletext/types";
import { SITE_SETTINGS_DOCUMENT_ID } from "./structure";

export type SeedDocument = {
  _id: string;
  _type: string;
  language?: string;
  [key: string]: unknown;
};

type SupportedLanguage = "fr" | "en";

function block(text: string, key: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
  };
}

function slug(current: string) {
  return { _type: "slug" as const, current };
}

type PropertySeed = {
  id: string;
  slug: string;
  featured: boolean;
  status: "a-vendre" | "vendu" | "en-primeur";
  type:
    | "unifamiliale"
    | "plex"
    | "condo"
    | "duplex"
    | "triplex"
    | "quadruplex"
    | "quintuplex"
    | "commercial";
  price: number;
  address: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: { fr: string[]; en: string[] };
  copy: {
    fr: { title: string; description: string };
    en: { title: string; description: string };
  };
};

const PROPERTY_SEEDS: PropertySeed[] = [
  {
    id: "property-duplex-rosemont",
    slug: "duplex-rosemont",
    featured: true,
    status: "a-vendre",
    type: "duplex",
    price: 749_000,
    address: "4521 rue Saint-Dominique",
    city: "Montréal",
    neighborhood: "Rosemont",
    bedrooms: 4,
    bathrooms: 2,
    area: 1_850,
    features: {
      fr: ["Deux logements lumineux", "Cour arrière privée", "Près du métro"],
      en: ["Two bright units", "Private backyard", "Near the metro"],
    },
    copy: {
      fr: {
        title: "Duplex lumineux à Rosemont",
        description:
          "Duplex bien entretenu avec revenus locatifs solides, idéal pour propriétaire occupant ou investisseur sur la Rive-Nord de Montréal.",
      },
      en: {
        title: "Bright duplex in Rosemont",
        description:
          "Well-maintained duplex with solid rental income, ideal for an owner-occupant or investor on Montreal's north shore.",
      },
    },
  },
  {
    id: "property-condo-griffintown",
    slug: "condo-griffintown",
    featured: true,
    status: "a-vendre",
    type: "condo",
    price: 489_000,
    address: "1200 rue Olier",
    city: "Montréal",
    neighborhood: "Griffintown",
    bedrooms: 2,
    bathrooms: 1,
    area: 920,
    features: {
      fr: ["Plan ouvert", "Balcon avec vue", "Stationnement intérieur"],
      en: ["Open concept layout", "Balcony with views", "Indoor parking"],
    },
    copy: {
      fr: {
        title: "Condo moderne à Griffintown",
        description:
          "Condo contemporain au coeur de Griffintown, à distance de marche des cafés, du canal Lachine et du centre-ville.",
      },
      en: {
        title: "Modern condo in Griffintown",
        description:
          "Contemporary condo in the heart of Griffintown, walking distance to cafés, the Lachine Canal, and downtown.",
      },
    },
  },
  {
    id: "property-unifamiliale-laval",
    slug: "unifamiliale-laval",
    featured: false,
    status: "a-vendre",
    type: "unifamiliale",
    price: 625_000,
    address: "845 rue des Érables",
    city: "Laval",
    neighborhood: "Fabreville",
    bedrooms: 3,
    bathrooms: 2,
    area: 1_420,
    features: {
      fr: ["Garage double", "Sous-sol aménagé", "Quartier familial"],
      en: ["Double garage", "Finished basement", "Family-friendly area"],
    },
    copy: {
      fr: {
        title: "Maison unifamiliale à Laval",
        description:
          "Propriété spacieuse dans un quartier paisible de Laval, parfaite pour une famille cherchant espace et tranquillité.",
      },
      en: {
        title: "Single-family home in Laval",
        description:
          "Spacious property in a quiet Laval neighbourhood, perfect for a family seeking space and calm.",
      },
    },
  },
];

type TestimonialSeed = {
  id: string;
  order: number;
  rating: number;
  copy: {
    fr: { quote: string; authorName: string; authorContext: string };
    en: { quote: string; authorName: string; authorContext: string };
  };
};

const TESTIMONIAL_SEEDS: TestimonialSeed[] = [
  {
    id: "testimonial-marie-claire",
    order: 0,
    rating: 5,
    copy: {
      fr: {
        quote:
          "Sergine nous a guidés avec patience à chaque étape. Nous avons trouvé notre premier condo en moins de trois semaines.",
        authorName: "Marie-Claire B.",
        authorContext: "Première acheteuse, Montréal",
      },
      en: {
        quote:
          "Sergine guided us patiently through every step. We found our first condo in under three weeks.",
        authorName: "Marie-Claire B.",
        authorContext: "First-time buyer, Montreal",
      },
    },
  },
  {
    id: "testimonial-jean-philippe",
    order: 1,
    rating: 5,
    copy: {
      fr: {
        quote:
          "Vente rapide, prix au-dessus de nos attentes et communication claire du début à la fin. Je recommande sans hésiter.",
        authorName: "Jean-Philippe L.",
        authorContext: "Vendeur, Laval",
      },
      en: {
        quote:
          "Quick sale, price above our expectations, and clear communication from start to finish. I recommend without hesitation.",
        authorName: "Jean-Philippe L.",
        authorContext: "Seller, Laval",
      },
    },
  },
];

const TEAM_MEMBER_SEED = {
  id: "team-member-sergine-hougoue",
  order: 0,
  copy: {
    fr: {
      name: "Sergine Hougoue",
      role: "Courtier immobilier résidentiel",
      bio: "Spécialisée dans l'accompagnement des premiers acheteurs et des investisseurs sur la Rive-Nord et à Montréal, Sergine combine expertise locale et écoute attentive pour transformer chaque projet immobilier en réussite.",
    },
    en: {
      name: "Sergine Hougoue",
      role: "Residential real estate broker",
      bio: "Specializing in first-time buyers and investors across Montreal and the North Shore, Sergine pairs local expertise with attentive guidance to turn every real estate goal into a success.",
    },
  },
};

function propertyDocument(
  seed: PropertySeed,
  language: SupportedLanguage,
): SeedDocument {
  const localized = seed.copy[language];
  const features = seed.features[language];

  return {
    _id: `${seed.id}-${language}`,
    _type: "property",
    language,
    title: localized.title,
    slug: slug(seed.slug),
    status: seed.status,
    price: seed.price,
    address: seed.address,
    city: seed.city,
    neighborhood: seed.neighborhood,
    type: seed.type,
    bedrooms: seed.bedrooms,
    bathrooms: seed.bathrooms,
    area: seed.area,
    description: [block(localized.description, `${seed.id}-${language}-desc`)],
    features,
    publishedAt: "2026-01-15T12:00:00.000Z",
    featured: seed.featured,
  };
}

function testimonialDocument(
  seed: TestimonialSeed,
  language: SupportedLanguage,
): SeedDocument {
  const localized = seed.copy[language];

  return {
    _id: `${seed.id}-${language}`,
    _type: "testimonial",
    language,
    quote: localized.quote,
    authorName: localized.authorName,
    authorContext: localized.authorContext,
    rating: seed.rating,
    order: seed.order,
  };
}

function teamMemberDocument(language: SupportedLanguage): SeedDocument {
  const localized = TEAM_MEMBER_SEED.copy[language];

  return {
    _id: `${TEAM_MEMBER_SEED.id}-${language}`,
    _type: "teamMember",
    language,
    name: localized.name,
    role: localized.role,
    bio: [block(localized.bio, `${TEAM_MEMBER_SEED.id}-${language}-bio`)],
    order: TEAM_MEMBER_SEED.order,
  };
}

function siteSettingsDocument(): SeedDocument {
  return {
    _id: SITE_SETTINGS_DOCUMENT_ID,
    _type: "siteSettings",
    brandName: "Sergine Hougoue",
    tagline: "Votre partenaire immobilier sur la Rive-Nord et à Montréal",
    contactEmail: "serginehougoue@gmail.com",
    contactPhone: "438-462-6015",
    whatsappNumber: "14384626015",
    hoursOfOperation:
      "Lun–ven 8h–20h, sam–dim 9h–17h\nMon–Fri 8am–8pm, Sat–Sun 9am–5pm",
    socialLinks: {
      facebook: "https://facebook.com/serginehougoue",
      instagram: "https://instagram.com/serginehougoue",
      linkedin: "https://linkedin.com/in/serginehougoue",
    },
    defaultSEO: {
      metaTitle: "Sergine Hougoue | Courtier immobilier Montréal & Rive-Nord",
      metaDescription:
        "Achat, vente et investissement immobilier avec Sergine Hougoue. Accompagnement personnalisé pour premiers acheteurs et propriétaires au Québec.",
    },
    cookieConsentCopy:
      "Nous utilisons des témoins (cookies) pour analyser le trafic et améliorer votre expérience. Vous pouvez accepter ou refuser le suivi analytique.",
  };
}

/** Returns starter Sanity document payloads for idempotent seeding. */
export function getSeedDocuments(): SeedDocument[] {
  const languages: SupportedLanguage[] = ["fr", "en"];

  return [
    siteSettingsDocument(),
    ...PROPERTY_SEEDS.flatMap((seed) =>
      languages.map((language) => propertyDocument(seed, language)),
    ),
    ...TESTIMONIAL_SEEDS.flatMap((seed) =>
      languages.map((language) => testimonialDocument(seed, language)),
    ),
    ...languages.map((language) => teamMemberDocument(language)),
  ];
}
