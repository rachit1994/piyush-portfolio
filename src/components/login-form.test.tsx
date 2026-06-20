import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/login-form";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
}));

vi.mock("@/lib/demo-auth", () => ({
  signInDemo: mocks.signIn,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.signIn.mockReset();
  });

  it("stores demo access and navigates to the private route", () => {
    render(<LoginForm />);

    fireEvent.submit(screen.getByRole("form", { name: "Demo access" }));

    expect(mocks.signIn).toHaveBeenCalledOnce();
    expect(mocks.push).toHaveBeenCalledWith("/private");
  });
});
