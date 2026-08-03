<script lang="ts">
  import type { DisplayTeamMember } from "$lib/team/roster";
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";
  import BadgeCheck from "lucide-svelte/icons/badge-check";
  import Building2 from "lucide-svelte/icons/building-2";
  import Check from "lucide-svelte/icons/check";
  import Mail from "lucide-svelte/icons/mail";
  import Phone from "lucide-svelte/icons/phone";
  import Share2 from "lucide-svelte/icons/share-2";
  import Star from "lucide-svelte/icons/star";

  interface Props {
    member: DisplayTeamMember;
    locale: Locale;
    /** Horizontal featured layout (Sergine / lead) */
    featured?: boolean;
  }

  let { member, locale, featured = false }: Props = $props();

  const copy = $derived(getCopy(locale).teamPartners);
  const title = $derived(member.displayName || member.name);
  const showFullName = $derived(
    Boolean(member.displayName && member.displayName !== member.name),
  );
</script>

<article
  class="card group overflow-hidden border-[color:var(--border-hairline)] shadow-sm transition-shadow duration-300 hover:shadow-card-hover
    {featured
    ? 'grid md:grid-cols-12 md:items-stretch'
    : 'flex h-full flex-col'}"
>
  <!-- Photo -->
  <div
    class="relative overflow-hidden bg-surface
      {featured
      ? 'aspect-[4/5] md:col-span-5 md:aspect-auto md:min-h-[28rem]'
      : 'aspect-[4/5]'}"
  >
    <img
      src={member.photoSrc}
      alt={member.photoAlt}
      class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      loading={featured ? "eager" : "lazy"}
      width={featured ? 800 : 640}
      height={featured ? 1000 : 800}
    />
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 to-transparent"
      aria-hidden="true"
    ></div>
    {#if featured}
      <span
        class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-burgundy px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-on-brand shadow-sm"
      >
        <Star class="size-3 fill-current" aria-hidden="true" />
        {locale === "fr" ? "Courtière" : "Lead broker"}
      </span>
    {/if}
  </div>

  <!-- Body -->
  <div
    class="flex flex-1 flex-col gap-4 p-5 md:p-6
      {featured ? 'md:col-span-7 md:justify-center md:gap-5 md:p-8 lg:p-10' : ''}"
  >
    <header class="space-y-1.5">
      <h3
        class="font-display leading-tight text-primary
          {featured ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl'}"
      >
        {title}
      </h3>
      {#if showFullName}
        <p class="text-xs text-muted">{member.name}</p>
      {/if}
      <p
        class="font-medium uppercase tracking-[0.12em] text-gold-text
          {featured ? 'text-xs md:text-sm' : 'text-[11px] md:text-xs'}"
      >
        {member.role}
      </p>
      {#if member.company}
        <p class="flex items-center gap-2 pt-1 text-sm text-secondary md:text-base">
          <Building2 class="size-4 shrink-0 text-burgundy" aria-hidden="true" />
          <span>{member.company}</span>
        </p>
      {/if}
    </header>

    {#if member.credentials.length > 0}
      <section
        class="rounded-xl bg-elevated/90 px-3.5 py-3
          {featured ? 'md:max-w-md' : ''}"
      >
        <p
          class="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          <BadgeCheck class="size-3.5 text-burgundy" aria-hidden="true" />
          {copy.credentialsLabel}
        </p>
        <ul class="space-y-1.5">
          {#each member.credentials as cred}
            <li class="text-sm text-primary">
              <span class="font-medium">{cred.organization}</span>
              {#if cred.memberNumber}
                <span class="text-secondary"> · n° {cred.memberNumber}</span>
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if member.services.length > 0}
      <section class={featured ? "md:max-w-lg" : ""}>
        <p
          class="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          {copy.servicesLabel}
        </p>
        <ul
          class="space-y-2
            {featured ? 'sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 sm:space-y-0' : ''}"
        >
          {#each member.services as service}
            <li class="flex items-start gap-2 text-sm text-secondary">
              <span
                class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy"
              >
                <Check class="size-3" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span class="leading-snug">{service}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if member.phone || member.email || member.socials.instagram}
      <footer
        class="mt-auto space-y-2 border-t border-[color:var(--border-hairline)] pt-4
          {featured ? 'md:max-w-md' : ''}"
      >
        <p
          class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          {copy.contactLabel}
        </p>
        <ul class="space-y-2">
          {#if member.phone}
            <li>
              <a
                href={member.phone.href}
                class="flex min-h-10 items-center gap-3 rounded-lg px-2 -mx-2 text-sm text-primary transition-colors hover:bg-[var(--state-hover)] hover:text-burgundy"
              >
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-hairline)] bg-surface text-burgundy"
                >
                  <Phone class="size-3.5" aria-hidden="true" />
                </span>
                <span class="font-medium">{member.phone.display}</span>
              </a>
            </li>
          {/if}
          {#if member.email}
            <li>
              <a
                href={member.email.href}
                class="flex min-h-10 items-center gap-3 rounded-lg px-2 -mx-2 text-sm text-primary transition-colors hover:bg-[var(--state-hover)] hover:text-burgundy"
              >
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-hairline)] bg-surface text-burgundy"
                >
                  <Mail class="size-3.5" aria-hidden="true" />
                </span>
                <span class="break-all font-medium">{member.email.display}</span>
              </a>
            </li>
          {/if}
          {#if member.socials.instagram}
            <li>
              <a
                href={member.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex min-h-10 items-center gap-3 rounded-lg px-2 -mx-2 text-sm text-primary transition-colors hover:bg-[var(--state-hover)] hover:text-burgundy"
              >
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-hairline)] bg-surface text-burgundy"
                >
                  <Share2 class="size-3.5" aria-hidden="true" />
                </span>
                <span class="font-medium">{member.socials.instagram.handle}</span>
              </a>
            </li>
          {/if}
        </ul>
      </footer>
    {/if}
  </div>
</article>
