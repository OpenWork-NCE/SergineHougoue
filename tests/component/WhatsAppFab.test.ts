import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import WhatsAppFab from "$components/layout/WhatsAppFab.svelte";

describe("<WhatsAppFab>", () => {
  it("renders a link to wa.me with the correct phone number", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "fr" } });
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toContain("wa.me/14384626015");
  });

  it("pre-fills the FR message", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "fr" } });
    const link = screen.getByRole("link");
    const href = link.getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("Bonjour Sergine");
  });

  it("pre-fills the EN message", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "en" } });
    const link = screen.getByRole("link");
    const href = link.getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("Hello Sergine");
  });

  it("has a localized aria-label", () => {
    render(WhatsAppFab, { props: { phone: "14384626015", locale: "fr" } });
    expect(screen.getByRole("link")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("WhatsApp"),
    );
  });
});
