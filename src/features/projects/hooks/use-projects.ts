"use client";

import { useCallback, useEffect, useState } from "react";

import type { ProjectInput } from "../lib/project-types";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "../lib/projects-repo";

export function useProjects() {
  const [projects, setProjects] = useState<
    Awaited<ReturnType<typeof listProjects>>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await listProjects());
      setError(null);
    } catch {
      setError("Could not load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listProjects()
      .then((data) => {
        setProjects(data);
        setError(null);
      })
      .catch(() => setError("Could not load projects."))
      .finally(() => setLoading(false));
  }, []);

  const create = useCallback(
    async (input: ProjectInput) => {
      await createProject(input);
      await reload();
    },
    [reload],
  );

  const update = useCallback(
    async (id: string, patch: Partial<ProjectInput>) => {
      await updateProject(id, patch);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteProject(id);
      await reload();
    },
    [reload],
  );

  return { projects, loading, error, create, update, remove, reload };
}
