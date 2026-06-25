import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import CookieBanner from "$components/layout/CookieBanner.svelte";
import { getCopy } from "$i18n/copy";

describe("<CookieBanner>", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the banner with localized copy on first render", () => {
    render(CookieBanner, { props: { locale: "fr" } });
    expect(screen.getByText(getCopy("fr").cookie.title)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Accepter" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refuser" })).toBeInTheDocument();
  });

  it("renders English copy for en locale", () => {
    render(CookieBanner, { props: { locale: "en" } });
    expect(screen.getByText(/Cookies & privacy/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });

  it("hides the banner after Accept and persists choice", async () => {
    render(CookieBanner, { props: { locale: "fr" } });
    await fireEvent.click(screen.getByRole("button", { name: "Accepter" }));
    expect(
      screen.queryByText(getCopy("fr").cookie.title),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem("sergine_cookie_consent")).toBe("accepted");
  });

  it("hides the banner after Reject and persists choice", async () => {
    render(CookieBanner, { props: { locale: "fr" } });
    await fireEvent.click(screen.getByRole("button", { name: "Refuser" }));
    expect(
      screen.queryByText(getCopy("fr").cookie.title),
    ).not.toBeInTheDocument();
    expect(localStorage.getItem("sergine_cookie_consent")).toBe("rejected");
  });

  it("does not render if a choice was already persisted", () => {
    localStorage.setItem("sergine_cookie_consent", "accepted");
    render(CookieBanner, { props: { locale: "fr" } });
    expect(
      screen.queryByText(getCopy("fr").cookie.title),
    ).not.toBeInTheDocument();
  });
});
