import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PrivateRoute } from "@/components/private-route";

const mocks = vi.hoisted(() => ({
  authenticated: false,
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.replace,
  }),
}));

vi.mock("@/lib/demo-auth", () => ({
  isDemoAuthenticated: () => mocks.authenticated,
}));

describe("PrivateRoute", () => {
  beforeEach(() => {
    mocks.authenticated = false;
    mocks.replace.mockReset();
  });

  it("redirects signed-out visitors and keeps private content hidden", async () => {
    render(
      <PrivateRoute>
        <p>Private portfolio draft</p>
      </PrivateRoute>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Checking access");
    expect(
      screen.queryByText("Private portfolio draft"),
    ).not.toBeInTheDocument();

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/login"));
  });

  it("renders private content for signed-in visitors", async () => {
    mocks.authenticated = true;

    render(
      <PrivateRoute>
        <p>Private portfolio draft</p>
      </PrivateRoute>,
    );

    expect(
      await screen.findByText("Private portfolio draft"),
    ).toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
