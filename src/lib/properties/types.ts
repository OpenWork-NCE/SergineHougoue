import type {
  PortableTextBlock,
  Property,
  PropertyStatus,
  PropertyType,
  SanityImage,
  SanitySlug,
} from "$sanity/types";

/**
 * UI property model. Supports full CMS listings and partial static sold
 * portfolios (no fake price/specs when unknown).
 */
export type DisplayProperty = {
  _id: string;
  _type: "property";
  title: string;
  slug: SanitySlug;
  status: PropertyStatus;
  city: string;
  type: PropertyType;
  /** Street address — omit when unknown (sold portfolio). */
  address?: string;
  neighborhood?: string;
  /** CAD — omit when not disclosed. Never use 0 as placeholder. */
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  description?: PortableTextBlock[];
  features?: string[];
  photos?: SanityImage[];
  /** Local /static path when not a Sanity asset. */
  staticImageSrc?: string;
  photoAlt?: string;
  publishedAt?: string;
  featured?: boolean;
  language?: string;
  source: "cms" | "static";
};

export function fromCmsProperty(property: Property): DisplayProperty {
  return {
    ...property,
    source: "cms",
  };
}
