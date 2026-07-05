// Central SEO configuration for Malayaan Photography.
// Update SITE_URL once the real domain is live.

export const SITE_URL = "https://malayaanphotography.com";

export const BUSINESS = {
  name: "Malayaan Photography",
  legalName: "Malayaan Photography",
  tagline: "Capturing Emotions. Creating Timeless Memories.",
  phone: "+91 77081 13657",
  phoneRaw: "+917708113657",
  email: "hello@malayaanphotography.com",
  street: "Therkkupatty, Surakkundu",
  city: "Melur",
  region: "Tamil Nadu",
  postalCode: "625106",
  country: "IN",
  // Approx coordinates for Melur, Tamil Nadu
  latitude: 10.0339,
  longitude: 78.3389,
  rating: 5.0,
  reviewCount: 38,
  priceRange: "₹₹₹",
  founded: "2014",
};

// Primary service areas — drives local SEO keyword coverage across Tamil Nadu.
export const SERVICE_AREAS = [
  "Madurai",
  "Melur",
  "Kottampatti",
  "Chennai",
  "Tirunelveli",
  "Kanyakumari",
  "Kodaikanal",
  "Dindigul",
  "Theni",
  "Sivagangai",
  "Karaikudi",
  "Trichy",
  "Virudhunagar",
  "Ramanathapuram",
];

export const SERVICES = [
  "Wedding Photography",
  "Candid Wedding Photography",
  "Cinematic Wedding Films",
  "Pre-Wedding Shoots",
  "Engagement Photography",
  "Maternity Photography",
  "Baby & Newborn Photography",
  "Family Portraits",
  "House Warming (Griha Pravesh) Photography",
  "Traditional Event Coverage",
  "Birthday & Function Photography",
  "Album Designing & Retouching",
];

// Rich keyword set blending services × locations for organic reach.
export const KEYWORDS = [
  "Malayaan Photography",
  "best wedding photographer in Madurai",
  "wedding photography Madurai",
  "candid wedding photographer Madurai",
  "wedding photographer Melur",
  "photography Kottampatti",
  "wedding photographer Chennai",
  "wedding photography Tirunelveli",
  "wedding photographer Kanyakumari",
  "Kodaikanal pre-wedding shoot",
  "best photographer in Tamil Nadu",
  "pre-wedding shoot Tamil Nadu",
  "maternity photography Madurai",
  "baby photoshoot Madurai",
  "house warming photography",
  "Griha Pravesh photographer",
  "cinematic wedding films Tamil Nadu",
  "candid photography Madurai",
  "engagement photographer Tamil Nadu",
  "family portrait photographer Madurai",
  "traditional event photographer Tamil Nadu",
];

// LocalBusiness / ProfessionalService structured data (JSON-LD).
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService", "PhotographyBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: BUSINESS.phoneRaw,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    slogan: BUSINESS.tagline,
    foundingDate: BUSINESS.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    areaServed: SERVICE_AREAS.map((a) => ({
      "@type": "City",
      name: a,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.rating,
      reviewCount: BUSINESS.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
    sameAs: [
      "https://www.instagram.com/",
      "https://www.facebook.com/",
      "https://www.youtube.com/",
    ],
  };
}

// FAQ content — written to target real local search queries.
export const FAQS: { q: string; a: string }[] = [
  {
    q: "How much does a wedding photographer in Madurai cost?",
    a: "Our wedding photography collections start at ₹49,000 and scale based on coverage days, deliverables, cinematic films and album choices. Event and house-warming coverage starts at ₹15,000, while our premium cinematic wedding experience starts at ₹95,000. Every package is fully customisable — share your dates and we'll tailor a quote for you.",
  },
  {
    q: "Do you travel across Tamil Nadu for shoots?",
    a: "Yes. Based in Melur near Madurai, we regularly photograph weddings and events across Madurai, Kottampatti, Chennai, Tirunelveli, Kanyakumari, Kodaikanal, Dindigul, Theni, Karaikudi and all over Tamil Nadu. Destination and outstation travel can be arranged for any location.",
  },
  {
    q: "How far in advance should we book our wedding date?",
    a: "We recommend booking 3 to 6 months ahead, especially for peak muhurtham and festival seasons, as dates fill quickly. For destination shoots in Kodaikanal or Kanyakumari, earlier is better. A booking is confirmed once your date is reserved with an advance.",
  },
  {
    q: "When will we receive our photos, album and film?",
    a: "You'll receive a sneak-peek gallery within 48 hours of the shoot. Fully edited photos are delivered within 3–4 weeks, the cinematic film within 6–8 weeks, and your hand-crafted album after design approval — typically 8 to 12 weeks end-to-end.",
  },
  {
    q: "Do you offer pre-wedding, maternity and baby photography?",
    a: "Absolutely. Alongside weddings, we specialise in pre-wedding and engagement shoots, maternity portraits, newborn and baby photography, kids and family portraits, and traditional house-warming (Griha Pravesh) coverage across Tamil Nadu.",
  },
  {
    q: "Do you cover both candid and traditional photography?",
    a: "Yes — every wedding includes both. Our team blends documentary-style candid photography with classic traditional portraits and cinematic films, so you get the unscripted emotion and the timeless posed frames your family will treasure.",
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    description: `${BUSINESS.tagline} Premium wedding & portrait photography across Tamil Nadu.`,
    publisher: { "@id": `${SITE_URL}/#business` },
    inLanguage: "en-IN",
  };
}
