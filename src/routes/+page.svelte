<script lang="ts">
  import Hero from "$components/content/Hero.svelte";
  import { getCopy } from "$i18n/copy";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
</script>

<Hero
  eyebrow={copy.hero.eyebrow}
  title={copy.hero.title}
  subtitle={copy.hero.subtitle}
  ctaHref={`${base}/contact`}
  ctaLabel={copy.nav.cta}
/>