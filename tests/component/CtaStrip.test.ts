import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import CtaStrip from "$components/content/CtaStrip.svelte";
import { getCopy } from "$i18n/copy";

describe("<CtaStrip>", () => {
  it("renders title and CTA link", () => {
    const copy = getCopy("fr");

    render(CtaStrip, {
      props: {
        title: copy.ctaStrip.title,
        ctaHref: "/fr/contact",
        ctaLabel: copy.nav.cta,
      },
    });

    expect(
      screen.getByRole("heading", { level: 2, name: copy.ctaStrip.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: copy.nav.cta })).toHaveAttribute(
      "href",
      "/fr/contact",
    );
  });
});