<script lang="ts">
  import type { DisplayTeamMember } from "$lib/team/roster";
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";

  interface Props {
    member: DisplayTeamMember;
    locale: Locale;
    /** Larger featured layout for the lead broker */
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
  class="card group flex h-full flex-col overflow-hidden {featured
    ? 'md:col-span-2 lg:col-span-1'
    : ''}"
>
  <div
    class="relative overflow-hidden bg-surface {featured
      ? 'aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5]'
      : 'aspect-[4/5]'}"
  >
    <img
      src={member.photoSrc}
      alt={member.photoAlt}
      class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      loading="lazy"
      width="640"
      height="800"
    />
  </div>

  <div class="flex flex-1 flex-col space-y-3 p-5 md:p-6">
    <div class="space-y-1">
      <h3 class="font-display text-xl text-primary md:text-2xl">{title}</h3>
      {#if showFullName}
        <p class="text-xs text-muted">{member.name}</p>
      {/if}
      <p class="text-xs uppercase tracking-[0.1em] text-gold-text md:text-sm">
        {member.role}
      </p>
      {#if member.company}
        <p class="text-sm text-secondary">{member.company}</p>
      {/if}
    </div>

    {#if member.credentials.length > 0}
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-1">
          {copy.credentialsLabel}
        </p>
        <ul class="space-y-0.5 text-sm text-secondary">
          {#each member.credentials as cred}
            <li>
              {cred.organization}{#if cred.memberNumber}
                <span class="text-muted"> · n° {cred.memberNumber}</span>{/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if member.services.length > 0}
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-1">
          {copy.servicesLabel}
        </p>
        <ul class="list-inside list-disc space-y-0.5 text-sm text-secondary">
          {#each member.services as service}
            <li>{service}</li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if member.phone || member.email || member.socials.instagram}
      <div class="mt-auto space-y-1.5 border-t border-[color:var(--border-hairline)] pt-3">
        <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          {copy.contactLabel}
        </p>
        <ul class="space-y-1 text-sm">
          {#if member.phone}
            <li>
              <a
                href={member.phone.href}
                class="text-primary transition-colors hover:text-burgundy"
              >
                {member.phone.display}
              </a>
            </li>
          {/if}
          {#if member.email}
            <li>
              <a
                href={member.email.href}
                class="text-primary break-all transition-colors hover:text-burgundy"
              >
                {member.email.display}
              </a>
            </li>
          {/if}
          {#if member.socials.instagram}
            <li>
              <a
                href={member.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary transition-colors hover:text-burgundy"
              >
                {member.socials.instagram.handle}
              </a>
            </li>
          {/if}
        </ul>
      </div>
    {/if}
  </div>
</article>
