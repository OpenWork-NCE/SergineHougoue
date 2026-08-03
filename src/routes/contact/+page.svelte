<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import CalEmbed from "$components/forms/CalEmbed.svelte";
  import ContactForm from "$components/forms/ContactForm.svelte";
  import { getCopy } from "$i18n/copy";
  import Clock from "lucide-svelte/icons/clock";
  import Mail from "lucide-svelte/icons/mail";
  import MessageCircle from "lucide-svelte/icons/message-circle";
  import Phone from "lucide-svelte/icons/phone";
  import type { PageData } from "./$types";

  const DEFAULT_PHONE = "438-462-6015";
  const DEFAULT_EMAIL = "serginehougoue@gmail.com";
  const DEFAULT_WHATSAPP = "14384626015";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));

  const phone = $derived(
    data.siteSettings?.contactPhone?.trim() || DEFAULT_PHONE,
  );
  const email = $derived(
    data.siteSettings?.contactEmail?.trim() || DEFAULT_EMAIL,
  );
  const whatsappNumber = $derived(
    data.siteSettings?.whatsappNumber?.trim() || DEFAULT_WHATSAPP,
  );
  const hours = $derived(
    data.siteSettings?.hoursOfOperation?.trim() || copy.footer.hours,
  );

  const phoneHref = $derived(`tel:${phone.replace(/\D/g, "")}`);
  const whatsappHref = $derived(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(copy.whatsapp.defaultMessage)}`,
  );
</script>

<PageHeader
  eyebrow={copy.contact.eyebrow}
  title={copy.contact.title}
  intro={copy.contact.intro}
/>

<section class="container-editorial py-14 md:py-20">
  <div class="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
    <div class="space-y-8">
      <h2 class="eyebrow text-burgundy">{copy.contact.methodsHeading}</h2>

      <div class="space-y-3">
        <a
          href={phoneHref}
          class="card flex items-center gap-4 p-4 transition-colors hover:border-burgundy/30"
        >
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy"
          >
            <Phone class="size-5" aria-hidden="true" />
          </span>
          <div>
            <p class="text-xs uppercase tracking-[0.08em] text-secondary">
              {copy.contact.phoneLabel}
            </p>
            <p class="text-lg text-primary">{phone}</p>
          </div>
        </a>

        <a
          href="mailto:{email}"
          class="card flex items-center gap-4 p-4 transition-colors hover:border-burgundy/30"
        >
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy"
          >
            <Mail class="size-5" aria-hidden="true" />
          </span>
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-[0.08em] text-secondary">
              {copy.contact.emailLabel}
            </p>
            <p class="truncate text-lg text-primary">{email}</p>
          </div>
        </a>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          class="card flex items-center gap-4 p-4 transition-colors hover:border-burgundy/30"
        >
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy"
          >
            <MessageCircle class="size-5" aria-hidden="true" />
          </span>
          <div>
            <p class="text-xs uppercase tracking-[0.08em] text-secondary">
              {copy.contact.whatsappLabel}
            </p>
            <p class="text-lg text-primary">{phone}</p>
          </div>
        </a>

        <div class="card flex items-start gap-4 p-4">
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy"
          >
            <Clock class="size-5" aria-hidden="true" />
          </span>
          <div>
            <p class="text-xs uppercase tracking-[0.08em] text-secondary">
              {copy.contact.hoursLabel}
            </p>
            <p class="mt-1 whitespace-pre-line text-sm text-secondary">{hours}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-10">
      <div>
        <h2 class="eyebrow text-burgundy mb-4">{copy.contact.formHeading}</h2>
        <ContactForm locale={data.locale} />
      </div>

      <div>
        <h2 class="eyebrow text-burgundy mb-4">{copy.contact.bookingHeading}</h2>
        <CalEmbed locale={data.locale} calLink={data.calLink} />
      </div>
    </div>
  </div>
</section>
