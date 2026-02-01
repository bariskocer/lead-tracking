"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAllCustomers, fetchProfilesBasic } from "@/services/adminService";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const ownerMap = useMemo(() => {
    const map = {};
    for (const p of profiles) {
      map[p.id] =
        p.display_name && p.display_name.trim()
          ? p.display_name
          : p.email || p.id;
    }
    return map;
  }, [profiles]);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [c, p] = await Promise.all([
        fetchAllCustomers(),
        fetchProfilesBasic(),
      ]);

      setCustomers(c);
      setProfiles(p);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Customers</h1>
        <button
          onClick={load}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {err && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">No customers found.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {customers.map((c) => (
            <Link key={c.id} href={`/admin/customers/${c.id}`}>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.name}</div>
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {c.status}
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  Phone: {c.phone || "-"}
                </div>

                <div className="mt-1 text-sm text-gray-700">
                  Owner:{" "}
                  <span className="font-medium">
                    {ownerMap[c.created_by] || c.created_by}
                  </span>
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Created: {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
