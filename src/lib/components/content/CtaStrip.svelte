<script lang="ts">
  interface Props {
    title: string;
    ctaHref: string;
    ctaLabel: string;
  }

  let { title, ctaHref, ctaLabel }: Props = $props();
</script>

<section class="bg-burgundy py-14 md:py-16">
  <div class="container-editorial text-center">
    <h2 class="font-display text-3xl text-on-brand mb-6">{title}</h2>
    <a
      href={ctaHref}
      class="inline-flex items-center justify-center gap-2 rounded-full border border-on-brand px-5 py-2.5 text-sm text-on-brand transition-all duration-300 hover:bg-on-brand hover:text-burgundy"
    >
      {ctaLabel}
    </a>
  </div>
</section>