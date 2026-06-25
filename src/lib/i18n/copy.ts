import type { Locale } from "./locales";
import type {
  PartnerCategory,
  PostCategory,
  PropertyStatus,
  PropertyType,
} from "$sanity/types";

export interface NavCopy {
  home: string;
  services: string;
  listings: string;
  transactions: string;
  blog: string;
  about: string;
  contact: string;
  cta: string;
}

export interface WhatsappCopy {
  defaultMessage: string;
  ariaLabel: string;
}

export interface CookieCopy {
  title: string;
  body: string;
  accept: string;
  reject: string;
}

export interface FooterCopy {
  tagline: string;
  sitemapHeading: string;
  contactHeading: string;
  socialHeading: string;
  hours: string;
  privacy: string;
}

export interface HeroCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface HomeCopy {
  featuredProperties: string;
  testimonials: string;
  carouselAriaLabel: string;
  carouselPrevious: string;
  carouselNext: string;
}

export interface CtaStripCopy {
  title: string;
}

export interface AboutCopy {
  eyebrow: string;
  title: string;
  intro: string;
}

export interface ListingsCopy {
  eyebrow: string;
  title: string;
  intro: string;
}

export interface TransactionsCopy {
  eyebrow: string;
  title: string;
  intro: string;
  soldHeading: string;
  partnersHeading: string;
  partnerCategories: Record<PartnerCategory, string>;
}

export interface BlogCopy {
  eyebrow: string;
  title: string;
  intro: string;
  readMore: string;
  categories: Record<PostCategory, string>;
  pagination: {
    previous: string;
    next: string;
    pageLabel: string;
  };
  detail: {
    byAuthor: string;
    publishedOn: string;
  };
}

export interface ServicesCopy {
  eyebrow: string;
  title: string;
  intro: string;
}

export interface PropertyDetailCopy {
  specs: string;
  description: string;
  features: string;
  location: string;
  mapLink: string;
  contactCta: string;
  type: string;
  status: string;
  price: string;
}

export interface PropertyCopy {
  viewDetail: string;
  beds: string;
  baths: string;
  area: string;
  types: Record<PropertyType, string>;
  statuses: Record<PropertyStatus, string>;
  detail: PropertyDetailCopy;
}

export interface SiteCopy {
  nav: NavCopy;
  whatsapp: WhatsappCopy;
  cookie: CookieCopy;
  footer: FooterCopy;
  hero: HeroCopy;
  home: HomeCopy;
  ctaStrip: CtaStripCopy;
  about: AboutCopy;
  services: ServicesCopy;
  listings: ListingsCopy;
  transactions: TransactionsCopy;
  blog: BlogCopy;
  property: PropertyCopy;
}

const fr: SiteCopy = {
  nav: {
    home: "Accueil",
    services: "Services",
    listings: "Biens",
    transactions: "Transactions",
    blog: "Blogue",
    about: "À propos",
    contact: "Contact",
    cta: "Prendre rendez-vous",
  },
  whatsapp: {
    defaultMessage: "Bonjour Sergine, je vous contacte depuis votre site web.",
    ariaLabel: "Contacter Sergine par WhatsApp",
  },
  cookie: {
    title: "Cookies et confidentialité",
    body: "Ce site utilise Google Analytics pour améliorer votre expérience. Vos données sont anonymisées.",
    accept: "Accepter",
    reject: "Refuser",
  },
  footer: {
    tagline:
      "Courtier immobilier résidentiel et commercial — VENDIRECT, certifiée OACIQ.",
    sitemapHeading: "Plan du site",
    contactHeading: "Contact",
    socialHeading: "Réseaux sociaux",
    hours: "Lun–Ven 8h–20h\nSam–Dim 9h–17h",
    privacy: "Politique de confidentialité",
  },
  hero: {
    eyebrow: "01 / Courtier immobilier",
    title: "Construisons votre avenir immobilier",
    subtitle:
      "Résidentiel et commercial — accompagnement sur mesure à Montréal et environs.",
  },
  home: {
    featuredProperties: "Biens en vedette",
    testimonials: "Témoignages",
    carouselAriaLabel: "Carrousel des biens en vedette",
    carouselPrevious: "Bien précédent",
    carouselNext: "Bien suivant",
  },
  ctaStrip: {
    title: "Prêt à passer à l'étape suivante ?",
  },
  about: {
    eyebrow: "03 / À propos",
    title: "À propos",
    intro:
      "Découvrez l'approche humaine et rigoureuse de Sergine Hougoue, courtier immobilier certifiée OACIQ.",
  },
  services: {
    eyebrow: "02 / Services",
    title: "Nos services",
    intro: "Accompagnement pour acheteurs et vendeurs.",
  },
  listings: {
    eyebrow: "02 / Biens",
    title: "Biens",
    intro:
      "Découvrez les propriétés résidentielles et commerciales actuellement offertes à Montréal et environs.",
  },
  transactions: {
    eyebrow: "04 / Transactions",
    title: "Transactions",
    intro:
      "Découvrez les propriétés vendues récemment et les partenaires de confiance qui accompagnent chaque transaction.",
    soldHeading: "Propriétés vendues",
    partnersHeading: "Nos partenaires de confiance",
    partnerCategories: {
      preteur: "Prêteurs",
      notaire: "Notaires",
      inspecteur: "Inspecteurs",
      autre: "Autres partenaires",
    },
  },
  blog: {
    eyebrow: "05 / Blogue",
    title: "Blogue",
    intro:
      "Conseils, tendances du marché et guides pratiques pour vos projets immobiliers à Montréal et sur la Rive-Nord.",
    readMore: "Lire l'article",
    categories: {
      acheter: "Acheter",
      vendre: "Vendre",
      investir: "Investir",
      "mode-de-vie": "Mode de vie",
      marche: "Marché",
    },
    pagination: {
      previous: "Page précédente",
      next: "Page suivante",
      pageLabel: "Page",
    },
    detail: {
      byAuthor: "Par",
      publishedOn: "Publié le",
    },
  },
  property: {
    viewDetail: "Voir le détail",
    beds: "ch.",
    baths: "sdb.",
    area: "pi²",
    detail: {
      specs: "Caractéristiques",
      description: "Description",
      features: "Atouts",
      location: "Emplacement",
      mapLink: "Voir sur Google Maps",
      contactCta: "Demander une visite",
      type: "Type",
      status: "Statut",
      price: "Prix",
    },
    types: {
      unifamiliale: "Unifamiliale",
      plex: "Plex",
      condo: "Condo",
      duplex: "Duplex",
      triplex: "Triplex",
      quadruplex: "Quadruplex",
      quintuplex: "Quintuplex",
      commercial: "Commercial",
    },
    statuses: {
      "a-vendre": "À vendre",
      vendu: "Vendu",
      "en-primeur": "En primeur",
    },
  },
};

const en: SiteCopy = {
  nav: {
    home: "Home",
    services: "Services",
    listings: "Listings",
    transactions: "Transactions",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    cta: "Book a meeting",
  },
  whatsapp: {
    defaultMessage: "Hello Sergine, I am reaching out from your website.",
    ariaLabel: "Contact Sergine on WhatsApp",
  },
  cookie: {
    title: "Cookies & privacy",
    body: "This site uses Google Analytics to improve your experience. Your data is anonymized.",
    accept: "Accept",
    reject: "Reject",
  },
  footer: {
    tagline:
      "Residential and commercial real estate broker — VENDIRECT, OACIQ certified.",
    sitemapHeading: "Sitemap",
    contactHeading: "Contact",
    socialHeading: "Social media",
    hours: "Mon–Fri 8am–8pm\nSat–Sun 9am–5pm",
    privacy: "Privacy policy",
  },
  hero: {
    eyebrow: "01 / Real estate broker",
    title: "Let's build your real estate future",
    subtitle:
      "Residential and commercial — tailored guidance in Montreal and beyond.",
  },
  home: {
    featuredProperties: "Featured listings",
    testimonials: "Testimonials",
    carouselAriaLabel: "Featured listings carousel",
    carouselPrevious: "Previous listing",
    carouselNext: "Next listing",
  },
  ctaStrip: {
    title: "Ready to take the next step?",
  },
  about: {
    eyebrow: "03 / About",
    title: "About",
    intro:
      "Meet Sergine Hougoue — an OACIQ-certified broker offering attentive, rigorous guidance for every real estate goal.",
  },
  services: {
    eyebrow: "02 / Services",
    title: "Our services",
    intro: "Guidance for buyers and sellers.",
  },
  listings: {
    eyebrow: "02 / Listings",
    title: "Listings",
    intro:
      "Browse residential and commercial properties currently available in Montreal and surrounding areas.",
  },
  transactions: {
    eyebrow: "04 / Transactions",
    title: "Transactions",
    intro:
      "Explore recently closed deals and the trusted partners who support every transaction.",
    soldHeading: "Sold properties",
    partnersHeading: "Our trusted partners",
    partnerCategories: {
      preteur: "Lenders",
      notaire: "Notaries",
      inspecteur: "Inspectors",
      autre: "Other partners",
    },
  },
  blog: {
    eyebrow: "05 / Blog",
    title: "Blog",
    intro:
      "Tips, market trends, and practical guides for your real estate projects in Montreal and the North Shore.",
    readMore: "Read article",
    categories: {
      acheter: "Buying",
      vendre: "Selling",
      investir: "Investing",
      "mode-de-vie": "Lifestyle",
      marche: "Market",
    },
    pagination: {
      previous: "Previous page",
      next: "Next page",
      pageLabel: "Page",
    },
    detail: {
      byAuthor: "By",
      publishedOn: "Published on",
    },
  },
  property: {
    viewDetail: "View details",
    beds: "bd",
    baths: "ba",
    area: "sq ft",
    detail: {
      specs: "Specifications",
      description: "Description",
      features: "Features",
      location: "Location",
      mapLink: "View on Google Maps",
      contactCta: "Request a visit",
      type: "Type",
      status: "Status",
      price: "Price",
    },
    types: {
      unifamiliale: "Single-family",
      plex: "Plex",
      condo: "Condo",
      duplex: "Duplex",
      triplex: "Triplex",
      quadruplex: "Quadruplex",
      quintuplex: "Quintuplex",
      commercial: "Commercial",
    },
    statuses: {
      "a-vendre": "For sale",
      vendu: "Sold",
      "en-primeur": "Coming soon",
    },
  },
};

const COPY: Record<Locale, SiteCopy> = { fr, en };

export function getCopy(locale: Locale): SiteCopy {
  return COPY[locale];
}
