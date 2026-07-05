import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer, createServiceClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { Booking } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sb = await createSupabaseServer();

  if (!sb) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl mb-4">Supabase Not Configured</h1>
        <p className="text-ivory-100/60 mb-8">
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, then restart the dev server.
        </p>
        <Link href="/" className="btn-ghost">
          Back to site
        </Link>
      </div>
    );
  }

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl mb-3">Access Denied</h1>
        <p className="text-ivory-100/60 mb-6">
          Your account ({user.email}) is signed in but not authorised as an admin.
        </p>
        <p className="text-xs text-ivory-100/40 mb-8">
          To grant access, run in Supabase SQL:
          <br />
          <code className="block mt-2 bg-ink-900 p-3 rounded-sm text-left">
            insert into public.admins (user_id, email) values (&apos;{user.id}&apos;, &apos;{user.email}&apos;);
          </code>
        </p>
        <form action="/admin/logout" method="post">
          <button className="btn-ghost">Sign Out</button>
        </form>
      </div>
    );
  }

  const service = createServiceClient()!;
  const { data: bookingRows } = await service
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: enquiries } = await service
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const bookings: Booking[] = (bookingRows ?? []).map((b) => ({
    id: b.id,
    booking_id: b.booking_id,
    tracking_number: b.tracking_number,
    client_name: b.client_name,
    client_email: b.client_email,
    client_phone: b.client_phone,
    event_type: b.event_type,
    shoot_date: b.shoot_date,
    booking_date: b.booking_date,
    expected_delivery_date: b.expected_delivery_date,
    current_stage: b.current_stage,
    edited_photos: b.edited_photos,
    total_photos: b.total_photos,
    album_progress: b.album_progress,
    video_progress: b.video_progress,
    deliverables: b.deliverables,
    admin_notes: b.admin_notes,
    download_url: b.download_url,
    updates: [],
  }));

  return <AdminDashboard user={{ email: user.email ?? "" }} bookings={bookings} enquiries={enquiries ?? []} />;
}
