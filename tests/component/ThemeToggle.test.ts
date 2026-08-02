import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import ThemeToggle from "$components/layout/ThemeToggle.svelte";
import { THEME_STORAGE_KEY } from "$utils/theme";

describe("<ThemeToggle>", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
  });

  it("toggles theme from light to dark and persists", async () => {
    render(ThemeToggle, { props: { locale: "fr" } });
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("exposes an accessible label", () => {
    render(ThemeToggle, { props: { locale: "en" } });
    expect(screen.getByRole("button").getAttribute("aria-label")).toBeTruthy();
  });
});
