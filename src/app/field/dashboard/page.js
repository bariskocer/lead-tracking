"use client";

import { useEffect, useState } from "react";
import { fetchMyCustomers } from "@/services/customersService";
import Link from "next/link";

export default function FieldDashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchMyCustomers();
      setCustomers(data);
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
        <h1 className="text-2xl font-bold">My Customers</h1>
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
        <p className="mt-4 text-sm text-gray-600">No customers yet.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {customers.map((c) => (
            <Link key={c.id} href={`/field/customers/${c.id}`}>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.name}</div>

                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {c.status}
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  Phone: <span className="font-mono">{c.phone || "-"}</span>
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
