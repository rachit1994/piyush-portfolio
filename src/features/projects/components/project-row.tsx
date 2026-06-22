"use client";

import type { Project } from "../lib/project-types";

type Props = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleFeatured: (project: Project) => void;
  onToggleStatus: (project: Project) => void;
};

export function ProjectRow({
  project,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleStatus,
}: Props) {
  const published = project.status === "published";
  return (
    <li className="project-row" data-status={project.status}>
      <div className="project-row__main">
        <strong className="project-row__title">{project.title}</strong>
        <span className="project-row__meta">
          {project.client ?? "—"} · {project.year ?? "—"}
        </span>
      </div>
      <div className="project-row__actions">
        <button
          aria-pressed={project.featured}
          className="admin-link-button"
          onClick={() => onToggleFeatured(project)}
          type="button"
        >
          {project.featured ? "★ Featured" : "☆ Feature"}
        </button>
        <button
          className="admin-link-button"
          onClick={() => onToggleStatus(project)}
          type="button"
        >
          {published ? "Unpublish" : "Publish"}
        </button>
        <button
          className="admin-link-button"
          onClick={() => onEdit(project)}
          type="button"
        >
          Edit
        </button>
        <button
          className="admin-link-button"
          onClick={() => onDelete(project)}
          type="button"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
