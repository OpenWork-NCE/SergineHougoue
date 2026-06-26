<script lang="ts">
  import { page } from "$app/state";
  import "../app.css";
  import SeoHead from "$components/seo/SeoHead.svelte";
  import CookieBanner from "$components/layout/CookieBanner.svelte";
  import Footer from "$components/layout/Footer.svelte";
  import Nav from "$components/layout/Nav.svelte";
  import WhatsAppFab from "$components/layout/WhatsAppFab.svelte";
  import { getCopy } from "$i18n/copy";
  import type { LayoutData } from "./$types";
  import type { Post, Property } from "$sanity/types";

  interface Props {
    data: LayoutData;
    children?: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();

  const isStudio = $derived(page.url.pathname.startsWith("/studio"));

  // SEO derivation: layout always provides siteSettings + locale (via +layout.server + +layout.ts);
  // leaf page data (post, property, or explicit) provides per-page overrides without per-page head duplication.
  const routeData = $derived(page.data);
  const locale = $derived(data.locale || routeData.locale || ("fr" as const));
  const siteSettings = $derived(
    data.siteSettings ?? routeData.siteSettings ?? null,
  );
  const copy = $derived(getCopy(locale));
  const currentPath = $derived(page.url.pathname);

  const effectiveTitle = $derived.by(() => {
    if (routeData.title) return String(routeData.title);
    if (routeData.post) {
      const post = routeData.post as Post;
      return post.seo?.metaTitle || post.title;
    }
    if (routeData.property) {
      const prop = routeData.property as Property;
      return prop.title;
    }
    // derive bilingual titles for static routes from getCopy + siteSettings
    const p = currentPath.replace(/^\/(fr|en)/, "") || "/";
    const brand = siteSettings?.brandName || "";
    if (p === "/" || p === "")
      return siteSettings?.defaultSEO?.metaTitle || brand || copy.hero.title;
    if (p.startsWith("/biens"))
      return `${copy.listings.title}${brand ? ` | ${brand}` : ""}`;
    if (p.startsWith("/blog"))
      return `${copy.blog.title}${brand ? ` | ${brand}` : ""}`;
    if (p.startsWith("/a-propos"))
      return `${copy.about.title}${brand ? ` | ${brand}` : ""}`;
    if (p.startsWith("/services"))
      return `${copy.services.title}${brand ? ` | ${brand}` : ""}`;
    if (p.startsWith("/transactions"))
      return `${copy.transactions.title}${brand ? ` | ${brand}` : ""}`;
    if (p.startsWith("/contact"))
      return `${copy.contact.title}${brand ? ` | ${brand}` : ""}`;
    if (p.startsWith("/politique-confidentialite"))
      return locale === "fr"
        ? "Politique de confidentialité"
        : "Privacy Policy";
    return (
      siteSettings?.defaultSEO?.metaTitle || brand || "Sergine Hougoue Immo"
    );
  });

  const effectiveDescription = $derived.by(() => {
    if (routeData.description) return String(routeData.description);
    if (routeData.post) {
      const post = routeData.post as Post;
      return post.seo?.metaDescription || post.excerpt;
    }
    if (routeData.property) {
      const prop = routeData.property as Property;
      return `${prop.title} — ${prop.address}, ${prop.city}. ${prop.bedrooms} ${copy.property.beds}, ${prop.bathrooms} ${copy.property.baths}, ${prop.area} ${copy.property.area}.`;
    }
    const p = currentPath.replace(/^\/(fr|en)/, "") || "/";
    if (p === "/" || p === "")
      return (
        siteSettings?.defaultSEO?.metaDescription || copy.hero.subtitle || ""
      );
    if (p.startsWith("/contact")) return copy.contact.intro || "";
    if (p.startsWith("/biens")) return copy.listings.intro || "";
    if (p.startsWith("/blog")) return copy.blog.intro || "";
    if (p.startsWith("/a-propos")) return copy.about.intro || "";
    if (p.startsWith("/services")) return copy.services.intro || "";
    if (p.startsWith("/transactions")) return copy.transactions.intro || "";
    return siteSettings?.defaultSEO?.metaDescription || "";
  });

  const effectiveOgImage = $derived.by(() => {
    if (routeData.ogImage) return routeData.ogImage;
    if (routeData.post) {
      const post = routeData.post as Post;
      return post.seo?.ogImage || post.coverImage;
    }
    if (routeData.property) {
      const prop = routeData.property as Property;
      return prop.photos?.[0];
    }
    return siteSettings?.defaultSEO?.ogImage;
  });
</script>

<SeoHead
  title={effectiveTitle}
  description={effectiveDescription || undefined}
  ogImage={effectiveOgImage}
  {locale}
  path={currentPath}
  {siteSettings}
/>

{#if isStudio}
  {@render children?.()}
{:else}
  <Nav currentPath={page.url.pathname} locale={data.locale} />

  <main>
    {@render children?.()}
  </main>

  <Footer locale={data.locale} />

  <CookieBanner locale={data.locale} />

  <WhatsAppFab phone="14384626015" locale={data.locale} />
{/if}
