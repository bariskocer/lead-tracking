import { supabaseAdmin } from "@/lib/supabase/admin";

export async function assertAdminFromAuthHeader(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) throw new Error("Not authenticated (missing token)");

  const admin = supabaseAdmin();

  // Token -> user
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr) throw userErr;

  const user = userData?.user;
  if (!user) throw new Error("Not authenticated");

  // user -> profile -> admin mi?
  const { data: profile, error: pErr } = await admin
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (pErr) throw pErr;
  if (!profile?.is_active) throw new Error("Inactive user");
  if (profile.role !== "admin") throw new Error("Forbidden");

  return user;
}
