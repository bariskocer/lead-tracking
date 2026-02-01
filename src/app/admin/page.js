import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Manage field agents and customers.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/admin/agents"
          className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Field Agents
        </Link>

        <Link
          href="/admin/customers"
          className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          All Customers
        </Link>
      </div>
    </div>
  );
}
