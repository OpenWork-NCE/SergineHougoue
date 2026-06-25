<script lang="ts">
  import type { ServiceCategory } from "$i18n/services";

  interface Props {
    services: ServiceCategory[];
  }

  let { services }: Props = $props();
  let openIndex = $state<number | null>(null);

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }

  function handleKeydown(event: KeyboardEvent, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(index);
    }
  }
</script>

<section class="container-editorial pb-24 md:pb-32">
  <div
    class="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]"
  >
    {#each services as service, index}
      <div>
        <h2 class="m-0">
          <button
            type="button"
            class="flex w-full items-center gap-6 py-8 text-left editorial-transition hover:bg-[var(--state-hover)]"
            aria-expanded={openIndex === index}
            aria-controls="service-panel-{index}"
            id="service-trigger-{index}"
            onclick={() => toggle(index)}
            onkeydown={(event) => handleKeydown(event, index)}
          >
            <span
              class="font-display text-2xl tabular-nums text-gold"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span class="font-display text-2xl text-primary md:text-3xl">
              {service.title}
            </span>
          </button>
        </h2>

        {#if openIndex === index}
          <div
            id="service-panel-{index}"
            role="region"
            aria-labelledby="service-trigger-{index}"
            class="pb-8 pl-14 md:pl-16"
          >
            <ul class="space-y-3 text-secondary">
              {#each service.bullets as bullet}
                <li class="flex gap-3">
                  <span class="text-gold" aria-hidden="true">—</span>
                  <span>{bullet}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>