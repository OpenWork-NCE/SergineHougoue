<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<div id="studio" class="studio-root">
  {@render children?.()}
</div>

<style>
  .studio-root {
    height: 100vh;
    max-height: 100dvh;
    overflow: auto;
    overscroll-behavior: none;
    -webkit-font-smoothing: antialiased;
  }
</style>