<script lang="ts">
  interface Props {
    title: string;
    ctaHref: string;
    ctaLabel: string;
  }

  let { title, ctaHref, ctaLabel }: Props = $props();
</script>

<section class="bg-burgundy py-16 md:py-20">
  <div class="container-editorial flex flex-col items-center gap-8 text-center">
    <h2 class="font-display text-3xl text-primary md:text-4xl">
      {title}
    </h2>
    <a
      href={ctaHref}
      class="inline-block rounded-full border border-primary px-6 py-3 text-xs uppercase tracking-[0.08em] text-primary transition-colors hover:bg-[#8a2638]"
    >
      {ctaLabel}
    </a>
  </div>
</section>