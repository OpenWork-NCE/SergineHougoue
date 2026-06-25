<script lang="ts">
  import "../app.css";
  import CookieBanner from "$components/layout/CookieBanner.svelte";
  import Footer from "$components/layout/Footer.svelte";
  import Nav from "$components/layout/Nav.svelte";
  import WhatsAppFab from "$components/layout/WhatsAppFab.svelte";
  import type { LayoutData } from "./$types";

  interface Props {
    data: LayoutData;
    children?: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();
</script>

<Nav currentPath={`/${data.locale}/`} locale={data.locale} />

<main>
  {@render children?.()}
</main>

<Footer locale={data.locale} />

<CookieBanner locale={data.locale} />

<WhatsAppFab phone="14384626015" locale={data.locale} />