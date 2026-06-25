<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import PropertyGrid from "$components/content/PropertyGrid.svelte";
  import { getCopy } from "$i18n/copy";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
</script>

<PageHeader
  eyebrow={copy.listings.eyebrow}
  title={copy.listings.title}
  intro={copy.listings.intro}
/>

<section class="container-editorial pb-24 md:pb-32">
  <PropertyGrid
    properties={data.properties}
    locale={data.locale}
    basePath={base}
  />
</section>
