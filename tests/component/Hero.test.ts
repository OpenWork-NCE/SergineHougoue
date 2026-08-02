import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Hero from "$components/content/Hero.svelte";
import { getCopy } from "$i18n/copy";

describe("<Hero>", () => {
  it("renders full-bleed hero with dual CTAs when image provided", () => {
    const copy = getCopy("fr");

    render(Hero, {
      props: {
        eyebrow: copy.hero.eyebrow,
        title: copy.hero.title,
        subtitle: copy.hero.subtitle,
        ctaHref: "/fr/contact",
        ctaLabel: copy.nav.cta,
        secondaryCtaHref: "/fr/biens",
        secondaryCtaLabel: copy.hero.secondaryCta,
        scrollCue: copy.hero.scrollCue,
        imageSrc: "/hero-home.webp",
        imageAlt: "Hero",
        variant: "full",
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
    expect(
      screen.getByRole("link", { name: copy.hero.secondaryCta }),
    ).toHaveAttribute("href", "/fr/biens");

    const image = document.querySelector("img");
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("src", "/hero-home.webp");
  });

  it("renders compact variant without image", () => {
    render(Hero, {
      props: {
        eyebrow: "01 / Test",
        title: "Test title",
        ctaHref: "/fr/contact",
        ctaLabel: "CTA",
        variant: "full",
      },
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Test title" }),
    ).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });
});
