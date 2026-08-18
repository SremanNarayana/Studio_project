import { NextResponse } from "next/server";

const API_TIMEOUT_MS = 10_000;

const shootTypeMap: Record<string, string> = {
  Reception: "Traditional Event",
  "Corporate Event": "Corporate",
  "Commercial Shoot": "Product Shoot",
  "Fashion Shoot": "Portrait",
};

const requirementMap: Record<string, string> = {
  Photography: "Photography",
  Cinematography: "Videography",
  "Drone Coverage": "Drone Coverage",
  "Live Streaming": "Live Streaming",
};

export async function POST(request: Request) {
  const apiUrl = process.env.ADMIN_API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    console.error("ADMIN_API_URL is not configured");
    return NextResponse.json({ error: "Booking is temporarily unavailable." }, { status: 503 });
  }

  const form = await request.json().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });

  try {
    const response = await fetch(`${apiUrl}/api/client/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.name?.trim(),
        phoneNumber: form.mobile,
        emailAddress: form.email?.trim(),
        shootType: shootTypeMap[form.eventType] ?? form.eventType,
        eventDate: form.date,
        eventTime: form.time,
        venueName: form.location?.trim(),
        venueAddress: form.city?.trim(),
        requirements: Array.isArray(form.services)
          ? form.services.map((service: string) => requirementMap[service]).filter(Boolean)
          : [],
        enquiryNotes: [
          form.budget && `Budget: ${form.budget}`,
          form.requirement && `Customer requirements: ${form.requirement.trim()}`,
        ].filter(Boolean).join("\n"),
        referralCode: form.referralCode,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json({ error: result.message || result.error || "We could not submit your booking request." }, { status: response.status });
    }
    return NextResponse.json({ trackingNumber: result.data?.trackingNumber || result.trackingNumber });
  } catch (error) {
    console.error("Booking API request failed", error);
    return NextResponse.json({ error: "Booking is temporarily unavailable." }, { status: 503 });
  }
}
