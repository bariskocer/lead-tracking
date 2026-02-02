import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { assertAdminFromAuthHeader } from "@/lib/auth/adminCheck";

export async function POST(req) {
  try {
    await assertAdminFromAuthHeader(req);

    const { userId, role, is_active } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const patch = {};
    if (role) patch.role = role === "admin" ? "admin" : "field";
    if (typeof is_active === "boolean") patch.is_active = is_active;

    const admin = supabaseAdmin();
    const { error } = await admin.from("profiles").update(patch).eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Forbidden" },
      { status: 403 }
    );
  }
}
