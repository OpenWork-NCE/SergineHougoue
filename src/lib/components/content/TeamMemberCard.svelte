<script lang="ts">
  import type { DisplayTeamMember } from "$lib/team/roster";

  interface Props {
    member: DisplayTeamMember;
    /** Larger featured layout for the lead broker */
    featured?: boolean;
  }

  let { member, featured = false }: Props = $props();
</script>

<article
  class="card group h-full overflow-hidden {featured
    ? 'md:col-span-2 lg:col-span-1'
    : ''}"
>
  <div
    class="relative overflow-hidden bg-surface {featured
      ? 'aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5]'
      : 'aspect-[4/5]'}"
  >
    <img
      src={member.photoSrc}
      alt={member.photoAlt}
      class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      loading="lazy"
      width="640"
      height="800"
    />
  </div>
  <div class="space-y-1.5 p-5 md:p-6">
    <h3 class="font-display text-xl text-primary md:text-2xl">
      {member.name}
    </h3>
    <p class="text-xs uppercase tracking-[0.1em] text-gold-text md:text-sm">
      {member.role}
    </p>
  </div>
</article>
