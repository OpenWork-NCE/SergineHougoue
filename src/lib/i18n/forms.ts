import { z } from "zod";
import type { Locale } from "./locales";

export const contactIntents = ["buy", "sell", "invest", "other"] as const;
export type ContactIntent = (typeof contactIntents)[number];

export interface FormValidationCopy {
  nameRequired: string;
  phoneMin: string;
  emailInvalid: string;
  intentRequired: string;
  messageMax: string;
}

export interface FormCopy {
  fields: {
    name: string;
    phone: string;
    email: string;
    intent: string;
    message: string;
  };
  intentPlaceholder: string;
  intents: Record<ContactIntent, string>;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  validation: FormValidationCopy;
  calEmbed: {
    ariaLabel: string;
    fallback: string;
  };
}

const fr: FormCopy = {
  fields: {
    name: "Nom complet",
    phone: "Téléphone",
    email: "Courriel",
    intent: "Motif de contact",
    message: "Message (optionnel)",
  },
  intentPlaceholder: "Sélectionnez un motif",
  intents: {
    buy: "Acheter une propriété",
    sell: "Vendre une propriété",
    invest: "Investir",
    other: "Autre",
  },
  submit: "Envoyer le message",
  submitting: "Envoi en cours…",
  success: "Merci! Votre message a été envoyé. Je vous répondrai sous peu.",
  error: "Une erreur s'est produite. Veuillez réessayer ou me contacter directement.",
  validation: {
    nameRequired: "Le nom est requis",
    phoneMin: "Le téléphone doit comporter au moins 10 caractères",
    emailInvalid: "Adresse courriel invalide",
    intentRequired: "Veuillez sélectionner un motif",
    messageMax: "Le message est trop long",
  },
  calEmbed: {
    ariaLabel: "Calendrier de prise de rendez-vous",
    fallback:
      "La prise de rendez-vous en ligne n'est pas disponible pour le moment. Contactez-moi par téléphone, courriel ou WhatsApp.",
  },
};

const en: FormCopy = {
  fields: {
    name: "Full name",
    phone: "Phone",
    email: "Email",
    intent: "Reason for contact",
    message: "Message (optional)",
  },
  intentPlaceholder: "Select a reason",
  intents: {
    buy: "Buy a property",
    sell: "Sell a property",
    invest: "Invest",
    other: "Other",
  },
  submit: "Send message",
  submitting: "Sending…",
  success: "Thank you! Your message has been sent. I will get back to you shortly.",
  error: "Something went wrong. Please try again or contact me directly.",
  validation: {
    nameRequired: "Name is required",
    phoneMin: "Phone must be at least 10 characters",
    emailInvalid: "Invalid email address",
    intentRequired: "Please select a reason",
    messageMax: "Message is too long",
  },
  calEmbed: {
    ariaLabel: "Appointment booking calendar",
    fallback:
      "Online booking is not available at the moment. Please reach out by phone, email, or WhatsApp.",
  },
};

const FORM_COPY: Record<Locale, FormCopy> = { fr, en };

export function getFormCopy(locale: Locale): FormCopy {
  return FORM_COPY[locale];
}

export type ContactFormValues = {
  name: string;
  phone: string;
  email: string;
  intent: ContactIntent | "";
  message: string;
};

export type ContactFormField = keyof Omit<ContactFormValues, "intent"> | "intent";

export type ContactFormFieldErrors = Partial<Record<ContactFormField, string>>;

export function createContactFormSchema(validation: FormValidationCopy) {
  return z.object({
    name: z.string().trim().min(1, validation.nameRequired),
    phone: z.string().trim().min(10, validation.phoneMin),
    email: z.string().trim().email(validation.emailInvalid),
    intent: z.enum(contactIntents, {
      required_error: validation.intentRequired,
      invalid_type_error: validation.intentRequired,
    }),
    message: z.string().trim().max(2000, validation.messageMax),
  });
}

export function validateContactForm(
  values: ContactFormValues,
  validation: FormValidationCopy,
): ContactFormFieldErrors {
  const schema = createContactFormSchema(validation);
  const result = schema.safeParse({
    ...values,
    intent: values.intent || undefined,
  });

  if (result.success) {
    return {};
  }

  const errors: ContactFormFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field as ContactFormField]) {
      errors[field as ContactFormField] = issue.message;
    }
  }

  return errors;
}