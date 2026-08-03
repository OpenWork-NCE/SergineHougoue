import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";
import PropertyGallery from "$components/content/PropertyGallery.svelte";

const images = [
  { src: "/properties/sold/a.webp", alt: "Photo A" },
  { src: "/properties/sold/b.webp", alt: "Photo B" },
  { src: "/properties/sold/c.webp", alt: "Photo C" },
];

describe("<PropertyGallery>", () => {
  it("renders main image and supports navigating thumbnails", async () => {
    render(PropertyGallery, {
      props: {
        images,
        galleryLabel: "Photos du bien",
        previousLabel: "Photo précédente",
        nextLabel: "Photo suivante",
        thumbnailsLabel: "Miniatures des photos",
        statusLabel: "Vendu",
        statusTone: "sold",
        priceLabel: "749 000 $ CA",
      },
    });

    expect(screen.getByRole("img", { name: "Photo A" })).toHaveAttribute(
      "src",
      "/properties/sold/a.webp",
    );
    expect(screen.getByText("Vendu")).toBeInTheDocument();
    expect(screen.getByText("749 000 $ CA")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: "2 / 3" }));
    expect(screen.getByRole("img", { name: "Photo B" })).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    await fireEvent.click(
      screen.getByRole("button", { name: "Photo suivante" }),
    );
    expect(screen.getByRole("img", { name: "Photo C" })).toBeInTheDocument();
  });

  it("hides navigation when only one image", () => {
    render(PropertyGallery, {
      props: {
        images: [{ src: "/only.webp", alt: "Unique" }],
        galleryLabel: "Photos",
        previousLabel: "Prev",
        nextLabel: "Next",
        thumbnailsLabel: "Thumbs",
      },
    });

    expect(screen.getByRole("img", { name: "Unique" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next" }),
    ).not.toBeInTheDocument();
  });
});
