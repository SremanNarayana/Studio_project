import { NextResponse } from "next/server";
import { createServiceClient, createSupabaseServer } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function requireAdmin() {
  const sb = await createSupabaseServer();
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return admin ? user : null;
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("image");
  const title = String(form.get("title") || "Untitled story").trim().slice(0, 100);
  const category = String(form.get("category") || "Weddings").trim().slice(0, 50);
  if (!(file instanceof File) || !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Upload a JPG, PNG, or WebP image no larger than 10 MB." }, { status: 400 });
  }
  const service = createServiceClient();
  if (!service) return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await service.storage.from("portfolio").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });
  const { data: urlData } = service.storage.from("portfolio").getPublicUrl(path);
  const { data, error } = await service.from("gallery_images").insert({ title, category, image_path: path, image_url: urlData.publicUrl }).select().single();
  if (error) {
    await service.storage.from("portfolio").remove([path]);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ image: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing image id" }, { status: 400 });
  const service = createServiceClient();
  if (!service) return NextResponse.json({ error: "Storage is not configured." }, { status: 503 });
  const { data: image, error: findError } = await service.from("gallery_images").select("image_path").eq("id", id).single();
  if (findError || !image) return NextResponse.json({ error: "Image not found" }, { status: 404 });
  const { error } = await service.from("gallery_images").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await service.storage.from("portfolio").remove([image.image_path]);
  return NextResponse.json({ ok: true });
}
