"use client";

import { useRouter } from "next/navigation";

import { signOutDemo } from "@/features/access/lib/demo-auth";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    signOutDemo();
    router.replace("/login");
  }

  return (
    <button className="nav-pill" onClick={handleLogout}>
      Sign out
    </button>
  );
}
