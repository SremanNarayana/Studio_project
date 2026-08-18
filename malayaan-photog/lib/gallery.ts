// ---------------------------------------------------------------------------
// Gallery data layer
// ---------------------------------------------------------------------------
// The UI depends ONLY on the shape returned by `getGalleryItems()`. To make the
// gallery fully dynamic, replace the body of that function with a database/API
// call (e.g. Supabase) that returns the same `GalleryItem[]` shape — nothing in
// the page needs to change. See the note above `getGalleryItems` below.
// ---------------------------------------------------------------------------

export type GalleryCategory =
  | "Wedding Photography"
  | "Bridal Portfolio"
  | "Groom Portfolio"
  | "Couple Portraits"
  | "Pre Wedding"
  | "Post Wedding"
  | "Engagement"
  | "Candid Moments"
  | "Reception"
  | "Traditional Ceremony"
  | "Cinematic Stills";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Wedding Photography",
  "Bridal Portfolio",
  "Groom Portfolio",
  "Couple Portraits",
  "Pre Wedding",
  "Post Wedding",
  "Engagement",
  "Candid Moments",
  "Reception",
  "Traditional Ceremony",
  "Cinematic Stills",
];

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  location: string;
  eventType: string;
  coverImage: string;
  images: string[];
  photographer: string;
  date: string; // ISO (YYYY-MM-DD) — the event date
  description?: string;
  featured: boolean;
  createdAt: string; // ISO
  photoCount: number; // total photos in the album (images[] holds the preview set)
  /** Front-end masonry hint (CSS aspect-ratio, e.g. "3/4"). Not persisted server-side. */
  aspect: string;
};

// Soft warm blur placeholder shared across images (prevents blank flashes, no
// per-image generation needed). Works in both server and client bundles.
export const GALLERY_BLUR =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='15'><rect width='100%' height='100%' fill='#efe7d8'/></svg>`
  );

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// Proven-good remote assets (already used elsewhere in this project, so they are
// guaranteed to resolve through the Next.js image optimizer).
const U1 = u("photo-1519741497674-611481863552");
const U2 = u("photo-1591604466107-ec97de577aff");
const U3 = u("photo-1583939003579-730e3918a45a");
const U4 = u("photo-1606216794074-735e91aa2c92");
const U5 = u("photo-1537633552985-df8429e8048b");
const U6 = u("photo-1525258946800-98cfd641d0de");
const U7 = u("photo-1521737604893-d14cc237f11d");
const U8 = u("photo-1497032628192-86f99bcd76bc");
const U9 = u("photo-1542038784456-1ea8e935640e");
const U10 = u("photo-1481627834876-b7833e8f5570");

const items: GalleryItem[] = [
  {
    id: "gal-01",
    title: "Rohit & Priya",
    category: "Pre Wedding",
    location: "Madurai",
    eventType: "Pre-Wedding Shoot",
    coverImage: "/portfolio-02.jpg",
    images: ["/portfolio-02.jpg", U7, U1],
    photographer: "Malayaan Studio",
    date: "2026-01-18",
    description: "Golden-hour portraits along the temple town backwaters.",
    featured: true,
    createdAt: "2026-01-20",
    photoCount: 48,
    aspect: "4/5",
  },
  {
    id: "gal-02",
    title: "Sneha — Bridal",
    category: "Bridal Portfolio",
    location: "Chennai",
    eventType: "Bridal Portrait",
    coverImage: "/portfolio-10.jpg",
    images: ["/portfolio-10.jpg", U8],
    photographer: "Priya Nair",
    date: "2025-12-04",
    description: "Kanjivaram silks, temple jewellery, and quiet confidence.",
    featured: false,
    createdAt: "2025-12-06",
    photoCount: 32,
    aspect: "2/3",
  },
  {
    id: "gal-03",
    title: "Karthik & Meena",
    category: "Wedding Photography",
    location: "Melur",
    eventType: "Wedding",
    coverImage: "/portfolio-04.jpg",
    images: ["/portfolio-04.jpg", U1, U4],
    photographer: "Malayaan Studio",
    date: "2026-02-11",
    description: "A grand South Indian wedding across two luminous days.",
    featured: true,
    createdAt: "2026-02-14",
    photoCount: 128,
    aspect: "3/2",
  },
  {
    id: "gal-04",
    title: "Aravind — Groom",
    category: "Groom Portfolio",
    location: "Tirunelveli",
    eventType: "Groom Portrait",
    coverImage: U9,
    images: [U9, U7],
    photographer: "Arjun Raj",
    date: "2025-11-22",
    description: "Sharp veshti tailoring against heritage walls.",
    featured: false,
    createdAt: "2025-11-24",
    photoCount: 24,
    aspect: "4/5",
  },
  {
    id: "gal-05",
    title: "Vikram & Divya",
    category: "Couple Portraits",
    location: "Kodaikanal",
    eventType: "Couple Session",
    coverImage: "/portfolio-05.jpg",
    images: ["/portfolio-05.jpg", U3],
    photographer: "Malayaan Studio",
    date: "2026-03-02",
    description: "Misty hill-station morning, endless coffee, easy laughter.",
    featured: false,
    createdAt: "2026-03-04",
    photoCount: 40,
    aspect: "1/1",
  },
  {
    id: "gal-06",
    title: "Akash & Nandhini",
    category: "Pre Wedding",
    location: "Madurai",
    eventType: "Pre-Wedding Shoot",
    coverImage: "/portfolio-11.jpg",
    images: ["/portfolio-11.jpg", U1],
    photographer: "Malayaan Studio",
    date: "2026-02-27",
    description: "City lights and a slow evening walk.",
    featured: true,
    createdAt: "2026-03-01",
    photoCount: 42,
    aspect: "3/4",
  },
  {
    id: "gal-07",
    title: "Suresh & Kavya — Reception",
    category: "Reception",
    location: "Chennai",
    eventType: "Reception",
    coverImage: U6,
    images: [U6, U4],
    photographer: "Priya Nair",
    date: "2026-01-30",
    description: "A candlelit stage and a room full of celebration.",
    featured: false,
    createdAt: "2026-02-01",
    photoCount: 86,
    aspect: "3/2",
  },
  {
    id: "gal-08",
    title: "The Garland Exchange",
    category: "Traditional Ceremony",
    location: "Melur",
    eventType: "Wedding Ritual",
    coverImage: "/portfolio-09.jpg",
    images: ["/portfolio-09.jpg", U4],
    photographer: "Malayaan Studio",
    date: "2026-02-11",
    description: "Maalai maatral — the sacred exchange of garlands.",
    featured: false,
    createdAt: "2026-02-12",
    photoCount: 54,
    aspect: "4/5",
  },
  {
    id: "gal-09",
    title: "Nithya & Ganesh",
    category: "Engagement",
    location: "Kanyakumari",
    eventType: "Engagement",
    coverImage: "/portfolio-03.jpg",
    images: ["/portfolio-03.jpg", U3],
    photographer: "Arjun Raj",
    date: "2025-12-19",
    description: "A seaside promise where three oceans meet.",
    featured: false,
    createdAt: "2025-12-21",
    photoCount: 36,
    aspect: "3/2",
  },
  {
    id: "gal-10",
    title: "Between Takes",
    category: "Candid Moments",
    location: "Madurai",
    eventType: "Wedding",
    coverImage: "/portfolio-13.jpg",
    images: ["/portfolio-13.jpg", U1],
    photographer: "Malayaan Studio",
    date: "2026-02-11",
    description: "The unscripted glances between the big moments.",
    featured: false,
    createdAt: "2026-02-13",
    photoCount: 60,
    aspect: "1/1",
  },
  {
    id: "gal-11",
    title: "First Light — Cinematic",
    category: "Cinematic Stills",
    location: "Kodaikanal",
    eventType: "Cinematic Film",
    coverImage: U3,
    images: [U3, U1],
    photographer: "Malayaan Studio",
    date: "2026-03-02",
    description: "Frame-grabs from the cinematic wedding film.",
    featured: true,
    createdAt: "2026-03-05",
    photoCount: 30,
    aspect: "16/9",
  },
  {
    id: "gal-12",
    title: "Anitha — Bridal",
    category: "Bridal Portfolio",
    location: "Tirunelveli",
    eventType: "Bridal Portrait",
    coverImage: "/portfolio-01.jpg",
    images: ["/portfolio-01.jpg", U8],
    photographer: "Priya Nair",
    date: "2025-11-08",
    description: "Traditional muhurtham glow, soft and regal.",
    featured: false,
    createdAt: "2025-11-10",
    photoCount: 28,
    aspect: "3/4",
  },
  {
    id: "gal-13",
    title: "Manoj & Shruthi",
    category: "Post Wedding",
    location: "Chennai",
    eventType: "Post-Wedding Shoot",
    coverImage: "/portfolio-06.jpg",
    images: ["/portfolio-06.jpg", U7],
    photographer: "Malayaan Studio",
    date: "2026-03-14",
    description: "A relaxed morning-after in soft neutrals.",
    featured: false,
    createdAt: "2026-03-16",
    photoCount: 34,
    aspect: "4/5",
  },
  {
    id: "gal-14",
    title: "Deepak & Ramya",
    category: "Wedding Photography",
    location: "Madurai",
    eventType: "Wedding",
    coverImage: "/portfolio-12.jpg",
    images: ["/portfolio-12.jpg", U4],
    photographer: "Malayaan Studio",
    date: "2025-10-27",
    description: "Temple vows under a canopy of jasmine.",
    featured: false,
    createdAt: "2025-10-29",
    photoCount: 142,
    aspect: "2/3",
  },
  {
    id: "gal-15",
    title: "Harini — Candid",
    category: "Candid Moments",
    location: "Melur",
    eventType: "Wedding",
    coverImage: "/portfolio-07.jpg",
    images: ["/portfolio-07.jpg", U3],
    photographer: "Arjun Raj",
    date: "2026-02-11",
    description: "Joy caught mid-dance during the celebrations.",
    featured: false,
    createdAt: "2026-02-12",
    photoCount: 52,
    aspect: "3/4",
  },
  {
    id: "gal-16",
    title: "Prakash & Lakshmi",
    category: "Couple Portraits",
    location: "Kanyakumari",
    eventType: "Couple Session",
    coverImage: U7,
    images: [U7, U1],
    photographer: "Malayaan Studio",
    date: "2026-01-06",
    description: "Windswept portraits on the southern shore.",
    featured: false,
    createdAt: "2026-01-08",
    photoCount: 38,
    aspect: "3/2",
  },
  {
    id: "gal-17",
    title: "Family Blessings",
    category: "Traditional Ceremony",
    location: "Madurai",
    eventType: "Wedding Ritual",
    coverImage: "/about-photo.jpg",
    images: ["/about-photo.jpg", U4],
    photographer: "Malayaan Studio",
    date: "2025-10-27",
    description: "Elders' blessings, the heart of every ceremony.",
    featured: false,
    createdAt: "2025-10-28",
    photoCount: 40,
    aspect: "4/5",
  },
  {
    id: "gal-18",
    title: "Ashwin & Tara",
    category: "Engagement",
    location: "Kodaikanal",
    eventType: "Engagement",
    coverImage: U5,
    images: [U5, U3],
    photographer: "Priya Nair",
    date: "2026-03-21",
    description: "Ring exchange among the eucalyptus.",
    featured: false,
    createdAt: "2026-03-23",
    photoCount: 30,
    aspect: "1/1",
  },
  {
    id: "gal-19",
    title: "Reception Glow",
    category: "Reception",
    location: "Melur",
    eventType: "Reception",
    coverImage: U6,
    images: [U6, U4],
    photographer: "Malayaan Studio",
    date: "2026-02-12",
    description: "Fairy lights, first dance, forever.",
    featured: false,
    createdAt: "2026-02-13",
    photoCount: 74,
    aspect: "3/2",
  },
  {
    id: "gal-20",
    title: "Naveen — Groom",
    category: "Groom Portfolio",
    location: "Chennai",
    eventType: "Groom Portrait",
    coverImage: U9,
    images: [U9],
    photographer: "Arjun Raj",
    date: "2026-01-15",
    description: "Classic sherwani, modern attitude.",
    featured: false,
    createdAt: "2026-01-17",
    photoCount: 22,
    aspect: "3/4",
  },
  {
    id: "gal-21",
    title: "Ishaan & Meghna",
    category: "Pre Wedding",
    location: "Kanyakumari",
    eventType: "Pre-Wedding Shoot",
    coverImage: U1,
    images: [U1, U7],
    photographer: "Malayaan Studio",
    date: "2026-03-09",
    description: "Barefoot on the sand at sunrise.",
    featured: false,
    createdAt: "2026-03-11",
    photoCount: 44,
    aspect: "16/9",
  },
  {
    id: "gal-22",
    title: "Quiet Vows — Cinematic",
    category: "Cinematic Stills",
    location: "Tirunelveli",
    eventType: "Cinematic Film",
    coverImage: U2,
    images: [U2],
    photographer: "Malayaan Studio",
    date: "2025-11-08",
    description: "A held breath, rendered in cinematic tones.",
    featured: false,
    createdAt: "2025-11-09",
    photoCount: 26,
    aspect: "16/9",
  },
  {
    id: "gal-23",
    title: "Reena — Post Wedding",
    category: "Post Wedding",
    location: "Kodaikanal",
    eventType: "Post-Wedding Shoot",
    coverImage: U8,
    images: [U8],
    photographer: "Priya Nair",
    date: "2026-03-28",
    description: "A dreamy morning wrapped in mist.",
    featured: false,
    createdAt: "2026-03-30",
    photoCount: 33,
    aspect: "2/3",
  },
  {
    id: "gal-24",
    title: "The Baraat",
    category: "Candid Moments",
    location: "Madurai",
    eventType: "Wedding",
    coverImage: U10,
    images: [U10, U4],
    photographer: "Malayaan Studio",
    date: "2026-02-11",
    description: "Colour, rhythm, and unfiltered joy.",
    featured: false,
    createdAt: "2026-02-12",
    photoCount: 58,
    aspect: "4/5",
  },
];

/**
 * Returns the visible gallery items, newest first.
 *
 * SWAP POINT — to make the gallery admin-driven, replace the body with a
 * database/API read, e.g.:
 *
 *   const sb = await createSupabaseServer();
 *   const { data } = await sb.from("gallery_albums")
 *     .select("*").eq("hidden", false).order("created_at", { ascending: false });
 *   return (data ?? []).map(mapRowToGalleryItem);
 *
 * The rest of the page consumes `GalleryItem[]` and needs no changes.
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const apiUrl = process.env.ADMIN_API_URL?.replace(/\/$/, "");
  if (!apiUrl) return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  try {
    const response = await fetch(`${apiUrl}/api/gallery`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(result.data)) throw new Error("Gallery API unavailable");
    const uploaded: GalleryItem[] = result.data.map((image: {
      id: string; title: string; category: string; eventType?: string; location?: string;
      eventDate?: string; photoCount?: number; description?: string; featured?: boolean;
      imageData: string; imagesData?: string[]; createdAt?: string;
    }) => {
      const images = image.imagesData?.length ? image.imagesData : [image.imageData];
      return {
        id: String(image.id),
        title: image.title,
        category: (GALLERY_CATEGORIES.includes(image.category as GalleryCategory) ? image.category : "Wedding Photography") as GalleryCategory,
        location: image.location || "Tamil Nadu",
        eventType: image.eventType || "Wedding",
        coverImage: images[0],
        images,
        photographer: "Malayaan Photography",
        date: image.eventDate ? new Date(image.eventDate).toISOString().slice(0, 10) : "2025-01-01",
        description: image.description,
        featured: Boolean(image.featured),
        createdAt: image.createdAt || new Date().toISOString(),
        photoCount: image.photoCount || images.length,
        aspect: "3/4",
      };
    });
    return [...uploaded, ...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
