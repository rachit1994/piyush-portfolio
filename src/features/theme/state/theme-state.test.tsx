import { render, screen } from "@testing-library/react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { describe, expect, it } from "vitest";

import { themeState } from "@/features/theme/state/theme-state";

function ThemeReader() {
  return <span>{useRecoilValue(themeState)}</span>;
}

describe("Recoil React 19 compatibility", () => {
  it("renders an atom value without React internal API failures", () => {
    render(
      <RecoilRoot>
        <ThemeReader />
      </RecoilRoot>,
    );

    expect(screen.getByText("light")).toBeInTheDocument();
  });
});
