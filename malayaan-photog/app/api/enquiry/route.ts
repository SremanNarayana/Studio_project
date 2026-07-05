import { NextResponse } from "next/server";

const API_TIMEOUT_MS = 10_000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name?.trim() || !body?.phone?.trim() || !body?.service || !body?.date) {
    return NextResponse.json(
      { error: "Name, phone number, event type, and event date are required." },
      { status: 400 }
    );
  }

  const apiUrl = process.env.ADMIN_API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    console.error("ADMIN_API_URL is not configured");
    return NextResponse.json(
      { error: "Online booking is temporarily unavailable. Please contact the studio." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/client/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: body.name.trim(),
        phoneNumber: body.phone.trim(),
        emailAddress: body.email?.trim() || undefined,
        shootType: body.service,
        eventDate: body.date,
        venueName: body.location?.trim() || undefined,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || result.error || "We could not submit your booking request." },
        { status: response.status }
      );
    }

    const data = result.data ?? result;
    return NextResponse.json({
      trackingNumber: data.trackingNumber,
      approvalStatus: data.approvalStatus ?? "Pending",
    });
  } catch (error) {
    console.error("Booking API request failed", error);
    return NextResponse.json(
      { error: "The studio service could not be reached. Please try again shortly." },
      { status: 502 }
    );
  }
}
