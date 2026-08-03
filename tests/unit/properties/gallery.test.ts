import { describe, it, expect } from "vitest";
import { resolvePropertyGalleryImages } from "$lib/properties/gallery";
import type { SanityImage } from "$sanity/types";

const photo = (ref: string, alt?: string): SanityImage => ({
  _type: "image",
  asset: { _type: "reference", _ref: ref },
  alt,
});

describe("resolvePropertyGalleryImages", () => {
  it("uses Sanity photos when photoUrl is provided", () => {
    const images = resolvePropertyGalleryImages(
      {
        title: "Duplex Rosemont",
        photos: [
          photo("image-a-jpg", "Façade"),
          photo("image-b-jpg", "Salon"),
        ],
      },
      {
        photoUrl: (p, i) => `https://cdn.example/${p.asset._ref}-${i}.jpg`,
      },
    );

    expect(images).toHaveLength(2);
    expect(images[0]).toEqual({
      src: "https://cdn.example/image-a-jpg-0.jpg",
      alt: "Façade",
    });
    expect(images[1]?.alt).toBe("Salon");
  });

  it("falls back to public imagePath when no Sanity photos", () => {
    const images = resolvePropertyGalleryImages({
      title: "Condo vendu",
      photos: null,
      imagePath: "/properties/sold/condo-vendu-montreal.webp",
      imageAlt: "Façade condo",
    });

    expect(images).toEqual([
      {
        src: "/properties/sold/condo-vendu-montreal.webp",
        alt: "Façade condo",
      },
    ]);
  });

  it("always returns at least one fallback image", () => {
    const images = resolvePropertyGalleryImages(
      { title: "Sans photo" },
      { fallbackIndex: 2 },
    );

    expect(images).toHaveLength(1);
    expect(images[0]?.src).toMatch(/^\/property-\d+\.webp$/);
    expect(images[0]?.alt).toBe("Sans photo");
  });

  it("skips photos without asset refs", () => {
    const images = resolvePropertyGalleryImages(
      {
        title: "Mix",
        photos: [
          { _type: "image", asset: undefined as never, alt: "broken" },
          photo("image-ok-jpg", "OK"),
        ],
        imagePath: "/should-not-use.webp",
      },
      { photoUrl: (p) => `url:${p.asset._ref}` },
    );

    expect(images).toEqual([{ src: "url:image-ok-jpg", alt: "OK" }]);
  });
});
