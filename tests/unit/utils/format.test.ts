import { describe, it, expect } from "vitest";
import { formatPrice } from "$utils/format";

describe("formatPrice", () => {
  it("formats FR price in Canadian dollars (CAD)", () => {
    expect(formatPrice(749_000, "fr")).toBe("749 000 $ CA");
  });

  it("formats EN price in Canadian dollars (CAD)", () => {
    expect(formatPrice(749_000, "en")).toBe("CAD $749,000");
  });
});
