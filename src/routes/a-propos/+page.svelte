<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import TeamMember from "$components/content/TeamMember.svelte";
  import { getCopy } from "$i18n/copy";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const member = $derived(data.teamMembers[0]);
</script>

<PageHeader
  eyebrow={copy.about.eyebrow}
  title={copy.about.title}
  intro={copy.about.intro}
/>

{#if member}
  <section class="container-editorial pb-24 md:pb-32">
    <TeamMember {member} />
  </section>
{/if}