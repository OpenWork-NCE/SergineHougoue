import type { Testimonial } from "$sanity/types";

export function mockTestimonial(
  overrides: Partial<Testimonial> = {},
): Testimonial {
  return {
    _id: "testimonial-marie-claire-fr",
    _type: "testimonial",
    quote:
      "Sergine nous a guidés avec patience à chaque étape. Nous avons trouvé notre premier condo en moins de trois semaines.",
    authorName: "Marie-Claire B.",
    authorContext: "Première acheteuse, Montréal",
    rating: 5,
    order: 0,
    ...overrides,
  };
}