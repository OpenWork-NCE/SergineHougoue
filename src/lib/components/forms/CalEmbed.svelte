<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { getFormCopy } from "$i18n/forms";
  import type { Locale } from "$i18n/locales";

  interface Props {
    locale: Locale;
    calLink?: string | null;
  }

  let { locale, calLink = null }: Props = $props();

  const copy = $derived(getFormCopy(locale));
  const normalizedCalLink = $derived(normalizeCalLink(calLink));

  let containerEl = $state<HTMLDivElement | undefined>();

  interface CalApi {
    (...args: unknown[]): void;
    loaded?: boolean;
    ns?: Record<string, CalApi>;
    q?: unknown[][];
  }

  function normalizeCalLink(link: string | null | undefined): string | null {
    if (!link?.trim()) return null;

    const trimmed = link.trim();

    try {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const url = new URL(trimmed);
        const path = url.pathname.replace(/^\/+/, "");
        return path || null;
      }
    } catch {
      return trimmed;
    }

    return trimmed.replace(/^\/+/, "");
  }

  function ensureCalEmbedScript(): CalApi {
    const win = window as typeof window & { Cal?: CalApi };
    const scriptSrc = "https://app.cal.com/embed/embed.js";

    if (!win.Cal) {
      const bootstrap = function bootstrapCal(
        C: Window & { Cal?: CalApi; document: Document },
        A: string,
        L: string,
      ) {
        const enqueue = function enqueue(api: CalApi, args: unknown[]) {
          api.q = api.q || [];
          api.q.push(args);
        };

        const doc = C.document;
        C.Cal =
          C.Cal ||
          function cal(...args: unknown[]) {
            const calApi = C.Cal as CalApi;
            if (!calApi.loaded) {
              calApi.ns = {};
              calApi.q = calApi.q || [];
              const script = doc.createElement("script");
              script.src = A;
              doc.head.appendChild(script);
              calApi.loaded = true;
            }

            if (args[0] === L) {
              const api = function apiProxy(...proxyArgs: unknown[]) {
                enqueue(api, proxyArgs);
              } as CalApi;
              const namespace = args[1];
              api.q = [];
              if (typeof namespace === "string") {
                calApi.ns = calApi.ns || {};
                calApi.ns[namespace] = calApi.ns[namespace] || api;
                enqueue(calApi.ns[namespace], args);
                enqueue(calApi, ["initNamespace", namespace]);
              } else {
                enqueue(calApi, args);
              }
              return;
            }

            enqueue(calApi, args);
          };
      };

      bootstrap(win, scriptSrc, "init");
    }

    return win.Cal as CalApi;
  }

  function mountInlineEmbed(link: string, element: HTMLDivElement) {
    const Cal = ensureCalEmbedScript();
    Cal("init", { origin: "https://cal.com" });
    Cal("inline", {
      elementOrSelector: element,
      calLink: link,
    });
  }

  onMount(() => {
    if (!browser || !normalizedCalLink || !containerEl) return;
    mountInlineEmbed(normalizedCalLink, containerEl);
  });
</script>

{#if normalizedCalLink}
  <div
    bind:this={containerEl}
    data-testid="cal-embed-container"
    aria-label={copy.calEmbed.ariaLabel}
    class="min-h-[600px] w-full overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)]"
  ></div>
{:else}
  <p
    data-testid="cal-embed-fallback"
    class="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-6 text-sm leading-relaxed text-secondary"
  >
    {copy.calEmbed.fallback}
  </p>
{/if}