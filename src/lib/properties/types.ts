import type { Property } from "$sanity/types";

/**
 * UI property model. All listing/transaction data comes from Sanity CMS.
 * Specs (price, address, beds…) may be omitted for sold portfolio items.
 */
export type DisplayProperty = Property & {
  source: "cms";
};

export function fromCmsProperty(property: Property): DisplayProperty {
  return {
    ...property,
    source: "cms",
  };
}
