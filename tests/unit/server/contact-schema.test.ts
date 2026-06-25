import { describe, expect, it } from "vitest";
import { contactFormSchema } from "$server/contact-schema";

const validPayload = {
  name: "Jane Doe",
  phone: "4384626015",
  email: "jane@example.com",
  intent: "buy" as const,
  message: "I want to buy a property in Montreal.",
};

describe("contactFormSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactFormSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it("rejects a payload with a missing email", () => {
    const result = contactFormSchema.safeParse({
      ...validPayload,
      email: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a payload with an invalid email", () => {
    const result = contactFormSchema.safeParse({
      ...validPayload,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a phone shorter than 10 characters", () => {
    const result = contactFormSchema.safeParse({
      ...validPayload,
      phone: "123456789",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone).toBeDefined();
    }
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactFormSchema.safeParse({
      ...validPayload,
      message: "Too short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toBeDefined();
    }
  });
});