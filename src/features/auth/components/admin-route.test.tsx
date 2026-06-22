import { render, screen, waitFor } from "@testing-library/react";
import type { Session } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { RecoilRoot, type MutableSnapshot } from "recoil";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminRoute } from "./admin-route";
import { authReadyState, sessionState } from "../state/session-state";

const mocks = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

function token(role?: string): string {
  const body = btoa(JSON.stringify(role ? { user_role: role } : {}))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `h.${body}.s`;
}

function wrapper(accessToken: string | null) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const init = (snapshot: MutableSnapshot) => {
      snapshot.set(authReadyState, true);
      snapshot.set(
        sessionState,
        accessToken
          ? ({ access_token: accessToken } as unknown as Session)
          : null,
      );
    };
    return <RecoilRoot initializeState={init}>{children}</RecoilRoot>;
  };
}

describe("AdminRoute", () => {
  beforeEach(() => mocks.replace.mockReset());

  it("redirects a non-admin session to the login route", async () => {
    render(<AdminRoute>secret</AdminRoute>, { wrapper: wrapper(token()) });
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith("/admin/login"),
    );
  });

  it("renders children for an admin session", () => {
    render(<AdminRoute>secret</AdminRoute>, {
      wrapper: wrapper(token("admin")),
    });
    expect(screen.getByText("secret")).toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
