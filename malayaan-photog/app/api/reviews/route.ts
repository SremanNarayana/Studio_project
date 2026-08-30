import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/places";

// Heavy caching lives on the underlying Places fetches (see lib/places.ts).
// This handler returns the cached summary + real reviews as JSON. It always
// responds 200 — an empty payload simply means "no real reviews to show".
export async function GET() {
  const data = await getGoogleReviews();
  return NextResponse.json(data);
}
