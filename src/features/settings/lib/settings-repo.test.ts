import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSettings, saveSettings } from "./settings-repo";

const maybeSingle = vi.fn();
const upsert = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));
const from = vi.fn(() => ({ select, upsert }));

vi.mock("@/shared/supabase", () => ({
  getSupabaseClient: () => ({ from }),
}));

describe("settings-repo", () => {
  beforeEach(() => {
    from.mockClear();
    upsert.mockReset();
  });

  it("reads the single settings row", async () => {
    maybeSingle.mockResolvedValue({ data: { agency_name: "X" }, error: null });
    await expect(getSettings()).resolves.toEqual({ agency_name: "X" });
    expect(from).toHaveBeenCalledWith("site_settings");
  });

  it("upserts settings with the fixed id", async () => {
    upsert.mockResolvedValue({ error: null });
    await saveSettings({ tagline: "Hi" });
    expect(upsert).toHaveBeenCalledWith({ id: 1, tagline: "Hi" });
  });
});
