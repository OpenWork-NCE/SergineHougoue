<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import ServiceAccordion from "$components/content/ServiceAccordion.svelte";
  import { getCopy } from "$i18n/copy";
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

<ServiceAccordion {services} />