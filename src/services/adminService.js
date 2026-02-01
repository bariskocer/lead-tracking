import { supabase } from "@/lib/supabase";

// ----- READ (RLS ile) -----
export async function fetchFieldAgents() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, is_active, created_at")
    .eq("role", "field")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchCustomersByAgent(agentId) {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, status, created_at, created_by")
    .eq("created_by", agentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchAllCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, status, created_at, created_by")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ----- WRITE (server API üzerinden) -----
// Burada requesterId YOK.
// API route, cookie/session’dan kimin admin olduğunu kendi anlıyor.

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data?.session?.access_token;
  if (!token) throw new Error("No session token. Please login again.");
  return token;
}

export async function adminCreateUser({ email, password, role, display_name }) {
  const token = await getAccessToken();

  const res = await fetch("/api/admin/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password, role, display_name }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create user failed");
  return data;
}

export async function adminUpdateProfile({ userId, role, is_active }) {
  const token = await getAccessToken();

  const res = await fetch("/api/admin/update-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, role, is_active }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update profile failed");
  return data;
}
export async function fetchProfilesBasic() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name");

  if (error) throw error;
  return data || [];
}
