import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";

vi.mock("$env/static/private", () => ({
  RESEND_API_KEY: "re_test_key",
  CONTACT_TO_EMAIL: "serginehougoue@gmail.com",
}));

vi.mock("$server/resend", () => ({
  sendContactEmail: vi.fn(),
}));

import { POST } from "../../../src/routes/api/contact/+server";
import { sendContactEmail } from "$server/resend";

const validPayload = {
  name: "Jane Doe",
  phone: "4384626015",
  email: "jane@example.com",
  intent: "buy",
  message: "I want to buy a property in Montreal.",
};

function makeEvent(body: unknown): RequestEvent {
  return {
    request: new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  } as RequestEvent;
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.mocked(sendContactEmail).mockReset();
    vi.mocked(sendContactEmail).mockResolvedValue({ ok: true });
  });

  it("returns 200 with ok:true for a valid payload", async () => {
    const response = await POST(makeEvent(validPayload));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(sendContactEmail).toHaveBeenCalledWith(validPayload);
  });

  it("returns 400 with structured errors for an invalid payload", async () => {
    const response = await POST(
      makeEvent({
        ...validPayload,
        email: "not-an-email",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.errors.email).toBeDefined();
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", async () => {
    const response = await POST(
      makeEvent({
        ...validPayload,
        email: "",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      errors: expect.objectContaining({
        email: expect.any(Array),
      }),
    });
  });

  it("returns 200 when message is empty", async () => {
    const response = await POST(
      makeEvent({
        ...validPayload,
        message: "",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(sendContactEmail).toHaveBeenCalledWith({
      ...validPayload,
      message: "",
    });
  });

  it("returns 500 when Resend fails", async () => {
    vi.mocked(sendContactEmail).mockResolvedValue({
      ok: false,
      error: "Resend API error",
    });

    const response = await POST(makeEvent(validPayload));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      errors: { _form: ["Resend API error"] },
    });
  });
});