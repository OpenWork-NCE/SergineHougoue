<script lang="ts">
  import { onMount } from "svelte";
  import { renderStudio } from "sanity";
  import config from "$sanity/studio-config";

  onMount(() => {
    const studioEl = document.getElementById("studio");
    if (!studioEl) return;
    return renderStudio(studioEl, config, { reactStrictMode: false });
  });
</script>