import { describe, it, expect } from "vitest";
import { formatPrice } from "$utils/format";

describe("formatPrice", () => {
  it("formats FR price with space thousands and trailing dollar", () => {
    expect(formatPrice(749_000, "fr")).toBe("749 000 $");
  });

  it("formats EN price with dollar prefix and comma thousands", () => {
    expect(formatPrice(749_000, "en")).toBe("$749,000");
  });
});
