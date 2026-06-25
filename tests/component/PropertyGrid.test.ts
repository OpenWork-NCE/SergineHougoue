import { afterEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import PropertyGrid from "$components/content/PropertyGrid.svelte";
import { mockProperty } from "../fixtures/property";

describe("<PropertyGrid>", () => {
  const originalProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = import.meta.env.PUBLIC_SANITY_DATASET;

  afterEach(() => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    import.meta.env.PUBLIC_SANITY_DATASET = originalDataset;
  });

  it("renders a card link for each property", () => {
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
    ];

    render(PropertyGrid, {
      props: {
        properties,
        locale: "fr",
        basePath: "/fr",
      },
    });

    const links = screen.getAllByRole("link", { name: /Voir le détail/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/fr/biens/duplex-rosemont");
    expect(links[1]).toHaveAttribute("href", "/fr/biens/condo-griffintown");
  });
});
