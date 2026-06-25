import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import CalEmbed from "$components/forms/CalEmbed.svelte";
import { getFormCopy } from "$i18n/forms";

describe("<CalEmbed>", () => {
  const copy = getFormCopy("fr");

  it("renders an embed container when calLink is set", () => {
    render(CalEmbed, {
      props: {
        locale: "fr",
        calLink: "sergine-hougoue/30min",
      },
    });

    const container = screen.getByTestId("cal-embed-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-label", copy.calEmbed.ariaLabel);
    expect(screen.queryByTestId("cal-embed-fallback")).not.toBeInTheDocument();
  });

  it("normalizes a full Cal.com URL to a calLink path", () => {
    render(CalEmbed, {
      props: {
        locale: "fr",
        calLink: "https://cal.com/sergine-hougoue/30min",
      },
    });

    expect(screen.getByTestId("cal-embed-container")).toBeInTheDocument();
  });

  it("renders a fallback message when calLink is unset", () => {
    render(CalEmbed, {
      props: {
        locale: "fr",
        calLink: null,
      },
    });

    expect(screen.getByTestId("cal-embed-fallback")).toHaveTextContent(
      copy.calEmbed.fallback,
    );
    expect(screen.queryByTestId("cal-embed-container")).not.toBeInTheDocument();
  });

  it("renders a fallback message when calLink is blank", () => {
    render(CalEmbed, {
      props: {
        locale: "en",
        calLink: "   ",
      },
    });

    expect(screen.getByTestId("cal-embed-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("cal-embed-container")).not.toBeInTheDocument();
  });
});