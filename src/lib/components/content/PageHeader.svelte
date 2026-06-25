<script lang="ts">
  interface Props {
    eyebrow: string;
    title: string;
    intro?: string;
  }

  let { eyebrow, title, intro }: Props = $props();
</script>

<header class="container-editorial py-16 md:py-20 border-b border-white/10">
  <p class="eyebrow mb-2 text-burgundy">{eyebrow}</p>
  <h1 class="font-display text-5xl md:text-6xl text-primary tracking-tight">
    {title}
  </h1>
  {#if intro}
    <p class="mt-4 max-w-2xl text-lg text-secondary">{intro}</p>
  {/if}
</header>