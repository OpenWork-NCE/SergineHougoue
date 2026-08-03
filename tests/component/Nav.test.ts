import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import Nav from "$components/layout/Nav.svelte";

describe("<Nav>", () => {
  it("renders slim primary nav links (not secondary)", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    expect(screen.getByRole("link", { name: "Biens" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "À propos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
    // Team partners is not a primary desktop link (footer / mobile drawer only)
    expect(
      screen.queryByRole("link", { name: "Équipe et partenaires" }),
    ).not.toBeInTheDocument();
  });

  it("renders the primary CTA", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    const ctas = screen.getAllByRole("link", { name: "Prendre rendez-vous" });
    expect(ctas.length).toBeGreaterThan(0);
  });

  it("renders English primary links when locale is en", () => {
    render(Nav, { props: { currentPath: "/en/", locale: "en" } });
    expect(screen.getByRole("link", { name: "Listings" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    const enCtas = screen.getAllByRole("link", { name: "Book a meeting" });
    expect(enCtas.length).toBeGreaterThan(0);
  });

  it("renders larger wordmark with accessible name", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    const brand = screen.getByRole("link", { name: "Sergine Hougoue" });
    expect(brand).toHaveAttribute("href", "/fr/");
  });

  it("renders theme toggle", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("opens mobile drawer with secondary links", async () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    const open = screen.getByRole("button", { name: "Ouvrir le menu" });
    await fireEvent.click(open);
    expect(
      screen.getByRole("link", { name: "Équipe et partenaires" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
  });
});
