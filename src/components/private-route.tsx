"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";

import { isDemoAuthenticated } from "@/lib/demo-auth";

type PrivateRouteProps = {
  children: ReactNode;
};

function subscribeToDemoAuth() {
  return () => undefined;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const isAllowed = useSyncExternalStore(
    subscribeToDemoAuth,
    isDemoAuthenticated,
    () => false,
  );

  useEffect(() => {
    if (!isAllowed) {
      router.replace("/login");
    }
  }, [isAllowed, router]);

  if (!isAllowed) {
    return (
      <div
        className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm"
        role="status"
      >
        Checking access…
      </div>
    );
  }

  return children;
}
