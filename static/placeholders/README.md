# Placeholder assets

Drop final photography here before launch (Task 4.10). Until then, components reference these paths with missing files acceptable in dev.

## Image files

| File                                  | Used by                                    | Aspect ratio | Recommended size |
| ------------------------------------- | ------------------------------------------ | ------------ | ---------------- |
| `hero.jpg`                            | Home `<Hero />`                            | 4:5          | 1200 × 1500 px   |
| `property-01.jpg` … `property-06.jpg` | `<PropertyCard />`, `<PropertyCarousel />` | 4:3          | 1200 × 900 px    |
| `team-sergine.jpg`                    | `<TeamMember />` on About                  | 4:5          | 800 × 1000 px    |
| `blog-01.jpg` … `blog-03.jpg`         | `<BlogCard />`, blog post hero             | 16:9         | 1200 × 675 px    |
| `neighborhood.jpg`                    | Services / About ambient imagery           | 16:9         | 1920 × 1080 px   |
| `interior.jpg`                        | Transactions / editorial sections          | 3:2          | 1500 × 1000 px   |

## Static root (not in this folder)

| File                | Used by                        | Aspect ratio | Recommended size |
| ------------------- | ------------------------------ | ------------ | ---------------- |
| `../favicon.svg`    | `app.html`                     | 1:1          | 32 × 32 px (SVG) |
| `../og-default.png` | `<SeoHead />`, social previews | 1.91:1       | 1200 × 630 px    |

## Guidelines

- Prefer architectural interiors, neighborhood shots, and warm natural light.
- Export as JPG (photos) or WebP where supported; keep files under 300 KB when possible.
- Provide descriptive alt text in Sanity when assets are wired to CMS fields.
