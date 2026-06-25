import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import PageHeader from "$components/content/PageHeader.svelte";

describe("<PageHeader>", () => {
  it("renders eyebrow and H1", () => {
    render(PageHeader, {
      props: {
        eyebrow: "02 / Services",
        title: "Nos services",
      },
    });

    expect(screen.getByText("02 / Services")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Nos services" }),
    ).toBeInTheDocument();
  });

  it("renders optional intro when provided", () => {
    render(PageHeader, {
      props: {
        eyebrow: "02 / Services",
        title: "Nos services",
        intro: "Accompagnement pour acheteurs et vendeurs.",
      },
    });

    expect(
      screen.getByText("Accompagnement pour acheteurs et vendeurs."),
    ).toBeInTheDocument();
  });
});
