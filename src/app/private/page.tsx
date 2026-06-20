import type { Metadata } from "next";

import { LogoutButton } from "@/components/logout-button";
import { PrivateRoute } from "@/components/private-route";

export const metadata: Metadata = {
  title: "Private demo",
};

export default function PrivatePage() {
  return (
    <section className="w-full">
      <PrivateRoute>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Client-guarded route
              </h1>
              <p className="mt-4 leading-7 text-slate-700">
                The route guard is working, but this content is still part of
                the public static export. Never place secrets, private
                documents, or authorization decisions here.
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </PrivateRoute>
    </section>
  );
}
