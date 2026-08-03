<script lang="ts">
  import type { Locale } from "$i18n/locales";
  import type { SanityImage, SiteSettings } from "$sanity/types";
  import { urlFor } from "$sanity/image";

  interface Props {
    title?: string;
    description?: string;
    ogImage?: SanityImage;
    locale: Locale;
    path?: string;
    siteSettings?: SiteSettings | null;
  }

  let {
    title: propTitle,
    description: propDesc,
    ogImage: propOgImage,
    locale,
    path = "/",
    siteSettings = null,
  }: Props = $props();

  // Plain copies of props (snapshotted) to avoid state_referenced_locally warnings in deriveds/closures
  // svelte-ignore state_referenced_locally
  const _title = propTitle;
  // svelte-ignore state_referenced_locally
  const _description = propDesc;
  // svelte-ignore state_referenced_locally
  const _ogImage = propOgImage;
  // svelte-ignore state_referenced_locally
  const _locale = locale;
  // svelte-ignore state_referenced_locally
  const _path = path;
  // svelte-ignore state_referenced_locally
  const _siteSettings = siteSettings;

  const SITE_URL =
    (import.meta.env.PUBLIC_SITE_URL as string) || "http://localhost:5173";

  const defaultTitle =
    _siteSettings?.defaultSEO?.metaTitle ||
    _siteSettings?.brandName ||
    "Sergine Hougoue Immo";
  const defaultDesc = _siteSettings?.defaultSEO?.metaDescription || "";

  const title = _title || defaultTitle;
  const description = _description || defaultDesc;

  let ogImage = _ogImage || _siteSettings?.defaultSEO?.ogImage;

  // Resolve og:image to absolute URL. Fallback to static Profil for now (4.3 will add /api/og)
  function resolveOgImageUrl(img?: SanityImage): string {
    if (img) {
      try {
        const built = urlFor(img)
          .width(1200)
          .height(630)
          .fit("crop")
          .auto("format")
          .url();
        if (built) {
          return built.startsWith("http") ? built : `${SITE_URL}${built}`;
        }
      } catch {
        // fallthrough
      }
    }
    return `${SITE_URL}/og-default.webp`;
  }

  const ogImageUrl = resolveOgImageUrl(ogImage);

  // Use $derived for url computations to avoid svelte rune closure capture warnings on destructured props
  const pageUrl = $derived(
    _path.startsWith("http")
      ? _path
      : `${SITE_URL}${_path.startsWith("/") ? _path : `/${_path}`}`,
  );

  const frUrl = $derived.by(() => {
    const noLocalePath = _path.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
    const normalized = noLocalePath === "/" ? "/" : noLocalePath;
    return `${SITE_URL}/fr${normalized}`;
  });

  const enUrl = $derived.by(() => {
    const noLocalePath = _path.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
    const normalized = noLocalePath === "/" ? "/" : noLocalePath;
    return `${SITE_URL}/en${normalized}`;
  });

  const canonicalUrl = $derived.by(() => {
    const noLocalePath = _path.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
    const normalized = noLocalePath === "/" ? "/" : noLocalePath;
    return `${SITE_URL}/${_locale}${normalized}`;
  });

  // JSON-LD RealEstateAgent (schema.org); use $derived for rune local state ref rules
  const _jsonLd = $derived.by(() => {
    const phoneRaw = _siteSettings?.contactPhone || "4384626015";
    const phone = `+1${phoneRaw.replace(/\D/g, "")}`;
    return {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: _siteSettings?.brandName || "Sergine Hougoue",
      url: SITE_URL,
      telephone: phone,
      email: _siteSettings?.contactEmail || undefined,
      image: ogImageUrl,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Montréal",
        addressRegion: "QC",
        addressCountry: "CA",
      },
    };
  });

  // _jsonLd referenced in head script expr below
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}

  <!-- hreflang + canonical -->
  <link rel="alternate" hreflang="fr" href={frUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={frUrl} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content={locale === "fr" ? "fr_CA" : "en_CA"} />
  <meta
    property="og:site_name"
    content={siteSettings?.brandName || "Sergine Hougoue Immo"}
  />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  <meta name="twitter:image" content={ogImageUrl} />

  <!-- JSON-LD Structured Data for RealEstateAgent -->
  <script type="application/ld+json" data-testid="json-ld" data-json={JSON.stringify(_jsonLd)}>
    {JSON.stringify(_jsonLd)}
  </script>
</svelte:head>
