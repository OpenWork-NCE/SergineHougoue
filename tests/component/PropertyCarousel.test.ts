import { afterEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import PropertyCarousel from "$components/content/PropertyCarousel.svelte";
import { mockProperty } from "../fixtures/property";

describe("<PropertyCarousel>", () => {
  const originalProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = import.meta.env.PUBLIC_SANITY_DATASET;

  afterEach(() => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    import.meta.env.PUBLIC_SANITY_DATASET = originalDataset;
  });

  it("renders three property cards with carousel controls", () => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = "test-project-id";
    import.meta.env.PUBLIC_SANITY_DATASET = "production";

    const properties = [
      mockProperty(),
      mockProperty({
        _id: "property-condo-griffintown",
        title: "Condo Griffintown",
        slug: { current: "condo-griffintown" },
        type: "condo",
        price: 489_000,
        address: "1200 rue Olier",
        bedrooms: 2,
        bathrooms: 1,
        area: 920,
      }),
      mockProperty({
        _id: "property-plex-plateau",
        title: "Plex Plateau",
        slug: { current: "plex-plateau" },
        type: "plex",
        price: 1_250_000,
        address: "4512 avenue du Parc",
        bedrooms: 6,
        bathrooms: 3,
        area: 3_200,
      }),
    ];

    render(PropertyCarousel, {
      props: {
        properties,
        locale: "fr",
        basePath: "/fr",
      },
    });

    const carousel = screen.getByRole("region", {
      name: /carrousel des biens en vedette/i,
    });
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");

    const links = screen.getAllByRole("link", { name: /Voir le détail/i });
    expect(links).toHaveLength(3);

    expect(
      screen.getByRole("button", { name: /bien précédent/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /bien suivant/i }),
    ).toBeInTheDocument();
  });
});
