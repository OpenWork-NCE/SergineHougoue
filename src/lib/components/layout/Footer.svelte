<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";

  interface Props {
    locale: Locale;
  }
  let { locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  const base = $derived(`/${locale}`);
  const year = new Date().getFullYear();

  const sitemap = $derived([
    { href: `${base}/`, label: copy.nav.home },
    { href: `${base}/services`, label: copy.nav.services },
    { href: `${base}/biens`, label: copy.nav.listings },
    { href: `${base}/transactions`, label: copy.nav.transactions },
    { href: `${base}/blog`, label: copy.nav.blog },
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact },
  ]);
</script>

<footer class="bg-[#F5F2EC] text-[#0E0E0E] mt-24">
  <div class="container-editorial py-16 md:py-24">
    <div class="grid gap-12 md:grid-cols-3">
      <div>
        <p class="font-display text-xl text-[#0E0E0E] mb-4">
          <span class="text-[#6E1F2E]">S</span>ergine Hougoue
        </p>
        <p class="text-sm leading-relaxed text-[#0E0E0E]/80">
          {copy.footer.tagline}
        </p>
      </div>

      <div>
        <h2 class="eyebrow mb-4 text-[#6E1F2E]">
          {copy.footer.sitemapHeading}
        </h2>
        <ul class="space-y-2">
          {#each sitemap as link}
            <li>
              <a
                href={link.href}
                class="text-sm text-[#0E0E0E] hover:text-[#6E1F2E] transition-colors"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <div>
        <h2 class="eyebrow mb-4 text-[#6E1F2E]">
          {copy.footer.contactHeading}
        </h2>
        <ul class="space-y-2 text-sm">
          <li>
            <a href="tel:4384626015" class="hover:text-[#6E1F2E]">438-462-6015</a>
          </li>
          <li>
            <a href="mailto:serginehougoue@gmail.com" class="hover:text-[#6E1F2E]"
              >serginehougoue@gmail.com</a
            >
          </li>
          <li class="text-[#0E0E0E]/70 pt-2">
            Lun–Ven 8h–20h<br />Sam–Dim 9h–17h
          </li>
        </ul>
      </div>
    </div>

    <hr class="my-12 border-[#0E0E0E]/10" />

    <div
      class="flex flex-col items-start justify-between gap-4 text-xs uppercase tracking-[0.08em] text-[#0E0E0E]/70 md:flex-row md:items-center"
    >
      <p>© {year} Sergine Hougoue — VENDIRECT</p>
      <a href={`${base}/politique-confidentialite`} class="hover:text-[#6E1F2E]"
        >{copy.footer.privacy}</a
      >
    </div>
  </div>
</footer>