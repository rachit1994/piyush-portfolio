"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";

import { isDemoAuthenticated } from "@/features/access/lib/demo-auth";

const subscribe = () => () => undefined;

export function PrivateRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const allowed = useSyncExternalStore(
    subscribe,
    isDemoAuthenticated,
    () => false,
  );

  useEffect(() => {
    if (!allowed) router.replace("/login");
  }, [allowed, router]);

  return allowed ? (
    children
  ) : (
    <div className="access-status" role="status">
      Checking access…
    </div>
  );
}
