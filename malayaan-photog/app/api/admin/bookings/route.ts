import { NextResponse } from "next/server";
import { createSupabaseServer, createServiceClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const sb = await createSupabaseServer();
  if (!sb) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return admin ? user : null;
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const service = createServiceClient()!;

  const { data, error } = await service
    .from("bookings")
    .insert({
      booking_id: body.booking_id,
      tracking_number: body.tracking_number,
      client_name: body.client_name,
      client_email: body.client_email ?? null,
      client_phone: body.client_phone ?? null,
      event_type: body.event_type,
      shoot_date: body.shoot_date,
      booking_date: body.booking_date ?? new Date().toISOString().slice(0, 10),
      expected_delivery_date: body.expected_delivery_date,
      current_stage: body.current_stage ?? "booking_confirmed",
      total_photos: body.total_photos ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ booking: data });
}

export async function PATCH(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, update_note, ...patch } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const service = createServiceClient()!;
  patch.updated_at = new Date().toISOString();
  const { error } = await service.from("bookings").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (update_note) {
    await service.from("booking_updates").insert({ booking_id: id, note: update_note });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const service = createServiceClient()!;
  const { error } = await service.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
