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

<footer class="bg-canvas border-t border-white/10 mt-16 lg:mt-24 text-primary">
  <div class="container-editorial py-12 lg:py-16">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
      <!-- Brand -->
      <div class="col-span-2 md:col-span-1">
        <a href={`${base}/`} class="font-display text-xl tracking-tight flex items-center">
          <span class="text-burgundy">S</span>ergine Hougoue
        </a>
        <p class="mt-3 text-sm text-secondary max-w-[200px]">
          {copy.footer.tagline}
        </p>
      </div>

      <!-- Navigation -->
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-[0.1em] mb-4 text-secondary">{copy.footer.sitemapHeading}</h3>
        <ul class="space-y-1.5 text-sm">
          {#each sitemap as link}
            <li><a href={link.href} class="text-secondary hover:text-primary transition-colors duration-200">{link.label}</a></li>
          {/each}
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-[0.1em] mb-4 text-secondary">{copy.footer.contactHeading}</h3>
        <ul class="space-y-1.5 text-sm">
          <li><a href="tel:4384626015" class="hover:text-burgundy transition-colors">438-462-6015</a></li>
          <li><a href="mailto:serginehougoue@gmail.com" class="hover:text-burgundy transition-colors">serginehougoue@gmail.com</a></li>
          <li class="pt-2 text-xs text-muted whitespace-pre-line">{copy.footer.hours}</li>
        </ul>
      </div>

      <!-- Legal / Extra -->
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-[0.1em] mb-4 text-secondary">Legal</h3>
        <ul class="space-y-1.5 text-sm">
          <li><a href={`${base}/politique-confidentialite`} class="text-secondary hover:text-primary transition-colors">{copy.footer.privacy}</a></li>
        </ul>
        <p class="mt-8 text-[10px] text-muted">© {year} Sergine Hougoue — VENDIRECT</p>
      </div>
    </div>
  </div>
</footer>