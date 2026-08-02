<script lang="ts">
  import type { Testimonial } from "$sanity/types";
  import { urlFor } from "$sanity/image";

  interface Props {
    testimonial: Testimonial;
  }

  let { testimonial }: Props = $props();

  const photoUrl = $derived(
    testimonial.photo?.asset
      ? urlFor(testimonial.photo).width(96).height(96).fit("crop").url()
      : undefined,
  );
  const photoAlt = $derived(
    testimonial.photo?.alt?.trim() || testimonial.authorName,
  );
  const ratingLabel = $derived(
    `${testimonial.rating} out of 5 stars`,
  );
</script>

<article
  class="min-w-[min(100%,20rem)] flex-1 rounded-sm border border-[color:var(--border-hairline)] bg-elevated p-6 md:min-w-[18rem] md:max-w-[24rem]"
>
  <div
    role="img"
    aria-label={ratingLabel}
    class="flex gap-0.5 text-sm text-gold"
  >
    {#each Array.from({ length: 5 }, (_, index) => index) as index (index)}
      <span aria-hidden="true" class={index < testimonial.rating ? "" : "text-muted"}
        >★</span
      >
    {/each}
  </div>

  <blockquote class="mt-4 font-display text-xl leading-relaxed text-secondary md:text-2xl">
    “{testimonial.quote}”
  </blockquote>

  <footer class="mt-6 flex items-center gap-4">
    {#if photoUrl}
      <img
        src={photoUrl}
        alt={photoAlt}
        class="h-12 w-12 shrink-0 rounded-full object-cover"
      />
    {/if}

    <div>
      <p class="text-sm uppercase tracking-[0.08em] text-gold-text">
        {testimonial.authorName}
      </p>
      {#if testimonial.authorContext}
        <p class="mt-1 text-sm text-secondary">{testimonial.authorContext}</p>
      {/if}
    </div>
  </footer>
</article>