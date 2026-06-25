import type { Locale } from "./locales";

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
  privacy: string;
}

export interface HeroCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface SiteCopy {
  nav: NavCopy;
  whatsapp: WhatsappCopy;
  cookie: CookieCopy;
  footer: FooterCopy;
  hero: HeroCopy;
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
    privacy: "Politique de confidentialité",
  },
  hero: {
    eyebrow: "01 / Courtier immobilier",
    title: "Construisons votre avenir immobilier",
    subtitle:
      "Résidentiel et commercial — accompagnement sur mesure à Montréal et environs.",
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
    privacy: "Privacy policy",
  },
  hero: {
    eyebrow: "01 / Real estate broker",
    title: "Let's build your real estate future",
    subtitle:
      "Residential and commercial — tailored guidance in Montreal and beyond.",
  },
};

const COPY: Record<Locale, SiteCopy> = { fr, en };

export function getCopy(locale: Locale): SiteCopy {
  return COPY[locale];
}
