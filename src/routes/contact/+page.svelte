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

<section class="container-editorial pb-16 md:pb-20">
  <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
    <div class="space-y-8">
      <h2 class="eyebrow text-burgundy">{copy.contact.methodsHeading}</h2>

      <div class="space-y-6">
        <div>
          <p class="text-xs uppercase tracking-[0.08em] text-secondary mb-1">{copy.contact.phoneLabel}</p>
          <a href={phoneHref} class="text-xl text-primary hover:text-burgundy transition-colors">{phone}</a>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.08em] text-secondary mb-1">{copy.contact.emailLabel}</p>
          <a href="mailto:{email}" class="text-xl text-primary hover:text-burgundy transition-colors">{email}</a>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.08em] text-secondary mb-1">{copy.contact.whatsappLabel}</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" class="text-xl text-primary hover:text-burgundy transition-colors">{phone}</a>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.08em] text-secondary mb-1">{copy.contact.hoursLabel}</p>
          <p class="whitespace-pre-line text-sm text-secondary">{hours}</p>
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