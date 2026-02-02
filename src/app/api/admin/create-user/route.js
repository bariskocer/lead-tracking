import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { assertAdminFromAuthHeader } from "@/lib/auth/adminCheck";

export async function POST(req) {
  try {
    // 1) Bu isteği yapan admin mi?
    await assertAdminFromAuthHeader(req);

    let { email, password, role, display_name } = await req.json();

    email = (email || "").trim().toLowerCase();
    role = role === "admin" ? "admin" : "field";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    // 2) User create (Supabase Admin API)
    const admin = supabaseAdmin();

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const newUserId = data.user.id;

    // 3) Role/is_active ayarla (profiles trigger ile açıldı varsayıyoruz)
    const { error: upErr } = await admin
      .from("profiles")
      .update({
        role,
        is_active: true,
        display_name: display_name ? display_name.trim() : null,
      })
      .eq("id", newUserId);

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, userId: newUserId });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 403 },
    );
  }
}
