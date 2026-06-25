import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Hero from "$components/content/Hero.svelte";
import { getCopy } from "$i18n/copy";

describe("<Hero>", () => {
  it("renders eyebrow, H1, subtitle, and CTA href", () => {
    const copy = getCopy("fr");

    render(Hero, {
      props: {
        eyebrow: copy.hero.eyebrow,
        title: copy.hero.title,
        subtitle: copy.hero.subtitle,
        ctaHref: "/fr/contact",
        ctaLabel: copy.nav.cta,
      },
    });

    expect(screen.getByText(copy.hero.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: copy.hero.title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(copy.hero.subtitle)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: copy.nav.cta })).toHaveAttribute(
      "href",
      "/fr/contact",
    );
  });

  it("renders optional image when imageSrc is provided", () => {
    const { container } = render(Hero, {
      props: {
        eyebrow: "01 / Test",
        title: "Test title",
        ctaHref: "/fr/contact",
        ctaLabel: "CTA",
        imageSrc: "/placeholders/hero.jpg",
      },
    });

    const image = container.querySelector("img");
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("src", "/placeholders/hero.jpg");
  });
});
