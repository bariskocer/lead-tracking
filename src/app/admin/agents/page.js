"use client";

import { useEffect, useState } from "react";
import { fetchFieldAgents } from "@/services/adminService";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchFieldAgents();
      setAgents(data);
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
        <h1 className="text-2xl font-bold">Field Agents</h1>
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
      ) : agents.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">No field agents found.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {agents.map((a) => (
            <a
              key={a.id}
              href={`/admin/agents/${a.id}`}
              className="rounded-xl border bg-white p-4 shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.email}</div>
                  <div className="mt-1 text-xs text-gray-500">{a.id}</div>
                </div>

                <span className={`rounded-full px-2 py-1 text-xs ${
                  a.is_active ? "bg-green-100" : "bg-red-100"
                }`}>
                  {a.is_active ? "active" : "inactive"}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
