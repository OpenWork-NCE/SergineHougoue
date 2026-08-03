import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import PropertyCard from "$components/content/PropertyCard.svelte";
import { mockProperty } from "../fixtures/property";

describe("<PropertyCard>", () => {
  // Env provided early via tests/setup.ts + vi.stubEnv (before this module + component loads)
  // + live reads in env.ts ensure urlFor in deriveds succeeds.

  it("renders price, address, specs, link, and image alt", () => {
    const property = mockProperty();

    render(PropertyCard, {
      props: {
        property,
        locale: "fr",
        basePath: "/fr",
      },
    });

    expect(screen.getByText("749 000 $ CA")).toBeInTheDocument();
    expect(
      screen.getByText("4521 rue Saint-Dominique, Montréal"),
    ).toBeInTheDocument();
    expect(screen.getByText(/4\s+ch\./)).toBeInTheDocument();
    expect(screen.getByText(/2\s+sdb\./)).toBeInTheDocument();
    expect(screen.getByText(/1\s+850\s+pi²/)).toBeInTheDocument();
    expect(screen.getByText("Duplex")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Voir le détail/i }),
    ).toHaveAttribute("href", "/fr/biens/duplex-rosemont");

    const image = screen.getByRole("img", {
      name: "Façade du duplex à Rosemont",
    });
    expect(image).toBeInTheDocument();
  });

  it("renders sold portfolio card without fake price or specs", () => {
    const property = mockProperty({
      _id: "property-condo-vendu-montreal-fr",
      title: "Condo vendu à Montréal",
      slug: { current: "condo-vendu-montreal" },
      status: "vendu",
      price: undefined,
      address: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      area: undefined,
      photos: undefined,
      imagePath: "/properties/sold/condo-vendu-montreal.webp",
      imageAlt: "Façade condo Montréal",
      city: "Montréal",
      type: "condo",
    });

    render(PropertyCard, {
      props: { property, locale: "fr", basePath: "/fr" },
    });

    // Badge + price-area both show "Vendu" when price unknown
    expect(screen.getAllByText("Vendu").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Condo vendu à Montréal")).toBeInTheDocument();
    expect(screen.getByText("Montréal")).toBeInTheDocument();
    expect(screen.queryByText(/ch\./)).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Façade condo Montréal" })).toHaveAttribute(
      "src",
      "/properties/sold/condo-vendu-montreal.webp",
    );
  });
});
