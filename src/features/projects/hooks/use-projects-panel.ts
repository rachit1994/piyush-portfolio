"use client";

import { useState } from "react";

import { useCategoryOptions } from "./use-category-options";
import { useProjects } from "./use-projects";
import { setProjectCategories } from "../lib/project-categories-repo";
import {
  EMPTY_FORM,
  formToInput,
  projectToForm,
} from "../lib/project-form-mapping";
import { createProject, updateProject } from "../lib/projects-repo";
import type { Project, ProjectFormValue } from "../lib/project-types";

export function useProjectsPanel() {
  const { projects, loading, error, update, remove, reload } = useProjects();
  const { options } = useCategoryOptions();
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectFormValue>(EMPTY_FORM);

  const reset = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const save = async () => {
    const input = formToInput(form);
    const id = editing
      ? (await updateProject(editing.id, input), editing.id)
      : (await createProject(input)).id;
    await setProjectCategories(id, form.categoryIds);
    reset();
    await reload();
  };

  const edit = (project: Project) => {
    setEditing(project);
    setForm(projectToForm(project, []));
  };

  return {
    projects,
    loading,
    error,
    update,
    remove,
    options,
    editing,
    form,
    setForm,
    reset,
    save,
    edit,
  };
}
