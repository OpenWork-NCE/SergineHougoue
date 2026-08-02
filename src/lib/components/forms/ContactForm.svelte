<script lang="ts">
  import {
    contactIntents,
    getFormCopy,
    validateContactForm,
    type ContactFormFieldErrors,
    type ContactFormValues,
    type ContactIntent,
  } from "$i18n/forms";
  import type { Locale } from "$i18n/locales";

  interface Props {
    locale: Locale;
  }

  let { locale }: Props = $props();

  const copy = $derived(getFormCopy(locale));

  const emptyValues = (): ContactFormValues => ({
    name: "",
    phone: "",
    email: "",
    intent: "",
    message: "",
  });

  let values = $state<ContactFormValues>(emptyValues());
  let fieldErrors = $state<ContactFormFieldErrors>({});
  let formError = $state<string | null>(null);
  let status = $state<"idle" | "submitting" | "success" | "error">("idle");

  const fieldClass =
    "w-full rounded-lg border bg-[var(--bg-elevated)] px-4 py-3 text-sm text-primary placeholder:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy";
  const errorFieldClass = `${fieldClass} border-red-500/70`;
  const normalFieldClass = `${fieldClass} border-[var(--border-hairline)]`;

  function inputClass(field: keyof ContactFormFieldErrors) {
    return fieldErrors[field] ? errorFieldClass : normalFieldClass;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    formError = null;

    const errors = validateContactForm(values, copy.validation);
    fieldErrors = errors;

    if (Object.keys(errors).length > 0) {
      status = "idle";
      return;
    }

    status = "submitting";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          intent: values.intent,
          message: values.message,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        errors?: Record<string, string[]>;
      };

      if (!response.ok || !payload.ok) {
        const localizedErrors = validateContactForm(values, copy.validation);
        if (Object.keys(localizedErrors).length > 0) {
          fieldErrors = localizedErrors;
        } else if (payload.errors) {
          for (const [field, messages] of Object.entries(payload.errors)) {
            if (field !== "_form" && messages?.[0]) {
              fieldErrors[field as keyof ContactFormFieldErrors] = messages[0];
            }
          }
        }

        formError =
          payload.errors?._form?.[0] ??
          (Object.keys(fieldErrors).length === 0 ? copy.error : null);
        status = "error";
        return;
      }

      values = emptyValues();
      fieldErrors = {};
      formError = null;
      status = "success";
    } catch {
      formError = copy.error;
      status = "error";
    }
  }
</script>

<form class="space-y-5" onsubmit={handleSubmit} novalidate>
  {#if status === "success"}
    <p
      role="status"
      data-testid="contact-form-success"
      class="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
    >
      {copy.success}
    </p>
  {/if}

  {#if status === "error" && formError}
    <p
      role="alert"
      data-testid="contact-form-error"
      class="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
    >
      {formError}
    </p>
  {/if}

  <div class="space-y-2">
    <label class="block text-sm text-secondary" for="contact-name">
      {copy.fields.name}
    </label>
    <input
      id="contact-name"
      name="name"
      type="text"
      autocomplete="name"
      bind:value={values.name}
      class={inputClass("name")}
      aria-invalid={fieldErrors.name ? "true" : undefined}
      aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
    />
    {#if fieldErrors.name}
      <p id="contact-name-error" class="text-sm text-red-300">
        {fieldErrors.name}
      </p>
    {/if}
  </div>

  <div class="space-y-2">
    <label class="block text-sm text-secondary" for="contact-phone">
      {copy.fields.phone}
    </label>
    <input
      id="contact-phone"
      name="phone"
      type="tel"
      autocomplete="tel"
      bind:value={values.phone}
      class={inputClass("phone")}
      aria-invalid={fieldErrors.phone ? "true" : undefined}
      aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
    />
    {#if fieldErrors.phone}
      <p id="contact-phone-error" class="text-sm text-red-300">
        {fieldErrors.phone}
      </p>
    {/if}
  </div>

  <div class="space-y-2">
    <label class="block text-sm text-secondary" for="contact-email">
      {copy.fields.email}
    </label>
    <input
      id="contact-email"
      name="email"
      type="email"
      autocomplete="email"
      bind:value={values.email}
      class={inputClass("email")}
      aria-invalid={fieldErrors.email ? "true" : undefined}
      aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
    />
    {#if fieldErrors.email}
      <p id="contact-email-error" class="text-sm text-red-300">
        {fieldErrors.email}
      </p>
    {/if}
  </div>

  <div class="space-y-2">
    <label class="block text-sm text-secondary" for="contact-intent">
      {copy.fields.intent}
    </label>
    <select
      id="contact-intent"
      name="intent"
      bind:value={values.intent}
      class={inputClass("intent")}
      aria-invalid={fieldErrors.intent ? "true" : undefined}
      aria-describedby={fieldErrors.intent ? "contact-intent-error" : undefined}
    >
      <option value="">{copy.intentPlaceholder}</option>
      {#each contactIntents as intent (intent)}
        <option value={intent}>{copy.intents[intent]}</option>
      {/each}
    </select>
    {#if fieldErrors.intent}
      <p id="contact-intent-error" class="text-sm text-red-300">
        {fieldErrors.intent}
      </p>
    {/if}
  </div>

  <div class="space-y-2">
    <label class="block text-sm text-secondary" for="contact-message">
      {copy.fields.message}
    </label>
    <textarea
      id="contact-message"
      name="message"
      rows="5"
      bind:value={values.message}
      class={inputClass("message")}
      aria-invalid={fieldErrors.message ? "true" : undefined}
      aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
    ></textarea>
    {#if fieldErrors.message}
      <p id="contact-message-error" class="text-sm text-red-300">
        {fieldErrors.message}
      </p>
    {/if}
  </div>

  <button
    type="submit"
    class="rounded-full border border-burgundy bg-burgundy px-6 py-3 text-xs uppercase tracking-[0.08em] text-on-brand transition-colors hover:bg-[#8a2638] disabled:cursor-not-allowed disabled:opacity-60"
    disabled={status === "submitting"}
  >
    {status === "submitting" ? copy.submitting : copy.submit}
  </button>
</form>