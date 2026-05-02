// components/site/json-ld.tsx
// Structured data for search engines — rich results, knowledge panels, FAQ snippets

type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  // JSON-LD requires raw inline JSON; this is the canonical Next.js pattern.
  // `data` is always server-built from controlled inputs (schema generators in this
  // file plus DB content we own), never from user input. JSON.stringify inside a
  // <script type="application/ld+json"> is parsed as data, not HTML.
  const inner = { __html: JSON.stringify(data) };
  return (
    // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
    <script type="application/ld+json" dangerouslySetInnerHTML={inner} />
  );
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Akritos Technology Partners LLC",
    alternateName: "Akritos",
    description:
      "We help small businesses own the keys to move — domain, DNS, cloud accounts, backups, vendor relationships. Vendor Independence Audits, Apple Business setup, enterprise MDM when needed, Google Workspace, AI risk advisory, and exit plans for any vendor. Published rates, zero vendor markup, no lock-in.",
    url: "https://akritos.com",
    telephone: "+18609343410",
    priceRange: "$225/hr",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "State", name: "Connecticut" },
      { "@type": "State", name: "Massachusetts" },
      { "@type": "State", name: "Rhode Island" },
      { "@type": "City", name: "New York City" },
    ],
    serviceType: [
      "Vendor Independence Audit",
      "Vendor Migration and Exit Planning",
      "Apple Business Setup",
      "Apple Business Management",
      "Enterprise MDM Deployment and Migration",
      "Google Workspace Setup",
      "Mac Management Training for Internal IT",
      "PCI Scope Reduction",
      "Payment Processing Consulting",
      "Executive IT Support",
      "Digital Legacy and Account Recovery",
      "IT Advisory",
      "AI Risk Assessment",
      "AI Governance Advisory",
      "AI Policy Development",
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
      "AI Risk Management",
      "AI Governance",
      "Responsible AI Adoption",
      "Prompt Engineering Best Practices",
      "Vendor Lock-in Mitigation",
      "Domain Ownership",
      "DNS Management",
      "Cloud Account Sovereignty",
      "Internal IT Enablement",
    ],
    slogan: "Own the keys to move.",
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

export function articleSchema(post: {
  title: string;
  description: string | null;
  slug: string;
  publishedAt: Date | null;
  updatedAt: Date;
  coverImage?: string | null;
}) {
  const url = `https://akritos.com/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? undefined,
    image: post.coverImage ?? "https://akritos.com/og-default.png",
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: "Goetch Stone", url: "https://akritos.com/about" },
    publisher: {
      "@type": "Organization",
      name: "Akritos Technology Partners LLC",
      logo: { "@type": "ImageObject", url: "https://akritos.com/logo.png" },
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
