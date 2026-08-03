# Architecture

## Stack

| Couche | Choix |
| ------ | ----- |
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Styles | Tailwind 3 + tokens CSS (`src/app.css`) |
| Contenu | Sanity (headless) + Studio à `/studio` |
| i18n | Préfixe URL `/fr` \| `/en` + `reroute` (`src/hooks.ts`) |
| Email contact | Resend (`src/lib/server/resend.ts`) |
| RDV | Cal.com embed (lien env `CAL_COM_LINK`) |
| Hosting | Adapter Vercel (`@sveltejs/adapter-vercel`) |

## Flux locale

1. URL publique : `/fr/biens`, `/en/contact`, …
2. `hooks.ts` `reroute` retire le préfixe locale pour le matching de fichiers routes
3. `hooks.server.ts` pose `locals.locale`
4. `+layout.server.ts` charge `siteSettings` + expose `locale`

Copy UI : `src/lib/i18n/copy.ts` (`getCopy(locale)`).  
Régions Québec : `regions.ts`. Services accordion : `services.ts`.

## Contenu : Sanity

### Client

- `src/lib/sanity/client.ts` : client serveur, **API non-CDN**, token via `$env/dynamic/private`
- `src/lib/sanity/env.ts` : `PUBLIC_SANITY_*` via `$env/dynamic/public` (+ fallback `import.meta.env` pour les tests)

Si `PUBLIC_SANITY_PROJECT_ID` est vide / placeholder → loaders renvoient des listes vides (site toujours buildable).

### Requêtes

Fichier `src/lib/sanity/queries.ts` :

- Listings : `status != "vendu"`
- Transactions : `status == "vendu"`
- Détail : `propertyBySlug` (tous statuts)
- Posts paginés, sitemap, etc.

### Modèle `property`

Champs requis assouplis pour le portfolio vendu (prix, adresse, specs optionnels si `vendu`).

Images :

1. Tableau Sanity `photos` (préféré)
2. Sinon `imagePath` + `imageAlt` (chemin public sous `static/`)
3. Sinon fallback `property-0N.webp` (`src/lib/media.ts`)

### Seed

`npm run seed:sanity` → `scripts/seed-sanity.ts` + `src/lib/sanity/seed-data.ts`.

- Upsert toujours les `property` (FR + EN)
- Base (settings / team / témoignages) skip si `siteSettings` existe, sauf `--force`

## Couche présentation propriétés

```
Sanity Property  →  fromCmsProperty()  →  DisplayProperty  →  PropertyCard / PropertyGallery / détail
```

- `src/lib/properties/types.ts` : `DisplayProperty`, `source: "cms"`
- `src/lib/properties/gallery.ts` : résolution d’images
- **Aucune** source `sold-static` : tout passe par Sanity

## Équipe

Roster statique `src/lib/team/roster.ts` (Sergine, Steve, Sara, Guy) avec photos sous `static/`.  
Optionnel : premier `teamMember` Sanity peut enrichir la carte lead Sergine.

## Formulaires

- Validation Zod : `src/lib/server/contact-schema.ts`
- POST `/api/contact` → Resend
- Copy formulaires : `src/lib/i18n/forms.ts`

## SEO

- `SeoHead.svelte` : title, description, OG, JSON-LD agent
- `sitemap.xml` + `robots.txt` dynamiques
- `PUBLIC_SITE_URL` pour URLs absolues

## Tests

| Suite | Outil | Emplacement |
| ----- | ----- | ----------- |
| Unit / component | Vitest + Testing Library | `tests/unit`, `tests/component` |
| E2E + a11y | Playwright + axe | `tests/e2e` |
| Setup env mock | `tests/setup.ts` | stubs `$env/dynamic/*` |

## Déploiement

Variables d’environnement Vercel : mêmes clés que `.env.example` (projets Sanity + secrets).

Build : `npm run build` (adapter Vercel).

## Hors dépôt (gitignore)

Ne pas committer :

- `docs/superpowers/`, `.superpowers/` (artefacts agent)
- `Utilities to Brainstorm/` (notes client brutes)
- `.claude/`, `.worktrees/`, `.firecrawl/`
- `static/propriétés/` (doublons source ; le site sert `static/properties/sold/`)
- `.env.local`, `node_modules`, `test-results/`, etc.
