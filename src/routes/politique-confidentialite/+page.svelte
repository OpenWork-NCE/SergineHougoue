<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import type { Locale } from "$i18n/locales";
  import type { PageData } from "./$types";

  interface PrivacySection {
    title: string;
    body: string;
  }

  interface PrivacyCopy {
    eyebrow: string;
    title: string;
    intro: string;
    sections: PrivacySection[];
  }

  const content: Record<Locale, PrivacyCopy> = {
    fr: {
      eyebrow: "07 / Légal",
      title: "Politique de confidentialité",
      intro:
        "Cette politique décrit comment Sergine Hougoue Immo collecte, utilise et protège vos renseignements personnels, conformément à la Loi 25 du Québec.",
      sections: [
        {
          title: "Collecte des renseignements",
          body: "Nous recueillons les renseignements que vous fournissez volontairement via le formulaire de contact (nom, téléphone, courriel, intention et message), ainsi que des données techniques anonymisées via Google Analytics lorsque vous acceptez les témoins. Aucune information sensible n'est demandée.",
        },
        {
          title: "Utilisation des renseignements",
          body: "Vos coordonnées servent uniquement à répondre à vos demandes, planifier des rendez-vous et assurer le suivi de votre dossier immobilier. Les données analytiques nous aident à améliorer le site. Nous ne vendons ni ne louons vos renseignements à des tiers.",
        },
        {
          title: "Conservation des renseignements",
          body: "Les messages de contact sont conservés le temps nécessaire au suivi de votre demande, puis archivés ou supprimés selon nos obligations professionnelles. Les préférences de consentement aux témoins sont stockées localement dans votre navigateur.",
        },
        {
          title: "Vos droits",
          body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos renseignements en écrivant à serginehougoue@gmail.com. Vous pouvez retirer votre consentement aux témoins analytiques à tout moment via les paramètres de votre navigateur ou en refusant la bannière de consentement.",
        },
      ],
    },
    en: {
      eyebrow: "07 / Legal",
      title: "Privacy policy",
      intro:
        "This policy explains how Sergine Hougoue Immo collects, uses, and protects your personal information in accordance with Quebec's Law 25.",
      sections: [
        {
          title: "Information we collect",
          body: "We collect information you voluntarily provide through the contact form (name, phone, email, intent, and message), as well as anonymized technical data through Google Analytics when you accept cookies. We do not request sensitive information.",
        },
        {
          title: "How we use your information",
          body: "Your contact details are used solely to respond to inquiries, schedule appointments, and follow up on your real estate needs. Analytics data helps us improve the website. We do not sell or rent your information to third parties.",
        },
        {
          title: "Data retention",
          body: "Contact messages are kept for as long as needed to handle your request, then archived or deleted according to professional obligations. Cookie consent preferences are stored locally in your browser.",
        },
        {
          title: "Your rights",
          body: "You may request access, correction, or deletion of your information by emailing serginehougoue@gmail.com. You can withdraw analytics consent at any time through your browser settings or by rejecting the consent banner.",
        },
      ],
    },
  };

  let { data }: { data: PageData } = $props();

  const copy = $derived(content[data.locale]);
</script>

<PageHeader eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

<article class="container-editorial pb-24 md:pb-32">
  {#each copy.sections as section (section.title)}
    <section class="mb-12 max-w-3xl last:mb-0">
      <h2 class="font-display text-3xl text-primary">{section.title}</h2>
      <p class="mt-4 text-lg leading-relaxed text-secondary">{section.body}</p>
    </section>
  {/each}
</article>