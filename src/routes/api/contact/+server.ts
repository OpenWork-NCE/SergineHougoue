import { json, type RequestHandler } from "@sveltejs/kit";
import {
  contactFormSchema,
  formatContactErrors,
} from "$server/contact-schema";
import { sendContactEmail } from "$server/resend";

export const POST: RequestHandler = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json(
      { ok: false, errors: { _form: ["Invalid JSON body"] } },
      { status: 400 },
    );
  }

  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { ok: false, errors: formatContactErrors(parsed.error) },
      { status: 400 },
    );
  }

  const result = await sendContactEmail(parsed.data);

  if (!result.ok) {
    return json(
      { ok: false, errors: { _form: [result.error] } },
      { status: 500 },
    );
  }

  return json({ ok: true });
};