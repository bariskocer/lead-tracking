"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, is_active")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (!profile.is_active) {
          router.push("/login");
          return;
        }

        if (profile.role !== "admin") {
          router.push("/field/dashboard");
          return;
        }
      } catch (e) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (loading)
    return <div className="p-6 text-sm text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link className="font-bold" href="/admin">
            Admin
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="hover:underline" href="/admin/agents">
              Field Agents
            </Link>
            <Link className="hover:underline" href="/admin/customers">
              All Customers
            </Link>
            <Link className="hover:underline" href="/admin/users">
              Users
            </Link>
            <Link className="hover:underline" href="/admin/reports">
              Reports
            </Link>
          </nav>

          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
