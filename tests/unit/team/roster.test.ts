import { describe, expect, it } from "vitest";
import { getStaticTeamRoster } from "$lib/team/roster";
import { MEDIA } from "$lib/media";

describe("getStaticTeamRoster", () => {
  it("returns four members with full client data (FR)", () => {
    const roster = getStaticTeamRoster("fr");
    expect(roster).toHaveLength(4);

    const byId = Object.fromEntries(roster.map((m) => [m.id, m]));

    expect(byId.sergine?.isLead).toBe(true);
    expect(byId.sergine?.photoSrc).toBe(MEDIA.teamPortrait);

    const steve = byId["michael-steve-djeuga-ngadja"];
    expect(steve?.displayName).toBe("Steve Djeuga");
    expect(steve?.name).toBe("Michael Steve Djeuga Ngadja");
    expect(steve?.role).toMatch(/hypothécaire/i);
    expect(steve?.company).toBe("Xperto Hypothèques");
    expect(steve?.phone?.display).toBe("438-225-4003");
    expect(steve?.email?.display).toBe("sdjeuga@xperto.ca");
    expect(steve?.socials.instagram?.handle).toBe("@stevedjeuga");
    expect(steve?.services).toContain("Accompagnement personnalisé");
    expect(steve?.photoSrc).toBe(MEDIA.teamSteve);

    const sara = byId["sara-tamika-bruno"];
    expect(sara?.name).toBe("Sara-Tamika Bruno");
    expect(sara?.role).toMatch(/hypothécaire mobile/i);
    expect(sara?.company).toBe("TD Canada Trust");
    expect(sara?.phone?.href).toBe("tel:+14388674995");
    expect(sara?.email).toBeNull();
    expect(sara?.photoSrc).toBe(MEDIA.teamSara);

    const guy = byId["guy-merlin-kuigoua"];
    expect(guy?.name).toBe("Guy Merlin Kuigoua");
    expect(guy?.role).toMatch(/Inspecteur/i);
    expect(guy?.credentials[0]).toEqual({
      organization: "AIBQ",
      memberNumber: "22185",
    });
    expect(guy?.phone?.display).toBe("438-936-8779");
    expect(guy?.email?.display).toBe("gmkuigoua@gmail.com");
    expect(guy?.photoSrc).toBe(MEDIA.teamDefault);
  });

  it("returns English roles and services for en locale", () => {
    const roster = getStaticTeamRoster("en");
    const steve = roster.find((m) => m.id === "michael-steve-djeuga-ngadja");
    const sara = roster.find((m) => m.id === "sara-tamika-bruno");
    const guy = roster.find((m) => m.id === "guy-merlin-kuigoua");

    expect(steve?.role).toMatch(/mortgage broker/i);
    expect(steve?.services).toContain("Personalized guidance");
    expect(sara?.role).toBe("Mobile Mortgage Specialist");
    expect(guy?.role).toMatch(/inspector/i);
  });
});
