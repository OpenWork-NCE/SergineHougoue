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

  interface Props {
    member: DisplayTeamMember;
    locale: Locale;
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
  class="card group flex h-full flex-col overflow-hidden border-[color:var(--border-hairline)] shadow-sm transition-shadow duration-300 hover:shadow-card-hover {featured
    ? 'md:col-span-2 lg:col-span-1'
    : ''}"
>
  <!-- Photo -->
  <div class="relative aspect-[4/5] overflow-hidden bg-surface">
    <img
      src={member.photoSrc}
      alt={member.photoAlt}
      class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      loading="lazy"
      width="640"
      height="800"
    />
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent"
      aria-hidden="true"
    ></div>
  </div>

  <!-- Body -->
  <div class="flex flex-1 flex-col gap-4 p-5 md:p-6">
    <header class="space-y-1.5">
      <h3 class="font-display text-xl leading-tight text-primary md:text-2xl">
        {title}
      </h3>
      {#if showFullName}
        <p class="text-xs text-muted">{member.name}</p>
      {/if}
      <p
        class="text-[11px] font-medium uppercase tracking-[0.12em] text-gold-text md:text-xs"
      >
        {member.role}
      </p>
      {#if member.company}
        <p class="flex items-center gap-2 pt-0.5 text-sm text-secondary">
          <Building2 class="size-3.5 shrink-0 text-burgundy" aria-hidden="true" />
          <span>{member.company}</span>
        </p>
      {/if}
    </header>

    {#if member.credentials.length > 0}
      <section class="rounded-xl bg-elevated/80 px-3.5 py-3">
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
      <section>
        <p
          class="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          {copy.servicesLabel}
        </p>
        <ul class="space-y-2">
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
        class="mt-auto space-y-2 border-t border-[color:var(--border-hairline)] pt-4"
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
                class="group/link flex min-h-10 items-center gap-3 rounded-lg px-2 -mx-2 text-sm text-primary transition-colors hover:bg-[var(--state-hover)] hover:text-burgundy"
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
                class="group/link flex min-h-10 items-center gap-3 rounded-lg px-2 -mx-2 text-sm text-primary transition-colors hover:bg-[var(--state-hover)] hover:text-burgundy"
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
                class="group/link flex min-h-10 items-center gap-3 rounded-lg px-2 -mx-2 text-sm text-primary transition-colors hover:bg-[var(--state-hover)] hover:text-burgundy"
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
