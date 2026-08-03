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
  eyebrow={copy.transactions.eyebrow}
  title={copy.transactions.title}
  intro={copy.transactions.intro}
/>

<section class="container-editorial pb-16 md:pb-24">
  <h2 class="eyebrow mb-8 text-burgundy">{copy.transactions.soldHeading}</h2>
  {#if data.soldProperties.length > 0}
    <PropertyGrid
      properties={data.soldProperties}
      locale={data.locale}
      basePath={base}
    />
  {:else}
    <p class="text-secondary">{copy.transactions.emptySold}</p>
  {/if}
</section>
