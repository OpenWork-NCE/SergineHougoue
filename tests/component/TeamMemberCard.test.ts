import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import TeamMemberCard from "$components/content/TeamMemberCard.svelte";
import { MEDIA } from "$lib/media";
import type { DisplayTeamMember } from "$lib/team/roster";

const steve: DisplayTeamMember = {
  id: "michael-steve-djeuga-ngadja",
  name: "Michael Steve Djeuga Ngadja",
  displayName: "Steve Djeuga",
  role: "Courtier hypothécaire agréé",
  company: "Xperto Hypothèques",
  credentials: [],
  services: ["Accompagnement personnalisé", "Optimisation de financement"],
  phone: { display: "438-225-4003", href: "tel:+14382254003" },
  email: { display: "sdjeuga@xperto.ca", href: "mailto:sdjeuga@xperto.ca" },
  socials: {
    instagram: {
      handle: "@stevedjeuga",
      url: "https://www.instagram.com/stevedjeuga/",
    },
  },
  photoSrc: MEDIA.teamSteve,
  photoAlt: "Portrait de Steve Djeuga",
  order: 1,
  isLead: false,
};

describe("<TeamMemberCard>", () => {
  it("renders display name, company, services and contact links", () => {
    render(TeamMemberCard, {
      props: { member: steve, locale: "fr" },
    });

    expect(
      screen.getByRole("heading", { name: "Steve Djeuga" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Michael Steve Djeuga Ngadja")).toBeInTheDocument();
    expect(screen.getByText("Xperto Hypothèques")).toBeInTheDocument();
    expect(screen.getByText("Accompagnement personnalisé")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "438-225-4003" })).toHaveAttribute(
      "href",
      "tel:+14382254003",
    );
    expect(
      screen.getByRole("link", { name: "sdjeuga@xperto.ca" }),
    ).toHaveAttribute("href", "mailto:sdjeuga@xperto.ca");
    expect(screen.getByRole("link", { name: "@stevedjeuga" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/stevedjeuga/",
    );
    expect(
      screen.getByRole("img", { name: "Portrait de Steve Djeuga" }),
    ).toHaveAttribute("src", MEDIA.teamSteve);
  });

  it("renders AIBQ credential for inspector", () => {
    const guy: DisplayTeamMember = {
      id: "guy-merlin-kuigoua",
      name: "Guy Merlin Kuigoua",
      displayName: "Guy Merlin Kuigoua",
      role: "Inspecteur en bâtiment",
      company: null,
      credentials: [{ organization: "AIBQ", memberNumber: "22185" }],
      services: [],
      phone: { display: "438-936-8779", href: "tel:+14389368779" },
      email: {
        display: "gmkuigoua@gmail.com",
        href: "mailto:gmkuigoua@gmail.com",
      },
      socials: {},
      photoSrc: MEDIA.teamDefault,
      photoAlt: "Portrait de Guy",
      order: 3,
      isLead: false,
    };

    render(TeamMemberCard, { props: { member: guy, locale: "fr" } });

    expect(screen.getByText(/AIBQ/)).toBeInTheDocument();
    expect(screen.getByText(/22185/)).toBeInTheDocument();
  });
});
