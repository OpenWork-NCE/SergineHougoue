import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Nav from "$components/layout/Nav.svelte";

describe("<Nav>", () => {
  it("renders all primary nav links from copy", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Biens" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("renders the primary CTA", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    expect(
      screen.getByRole("link", { name: "Prendre rendez-vous" }),
    ).toBeInTheDocument();
  });

  it("renders English copy when locale is en", () => {
    render(Nav, { props: { currentPath: "/en/", locale: "en" } });
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Book a meeting" }),
    ).toBeInTheDocument();
  });
});
