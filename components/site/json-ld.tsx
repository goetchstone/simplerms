// components/site/json-ld.tsx
// Structured data for search engines — rich results, knowledge panels, FAQ snippets

type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Akritos Technology Partners, LLC",
    alternateName: "Akritos",
    description:
      "Apple Business setup, MDM deployment, Google Workspace, and Mac management training for Windows-native IT teams. Published rates, zero vendor markup, no lock-in.",
    url: "https://akritos.com",
    telephone: "+18609343410",
    priceRange: "$225/hr",
    areaServed: [
      { "@type": "State", name: "Connecticut" },
      { "@type": "State", name: "Massachusetts" },
      { "@type": "State", name: "Rhode Island" },
      { "@type": "City", name: "New York City" },
    ],
    serviceType: [
      "Apple Business Manager Setup",
      "MDM Deployment and Migration",
      "Google Workspace Setup",
      "Mac Management Training",
      "PCI Scope Reduction",
      "Payment Processing Consulting",
      "Executive IT Support",
      "IT Advisory",
    ],
    knowsAbout: [
      "Apple Business Manager",
      "Mosyle",
      "Jamf",
      "Iru",
      "Addigy",
      "Google Workspace",
      "Microsoft Intune Migration",
      "PCI DSS",
      "MDM",
      "macOS Management",
      "Zero-Touch Deployment",
    ],
    slogan: "Your IT team knows Windows. We teach them Apple.",
    founder: {
      "@type": "Person",
      name: "Goetch Stone",
      jobTitle: "Founder",
    },
    email: "info@akritos.com",
    address: {
      "@type": "PostalAddress",
      addressRegion: "CT",
      addressCountry: "US",
    },
    foundingDate: "2026",
    makesOffer: {
      "@type": "Offer",
      name: "Free Consultation",
      price: "0",
      priceCurrency: "USD",
      description:
        "No-obligation initial consultation to assess your technology needs.",
    },
  };
}

export function faqSchema(
  faqs: Array<{ q: string; a: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "ProfessionalService",
      name: "Akritos",
      url: "https://akritos.com",
    },
    name: service.name,
    description: service.description,
  };
}
