import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import RegionsMarquee from "$components/content/RegionsMarquee.svelte";
import { QUEBEC_REGIONS } from "$i18n/regions";

describe("<RegionsMarquee>", () => {
  beforeEach(() => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("lists all 17 Quebec regions with an accessible label", () => {
    render(RegionsMarquee, { props: { locale: "fr" } });

    const region = screen.getByRole("region", {
      name: /17 régions administratives du Québec/i,
    });
    expect(region).toBeInTheDocument();

    for (const name of QUEBEC_REGIONS) {
      // Animated track duplicates the list; assert at least one visible label.
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("exposes English aria label", () => {
    render(RegionsMarquee, { props: { locale: "en" } });

    expect(
      screen.getByRole("region", {
        name: /Quebec's 17 administrative regions/i,
      }),
    ).toBeInTheDocument();
  });

  it("falls back to a scrollable list when reduced motion is preferred", () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(RegionsMarquee, { props: { locale: "fr" } });

    // Single list only (no duplicate track) when reduced motion is on.
    expect(screen.getAllByText("Montréal")).toHaveLength(1);
    expect(screen.getAllByText("Montérégie")).toHaveLength(1);
  });
});
