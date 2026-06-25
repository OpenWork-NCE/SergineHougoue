<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<h2 class="font-display text-3xl text-primary">
  {@render children()}
</h2>