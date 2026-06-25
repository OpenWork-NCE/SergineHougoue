import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getPublicSanityConfig } from "./env";

export function createImageUrlBuilder() {
  const { projectId, dataset } = getPublicSanityConfig();
  return imageUrlBuilder({ projectId, dataset });
}

export function urlFor(source: SanityImageSource) {
  return createImageUrlBuilder().image(source);
}
