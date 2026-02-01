import { supabase } from "@/lib/supabase";

export async function fetchMyCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCustomer({ name, phone, email, address }) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("customers")
    .insert([
      {
        created_by: user.id,
        name,
        phone: phone || null,
        email: email || null,
        address: address || null,
        status: "new",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
export async function fetchCustomerById(customerId) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchCustomerLogs(customerId) {
  const { data, error } = await supabase
    .from("customer_logs")
    .select("id, old_status, new_status, note, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateCustomerInfo(customerId, patch) {
  const { error } = await supabase
    .from("customers")
    .update({
      name: patch.name,
      phone: patch.phone || null,
      email: patch.email || null,
      address: patch.address || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId);

  if (error) throw error;
  return true;
}

export async function updateCustomerStatus(customerId, newStatus, note) {
  // 1) eski status’u al
  const { data: existing, error: exErr } = await supabase
    .from("customers")
    .select("status")
    .eq("id", customerId)
    .single();
  if (exErr) throw exErr;

  const oldStatus = existing.status;

  // 2) current user
  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  if (!user) throw new Error("Not logged in");

  // 3) customers status update
  const { error: upErr } = await supabase
    .from("customers")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", customerId);
  if (upErr) throw upErr;

  // 4) log insert
  const { error: logErr } = await supabase.from("customer_logs").insert([
    {
      customer_id: customerId,
      changed_by: user.id,
      old_status: oldStatus,
      new_status: newStatus,
      note: note || null,
    },
  ]);
  if (logErr) throw logErr;

  return true;
}
