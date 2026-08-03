import type { Locale } from "$i18n/locales";
import type { PropertyType } from "$sanity/types";
import type { DisplayProperty } from "./types";

type SoldSeed = {
  id: string;
  slug: string;
  type: PropertyType;
  city: string;
  /** Relative to static/ */
  imagePath: string;
  title: { fr: string; en: string };
  photoAlt: { fr: string; en: string };
};

/**
 * Portfolio of closed deals from client photos in static/propriétés
 * (copied to static/properties/sold/ for clean URLs).
 *
 * Intentionally omits price, full address, beds/baths/area — not verified.
 */
const SOLD_SEED: SoldSeed[] = [
  {
    id: "static-sold-condo-montreal",
    slug: "condo-vendu-montreal",
    type: "condo",
    city: "Montréal",
    imagePath: "/properties/sold/condo-vendu-montreal.jpeg",
    title: {
      fr: "Condo vendu à Montréal",
      en: "Condo sold in Montreal",
    },
    photoAlt: {
      fr: "Façade extérieure d’un immeuble de condos à Montréal",
      en: "Exterior façade of a condo building in Montreal",
    },
  },
  {
    id: "static-sold-duplex-chateauguay",
    slug: "duplex-vendu-chateauguay",
    type: "duplex",
    city: "Châteauguay",
    imagePath: "/properties/sold/duplex-vendu-chateauguay.jpeg",
    title: {
      fr: "Duplex vendu à Châteauguay",
      en: "Duplex sold in Châteauguay",
    },
    photoAlt: {
      fr: "Façade extérieure d’un duplex à Châteauguay",
      en: "Exterior façade of a duplex in Châteauguay",
    },
  },
  {
    id: "static-sold-duplex-drummondville",
    slug: "duplex-vendu-drummondville",
    type: "duplex",
    city: "Drummondville",
    imagePath: "/properties/sold/duplex-vendu-drummondville.jpeg",
    title: {
      fr: "Duplex vendu à Drummondville",
      en: "Duplex sold in Drummondville",
    },
    photoAlt: {
      fr: "Façade extérieure d’un duplex à Drummondville",
      en: "Exterior façade of a duplex in Drummondville",
    },
  },
  {
    id: "static-sold-duplex-neuf-sorel-tracy",
    slug: "duplex-neuf-vendu-sorel-tracy",
    type: "duplex",
    city: "Sorel-Tracy",
    imagePath: "/properties/sold/duplex-neuf-vendu-sorel-tracy.jpeg",
    title: {
      fr: "Duplex neuf vendu à Sorel-Tracy",
      en: "New duplex sold in Sorel-Tracy",
    },
    photoAlt: {
      fr: "Façade extérieure d’un duplex neuf à Sorel-Tracy",
      en: "Exterior façade of a new duplex in Sorel-Tracy",
    },
  },
  {
    id: "static-sold-duplex-saint-jerome",
    slug: "duplex-vendu-saint-jerome",
    type: "duplex",
    city: "Saint-Jérôme",
    imagePath: "/properties/sold/duplex-vendu-saint-jerome.jpeg",
    title: {
      fr: "Duplex vendu à Saint-Jérôme",
      en: "Duplex sold in Saint-Jérôme",
    },
    photoAlt: {
      fr: "Façade extérieure d’un duplex à Saint-Jérôme",
      en: "Exterior façade of a duplex in Saint-Jérôme",
    },
  },
  {
    id: "static-sold-duplex-salaberry",
    slug: "duplex-vendu-salaberry-de-valleyfield",
    type: "duplex",
    city: "Salaberry-de-Valleyfield",
    imagePath: "/properties/sold/duplex-vendu-salaberry-de-valleyfield.jpg",
    title: {
      fr: "Duplex vendu à Salaberry-de-Valleyfield",
      en: "Duplex sold in Salaberry-de-Valleyfield",
    },
    photoAlt: {
      fr: "Façade extérieure d’un duplex à Salaberry-de-Valleyfield",
      en: "Exterior façade of a duplex in Salaberry-de-Valleyfield",
    },
  },
  {
    id: "static-sold-maison-etages-chateauguay",
    slug: "maison-etages-vendue-chateauguay",
    type: "unifamiliale",
    city: "Châteauguay",
    imagePath: "/properties/sold/maison-etages-vendue-chateauguay.jpeg",
    title: {
      fr: "Maison à étages vendue à Châteauguay",
      en: "Two-storey house sold in Châteauguay",
    },
    photoAlt: {
      fr: "Façade extérieure d’une maison à étages à Châteauguay",
      en: "Exterior façade of a two-storey house in Châteauguay",
    },
  },
  {
    id: "static-sold-maison-plain-pied-saint-jerome",
    slug: "maison-plain-pied-vendue-saint-jerome",
    type: "unifamiliale",
    city: "Saint-Jérôme",
    imagePath: "/properties/sold/maison-plain-pied-vendue-saint-jerome.jpeg",
    title: {
      fr: "Maison de plain-pied vendue à Saint-Jérôme",
      en: "Bungalow sold in Saint-Jérôme",
    },
    photoAlt: {
      fr: "Façade extérieure d’une maison de plain-pied à Saint-Jérôme",
      en: "Exterior façade of a bungalow in Saint-Jérôme",
    },
  },
];

export function getStaticSoldProperties(locale: Locale): DisplayProperty[] {
  return SOLD_SEED.map((seed) => ({
    _id: seed.id,
    _type: "property" as const,
    title: seed.title[locale],
    slug: { current: seed.slug },
    status: "vendu" as const,
    city: seed.city,
    type: seed.type,
    // No address / price / specs — not verified from source files
    staticImageSrc: seed.imagePath,
    photoAlt: seed.photoAlt[locale],
    featured: false,
    language: locale,
    source: "static" as const,
  }));
}

export function getStaticSoldPropertyBySlug(
  locale: Locale,
  slug: string,
): DisplayProperty | null {
  return (
    getStaticSoldProperties(locale).find((p) => p.slug.current === slug) ??
    null
  );
}

export function getStaticSoldSlugs(): string[] {
  return SOLD_SEED.map((s) => s.slug);
}
