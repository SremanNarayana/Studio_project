// ---------------------------------------------------------------------------
// Google Reviews — REAL data only.
// ---------------------------------------------------------------------------
// This file is the single source of truth for the homepage Google Reviews
// showcase. Populate it ONLY with genuine, client-approved Google reviews (or
// values pulled from the Google Business Profile / Places API server-side).
//
// NEVER add invented reviews, names, text, ratings, or counts:
//   • An empty APPROVED_REVIEWS array simply hides the review cards.
//   • A null REVIEW_SUMMARY simply hides the numeric rating summary.
// So the section always degrades to its authentic heading + CTA — it never
// shows anything fabricated.
// ---------------------------------------------------------------------------

export type Review = {
  name: string; // the reviewer's real displayed name on Google
  rating: number; // 1–5, the real star rating they gave
  text: string; // the real review text
  date?: string; // optional relative date, e.g. "2 months ago"
  reviewCount?: number; // reviewer's total review count on Google
  photoCount?: number; // reviewer's total photo count on Google
  uri?: string; // optional link to the review's author/source on Google
  source?: "Google";
};

export type ReviewSummary = {
  rating: number; // real overall rating, e.g. 5.0
  count: number; // real total number of Google reviews
};

export const GOOGLE_REVIEW_URL = "https://g.page/r/CUYt4Il17wOFEBM/review";

// Genuine, client-approved Google reviews — supplied verbatim by the client.
// Wording and emojis preserved exactly. Do not invent or alter these.
export const APPROVED_REVIEWS: Review[] = [
  {
    name: "Dhanush dr7",
    rating: 5,
    reviewCount: 1,
    photoCount: 3,
    date: "2 months ago",
    text: "Malayaan Photography captured our special moments beautifully. Every photo looks natural, emotional, and professionally edited. The beach location, lighting, poses, and color tones were handled perfectly. They made us feel comfortable throughout the shoot, which helped create genuine smiles and expressions. The attention to detail and quality of the final images exceeded our expectations. Highly recommended for pre-wedding, couple, engagement, and candid photography.",
    source: "Google",
  },
  {
    name: "Shiva Balan",
    rating: 5,
    reviewCount: 8,
    photoCount: 2,
    date: "2 months ago",
    text: "Pretty impressed by his team and his work, every good thing has its issues, yes they delay a little but they make sure the wait is worth it ✨😍 just keep following them on updates and they will deliver with a bangggg!!!!",
    source: "Google",
  },
  {
    name: "Saravanan Sakthi",
    rating: 5,
    reviewCount: 1,
    date: "1 year ago",
    text: "Aathi Anna was not only a master behind the camera but also a true professional. They arrived on time, maintained a friendly and approachable demeanor, and made us feel at ease throughout the session. They patiently listened to our ideas and incorporated them seamlessly into the shoot. ❤️‍🔥",
    source: "Google",
  },
  {
    name: "Solai King",
    rating: 5,
    reviewCount: 2,
    date: "2 years ago",
    text: "Our baby shower album turned out so beautiful, capturing our precious moments welcoming our little one 😍👍🏻. Your work is awesome and definitely will book you for all our upcoming celebrations. Keep up the good work 🫱🏻‍🫲🏻. Thanks for the beautiful album ❤️",
    source: "Google",
  },
];

// Set to the real Google Business Profile values once confirmed.
// Leave null to hide the numeric summary (no invented numbers).
export const REVIEW_SUMMARY: ReviewSummary | null = null;
