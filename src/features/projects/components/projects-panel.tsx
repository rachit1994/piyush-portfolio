"use client";

import { useProjectsPanel } from "../hooks/use-projects-panel";
import { ProjectForm } from "./project-form";
import { ProjectRow } from "./project-row";

export function ProjectsPanel() {
  const {
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
  } = useProjectsPanel();

  return (
    <section className="projects-panel">
      <h1 className="projects-panel__title">Projects</h1>
      <ProjectForm
        onCancel={editing ? reset : undefined}
        onChange={(patch) => setForm((c) => ({ ...c, ...patch }))}
        onSubmit={() => void save()}
        options={options}
        submitLabel={editing ? "Save project" : "Create project"}
        value={form}
      />
      {error ? <p className="admin-status">{error}</p> : null}
      {loading ? (
        <p className="admin-status" role="status">
          Loading projects…
        </p>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              onDelete={(p) => {
                if (confirm(`Delete “${p.title}”?`)) void remove(p.id);
              }}
              onEdit={edit}
              onToggleFeatured={(p) =>
                void update(p.id, { featured: !p.featured })
              }
              onToggleStatus={(p) =>
                void update(p.id, {
                  status: p.status === "published" ? "draft" : "published",
                })
              }
              project={project}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
