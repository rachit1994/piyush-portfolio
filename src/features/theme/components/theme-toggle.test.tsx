import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider, ThemeToggle } from "@/features/theme";

describe("ThemeToggle", () => {
  it("toggles the document theme through Recoil state", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Use light theme" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(
      screen.getByRole("button", { name: "Use dark theme" }),
    ).toBeInTheDocument();
  });
});
