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
    <h2 class="font-display text-3xl text-primary mb-6">{title}</h2>
    <a href={ctaHref} class="btn-secondary text-sm">{ctaLabel}</a>
  </div>
</section>