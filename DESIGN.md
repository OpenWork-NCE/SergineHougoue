# DESIGN.md : Sergine Hougoue Immo

Identité visuelle **actuelle** du site (code source de vérité : `src/app.css`, composants sous `src/lib/components/`).

## Positionnement

Courtière immobilière premium au Québec : éditorial, calme, confiant. Canvas crème en mode clair par défaut ; mode sombre optionnel. Accents **bordeaux** (marque) et **or** (prix, liens secondaires).

## Thèmes

Attribut `data-theme="light" | "dark"` sur `<html>`. Préférence stockée en `localStorage` (`sergine_theme`).

### Light (défaut)

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--bg-canvas` | `#f5f2ec` | Fond page |
| `--bg-surface` | `#ede8df` | Cartes, footer |
| `--bg-elevated` | `#faf7f2` | Inputs, surfaces élevées |
| `--text-primary` | `#0e0e0e` | Titres, corps |
| `--text-secondary` | `#4a463f` | Secondaire (contraste AA) |
| `--text-muted` | `#5c574f` | Meta |
| `--border-hairline` | `rgba(14,14,14,0.08)` | Séparateurs |
| `--brand-burgundy` | `#6e1f2e` | CTA, actif nav, badge Vendu |
| `--brand-gold` | `#c9a24a` | Accents décoratifs |
| `--brand-gold-text` | `#8a6a1f` | Texte or lisible sur crème |
| `--text-on-brand` | `#f5f2ec` | Texte sur bouton bordeaux |

### Dark

| Token | Valeur |
| ----- | ------ |
| `--bg-canvas` | `#0e0e0e` |
| `--bg-surface` | `#161616` |
| `--bg-elevated` | `#1f1f1f` |
| `--text-primary` | `#f5f2ec` |
| `--text-secondary` | `#a8a29a` |
| `--brand-burgundy` | `#6e1f2e` (inchangé) |
| `--brand-gold-text` | `#c9a24a` |

## Typographie

- **Display / titres** : `Fraunces`, ui-serif, Georgia (poids 300)
- **Corps** : `Inter`, system-ui (poids 300–600)
- **Eyebrow** : uppercase, tracking ~`0.1em`, `text-xs`

## Layout

- Conteneur : `.container-editorial` → `max-w-[1360px]`, gutters `px-5` → `lg:px-12`
- Sections : `.section-y` → `py-16 md:py-24 lg:py-28`
- Cartes : `.card` → surface, border hairline, `rounded-2xl`
- Boutons : `.btn-primary` (pill bordeaux), `.btn-secondary`, `.btn-ghost`

## Navigation

Desktop (`lg+`) :

```
[ Logo Sergine Hougoue ]  Biens · Transactions · Services · Blog · À propos  [Theme] [FR|EN] [Prendre rendez-vous]
```

- Contact = CTA (pas de doublon dans les liens primaires)
- Actif : soulignement bordeaux
- Mobile : drawer (focus trap, Escape, scroll lock) + lien secondaire Équipe & partenaires

## Pages clés

| Page | Pattern |
| ---- | ------- |
| Accueil | Hero full-bleed cinéma + biens en vedette + territoire QC + pourquoi + témoignages + CTA |
| Biens | Filtres type + grille cartes |
| Transactions | Grille vendus (badge Vendu, sans faux prix) |
| Détail bien | Galerie multi-images + stats + description + aside sticky (prix CAD / specs / CTA) |
| Équipe | Carte lead Sergine + réseau + logos partenaires |
| Contact | Coordonnées + formulaire Resend + embed Cal.com |

## Composants principaux

| Composant | Rôle |
| --------- | ---- |
| `Hero.svelte` | Hero full / contenu bas |
| `PropertyCard.svelte` | Carte listing / vendu |
| `PropertyGallery.svelte` | Galerie détail (thumbs, flèches) |
| `PropertyCarousel.svelte` | Carrousel Embla (accueil) |
| `TeamMemberCard.svelte` | Cartes équipe (featured lead) |
| `ServiceAccordion.svelte` | Services |
| `Nav.svelte` / `Footer.svelte` | Chrome |
| `ThemeToggle` / `LangToggle` | Préférences |

## Icônes

**Lucide** (`lucide-svelte`) uniquement, stroke ~1.75.

## Accessibilité

- Contraste AA light + dark (or texte dédié)
- Focus visible (`outline` accent)
- Cibles min ~44px (`min-h-11`)
- `prefers-reduced-motion` respecté sur carrousels / reveals
- Alt images obligatoires (Sanity + fallbacks)

## Anti-patterns

- Pas de jargon technique (CMS, Sanity) dans le copy public
- Pas de tirets cadratins (`—`) dans le copy public
- Pas de prix / specs inventés sur le portfolio vendu
- Pas de faux “AI gradient” génériques : photos réelles + tokens marque
