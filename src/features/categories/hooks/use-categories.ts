"use client";

import { useCallback, useEffect, useState } from "react";

import type { Category, CategoryInput } from "../lib/category-types";
import * as repo from "../lib/categories-repo";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await repo.listCategories());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    repo
      .listCategories()
      .then((data) => {
        setCategories(data);
        setError(null);
      })
      .catch((cause) => {
        setError(cause instanceof Error ? cause.message : "Failed to load");
      })
      .finally(() => setLoading(false));
  }, []);

  const run = useCallback(
    async (action: () => Promise<unknown>) => {
      try {
        await action();
        await reload();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Action failed");
      }
    },
    [reload],
  );

  const move = useCallback(
    (id: string, delta: number) => {
      const i = categories.findIndex((c) => c.id === id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= categories.length) return;
      void run(() => repo.swapOrder(categories[i], categories[j]));
    },
    [categories, run],
  );

  return {
    categories,
    loading,
    error,
    reload,
    create: (input: CategoryInput) => run(() => repo.createCategory(input)),
    update: (id: string, patch: Partial<CategoryInput>) =>
      run(() => repo.updateCategory(id, patch)),
    remove: (id: string) => run(() => repo.deleteCategory(id)),
    moveUp: (id: string) => move(id, -1),
    moveDown: (id: string) => move(id, 1),
  };
}
