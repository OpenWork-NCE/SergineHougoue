import { describe, it, expect } from "vitest";
import { tick } from "svelte";
import { render, screen, fireEvent, within } from "@testing-library/svelte";
import Nav from "$components/layout/Nav.svelte";

describe("<Nav>", () => {
  it("renders primary nav links including transactions and blog", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    expect(screen.getByRole("link", { name: "Biens" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Transactions" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "À propos" })).toBeInTheDocument();
    // Contact is CTA destination; not duplicated as a desktop primary text link
    // (mobile drawer still exposes Contact + team partners).
    expect(
      screen.queryByRole("link", { name: "Équipe et partenaires" }),
    ).not.toBeInTheDocument();
  });

  it("renders the primary CTA to contact", () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    const ctas = screen.getAllByRole("link", { name: "Prendre rendez-vous" });
    expect(ctas.length).toBeGreaterThan(0);
    expect(ctas[0]).toHaveAttribute("href", "/fr/contact");
  });

  it("renders English primary links when locale is en", () => {
    render(Nav, { props: { currentPath: "/en/", locale: "en" } });
    expect(screen.getByRole("link", { name: "Listings" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Transactions" }),
    ).toBeInTheDocument();
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

  it("marks active route on primary link", () => {
    render(Nav, {
      props: { currentPath: "/fr/transactions", locale: "fr" },
    });
    const transactions = screen.getByRole("link", { name: "Transactions" });
    expect(transactions).toHaveAttribute("aria-current", "page");
  });

  it("opens mobile drawer with contact and secondary team link", async () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    const open = screen.getByRole("button", { name: "Ouvrir le menu" });
    await fireEvent.click(open);
    await tick();

    const drawer = screen.getByRole("dialog");
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByRole("link", { name: "Contact" })).toBeInTheDocument();
    expect(
      within(drawer).getByRole("link", { name: "Équipe et partenaires" }),
    ).toBeInTheDocument();
    expect(within(drawer).getByRole("link", { name: "Blog" })).toBeInTheDocument();
  });

  it("closes mobile drawer via close control inside dialog", async () => {
    render(Nav, { props: { currentPath: "/fr/", locale: "fr" } });
    await fireEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    await tick();
    const drawer = screen.getByRole("dialog");
    expect(drawer).toBeInTheDocument();

    await fireEvent.click(
      within(drawer).getByRole("button", { name: "Fermer le menu" }),
    );
    await tick();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
