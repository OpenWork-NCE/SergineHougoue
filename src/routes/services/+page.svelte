<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import ServiceAccordion from "$components/content/ServiceAccordion.svelte";
  import { getCopy } from "$i18n/copy";
  import { MEDIA } from "$lib/media";
  import { getServices } from "$i18n/services";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const services = $derived(getServices(data.locale));
</script>

<PageHeader
  eyebrow={copy.services.eyebrow}
  title={copy.services.title}
  intro={copy.services.intro}
/>

<div class="border-b border-[color:var(--border-hairline)]">
  <div class="container-editorial py-10 md:py-12">
    <div
      class="aspect-[21/9] max-h-[280px] overflow-hidden rounded-2xl border border-[color:var(--border-hairline)] bg-surface md:max-h-[360px]"
    >
      <img
        src={MEDIA.servicesAmbient}
        alt=""
        class="h-full w-full object-cover"
        loading="lazy"
        width="1920"
        height="1080"
      />
    </div>
  </div>
</div>

<section class="container-editorial py-16 md:py-24">
  <div class="mx-auto max-w-3xl">
    <ServiceAccordion {services} />
  </div>
</section>
