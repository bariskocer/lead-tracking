"use client";

import { useEffect, useState } from "react";
import { fetchFieldAgents } from "@/services/adminService";
import { adminCreateUser, adminUpdateProfile } from "@/services/adminService";

export default function AdminUsersPage() {
  const [displayName, setDisplayName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // create form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("field");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await fetchFieldAgents();
      setUsers(data);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setCreating(true);
    setErr("");
    try {
      await adminCreateUser({
        email,
        password,
        role,
        display_name: displayName,
      });
      setDisplayName("");
      setEmail("");
      setPassword("");
      setRole("field");
      await load();
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(user) {
    setErr("");
    try {
      await adminUpdateProfile({ userId: user.id, is_active: !user.is_active });
      await load();
    } catch (e) {
      setErr(e.message || "Error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create users (email + password). No self-registration.
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Create user */}
      <form
        onSubmit={onCreate}
        className="rounded-xl border bg-white p-5 shadow-sm"
      >
        <h2 className="font-semibold">Create User</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className="text-sm font-medium text-gray-700">
              Name Surname
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ahmet Yılmaz"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@company.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="field">field</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="Set a password"
            />
          </div>
        </div>

        <button
          disabled={creating}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          type="submit"
        >
          {creating ? "Creating..." : "Create User"}
        </button>
      </form>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Field Users</h2>
          <button
            onClick={load}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        ) : users.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">No users found.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium">{u.email}</div>
                  <div className="mt-1 text-xs text-gray-500">{u.id}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      u.is_active ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {u.is_active ? "active" : "inactive"}
                  </span>

                  <button
                    onClick={() => toggleActive(u)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
