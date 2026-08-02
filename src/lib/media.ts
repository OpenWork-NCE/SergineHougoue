/** Static media paths for the visual redesign (files under /static). */
export const MEDIA = {
  heroHome: "/hero-home.webp",
  heroHomePortrait: "/hero-home-portrait.webp",
  teamPortrait: "/team-sergine-portrait.webp",
  teamPortraitFallback: "/Profil.png",
  ogDefault: "/og-default.webp",
  homeWhy: "/home-why.webp",
  servicesAmbient: "/services-ambient.webp",
  aboutJourney: "/about-journey.webp",
  contactMap: "/contact-map-soft.webp",
  properties: [
    "/property-01.webp",
    "/property-02.webp",
    "/property-03.webp",
    "/property-04.webp",
    "/property-05.webp",
    "/property-06.webp",
  ],
  blogs: ["/blog-01.webp", "/blog-02.webp", "/blog-03.webp"],
} as const;

export function propertyFallbackImage(index = 0): string {
  const list = MEDIA.properties;
  return list[index % list.length] ?? list[0];
}

export function blogFallbackImage(index = 0): string {
  const list = MEDIA.blogs;
  return list[index % list.length] ?? list[0];
}
