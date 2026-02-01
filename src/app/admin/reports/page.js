"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import { fetchAllCustomers, fetchProfilesBasic } from "@/services/adminService";

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "negotiating",
  "closed_won",
  "closed_lost",
];

export default function AdminReportsPage() {
  const [customers, setCustomers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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

  // id -> display_name || email
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

  // 1) Agent başına toplam müşteri sayısı
  const customersPerAgent = useMemo(() => {
    const counts = {}; // created_by -> number

    for (const c of customers) {
      counts[c.created_by] = (counts[c.created_by] || 0) + 1;
    }

    const rows = Object.entries(counts).map(([agentId, count]) => ({
      agent: ownerMap[agentId] || agentId,
      count,
    }));

    // en çoktan aza sırala
    rows.sort((a, b) => b.count - a.count);

    return rows;
  }, [customers, ownerMap]);

  // 2) Genel status dağılımı
  const statusDistribution = useMemo(() => {
    const counts = {};
    for (const s of STATUS_OPTIONS) counts[s] = 0;

    for (const c of customers) {
      const st = c.status || "new";
      counts[st] = (counts[st] || 0) + 1;
    }

    return STATUS_OPTIONS.map((s) => ({
      status: s,
      value: counts[s] || 0,
    }));
  }, [customers]);

  const totalCustomers = customers.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="mt-2 text-sm text-gray-600">
            Simple performance overview (customers & status).
          </p>
        </div>

        <button
          onClick={load}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-600">Loading...</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-600">Total customers</div>
              <div className="mt-1 text-2xl font-bold">{totalCustomers}</div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-600">Total field agents</div>
              <div className="mt-1 text-2xl font-bold">
                {profiles.filter((p) => p.role === "field").length}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-sm text-gray-600">Closed won</div>
              <div className="mt-1 text-2xl font-bold">
                {statusDistribution.find((x) => x.status === "closed_won")
                  ?.value || 0}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar: customers per agent */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Customers per Agent</h2>
              <p className="mt-1 text-sm text-gray-600">
                How many customers each field agent owns.
              </p>

              <div className="mt-4 h-80">
                {customersPerAgent.length === 0 ? (
                  <p className="text-sm text-gray-600">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={customersPerAgent}
                      layout="vertical"
                      margin={{ left: 24 }}
                    >
                      {/* Yatay grafik: X = sayı, Y = isim */}
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="agent" width={140} />
                      <Tooltip />
                      <Bar dataKey="count" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Basit “legend”: agent isimlerini aşağı listeleyelim (bar chart’ta XAxis gizli) */}
              {customersPerAgent.length > 0 && (
                <div className="mt-3 text-xs text-gray-600">
                  {customersPerAgent.slice(0, 8).map((r) => (
                    <div key={r.agent}>
                      <span className="font-medium">{r.count}</span> — {r.agent}
                    </div>
                  ))}
                  {customersPerAgent.length > 8 && (
                    <div className="mt-1 text-gray-500">
                      (+ {customersPerAgent.length - 8} more)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pie: status distribution */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Status Distribution</h2>
              <p className="mt-1 text-sm text-gray-600">
                Overall customer statuses.
              </p>

              <div className="mt-4 h-80">
                {totalCustomers === 0 ? (
                  <p className="text-sm text-gray-600">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        dataKey="value"
                        nameKey="status"
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
