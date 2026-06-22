"use client";

import { useEffect, useState } from "react";

import type { CategoryOption } from "../lib/project-types";
import { listCategoryOptions } from "../lib/project-categories-repo";

export function useCategoryOptions() {
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listCategoryOptions()
      .then(setOptions)
      .catch(() => setError("Could not load categories."));
  }, []);

  return { options, error };
}
