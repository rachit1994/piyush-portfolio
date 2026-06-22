import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const result = { data: [], error: null } as { data: unknown; error: unknown };
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const name of ["select", "insert", "update", "delete", "eq", "single"]) {
    builder[name] = vi.fn(() => builder);
  }
  builder.order = vi.fn(() => result);
  builder.single = vi.fn(() => result);
  const from = vi.fn(() => builder);
  return { result, builder, from };
});

vi.mock("@/shared/supabase", () => ({
  getSupabaseClient: () => ({ from: mocks.from }),
}));

import {
  createCategory,
  deleteCategory,
  listCategories,
  swapOrder,
  updateCategory,
} from "./categories-repo";

beforeEach(() => {
  mocks.result.data = [];
  mocks.result.error = null;
  for (const fn of Object.values(mocks.builder)) fn.mockClear();
  mocks.from.mockClear();
});

describe("categories-repo", () => {
  it("lists ordered by sort_order", async () => {
    await listCategories();
    expect(mocks.from).toHaveBeenCalledWith("categories");
    expect(mocks.builder.order).toHaveBeenCalledWith("sort_order", {
      ascending: true,
    });
  });

  it("creates with an auto-generated slug", async () => {
    mocks.result.data = { id: "1" };
    await createCategory({ title: "Wedding Films", kind: "videography" });
    expect(mocks.builder.insert).toHaveBeenCalledWith({
      title: "Wedding Films",
      kind: "videography",
      slug: "wedding-films",
    });
  });

  it("updates by id", async () => {
    mocks.result.data = { id: "1" };
    await updateCategory("1", { title: "New" });
    expect(mocks.builder.update).toHaveBeenCalledWith({ title: "New" });
    expect(mocks.builder.eq).toHaveBeenCalledWith("id", "1");
  });

  it("deletes by id", async () => {
    await deleteCategory("9");
    expect(mocks.builder.delete).toHaveBeenCalled();
    expect(mocks.builder.eq).toHaveBeenCalledWith("id", "9");
  });

  it("throws when supabase returns an error", async () => {
    mocks.result.error = { message: "denied" };
    await expect(listCategories()).rejects.toThrow("denied");
  });

  it("swaps sort_order between two rows", async () => {
    const a = { id: "a", sort_order: 0 } as never;
    const b = { id: "b", sort_order: 1 } as never;
    await swapOrder(a, b);
    expect(mocks.builder.update).toHaveBeenCalledWith({ sort_order: 1 });
    expect(mocks.builder.update).toHaveBeenCalledWith({ sort_order: 0 });
  });
});
