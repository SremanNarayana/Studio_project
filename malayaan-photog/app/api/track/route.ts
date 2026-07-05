import { NextResponse } from "next/server";

const API_TIMEOUT_MS = 10_000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const trackingNumber = body?.trackingNumber ?? body?.tracking_number;
  const phoneNumber = body?.phoneNumber ?? body?.phone;

  if (!trackingNumber?.trim() || !phoneNumber?.trim()) {
    return NextResponse.json(
      { error: "Both Tracking ID and Phone Number are required." },
      { status: 400 }
    );
  }

  const apiUrl = process.env.ADMIN_API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    console.error("ADMIN_API_URL is not configured");
    return NextResponse.json({ error: "Tracking is temporarily unavailable." }, { status: 503 });
  }

  try {
    const response = await fetch(`${apiUrl}/api/client/bookings/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber: trackingNumber.trim(), phoneNumber: phoneNumber.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || result.error || "No matching booking was found." },
        { status: response.status }
      );
    }

    return NextResponse.json({ booking: result.data ?? result.booking ?? result });
  } catch (error) {
    console.error("Tracking API request failed", error);
    return NextResponse.json(
      { error: "The studio service could not be reached. Please try again shortly." },
      { status: 502 }
    );
  }
}
