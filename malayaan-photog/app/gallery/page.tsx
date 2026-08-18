import type { Metadata } from "next";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { getGalleryItems } from "@/lib/gallery";
import { SITE_URL, BUSINESS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gallery — Wedding, Pre-Wedding & Portrait Photography",
  description:
    "Explore the Malayaan Photography gallery — wedding, bridal, groom, couple, pre-wedding, engagement, reception & cinematic photography across Madurai, Chennai, Melur & all of Tamil Nadu. A collection of timeless moments and unforgettable memories.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Malayaan Photography",
    description:
      "A collection of timeless moments, emotions and unforgettable memories captured through our lens.",
    url: "/gallery",
    type: "website",
    images: [{ url: "/portfolio-04.jpg", width: 1200, height: 630, alt: "Malayaan Photography Gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Malayaan Photography",
    description:
      "Wedding, pre-wedding, portrait & cinematic photography across Tamil Nadu.",
    images: ["/portfolio-04.jpg"],
  },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  const imageGalleryJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Malayaan Photography Gallery",
    description:
      "A collection of timeless moments, emotions and unforgettable memories captured through our lens.",
    url: `${SITE_URL}/gallery`,
    author: { "@type": "Organization", name: BUSINESS.name },
    image: items.slice(0, 12).map((it) => ({
      "@type": "ImageObject",
      name: it.title,
      contentUrl: it.coverImage.startsWith("http") ? it.coverImage : `${SITE_URL}${it.coverImage}`,
      caption: `${it.title} — ${it.category}, ${it.location}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Gallery", item: `${SITE_URL}/gallery` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <GalleryExperience items={items} />
    </>
  );
}
