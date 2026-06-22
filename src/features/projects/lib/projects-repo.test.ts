import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "./projects-repo";

const order = vi.fn();
const single = vi.fn();
const selectAfterInsert = vi.fn(() => ({ single }));
const select = vi.fn(() => ({ order }));
const insert = vi.fn(() => ({ select: selectAfterInsert }));
const eqUpdate = vi.fn();
const update = vi.fn(() => ({ eq: eqUpdate }));
const eqDelete = vi.fn();
const del = vi.fn(() => ({ eq: eqDelete }));
const from = vi.fn(() => ({ select, insert, update, delete: del }));

vi.mock("@/shared/supabase", () => ({ getSupabaseClient: () => ({ from }) }));

describe("projects-repo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lists projects ordered by sort_order", async () => {
    order.mockResolvedValue({ data: [{ id: "1" }], error: null });
    await expect(listProjects()).resolves.toEqual([{ id: "1" }]);
    expect(from).toHaveBeenCalledWith("projects");
    expect(order).toHaveBeenCalledWith("sort_order", { ascending: true });
  });

  it("creates and returns the new row", async () => {
    single.mockResolvedValue({ data: { id: "2" }, error: null });
    await createProject({ title: "T" } as never);
    expect(insert).toHaveBeenCalledWith({ title: "T" });
  });

  it("updates with a fresh updated_at and id filter", async () => {
    eqUpdate.mockResolvedValue({ error: null });
    await updateProject("9", { featured: true });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ featured: true }),
    );
    expect(eqUpdate).toHaveBeenCalledWith("id", "9");
  });

  it("deletes by id", async () => {
    eqDelete.mockResolvedValue({ error: null });
    await deleteProject("9");
    expect(eqDelete).toHaveBeenCalledWith("id", "9");
  });
});
