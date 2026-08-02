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
  teamPartners: string;
  about: string;
  contact: string;
  cta: string;
}

export interface ThemeCopy {
  toLight: string;
  toDark: string;
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
  territoryTitle: string;
  territoryIntro: string;
}

export interface CtaStripCopy {
  title: string;
}

export interface AboutCopy {
  eyebrow: string;
  title: string;
  intro: string;
  bioFallback: string;
  journeyTitle: string;
  journey: string;
  approachTitle: string;
  approach: string[];
  expertiseTitle: string;
  expertise: Array<{
    title: string;
    description: string;
  }>;
  testimonialsTitle: string;
  testimonialsHeading: string;
  ctaTitle: string;
  ctaSubtitle: string;
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
}

export interface TeamPartnersCopy {
  eyebrow: string;
  title: string;
  intro: string;
  teamHeading: string;
  partnersHeading: string;
  emptyPartners: string;
  teamFallbackName: string;
  teamFallbackRole: string;
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

export interface ContactCopy {
  eyebrow: string;
  title: string;
  intro: string;
  methodsHeading: string;
  phoneLabel: string;
  emailLabel: string;
  whatsappLabel: string;
  hoursLabel: string;
  formHeading: string;
  bookingHeading: string;
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
  theme: ThemeCopy;
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
  teamPartners: TeamPartnersCopy;
  blog: BlogCopy;
  contact: ContactCopy;
  property: PropertyCopy;
}

const fr: SiteCopy = {
  nav: {
    home: "Accueil",
    services: "Services",
    listings: "Biens",
    transactions: "Transactions",
    blog: "Blogue",
    teamPartners: "Équipe et partenaires",
    about: "À propos",
    contact: "Contact",
    cta: "Prendre rendez-vous",
  },
  theme: {
    toLight: "Passer en mode clair",
    toDark: "Passer en mode sombre",
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
    territoryTitle: "Partout au Québec",
    territoryIntro:
      "J'accompagne acheteurs et vendeurs dans les 17 régions administratives du Québec.",
  },
  ctaStrip: {
    title: "Prêt à passer à l'étape suivante ?",
  },
  about: {
    eyebrow: "03 / À propos",
    title: "À propos",
    intro:
      "Découvrez l'approche humaine et rigoureuse de Sergine Hougoue, courtier immobilier certifiée OACIQ.",
    bioFallback:
      "Courtier immobilier certifiée OACIQ basée à Montréal, Sergine Hougoue offre un accompagnement attentif et rigoureux aux acheteurs et investisseurs sur la Rive-Nord et à Montréal.",
    journeyTitle: "Mon parcours",
    journey:
      "Forte d’une solide expérience terrain et d’une connaissance approfondie du marché local, j’aide les premiers acheteurs à franchir le pas en toute confiance, tout en guidant les investisseurs vers des opportunités à fort potentiel. Mon engagement : transparence totale, écoute active et résultats concrets.",
    approachTitle: "Mon approche",
    approach: [
      "Écoute attentive de vos objectifs et contraintes",
      "Analyse rigoureuse du marché et des opportunités",
      "Accompagnement personnalisé à chaque étape",
      "Réseau de partenaires de confiance (notaires, inspecteurs, prêteurs)",
    ],
    expertiseTitle: "Mon expertise",
    expertise: [
      {
        title: "Premiers acheteurs",
        description:
          "Accompagnement complet pour votre premier achat : de la recherche au financement, en passant par les visites et les négociations.",
      },
      {
        title: "Investisseurs",
        description:
          "Identification d’opportunités à fort potentiel, analyse de rentabilité et stratégie d’acquisition sur le marché résidentiel.",
      },
      {
        title: "Vente de propriétés",
        description:
          "Mise en valeur de votre bien, stratégie de prix et négociation optimale pour maximiser sa valeur.",
      },
      {
        title: "Flip immobilier",
        description:
          "Stratégie d'achat, de rénovation et de revente pour maximiser la plus-value sur des projets de flip résidentiels.",
      },
      {
        title: "Location de propriétés",
        description:
          "Accompagnement des propriétaires bailleurs : mise en location, critères locataires et optimisation de la rentabilité locative.",
      },
    ],
    testimonialsTitle: "Ce que mes clients disent",
    testimonialsHeading: "Témoignages",
    ctaTitle: "Prêt à avancer sur votre projet immobilier ?",
    ctaSubtitle:
      "Discutons de vos objectifs et voyons comment je peux vous accompagner.",
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
    intro: "Découvrez les propriétés vendues récemment à Montréal et environs.",
    soldHeading: "Propriétés vendues",
  },
  teamPartners: {
    eyebrow: "06 / Équipe et partenaires",
    title: "Équipe et partenaires",
    intro:
      "Rencontrez Sergine et le réseau de partenaires de confiance qui accompagnent chaque transaction.",
    teamHeading: "L'équipe",
    partnersHeading: "Nos partenaires de confiance",
    emptyPartners: "Aucun partenaire pour le moment.",
    teamFallbackName: "Sergine Hougoue",
    teamFallbackRole: "Courtière immobilière certifiée OACIQ",
    partnerCategories: {
      preteur: "Prêteurs",
      "courtier-hypothecaire": "Courtiers hypothécaires",
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
  contact: {
    eyebrow: "06 / Contact",
    title: "Contact",
    intro:
      "Une question, un projet immobilier? Écrivez-moi ou prenez rendez-vous en ligne.",
    methodsHeading: "Coordonnées",
    phoneLabel: "Téléphone",
    emailLabel: "Courriel",
    whatsappLabel: "WhatsApp",
    hoursLabel: "Heures d'ouverture",
    formHeading: "Envoyer un message",
    bookingHeading: "Prendre rendez-vous",
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
    teamPartners: "Team & partners",
    about: "About",
    contact: "Contact",
    cta: "Book a meeting",
  },
  theme: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
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
    territoryTitle: "Across Quebec",
    territoryIntro:
      "I support buyers and sellers across Quebec's 17 administrative regions.",
  },
  ctaStrip: {
    title: "Ready to take the next step?",
  },
  about: {
    eyebrow: "03 / About",
    title: "About",
    intro:
      "Meet Sergine Hougoue — an OACIQ-certified broker offering attentive, rigorous guidance for every real estate goal.",
    bioFallback:
      "OACIQ-certified real estate broker based in Montreal, Sergine Hougoue provides attentive and rigorous guidance for buyers and investors across the North Shore and Montreal area.",
    journeyTitle: "My journey",
    journey:
      "With solid hands-on experience and in-depth knowledge of the local market, I help first-time buyers take the leap with confidence, while guiding investors toward high-potential opportunities. My commitment: total transparency, attentive listening, and concrete results.",
    approachTitle: "My approach",
    approach: [
      "Attentive listening to your goals and constraints",
      "Rigorous analysis of the market and opportunities",
      "Personalized support at every step",
      "Network of trusted partners (notaries, inspectors, lenders)",
    ],
    expertiseTitle: "My expertise",
    expertise: [
      {
        title: "First-time buyers",
        description:
          "Complete support for your first purchase: from search to financing, including viewings and negotiations.",
      },
      {
        title: "Investors",
        description:
          "Identifying high-potential opportunities, profitability analysis, and acquisition strategy in the residential market.",
      },
      {
        title: "Property sales",
        description:
          "Showcasing your property, pricing strategy, and optimal negotiation to maximize its value.",
      },
      {
        title: "Property flip",
        description:
          "Buy–renovate–resell strategy to maximize value on residential flip projects.",
      },
      {
        title: "Property rentals",
        description:
          "Support for landlord owners: listing for rent, tenant criteria, and rental yield optimization.",
      },
    ],
    testimonialsTitle: "What my clients say",
    testimonialsHeading: "Testimonials",
    ctaTitle: "Ready to move forward with your real estate project?",
    ctaSubtitle: "Let's discuss your goals and see how I can support you.",
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
    intro: "Explore recently closed deals in Montreal and surrounding areas.",
    soldHeading: "Sold properties",
  },
  teamPartners: {
    eyebrow: "06 / Team & partners",
    title: "Team & partners",
    intro:
      "Meet Sergine and the trusted partner network that supports every transaction.",
    teamHeading: "The team",
    partnersHeading: "Our trusted partners",
    emptyPartners: "No partners listed yet.",
    teamFallbackName: "Sergine Hougoue",
    teamFallbackRole: "OACIQ-certified real estate broker",
    partnerCategories: {
      preteur: "Lenders",
      "courtier-hypothecaire": "Mortgage brokers",
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
  contact: {
    eyebrow: "06 / Contact",
    title: "Contact",
    intro:
      "Have a question or a real estate project in mind? Send me a message or book a meeting online.",
    methodsHeading: "Get in touch",
    phoneLabel: "Phone",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    hoursLabel: "Hours",
    formHeading: "Send a message",
    bookingHeading: "Book a meeting",
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
