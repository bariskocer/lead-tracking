"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
    >
      Logout
    </button>
  );
}
