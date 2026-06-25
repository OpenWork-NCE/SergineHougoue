import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import LangToggle from "$components/layout/LangToggle.svelte";

describe("<LangToggle>", () => {
  it("renders FR and EN links", () => {
    render(LangToggle, {
      props: { currentPath: "/fr/services", currentLocale: "fr" },
    });
    expect(screen.getByRole("link", { name: "FR" })).toHaveAttribute(
      "href",
      "/fr/services",
    );
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/services",
    );
  });

  it("marks the active locale with aria-current", () => {
    render(LangToggle, {
      props: { currentPath: "/en/contact", currentLocale: "en" },
    });
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "FR" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("handles root path correctly", () => {
    render(LangToggle, { props: { currentPath: "/fr/", currentLocale: "fr" } });
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/",
    );
  });
});
