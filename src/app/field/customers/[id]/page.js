"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchCustomerById,
  fetchCustomerLogs,
  updateCustomerInfo,
  updateCustomerStatus,
} from "@/services/customersService";

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "negotiating",
  "closed_won",
  "closed_lost",
];

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [customer, setCustomer] = useState(null);
  const [logs, setLogs] = useState([]);

  // edit form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // status update states
  const [status, setStatus] = useState("new");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const c = await fetchCustomerById(id);
      const l = await fetchCustomerLogs(id);

      setCustomer(c);
      setLogs(l);

      setName(c.name || "");
      setPhone(c.phone || "");
      setEmail(c.email || "");
      setAddress(c.address || "");
      setStatus(c.status || "new");
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function saveInfo() {
    setSaving(true);
    setErr("");
    try {
      await updateCustomerInfo(id, { name, phone, email, address });
      await load();
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  async function saveStatus() {
    setSaving(true);
    setErr("");
    try {
      await updateCustomerStatus(id, status, note);
      setNote("");
      await load();
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {err}
      </div>
    );
  }

  if (!customer) return <p>Not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="mt-1 text-sm text-gray-600">Status: {customer.status}</p>
        </div>

        <button
          onClick={() => router.push("/field/dashboard")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {/* Edit customer info */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Edit Info</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Name *</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={saveInfo}
          disabled={saving || !name.trim()}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Info"}
        </button>
      </div>

      {/* Status update */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Update Status</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Note (optional)</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What happened?"
            />
          </div>
        </div>

        <button
          onClick={saveStatus}
          disabled={saving}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Status"}
        </button>
      </div>

      {/* Logs */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold">History</h2>

        {logs.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No history yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {logs.map((l) => (
              <div key={l.id} className="rounded-lg border p-3">
                <div className="text-sm">
                  <span className="font-medium">{l.old_status || "-"}</span>
                  {" → "}
                  <span className="font-medium">{l.new_status || "-"}</span>
                </div>
                {l.note && <div className="mt-1 text-sm text-gray-700">{l.note}</div>}
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(l.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
