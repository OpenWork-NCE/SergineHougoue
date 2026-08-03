<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import Clock from "lucide-svelte/icons/clock";
  import Mail from "lucide-svelte/icons/mail";
  import Phone from "lucide-svelte/icons/phone";

  interface Props {
    locale: Locale;
  }
  let { locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  const base = $derived(`/${locale}`);
  const year = new Date().getFullYear();

  const explore = $derived([
    { href: `${base}/biens`, label: copy.nav.listings },
    { href: `${base}/services`, label: copy.nav.services },
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact },
  ]);

  const resources = $derived([
    { href: `${base}/transactions`, label: copy.nav.transactions },
    { href: `${base}/blog`, label: copy.nav.blog },
    { href: `${base}/equipe-partenaires`, label: copy.nav.teamPartners },
    {
      href: `${base}/politique-confidentialite`,
      label: copy.footer.privacy,
    },
  ]);
</script>

<footer
  class="mt-16 border-t border-[color:var(--border-hairline)] bg-surface text-primary lg:mt-24"
>
  <div class="container-editorial py-14 lg:py-20">
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
      <div class="lg:col-span-4">
        <a
          href={`${base}/`}
          class="font-display text-2xl tracking-tight flex items-center"
          aria-label="Sergine Hougoue"
        >
          <span class="text-burgundy">S</span>ergine Hougoue
        </a>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-secondary">
          {copy.footer.tagline}
        </p>
      </div>

      <div class="lg:col-span-2">
        <h2
          class="text-xs font-semibold uppercase tracking-[0.1em] mb-4 text-secondary"
        >
          {copy.footer.exploreHeading}
        </h2>
        <ul class="space-y-2.5 text-sm">
          {#each explore as link}
            <li>
              <a
                href={link.href}
                class="text-secondary transition-colors duration-200 hover:text-primary"
                >{link.label}</a
              >
            </li>
          {/each}
        </ul>
      </div>

      <div class="lg:col-span-3">
        <h2
          class="text-xs font-semibold uppercase tracking-[0.1em] mb-4 text-secondary"
        >
          {copy.footer.resourcesHeading}
        </h2>
        <ul class="space-y-2.5 text-sm">
          {#each resources as link}
            <li>
              <a
                href={link.href}
                class="text-secondary transition-colors duration-200 hover:text-primary"
                >{link.label}</a
              >
            </li>
          {/each}
        </ul>
      </div>

      <div class="lg:col-span-3">
        <h2
          class="text-xs font-semibold uppercase tracking-[0.1em] mb-4 text-secondary"
        >
          {copy.footer.contactHeading}
        </h2>
        <ul class="space-y-3 text-sm">
          <li>
            <a
              href="tel:4384626015"
              class="inline-flex items-center gap-2 transition-colors hover:text-burgundy"
            >
              <Phone class="size-3.5 shrink-0 text-burgundy" aria-hidden="true" />
              438-462-6015
            </a>
          </li>
          <li>
            <a
              href="mailto:serginehougoue@gmail.com"
              class="inline-flex items-start gap-2 break-all transition-colors hover:text-burgundy"
            >
              <Mail class="mt-0.5 size-3.5 shrink-0 text-burgundy" aria-hidden="true" />
              serginehougoue@gmail.com
            </a>
          </li>
          <li class="flex items-start gap-2 pt-1 text-xs text-muted">
            <Clock class="mt-0.5 size-3.5 shrink-0 text-burgundy" aria-hidden="true" />
            <span class="whitespace-pre-line">{copy.footer.hours}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="mt-12 flex flex-col gap-3 border-t border-[color:var(--border-hairline)] pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <p>© {year} {copy.footer.copyright}</p>
      <p class="text-secondary sm:text-right">
        {copy.footer.designedBy}
      </p>
    </div>
  </div>
</footer>
