import type { Locale } from "./locales";

export interface ServiceCategory {
  id: string;
  title: string;
  bullets: string[];
}

const fr: ServiceCategory[] = [
  {
    id: "first-time-buyers",
    title: "Premiers acheteurs",
    bullets: [
      "Éducation sur le processus complet d'achat et démystification des documents légaux",
      "Accompagnement rassurant pour faire un choix éclairé et confiant",
      "Soutien personnalisé de la préapprobation hypothécaire jusqu'à la signature chez le notaire",
      "Recherches ciblées, visites organisées et offres rédigées selon vos critères",
    ],
  },
  {
    id: "investment-buyers",
    title: "Investissement immobilier",
    bullets: [
      "Analyse des chiffres, de la rentabilité potentielle et du cash flow",
      "Recherche de plex et d'immeubles à revenus selon vos objectifs",
      "Stratégie d'investissement pour bâtir ou bonifier votre portefeuille",
      "Approche analytique pour maximiser votre retour sur investissement",
    ],
  },
  {
    id: "seller-evaluation",
    title: "Évaluation marchande",
    bullets: [
      "Estimation précise et réaliste basée sur des données récentes",
      "Analyse technique du marché de votre secteur",
      "Service gratuit et sans obligation de votre part",
      "Conseils pour comprendre la valeur actuelle de votre propriété",
    ],
  },
  {
    id: "seller-strategy",
    title: "Mise en vente stratégique",
    bullets: [
      "Évaluation juste et stratégie de mise en marché adaptée",
      "Conseils de mise en valeur et photos professionnelles",
      "Gestion des visites et visibilité accrue",
      "Négociation rigoureuse pour protéger vos intérêts",
    ],
  },
];

const en: ServiceCategory[] = [
  {
    id: "first-time-buyers",
    title: "First-time buyers",
    bullets: [
      "Education on the full buying process and demystifying legal documents",
      "Reassuring guidance so you can make a confident, informed decision",
      "Personal support from mortgage pre-approval through closing at the notary",
      "Targeted searches, organized visits, and offers drafted to your criteria",
    ],
  },
  {
    id: "investment-buyers",
    title: "Investment properties",
    bullets: [
      "Analysis of numbers, potential profitability, and cash flow",
      "Search for plexes and income properties aligned with your goals",
      "Investment strategy to build or strengthen your portfolio",
      "Analytical approach to maximize your return on investment",
    ],
  },
  {
    id: "seller-evaluation",
    title: "Market evaluation",
    bullets: [
      "Accurate, realistic estimate based on recent market data",
      "Technical analysis of your neighbourhood market",
      "Free service with no obligation on your part",
      "Guidance to understand your property's current value",
    ],
  },
  {
    id: "seller-strategy",
    title: "Strategic listing",
    bullets: [
      "Fair valuation and a tailored go-to-market strategy",
      "Staging advice and professional photography",
      "Visit management and increased visibility",
      "Rigorous negotiation to protect your interests",
    ],
  },
];

const SERVICES: Record<Locale, ServiceCategory[]> = { fr, en };

export function getServices(locale: Locale): ServiceCategory[] {
  return SERVICES[locale];
}
