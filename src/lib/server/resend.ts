import { Resend } from "resend";
import { CONTACT_TO_EMAIL, RESEND_API_KEY } from "$env/static/private";
import type { ContactFormData } from "$server/contact-schema";

const CONTACT_FROM_EMAIL = "Contact <onboarding@resend.dev>";

export type SendContactEmailResult =
  | { ok: true }
  | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildContactEmailHtml(data: ContactFormData): string {
  return `
    <h1>New contact form submission</h1>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Intent:</strong> ${escapeHtml(data.intent)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replaceAll("\n", "<br />")}</p>
  `.trim();
}

export async function sendContactEmail(
  data: ContactFormData,
): Promise<SendContactEmailResult> {
  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    replyTo: data.email,
    subject: `New contact from ${data.name}`,
    html: buildContactEmailHtml(data),
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}