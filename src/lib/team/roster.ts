import { MEDIA } from "$lib/media";
import type { Locale } from "$i18n/locales";
import { getCopy } from "$i18n/copy";

export type TeamMemberId = "sergine" | "steve" | "sara" | "guy";

export type DisplayTeamMember = {
  id: TeamMemberId;
  name: string;
  role: string;
  photoSrc: string;
  photoAlt: string;
  order: number;
  isLead: boolean;
};

/**
 * Static roster extracted from provided member assets / filenames:
 * - Steve Djeuga — Courtier hypothécaire
 * - Sara — Spécialiste hypothécaire
 * - Guy — Inspecteur
 * Sergine remains lead broker (portrait + copy fallbacks).
 */
export function getStaticTeamRoster(locale: Locale): DisplayTeamMember[] {
  const copy = getCopy(locale).teamPartners;
  const m = copy.members;

  return [
    {
      id: "sergine",
      name: m.sergine.name,
      role: m.sergine.role,
      photoSrc: MEDIA.teamPortrait,
      photoAlt: m.sergine.photoAlt,
      order: 0,
      isLead: true,
    },
    {
      id: "steve",
      name: m.steve.name,
      role: m.steve.role,
      photoSrc: MEDIA.teamSteve,
      photoAlt: m.steve.photoAlt,
      order: 1,
      isLead: false,
    },
    {
      id: "sara",
      name: m.sara.name,
      role: m.sara.role,
      photoSrc: MEDIA.teamSara,
      photoAlt: m.sara.photoAlt,
      order: 2,
      isLead: false,
    },
    {
      id: "guy",
      name: m.guy.name,
      role: m.guy.role,
      photoSrc: MEDIA.teamDefault,
      photoAlt: m.guy.photoAlt,
      order: 3,
      isLead: false,
    },
  ];
}
