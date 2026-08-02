# Images à générer / fournir — Sergine Hougoue Immo

**But :** inventaire des visuels pour la refonte.  
**Statut (2026-08-02) :** fichiers générés déposés sous **`static/`** (URLs `/nom.webp`), pas sous `static/placeholders/`.  
**Manque optionnel :** `team-sergine-portrait.webp` (4:5) — interim : `/Profil.png`.

### Style global (à coller dans chaque prompt)

```
Professional real-estate photography, Quebec / Montreal atmosphere,
natural warm light, refined editorial luxury, photorealistic, no text,
no watermark, no logo, no distorted hands or faces, high detail,
architectural credibility, muted cream and warm neutrals with subtle
burgundy or brass accents in the environment only — not purple AI gradients.
```

**Style FR (optionnel) :**

```
Photographie immobilière professionnelle, ambiance Québec / Montréal,
lumière naturelle chaude, luxe éditorial raffiné, photoréaliste,
aucun texte ni filigrane, pas de déformations, crédible architecture.
```

**Interdits communs :** look cartoon, 3D render cheap, néon cyberpunk, sourire stock forcé, horloge à 6 doigts, texte illisible dans l’image.

---

## P0 — Critique (générer en premier)

### 1. `hero-home.webp` — Hero accueil (LCP)

| | |
| --- | --- |
| **Chemin** | `static/placeholders/hero-home.webp` (ou `.jpg`) |
| **Ratio** | 3:2 ou 16:9 large (export **2400×1600** ou **2400×1350**) |
| **Usage** | Full-bleed hero home light/dark (overlay CSS) |
| **Préférence réelle** | Photo d’architecture Montréal/Rive-Nord **ou** portrait environnemental de Sergine sur le terrain |

**Prompt (EN) :**

```
Wide cinematic photograph of a refined residential street or modern
condo exterior at golden hour in Montreal, Quebec. Soft warm sunlight,
maple trees, limestone or brick facades, quiet upscale neighborhood.
Shot on 35mm lens, shallow depth of field on background, editorial
real-estate magazine style. Horizontal 16:9 composition with open
lower third for dark gradient text overlay. No people or small
anonymous silhouettes only. Photorealistic, natural color grade,
cream and warm grey tones, subtle luxury — not flashy.
```

**Variante portrait Sergine (si tu as une vraie photo : l’utiliser plutôt) :**

```
Environmental portrait of a confident professional Black woman real
estate broker in her 30s–40s, standing outside a Montreal residential
building at golden hour, tailored coat, warm natural light, shallow
depth of field, editorial luxury real-estate branding photo, 3:4 or
4:5 crop friendly, photorealistic, respectful, no text.
```

---

### 2. `team-sergine-portrait.webp` — Portrait pro

| | |
| --- | --- |
| **Chemin** | `static/placeholders/team-sergine-portrait.webp` |
| **Ratio** | **4:5** (export **1600×2000**) |
| **Usage** | À propos, Équipe & partenaires, parfois hero secondaire |
| **Préférence réelle** | **Forte** — shoot studio ou lumière fenêtre ; remplacer l’IA dès que possible |

**Prompt (EN) — uniquement si pas de photo réelle :**

```
Studio-quality head-and-shoulders portrait of a professional Black
woman real estate broker, 30s–40s, natural makeup, warm confident
expression, soft key light, subtle cream backdrop, burgundy blazer
optional, photorealistic, 4:5 vertical, magazine quality, no text,
no logo.
```

**Note :** Si tu as déjà `static/Profil.png`, on peut l’utiliser en interim, mais un portrait 4:5 net est requis pour la refonte.

---

### 3. `og-default.webp` — Partage social

| | |
| --- | --- |
| **Chemin** | `static/og-default.webp` (racine static) |
| **Ratio** | **1.91:1** → **1200×630** exact |
| **Usage** | Open Graph / Twitter cards par défaut |

**Prompt (EN) :**

```
Horizontal Open Graph banner image 1200x630, elegant Montreal
residential architecture at dusk, warm windows glow, soft bokeh,
luxury real-estate brand feel, clean negative space on left third
for optional text overlay later, no existing text, photorealistic.
```

---

## P1 — Accueil & services (ambiance)

### 4. `home-why.webp` — Section « Pourquoi moi »

| | |
| --- | --- |
| **Chemin** | `static/placeholders/home-why.webp` |
| **Ratio** | 4:5 ou 3:4 (**1200×1500**) |
| **Usage** | Colonne image section piliers home |

**Prompt (EN) :**

```
Detail photograph of a bright residential interior in Quebec: oak
floors, linen curtains, soft morning light through large windows,
tasteful minimal furniture, calm aspirational home atmosphere,
vertical 4:5, photorealistic, no people, no text.
```

---

### 5. `services-ambient.webp` — Services

| | |
| --- | --- |
| **Chemin** | `static/placeholders/services-ambient.webp` |
| **Ratio** | 16:9 (**1920×1080**) |
| **Usage** | Bandeau ou intro page Services |

**Prompt (EN) :**

```
Wide editorial photo of keys and a property brochure on a stone
countertop with soft natural light, subtle brass accents, blurred
modern kitchen background, Quebec home interior, horizontal 16:9,
photorealistic, no readable text on papers.
```

---

### 6. `about-journey.webp` — À propos (optionnel ambiance)

| | |
| --- | --- |
| **Chemin** | `static/placeholders/about-journey.webp` |
| **Ratio** | 16:9 ou 3:2 |
| **Usage** | Séparateur éditorial page À propos |

**Prompt (EN) :**

```
Montreal skyline or Plateau rooftops in soft autumn light, refined
documentary style, warm muted palette, wide 3:2, photorealistic,
no logos, no text.
```

---

## P2 — Biens démo (si CMS / Sanity vide)

Utiliser pour seed local ou fallbacks cartes. **Remplacer par vraies photos de mandats** dès dispo.

### 7–12. `property-0N.webp` (N = 1…6)

| | |
| --- | --- |
| **Chemin** | `static/placeholders/property-01.webp` … `property-06.webp` |
| **Ratio** | **4:3** (**1200×900**) |
| **Usage** | PropertyCard / grilles démo |

**Prompt template (EN) — varier le type :**

```
Photorealistic real-estate listing photo of a [TYPE] in Greater
Montreal, Quebec: [DETAIL]. Exterior or living room, bright natural
light, tidy staging, horizontal 4:3, professional MLS quality,
no people, no text, no watermark.
```

| File | TYPE | DETAIL |
| ---- | ---- | ------ |
| property-01 | modern condo living room | open plan, city light, light oak |
| property-02 | brick duplex exterior | Plateau-style, front steps, summer |
| property-03 | single-family kitchen | white cabinets, marble-look counters |
| property-04 | suburban house exterior | North Shore feel, landscaped yard |
| property-05 | plex staircase interior | classic Montreal wood stairs |
| property-06 | primary bedroom | calm neutral bedding, soft light |

---

## P3 — Blog covers (démo)

### 13–15. `blog-0N.webp` (N = 1…3)

| | |
| --- | --- |
| **Chemin** | `static/placeholders/blog-01.webp` … `blog-03.webp` |
| **Ratio** | **16:9** (**1200×675**) |
| **Usage** | BlogCard / fallbacks |

**Prompts (EN) :**

**blog-01 — Acheter**

```
Top-down photo of coffee, notebook, and house floor plan sketches
on oak table, morning light, 16:9, photorealistic, no readable text.
```

**blog-02 — Marché**

```
Aerial-style soft photo of suburban Quebec rooftops and trees in
late afternoon, 16:9, documentary real-estate editorial, no text.
```

**blog-03 — Mode de vie**

```
Cozy reading nook by a large window with city view, plant and linen
throw, warm light, lifestyle real-estate magazine, 16:9, no people
or silhouette only, no text.
```

---

## P4 — Divers

### 16. `contact-map-soft.webp` (optionnel)

| | |
| --- | --- |
| **Chemin** | `static/placeholders/contact-map-soft.webp` |
| **Ratio** | 16:9 |
| **Usage** | Fond discret section contact (pas une fausse carte Google) |

**Prompt (EN) :**

```
Abstract soft aerial of river and city grid resembling St. Lawrence
corridor, desaturated warm cream and grey, very soft focus, 16:9,
artistic not cartographic labels, no text.
```

### 17. Favicon

Conserver `static/favicon.svg` (marque) sauf rebrand logo.

---

## Checklist de livraison (pour toi)

Pour **chaque** fichier P0–P1 :

- [ ] Export WebP (qualité ~80) ou JPG &lt; 400 KB si possible  
- [ ] Dimensions respectées  
- [ ] Nom de fichier **exact**  
- [ ] Déposé dans le chemin indiqué  
- [ ] (Optionnel) version 2× pour retina si WebP léger  

Dis-moi quand les **P0** sont prêts ; on pourra les brancher dès l’implémentation de la refonte.

---

## Mapping code (implémentation future)

| Slot | Composant / page |
| ---- | ---------------- |
| hero-home | `Hero` home full-bleed |
| team-sergine-portrait | About, Équipe |
| home-why | Home section piliers |
| services-ambient | Services |
| property-0N | Fallbacks PropertyCard si pas de photo CMS |
| blog-0N | Fallbacks BlogCard |
| og-default | SeoHead |

Les images CMS Sanity (biens, posts, partenaires) restent prioritaires dès qu’elles existent.
