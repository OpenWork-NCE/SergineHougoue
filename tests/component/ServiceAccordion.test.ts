import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import ServiceAccordion from "$components/content/ServiceAccordion.svelte";
import { getServices } from "$i18n/services";

function buttonFor(title: string) {
  return screen.getByRole("button", { name: new RegExp(title, "i") });
}

describe("<ServiceAccordion>", () => {
  const services = getServices("fr");

  it("renders numbered accordion buttons for each service", () => {
    render(ServiceAccordion, { props: { services } });

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();

    for (const service of services) {
      expect(buttonFor(service.title)).toBeInTheDocument();
    }
  });

  it("toggles aria-expanded on click", async () => {
    render(ServiceAccordion, { props: { services } });

    const firstButton = buttonFor(services[0].title);
    const secondButton = buttonFor(services[1].title);

    expect(firstButton).toHaveAttribute("aria-expanded", "false");

    await fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(services[0].bullets[0])).toBeVisible();

    await fireEvent.click(secondButton);
    expect(secondButton).toHaveAttribute("aria-expanded", "true");
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
  });

  it("opens panel on Enter and Space keyboard events", async () => {
    render(ServiceAccordion, { props: { services } });

    const thirdButton = buttonFor(services[2].title);
    const fourthButton = buttonFor(services[3].title);

    await fireEvent.keyDown(thirdButton, { key: "Enter", code: "Enter" });
    expect(thirdButton).toHaveAttribute("aria-expanded", "true");

    await fireEvent.keyDown(fourthButton, { key: " ", code: "Space" });
    expect(fourthButton).toHaveAttribute("aria-expanded", "true");
    expect(thirdButton).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps only one panel open at a time", async () => {
    render(ServiceAccordion, { props: { services } });

    const buttons = screen.getAllByRole("button");

    await fireEvent.click(buttons[0]);
    await fireEvent.click(buttons[2]);

    const expanded = buttons.filter(
      (button) => button.getAttribute("aria-expanded") === "true",
    );
    expect(expanded).toHaveLength(1);
    expect(expanded[0]).toBe(buttons[2]);
  });
});
