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

export interface SiteCopy {
  nav: NavCopy;
  whatsapp: WhatsappCopy;
  cookie: CookieCopy;
  footer: FooterCopy;
}

const fr: SiteCopy = {
  nav: {
    home: "Accueil",
    services: "Services",
    listings: "Biens",
    transactions: "Transactions",
    blog: "Blogue",
    about: "Ã€ propos",
    contact: "Contact",
    cta: "Prendre rendez-vous",
  },
  whatsapp: {
    defaultMessage: "Bonjour Sergine, je vous contacte depuis votre site web.",
    ariaLabel: "Contacter Sergine par WhatsApp",
  },
  cookie: {
    title: "Cookies et confidentialitÃ©",
    body: "Ce site utilise Google Analytics pour amÃ©liorer votre expÃ©rience. Vos donnÃ©es sont anonymisÃ©es.",
    accept: "Accepter",
    reject: "Refuser",
  },
  footer: {
    tagline:
      "Courtier immobilier rÃ©sidentiel et commercial â€” VENDIRECT, certifiÃ©e OACIQ.",
    sitemapHeading: "Plan du site",
    contactHeading: "Contact",
    socialHeading: "RÃ©seaux sociaux",
    privacy: "Politique de confidentialitÃ©",
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
      "Residential and commercial real estate broker â€” VENDIRECT, OACIQ certified.",
    sitemapHeading: "Sitemap",
    contactHeading: "Contact",
    socialHeading: "Social media",
    privacy: "Privacy policy",
  },
};

const COPY: Record<Locale, SiteCopy> = { fr, en };

export function getCopy(locale: Locale): SiteCopy {
  return COPY[locale];
}
