"use client";

import { useRouter } from "next/navigation";

import { signOutDemo } from "@/lib/demo-auth";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    signOutDemo();
    router.replace("/login");
  }

  return (
    <button
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
      onClick={handleLogout}
      type="button"
    >
      Sign out
    </button>
  );
}
