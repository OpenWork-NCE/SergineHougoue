import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Footer from "$components/layout/Footer.svelte";
import { getCopy } from "$i18n/copy";

describe("<Footer>", () => {
  it("renders the tagline in French for fr locale", () => {
    render(Footer, { props: { locale: "fr" } });
    expect(screen.getByText(getCopy("fr").footer.tagline)).toBeInTheDocument();
    expect(screen.getByText(/Explorer/)).toBeInTheDocument();
    expect(screen.getByText(/Ressources/)).toBeInTheDocument();
  });

  it("renders the tagline in English for en locale", () => {
    render(Footer, { props: { locale: "en" } });
    expect(
      screen.getByText(/Residential and commercial real estate broker/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explore/)).toBeInTheDocument();
    expect(screen.getByText(/Resources/)).toBeInTheDocument();
  });

  it("puts secondary links in footer resources", () => {
    render(Footer, { props: { locale: "fr" } });
    expect(
      screen.getByRole("link", { name: "Équipe et partenaires" }),
    ).toHaveAttribute("href", "/fr/equipe-partenaires");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/fr/blog",
    );
  });

  it("renders phone and email links", () => {
    render(Footer, { props: { locale: "fr" } });
    expect(screen.getByRole("link", { name: "438-462-6015" })).toHaveAttribute(
      "href",
      "tel:4384626015",
    );
    expect(
      screen.getByRole("link", { name: "serginehougoue@gmail.com" }),
    ).toHaveAttribute("href", "mailto:serginehougoue@gmail.com");
  });

  it("renders designed-by credit on the bottom right", () => {
    render(Footer, { props: { locale: "fr" } });
    expect(
      screen.getByText("Site conçu par Digital House Compagny"),
    ).toBeInTheDocument();
  });
});
