# Médias statiques

Fichiers servis depuis `static/` (URL publique = chemin sous `/`).

## Branding & pages

| Asset | URL | Notes |
| ----- | --- | ----- |
| Hero home | `/hero-home.webp` | Full-bleed accueil |
| Hero portrait | `/hero-home-portrait.webp` | Variante optionnelle |
| Portrait Sergine | `/team-sergine-portrait.webp` | 4:5 |
| Steve / Sara | `/team-steve-portrait.png`, `/team-sara-portrait.png` | |
| Fallback portrait | `/team-default-portrait.svg`, `/Profil.png` | |
| OG | `/og-default.webp` | 1200×630 |
| Home why / services / about / contact map | `/home-why.webp`, `/services-ambient.webp`, `/about-journey.webp`, `/contact-map-soft.webp` | |
| Fallbacks biens | `/property-01.webp` … `/property-06.webp` | Galerie / cartes |
| Fallbacks blog | `/blog-01.webp` … `/blog-03.webp` | |

Constantes : `src/lib/media.ts`.

## Portfolio vendu

Photos livrables client, redimensionnées webp :

```
static/properties/sold/*.webp
```

Référencées en Sanity via `imagePath` (ex. `/properties/sold/condo-vendu-montreal.webp`) jusqu’à upload Studio.

**Ne pas versionner** le dossier source `static/propriétés/` (doublons) : il est ignoré par git.

## Placeholders / prompts

Historique génération : `static/placeholders/` (prompts et inventaire legacy).
