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
    name: "Akritos",
    description:
      "Technology consulting partner for small businesses. Apple Business, MDM, compliance, e-commerce, and infrastructure — with published rates and zero vendor markup.",
    url: "https://akritos.com",
    telephone: "",
    priceRange: "$150-$175/hr",
    areaServed: [
      { "@type": "State", name: "Connecticut" },
      { "@type": "State", name: "Massachusetts" },
      { "@type": "State", name: "Rhode Island" },
      { "@type": "City", name: "New York City" },
    ],
    serviceType: [
      "IT Consulting",
      "Apple Business Setup",
      "MDM Deployment",
      "PCI Compliance",
      "E-Commerce Setup",
      "VoIP Systems",
      "Data Migration",
      "Legacy Application Modernization",
    ],
    knowsAbout: [
      "Apple Business Manager",
      "Mosyle",
      "Jamf",
      "Kandji",
      "PCI DSS",
      "HIPAA",
      "Shopify",
      "Google Workspace",
      "Microsoft 365",
    ],
    slogan: "We fix the confusion. You keep the independence.",
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
