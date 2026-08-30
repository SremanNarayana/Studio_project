// ---------------------------------------------------------------------------
// Google Places (New) — real reviews for the Malayaan Photography profile.
// ---------------------------------------------------------------------------
// Runs SERVER-SIDE only. Never import this into a client component and never
// expose GOOGLE_PLACES_API_KEY to the browser.
//
// Config (all via env, none committed):
//   GOOGLE_PLACES_API_KEY  — required. A key with "Places API (New)" enabled
//                            and billing active on the Google Cloud project.
//   GOOGLE_PLACE_ID        — optional. The business's Place ID. If omitted, we
//                            resolve it once via Text Search using the name.
//   GOOGLE_PLACE_QUERY     — optional. Overrides the Text Search query used to
//                            resolve the Place ID.
//
// If the key or Place ID is missing, or Google returns nothing, this returns
// empty data so the UI shows no fabricated reviews — only the real ones (if any).
// The Places API returns at most 5 reviews; attribution is preserved in the UI.
// ---------------------------------------------------------------------------

import type { Review, ReviewSummary } from "./reviews";

export type PlacesReviews = { summary: ReviewSummary | null; reviews: Review[] };

const EMPTY: PlacesReviews = { summary: null, reviews: [] };

const PLACE_ID_REVALIDATE = 60 * 60 * 24 * 30; // 30d — a Place ID is stable
const DETAILS_REVALIDATE = 60 * 60 * 6; //          6h — refresh reviews/rating

const DEFAULT_QUERY = "Malayaan Photography, Melur, Tamil Nadu";

/** Resolve the Place ID: explicit env var wins, else Text Search by name. */
async function resolvePlaceId(key: string): Promise<string | null> {
  const explicit = process.env.GOOGLE_PLACE_ID?.trim();
  if (explicit) return explicit;

  const textQuery = process.env.GOOGLE_PLACE_QUERY?.trim() || DEFAULT_QUERY;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.displayName",
      },
      body: JSON.stringify({ textQuery, maxResultCount: 1 }),
      next: { revalidate: PLACE_ID_REVALIDATE },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.places?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

interface PlaceReviewRaw {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string };
  relativePublishTimeDescription?: string;
}

/** Overall rating + count + up to 5 real reviews, or empty on any failure. */
export async function getGoogleReviews(): Promise<PlacesReviews> {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) return EMPTY;

  const placeId = await resolvePlaceId(key);
  if (!placeId) return EMPTY;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
      next: { revalidate: DETAILS_REVALIDATE },
    });
    if (!res.ok) return EMPTY;
    const data = await res.json();

    const rating = typeof data.rating === "number" ? data.rating : null;
    const count = typeof data.userRatingCount === "number" ? data.userRatingCount : null;
    const summary: ReviewSummary | null =
      rating != null && count != null ? { rating, count } : null;

    const reviews: Review[] = Array.isArray(data.reviews)
      ? (data.reviews as PlaceReviewRaw[])
          .map((r): Review => ({
            name: r.authorAttribution?.displayName?.trim() || "Google user",
            rating: typeof r.rating === "number" ? r.rating : 5,
            text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
            date: r.relativePublishTimeDescription,
            uri: r.authorAttribution?.uri,
            source: "Google",
          }))
          .filter((r) => r.text.length > 0)
      : [];

    return { summary, reviews };
  } catch {
    return EMPTY;
  }
}
