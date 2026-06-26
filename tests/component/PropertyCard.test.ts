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

    expect(screen.getByText("749 000 $")).toBeInTheDocument();
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
});
