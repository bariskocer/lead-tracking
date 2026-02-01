import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function FieldLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <Link className="font-bold" href="/field/dashboard">
            Field
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="hover:underline" href="/field/dashboard">
              Customers
            </Link>
            <Link className="hover:underline" href="/field/customers/new">
              New Customer
            </Link>
          </nav>

          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
