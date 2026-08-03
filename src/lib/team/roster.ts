import { MEDIA } from "$lib/media";
import type { Locale } from "$i18n/locales";
import { getCopy } from "$i18n/copy";

export type TeamMemberId =
  | "sergine"
  | "michael-steve-djeuga-ngadja"
  | "sara-tamika-bruno"
  | "guy-merlin-kuigoua";

export type TeamCredential = {
  organization: string;
  memberNumber?: string;
};

export type TeamContactLink = {
  display: string;
  href: string;
};

export type DisplayTeamMember = {
  id: TeamMemberId;
  /** Full legal / formal name */
  name: string;
  /** Shorter name shown as card title when different from name */
  displayName: string;
  role: string;
  company: string | null;
  credentials: TeamCredential[];
  services: string[];
  phone: TeamContactLink | null;
  email: TeamContactLink | null;
  socials: {
    instagram?: { handle: string; url: string };
  };
  photoSrc: string;
  photoAlt: string;
  order: number;
  isLead: boolean;
};

type LocaleStrings = {
  role: string;
  photoAlt: string;
  services: string[];
};

/**
 * Network team data provided by the client (contacts, credentials, companies).
 * Roles / services are localized; contact details are language-neutral.
 */
export function getStaticTeamRoster(locale: Locale): DisplayTeamMember[] {
  const copy = getCopy(locale).teamPartners;
  const m = copy.members;

  const steve: LocaleStrings = {
    role: m.steve.role,
    photoAlt: m.steve.photoAlt,
    services: m.steve.services ?? [],
  };
  const sara: LocaleStrings = {
    role: m.sara.role,
    photoAlt: m.sara.photoAlt,
    services: m.sara.services ?? [],
  };
  const guy: LocaleStrings = {
    role: m.guy.role,
    photoAlt: m.guy.photoAlt,
    services: m.guy.services ?? [],
  };

  return [
    {
      id: "sergine",
      name: m.sergine.name,
      displayName: m.sergine.name,
      role: m.sergine.role,
      company: "VENDIRECT",
      credentials: [{ organization: "OACIQ" }],
      services: m.sergine.services ?? [],
      phone: {
        display: "438-462-6015",
        href: "tel:+14384626015",
      },
      email: {
        display: "serginehougoue@gmail.com",
        href: "mailto:serginehougoue@gmail.com",
      },
      socials: {},
      photoSrc: MEDIA.teamPortrait,
      photoAlt: m.sergine.photoAlt,
      order: 0,
      isLead: true,
    },
    {
      id: "michael-steve-djeuga-ngadja",
      name: "Michael Steve Djeuga Ngadja",
      displayName: "Steve Djeuga",
      role: steve.role,
      company: "Xperto Hypothèques",
      credentials: [],
      services: steve.services,
      phone: {
        display: "438-225-4003",
        href: "tel:+14382254003",
      },
      email: {
        display: "sdjeuga@xperto.ca",
        href: "mailto:sdjeuga@xperto.ca",
      },
      socials: {
        instagram: {
          handle: "@stevedjeuga",
          url: "https://www.instagram.com/stevedjeuga/",
        },
      },
      photoSrc: MEDIA.teamSteve,
      photoAlt: steve.photoAlt,
      order: 1,
      isLead: false,
    },
    {
      id: "sara-tamika-bruno",
      name: "Sara-Tamika Bruno",
      displayName: "Sara-Tamika Bruno",
      role: sara.role,
      company: "TD Canada Trust",
      credentials: [],
      services: sara.services,
      phone: {
        display: "438-867-4995",
        href: "tel:+14388674995",
      },
      email: null,
      socials: {},
      photoSrc: MEDIA.teamSara,
      photoAlt: sara.photoAlt,
      order: 2,
      isLead: false,
    },
    {
      id: "guy-merlin-kuigoua",
      name: "Guy Merlin Kuigoua",
      displayName: "Guy Merlin Kuigoua",
      role: guy.role,
      company: null,
      credentials: [
        {
          organization: "AIBQ",
          memberNumber: "22185",
        },
      ],
      services: guy.services,
      phone: {
        display: "438-936-8779",
        href: "tel:+14389368779",
      },
      email: {
        display: "gmkuigoua@gmail.com",
        href: "mailto:gmkuigoua@gmail.com",
      },
      socials: {},
      photoSrc: MEDIA.teamDefault,
      photoAlt: guy.photoAlt,
      order: 3,
      isLead: false,
    },
  ];
}
