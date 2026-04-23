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
    name: "Akritos Technology Partners LLC",
    alternateName: "Akritos",
    description:
      "Apple Business setup and management, enterprise MDM when you need it, Google Workspace, and Mac management training. Published rates, zero vendor markup, no lock-in. Remote-first, serving small businesses nationwide.",
    url: "https://akritos.com",
    telephone: "+18609343410",
    priceRange: "$225/hr",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: [
      "Apple Business Setup",
      "Apple Business Management",
      "Enterprise MDM Deployment and Migration",
      "Google Workspace Setup",
      "Mac Management Training",
      "PCI Scope Reduction",
      "Payment Processing Consulting",
      "Executive IT Support",
      "Digital Legacy and Account Recovery",
      "IT Advisory",
    ],
    knowsAbout: [
      "Apple Business",
      "Apple Business Manager",
      "Apple Business Essentials",
      "Apple Business Connect",
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
      "Apple Legacy Contact",
      "Account Recovery",
      "Password Management",
      "Digital Estate Planning",
    ],
    slogan: "Apple device management, simplified.",
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
