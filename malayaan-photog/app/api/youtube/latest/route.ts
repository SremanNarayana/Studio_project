import { NextResponse } from "next/server";
import { getLatestVideo } from "@/lib/youtube";

// The heavy caching lives on the underlying YouTube fetches (see lib/youtube.ts),
// so this handler simply returns the cached latest video as JSON.
export async function GET() {
  const video = await getLatestVideo();

  if (!video) {
    return NextResponse.json(
      { error: "Latest video currently unavailable." },
      { status: 503 }
    );
  }

  return NextResponse.json(video);
}
