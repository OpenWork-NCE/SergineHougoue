# Design: Refonte visuelle complète — Sergine Hougoue Immo

**Date**: 2026-08-02  
**Status**: Approved in brainstorming (Approach A) — ready for implementation planning  
**Stack**: SvelteKit 2 + Svelte 5 + Tailwind + dual theme (existing)  
**Related**: prior product design, theme/partners/territory specs

## 1. Purpose

Refondre **tout le site public** pour qu’il paraisse conçu par un **designer senior**, pas un template ni un rendu « généré par IA » : hero d’accueil fort, menu allégé, motion premium fluide, responsive irréprochable, photographie professionnelle (mix réel + placeholders IA).

**Objectifs business inchangés** : convertir vers prise de RDV / WhatsApp / formulaire.

**Hors scope** : nouveaux produits, CRM, GSAP/Lenis, hamburger « démo », changement de stack CMS.

## 2. Locked decisions

| Sujet | Décision |
| ----- | -------- |
| Direction | **Éditorial luxe** (crème, bourgogne, or) |
| Thèmes | **Light + dark** (les deux soignés) |
| Motion | **Premium fluide** — CSS + IntersectionObserver + transitions Svelte ; Embla pour carrousels |
| Nav | **Courte** : Biens · Services · À propos · Contact + logo + RDV + langue + thème |
| Secondaire | Transactions · Blog · Équipe & partenaires → **footer** (+ liens contextuels home) |
| Scope livrable | **Tout le site public** d’un coup (cohérence) |
| Images | **Mix** : photos réelles Sergine/biens + slots + prompts IA |
| Anti-pattern | Look « site généré par IA » (voir §3) |
| Responsive | Mobile-first **parfait** (375 / 768 / 1024 / 1440) |

## 3. « Main d’expert » — règles anti-IA (non négociables)

« Main d’expert » = rendu **pensé et soigné**, pas générique.

**À faire**

- Peu d’éléments par section, **beaucoup d’air** (density basse).
- Hiérarchie typo claire (un seul H1 fort, H2 mesurés).
- Asymétrie **volontaire** (hero, about) plutôt que grilles 3×3 clones.
- Photographie avec **grain/lumière crédible** ; pas de stock « sourire IA ».
- Détails : filets hairline, compteurs `01 /`, baselines alignées, hover 200–300 ms.
- Copy courte, calme, sans points d’exclamation.

**À éviter**

- Gradients violet/bleu SaaS, glassmorphism partout, néons.
- 6+ cartes identiques même ombre même icône emoji.
- Animations bounce/spin décoratives, scroll-jacking.
- Menu saturé (8+ items primaires).
- Hero split « texte gauche / mugshot droite » sans direction art.
- Filtres en anglais « Villa / Apartment » décalés du modèle QC.

## 4. Design system

### 4.1 Color (conserver marque, affiner usage)

**Light (défaut)**

| Token | Rôle | Cible |
| ----- | ---- | ----- |
| `--bg-canvas` | Page | `#F5F2EC` crème |
| `--bg-surface` | Bandes / cartes | `#EDE8DF` |
| `--bg-elevated` | Inputs, chips | `#FAF7F2` |
| `--text-primary` | Corps | `#0E0E0E` |
| `--text-secondary` | Secondaire | warm grey AA |
| `--brand-burgundy` | CTA, accents | `#6E1F2E` |
| `--brand-gold` | Déco | `#C9A24A` |
| `--brand-gold-text` | Texte or AA | `#8A6A1F` light |
| `--text-on-brand` | Sur bourgogne | crème |
| `--border-hairline` | Filets | rgba sombre faible |

**Dark** : canvas près-noir, texte crème, mêmes bourgogne/or (gold-text = gold).

Composants : **pas** de `border-white/*` hardcodé ; tokens uniquement.

### 4.2 Typography

| Rôle | Famille | Usage |
| ---- | ------- | ----- |
| Display | **Fraunces** (gardée, mieux calibrée) | H1/H2, logo wordmark |
| Body | **Inter** | UI, paragraphes |
| Eyebrow | Inter caps + tracking | Labels section |

Échelle (mobile → desktop) : body 16 / 1.55 ; H1 hero ~clamp(2.5rem, 6vw, 4.5rem) ; H2 ~clamp(1.75rem, 3vw, 2.5rem).  
Pas de texte body &lt; 14px.

### 4.3 Spacing & layout

- Container max **1280–1360px**, gutters 20 / 32 / 48.
- Sections : `py-16 md:py-24 lg:py-28` (aéré).
- Grilles : 1 col mobile → 2 → 3 max pour biens ; éviter 4 cols denses sur mobile.
- Radius : cartes `rounded-2xl` images ; boutons `rounded-full` ; pas de « squircle » gadget.

### 4.4 Motion (premium fluide)

| Effet | Où | Spec |
| ----- | --- | ---- |
| Scroll reveal | Sections, cartes | opacity 0→1, y 16–24px, 400–600ms, ease editorial `cubic-bezier(0.22,1,0.36,1)` |
| Stagger | Grilles (≤6 items) | 40–80ms entre items |
| Image hover | Property/Blog cards | scale 1.03–1.05 sur img, 300ms ; overflow hidden |
| Nav | Scroll | fond canvas/95 + blur quand scrolled |
| Hero enter | Home only | fade + léger y sur copy ; image ken-burns **très** subtil ou none |
| Page | Route change | optionnel soft fade Svelte ; pas de Flip GSAP |

**`prefers-reduced-motion: reduce`** : reveals instantanés (opacity only or none), pas de ken-burns, carrousel sans autoplay.

**Implémentation** : utilitaire `.reveal` + `IntersectionObserver` (ou action Svelte) ; **pas de GSAP** en v1.

### 4.5 Responsive (parfait)

| Breakpoint | Exigences |
| ---------- | --------- |
| 375 | Nav drawer ; hero lisible ; CTA 44px ; pas de overflow-x |
| 768 | 2 cols biens ; hero peut rester stack |
| 1024 | Nav desktop courte ; grilles 3 |
| 1440 | Container centré ; pas d’étirement infini |

Checklist QA : iPhone SE / 14, iPad, desktop ; light + dark ; FR + EN.

## 5. Navigation & chrome

### 5.1 Primary nav (desktop)

```
[ Logo Sergine Hougoue ]    Biens · Services · À propos · Contact    [Theme] [FR|EN] [Prendre RDV]
```

- Logo → `/{locale}/`
- Active state : text-primary + hairline ou fond state-hover discret
- Sticky, height 64–72px mobile / 72–80px desktop

### 5.2 Mobile

- Left : logo  
- Right : Theme (optionnel icône) + RDV + **Menu** (icône 44px)  
- Drawer full-height ou panel : liens primaires + Lang + Theme + lien footer secondaires en petit  
- Focus trap + Escape + body scroll lock  
- `aria-expanded` / `aria-controls`

### 5.3 Footer

Colonnes :

1. Brand + tagline  
2. **Explorer** : Biens, Services, À propos, Contact  
3. **Ressources** : Transactions, Blog, Équipe & partenaires  
4. Contact + hours + privacy  

Social si CMS. Copyright VENDIRECT.

### 5.4 Global

- WhatsApp FAB (z sous cookie si besoin)  
- Cookie banner Law 25  
- Studio `/studio` sans chrome public  

## 6. Page patterns

### 6.1 Home (priorité visuelle #1)

**Hero — remplacer entièrement l’actuel**

- Full-bleed (min-h ~85–100svh) image pro (`hero-home.webp`)  
- Overlay gradient bas (canvas/dark) pour lisibilité **dans les deux thèmes**  
- Contenu bas-gauche (desktop) / bas (mobile) :  
  - eyebrow OACIQ / VENDIRECT  
  - H1 (Fraunces, clamp large)  
  - sous-titre 1–2 lignes  
  - **Dual CTA** : primaire RDV · secondaire « Voir les biens » (ghost/outline)  
  - scroll cue  
- Photo : architecture Montréal / intérieur chaleureux **ou** portrait environnemental Sergine (voir IMAGE-PROMPTS)  
- **Interdit** : mugshot flottant type carte d’identité à droite sans direction art

**Section 2 — Biens en vitrine**

- Titre + lien « Tous les biens »  
- 3–6 `PropertyCard` (données CMS) ; si vide : état vide élégant + CTA contact  
- Filtres : **uniquement types Sanity réels** (unifamiliale, condo, plex…) i18n — **supprimer** Villa/Apartment/House/Land EN

**Section 3 — Pourquoi travailler avec moi**

- Max **3** piliers (pas 8) : écoute, marché, réseau partenaires  
- Layout asymétrique possible (texte + image ambient `home-why.webp`)

**Section 4 — Témoignages**

- Carrousel Embla ou row chips ; autoplay off ou 6s + pause hover ; reduced-motion = static

**Section 5 — Territoire**

- Intro + grille 17 régions (déjà en place) ; style chips plus raffiné (pas « tags Bootstrap »)

**Section 6 — CTA final**

- Bande pleine largeur surface/burgundy soft ; H2 + bouton RDV

### 6.2 Biens (index)

- Header éditorial + count  
- Filtres type **i18n** sticky sous nav  
- Grid responsive 1/2/3  
- Empty state soigné  

### 6.3 Bien (détail)

- Galerie : image principale large + thumbs ; lightbox optionnel v1 = scroll gallery OK  
- Prix / specs / description portable text  
- CTA sticky mobile « Demander une visite » → contact  

### 6.4 Services

- Accordion accessible (existant) + **intro visuelle** (image `services-ambient.webp`)  
- Espacement + reveal  

### 6.5 À propos

- Storytelling 2 cols : texte + portrait pro `team-sergine-portrait.webp`  
- Expertise : 5 cartes (déjà flip + location) — grille 1/2/3, pas d’icônes emoji  
- Témoignages + CTA  

### 6.6 Transactions

- Header + grille vendus (badge Vendu)  
- Pas de partenaires ici (page dédiée)  

### 6.7 Blog index / post

- Cards 16:9 ; meta date/catégorie  
- Post : hero image, prose max-width ~65ch, typo lisible  

### 6.8 Équipe & partenaires

- Portrait Sergine + fallbacks  
- Logos partenaires par catégorie (dont courtier hypothécaire)  
- États vides  

### 6.9 Contact

- Split : coordonnées (phone/email/WhatsApp/heures) | formulaire (message **optionnel**) + Cal embed  
- Pas de clutter ; labels visibles ; erreurs inline  

### 6.10 Privacy

- Prose simple, même container  

## 7. Images & placeholders

Voir fichier livrable :

**`static/placeholders/IMAGE-PROMPTS.md`**

Contient : chaque fichier cible, ratio, usage, **prompt EN/FR** pour génération, notes « vrai shoot prioritaire ».

Règles code :

- Chemins stables sous `static/placeholders/` ou `static/media/`  
- `loading="lazy"` hors hero LCP  
- Dimensions / aspect-ratio CSS pour CLS  
- Alt bilingue via copy ou CMS  
- OG : `og-default.webp` 1200×630  

Priorité génération utilisateur :

1. `hero-home` (LCP)  
2. `team-sergine-portrait`  
3. `og-default`  
4. Ambiance home/services  
5. Couvertures blog / biens démo si CMS vide  

## 8. Component architecture (changes)

| Component | Change |
| --------- | ------ |
| `Nav.svelte` | Liens primaires réduits ; mobile drawer **nouveau** |
| `Footer.svelte` | Secondaires + structure 4 cols |
| `Hero.svelte` | API full-bleed (variant home) vs page header |
| `PageHeader.svelte` | Plus aéré, optional background image |
| `PropertyCard` | Image hover, badge status, typo prix |
| `Reveal` (new) | Action/wrapper scroll reveal |
| `MobileNav` / drawer (new) | Accessible sheet |
| Home `+page.svelte` | Nouvelle structure sections |
| Filtres biens | Align types Sanity + i18n |

## 9. i18n

- Nav labels déjà en copy ; retirer secondaires du `links` nav  
- Filtres types via `copy.property.types`  
- Home filter labels EN hardcodés **supprimés**  
- Drawer aria-labels FR/EN  

## 10. Accessibility

- Contrast AA light + dark (déjà gold-text / on-brand)  
- Focus visible cream/burgundy  
- Drawer keyboard  
- Motion reduce  
- Images alt  
- Ne pas animer si reduced-motion  

## 11. Testing

| Type | Couverture |
| ---- | ---------- |
| Component | Nav (4 links + drawer), Hero home, Reveal, Footer secondary links |
| E2E | Home hero CTAs ; mobile menu open/close ; light/dark still works ; key routes 200 |
| Visual QA | Checklist breakpoints (manuel / Playwright screenshots optionnel) |
| A11y | axe sur home + contact + biens ; contrast |

## 12. Success criteria

1. Menu desktop ≤ 4 liens contenu + CTA ; secondaires au footer.  
2. Mobile : drawer fonctionnel, pas de menu horizontal saturé.  
3. Hero home **full-bleed** distinct de l’ancien split ; dual CTA.  
4. Light + dark cohérents.  
5. Scroll reveals fluides ; coupés en reduced-motion.  
6. Responsive sans overflow sur 375–1440.  
7. Filtres biens = types métier QC i18n.  
8. `IMAGE-PROMPTS.md` livré ; slots branchés (placeholders ou images fournies).  
9. Ressenti global : **éditorial luxe**, pas template IA.  
10. Tests unit/component + e2e smoke verts.

## 13. Implementation phasing (for planner)

Suggested task order (single plan, sequential):

1. Design tokens + Reveal motion primitive + reduced-motion  
2. Nav slim + mobile drawer + Footer secondary  
3. Hero home full-bleed + Home page restructure  
4. Property/Blog cards polish + biens filters i18n  
5. Interior pages (about, services, contact, blog, transactions, team) layout pass  
6. Wire placeholders / media paths + document IMAGE-PROMPTS  
7. Responsive + a11y + e2e polish  

## 14. Out of scope

- GSAP, Lenis, 3D, WebGL  
- Refonte Sanity schemas (sauf besoin alt/image fields already present)  
- Mobile app  
- Changing brand burgundy hex  
- Rewriting all marketing copy (only structural/i18n filter fixes)  
