import type { SanityImage } from "$sanity/types";
import { propertyFallbackImage } from "$lib/media";

export type GalleryImage = {
  src: string;
  alt: string;
};

type GallerySource = {
  title: string;
  photos?: SanityImage[] | null;
  imagePath?: string | null;
  imageAlt?: string | null;
};

/**
 * Build ordered gallery images for a property.
 * Prefer Sanity photo assets, then CMS public imagePath, then static fallback.
 */
export function resolvePropertyGalleryImages(
  property: GallerySource,
  options: {
    fallbackIndex?: number;
    /** Map a Sanity image to a CDN URL (injected so tests stay free of env). */
    photoUrl?: (photo: SanityImage, index: number) => string | null;
  } = {},
): GalleryImage[] {
  const { fallbackIndex = 0, photoUrl } = options;
  const images: GalleryImage[] = [];

  if (photoUrl && property.photos?.length) {
    property.photos.forEach((photo, index) => {
      if (!photo?.asset?._ref) return;
      const src = photoUrl(photo, index);
      if (!src) return;
      images.push({
        src,
        alt: photo.alt?.trim() || property.title,
      });
    });
  }

  if (images.length === 0 && property.imagePath?.trim()) {
    images.push({
      src: property.imagePath.trim(),
      alt: property.imageAlt?.trim() || property.title,
    });
  }

  if (images.length === 0) {
    images.push({
      src: propertyFallbackImage(fallbackIndex),
      alt: property.title,
    });
  }

  return images;
}
