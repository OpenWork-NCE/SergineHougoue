<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import CalEmbed from "$components/forms/CalEmbed.svelte";
  import ContactForm from "$components/forms/ContactForm.svelte";
  import { getCopy } from "$i18n/copy";
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

<section class="container-editorial pb-24 md:pb-32">
  <div class="grid gap-16 lg:grid-cols-2 lg:gap-20">
    <div class="space-y-8">
      <h2 class="eyebrow text-gold">{copy.contact.methodsHeading}</h2>

      <ul class="space-y-6">
        <li>
          <p class="mb-1 text-xs uppercase tracking-[0.08em] text-secondary">
            {copy.contact.phoneLabel}
          </p>
          <a
            href={phoneHref}
            class="text-lg text-primary transition-colors hover:text-gold"
          >
            {phone}
          </a>
        </li>

        <li>
          <p class="mb-1 text-xs uppercase tracking-[0.08em] text-secondary">
            {copy.contact.emailLabel}
          </p>
          <a
            href="mailto:{email}"
            class="text-lg text-primary transition-colors hover:text-gold"
          >
            {email}
          </a>
        </li>

        <li>
          <p class="mb-1 text-xs uppercase tracking-[0.08em] text-secondary">
            {copy.contact.whatsappLabel}
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            class="text-lg text-primary transition-colors hover:text-gold"
          >
            {phone}
          </a>
        </li>

        <li>
          <p class="mb-1 text-xs uppercase tracking-[0.08em] text-secondary">
            {copy.contact.hoursLabel}
          </p>
          <p class="whitespace-pre-line text-sm leading-relaxed text-secondary">
            {hours}
          </p>
        </li>
      </ul>
    </div>

    <div class="space-y-16">
      <div class="space-y-6">
        <h2 class="eyebrow text-gold">{copy.contact.formHeading}</h2>
        <ContactForm locale={data.locale} />
      </div>

      <div class="space-y-6">
        <h2 class="eyebrow text-gold">{copy.contact.bookingHeading}</h2>
        <CalEmbed locale={data.locale} calLink={data.calLink} />
      </div>
    </div>
  </div>
</section>