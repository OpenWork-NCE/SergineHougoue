import { z } from "zod";

export const contactIntents = ["buy", "sell", "invest", "other"] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(10, "Phone must be at least 10 characters"),
  email: z.string().trim().email("Invalid email address"),
  intent: z.enum(contactIntents),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string[]>>;

export function formatContactErrors(error: z.ZodError): ContactFormErrors {
  const fieldErrors = error.flatten().fieldErrors as ContactFormErrors;
  const errors: ContactFormErrors = {};

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages?.length) {
      errors[field as keyof ContactFormData] = messages;
    }
  }

  return errors;
}