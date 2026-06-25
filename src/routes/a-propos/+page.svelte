<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import { getCopy } from "$i18n/copy";
  import { urlFor } from "$sanity/image";
  import { plainTextFromBlocks } from "$sanity/portable-text";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const member = $derived(data.teamMembers[0]);
  const bio = $derived(plainTextFromBlocks(member?.bio));
  const photoUrl = $derived(
    member?.photo?.asset
      ? urlFor(member.photo).width(640).height(800).fit("crop").url()
      : undefined,
  );
</script>

<PageHeader
  eyebrow={copy.about.eyebrow}
  title={copy.about.title}
  intro={copy.about.intro}
/>

{#if member}
  <section class="container-editorial pb-24 md:pb-32">
    <div class="grid items-start gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      {#if photoUrl}
        <div class="aspect-[4/5] overflow-hidden rounded-sm">
          <img
            src={photoUrl}
            alt={member.photo.alt ?? member.name}
            class="h-full w-full object-cover"
          />
        </div>
      {/if}

      <div class={photoUrl ? "" : "max-w-3xl"}>
        <h2 class="font-display text-4xl text-primary">{member.name}</h2>
        <p class="mt-2 text-sm uppercase tracking-[0.08em] text-gold">
          {member.role}
        </p>
        {#if bio}
          <p class="mt-6 text-lg leading-relaxed text-secondary">{bio}</p>
        {/if}
      </div>
    </div>
  </section>
{/if}