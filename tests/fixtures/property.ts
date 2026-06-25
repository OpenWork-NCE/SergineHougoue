import type { Property } from "$sanity/types";

export function mockProperty(overrides: Partial<Property> = {}): Property {
  return {
    _id: "property-duplex-rosemont",
    _type: "property",
    title: "Duplex lumineux à Rosemont",
    slug: { current: "duplex-rosemont" },
    status: "a-vendre",
    price: 749_000,
    address: "4521 rue Saint-Dominique",
    city: "Montréal",
    type: "duplex",
    bedrooms: 4,
    bathrooms: 2,
    area: 1_850,
    publishedAt: "2026-01-01T00:00:00.000Z",
    photos: [
      {
        _type: "image",
        asset: {
          _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
          _type: "reference",
        },
        alt: "Façade du duplex à Rosemont",
      },
    ],
    ...overrides,
  };
}
