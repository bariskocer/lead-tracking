"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/services/customersService";

export default function NewCustomerPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      await createCustomer({ name, phone, email, address });
      router.push("/field/dashboard");
      router.refresh();
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">New Customer</h1>
      <p className="mt-2 text-sm text-gray-600">
        Create a new customer record.
      </p>

      {err && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 rounded-xl border bg-white p-5 shadow-sm"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">Name *</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Customer name"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="customer@mail.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
        </div>

        <button
          className="w-full rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
