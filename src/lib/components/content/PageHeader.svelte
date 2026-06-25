<script lang="ts">
  interface Props {
    eyebrow: string;
    title: string;
    intro?: string;
  }

  let { eyebrow, title, intro }: Props = $props();
</script>

<header class="container-editorial py-24 md:py-32">
  <p class="eyebrow mb-4 text-gold">{eyebrow}</p>
  <h1 class="font-display text-5xl text-balance text-primary md:text-6xl">
    {title}
  </h1>
  {#if intro}
    <p class="mt-6 max-w-2xl text-lg text-secondary">{intro}</p>
  {/if}
</header>