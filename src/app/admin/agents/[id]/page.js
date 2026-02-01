"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  fetchCustomersByAgent,
  fetchProfilesBasic,
} from "@/services/adminService";
import Link from "next/link";

export default function AdminAgentDetailPage() {
  const params = useParams();
  const agentId = params.id;

  const [profiles, setProfiles] = useState([]);
  const [customers, setCustomers] = useState([]);
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

  const agentLabel = ownerMap[agentId] || agentId;

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [p, c] = await Promise.all([
        fetchProfilesBasic(),
        fetchCustomersByAgent(agentId),
      ]);

      setProfiles(p);
      setCustomers(c);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agent Customers</h1>
          <p className="mt-2 text-sm text-gray-600">
            Agent: <span className="font-medium">{agentLabel}</span>
          </p>
        </div>

        <a
          href="/admin/agents"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Back
        </a>
      </div>

      {err && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">
          This agent has no customers.
        </p>
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
