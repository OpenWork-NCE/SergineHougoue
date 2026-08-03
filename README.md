# Sergine Hougoue Immo

Site web bilingue (FR / EN) pour **Sergine Hougoue**, courtière immobilière certifiée OACIQ (VENDIRECT).

Construit avec **SvelteKit 2**, **Svelte 5**, **Tailwind CSS**, **Sanity** (contenu), déployable sur **Vercel**.

## Documentation

| Fichier | Contenu |
| ------- | ------- |
| [DESIGN.md](./DESIGN.md) | Identité visuelle, tokens, composants UI |
| [docs/architecture.md](./docs/architecture.md) | Stack, routes, CMS, i18n, données |
| [docs/media.md](./docs/media.md) | Inventaire des médias statiques |

## Prérequis

- Node.js 20+
- Compte [Sanity](https://www.sanity.io/manage) (projet + dataset)
- Optionnel : compte Resend (formulaire contact), Cal.com (prise de RDV)

## Installation

```bash
npm install
cp .env.example .env.local
```

Renseigner au minimum dans `.env.local` :

```bash
PUBLIC_SANITY_PROJECT_ID=...
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...      # Editor (seed / mutations)
SANITY_READ_TOKEN=...     # Viewer ou Editor (lecture serveur)
PUBLIC_SITE_URL=http://localhost:5173
```

Les variables `PUBLIC_*` et les tokens privés sont lus via les modules SvelteKit `$env/dynamic/*` (pas seulement `import.meta.env`).

## Développement

```bash
npm run dev          # http://localhost:5173
npm run check        # svelte-check
npm run test         # Vitest (unit + component)
npm run test:e2e     # Playwright
npm run build
npm run preview
```

## Contenu Sanity

- Schémas : `src/lib/sanity/schemas/`
- Studio embarqué : `/studio` (auth Sanity)
- Loaders : `src/lib/sanity/load-cms.ts`
- Seed (listings démo + portfolio vendu FR/EN) :

```bash
npm run seed:sanity
# réécrire aussi settings / team / témoignages :
npm run seed:sanity -- --force
```

Le seed upsert les documents `property` (statut `a-vendre` ou `vendu`). Les biens vendus peuvent utiliser un chemin public `imagePath` (ex. `/properties/sold/...webp`) tant que les assets ne sont pas uploadés dans Studio.

### Types de contenu principaux

| Type | Usage |
| ---- | ----- |
| `property` | Biens (`a-vendre`, `vendu`, `en-primeur`) |
| `post` | Articles de blog |
| `teamMember` | Équipe (optionnel, fallback roster statique) |
| `partner` | Partenaires |
| `testimonial` | Témoignages |
| `siteSettings` | Singleton marque / contact / SEO / cookies |

Documents i18n : champ `language` = `fr` \| `en` (plugin document internationalization).

## Structure du dépôt

```
src/
  lib/
    components/     # UI (content, layout, forms, seo)
    i18n/           # copy, locales, services, regions
    properties/     # DisplayProperty, galerie
    sanity/         # client, queries, schemas, seed
    team/           # roster statique (Steve, Sara, Guy, Sergine)
    server/         # contact schema + Resend
  routes/           # pages SvelteKit (locale via hooks reroute)
static/
  properties/sold/  # photos portfolio vendu (servies par le site)
scripts/
  seed-sanity.ts
  property-seed.ndjson
tests/              # unit, component, e2e
```

## Routes publiques (préfixe `/fr` ou `/en`)

| Chemin | Description |
| ------ | ----------- |
| `/` | Accueil |
| `/biens` | Listings actifs (Sanity, hors `vendu`) |
| `/biens/[slug]` | Détail bien ou transaction |
| `/transactions` | Portfolio vendu (`status == vendu`) |
| `/services` | Services (copy i18n) |
| `/blog`, `/blog/[slug]` | Blog |
| `/a-propos` | À propos |
| `/equipe-partenaires` | Équipe + partenaires |
| `/contact` | Formulaire + Cal embed |
| `/politique-confidentialite` | Confidentialité |
| `/studio` | Sanity Studio |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Prix

Les montants s’affichent en **dollars canadiens (CAD)** via `formatPrice` (`749 000 $ CA` / `CAD $749,000`).

## Crédit

Site conçu par Digital House Compagny (footer).

## Licence

Projet privé pour le client Sergine Hougoue / VENDIRECT.
