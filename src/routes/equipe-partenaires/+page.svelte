<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import TeamMemberCard from "$components/content/TeamMemberCard.svelte";
  import { getCopy } from "$i18n/copy";
  import { MEDIA } from "$lib/media";
  import { getStaticTeamRoster } from "$lib/team/roster";
  import { urlFor } from "$sanity/image";
  import type { Partner, PartnerCategory } from "$sanity/types";
  import type { PageData } from "./$types";

  const PARTNER_CATEGORY_ORDER: PartnerCategory[] = [
    "preteur",
    "courtier-hypothecaire",
    "notaire",
    "inspecteur",
    "autre",
  ];

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));

  /** Static roster; CMS can override Sergine photo/name/role. */
  const team = $derived.by(() => {
    const roster = getStaticTeamRoster(data.locale);
    const cmsLead = data.teamMembers[0];

    return roster.map((member) => {
      if (member.id !== "sergine" || !cmsLead) return member;

      const cmsPhoto = cmsLead.photo?.asset?._ref
        ? urlFor(cmsLead.photo).width(800).height(1000).fit("crop").url()
        : null;

      const name = cmsLead.name?.trim() || member.name;

      return {
        ...member,
        name,
        displayName: name,
        role: cmsLead.role?.trim() || member.role,
        photoSrc: cmsPhoto || member.photoSrc || MEDIA.teamPortrait,
        photoAlt: cmsLead.photo?.alt?.trim() || member.photoAlt,
      };
    });
  });

  const lead = $derived(team.find((m) => m.isLead) ?? team[0]);
  const network = $derived(team.filter((m) => !m.isLead));

  const partnersByCategory = $derived(
    PARTNER_CATEGORY_ORDER.map((category) => ({
      category,
      label: copy.teamPartners.partnerCategories[category],
      partners: data.partners.filter(
        (partner) => partner.category === category,
      ),
    })).filter((group) => group.partners.length > 0),
  );

  function partnerLogoSrc(partner: Partner): string | null {
    if (!partner.logo?.asset?._ref) {
      return null;
    }

    return urlFor(partner.logo).width(240).height(120).fit("max").url();
  }
</script>

<PageHeader
  eyebrow={copy.teamPartners.eyebrow}
  title={copy.teamPartners.title}
  intro={copy.teamPartners.intro}
/>

<!-- Lead: Sergine — same card system, featured layout -->
<section class="container-editorial pb-12 md:pb-16">
  <h2 class="eyebrow mb-8 text-burgundy">{copy.teamPartners.teamHeading}</h2>

  {#if lead}
    <TeamMemberCard member={lead} locale={data.locale} featured />
  {/if}
</section>

<!-- Network: Steve, Sara, Guy -->
<section
  class="border-t border-[color:var(--border-hairline)] bg-surface/40 py-14 md:py-20"
>
  <div class="container-editorial">
    <h2 class="eyebrow mb-8 text-burgundy">
      {copy.teamPartners.networkHeading}
    </h2>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each network as member (member.id)}
        <TeamMemberCard {member} locale={data.locale} />
      {/each}
    </div>
  </div>
</section>

<!-- CMS partner logos -->
<section
  class="container-editorial border-t border-[color:var(--border-hairline)] py-16 md:py-20"
>
  <h2 class="eyebrow mb-8 text-burgundy">{copy.teamPartners.partnersHeading}</h2>

  {#if data.partners.length > 0}
    <div class="space-y-12">
      {#each partnersByCategory as group (group.category)}
        <div>
          <h3 class="mb-6 text-sm uppercase tracking-[0.08em] text-secondary">
            {group.label}
          </h3>
          <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {#each group.partners as partner (partner._id)}
              {@const logoSrc = partnerLogoSrc(partner)}
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                class="card group flex items-center justify-center p-6 transition-colors hover:border-burgundy/30"
              >
                {#if logoSrc}
                  <img
                    src={logoSrc}
                    alt={partner.name}
                    class="max-h-12 w-auto max-w-[10rem] object-contain opacity-80 transition-opacity group-hover:opacity-100"
                  />
                {:else}
                  <span class="text-sm uppercase tracking-[0.08em] text-primary">
                    {partner.name}
                  </span>
                {/if}
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-secondary">{copy.teamPartners.emptyPartners}</p>
  {/if}
</section>
