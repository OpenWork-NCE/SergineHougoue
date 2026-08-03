<script lang="ts">
  import type { Locale } from "$i18n/locales";
  import type { DisplayProperty } from "$lib/properties/types";
  import PropertyCard from "./PropertyCard.svelte";

  interface Props {
    properties: DisplayProperty[];
    locale: Locale;
    basePath: string;
  }

  let { properties, locale, basePath }: Props = $props();
</script>

{#if properties.length > 0}
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each properties as property, i (property._id)}
      <PropertyCard {property} {locale} {basePath} fallbackIndex={i} />
    {/each}
  </div>
{:else}
  <p class="text-secondary">—</p>
{/if}
