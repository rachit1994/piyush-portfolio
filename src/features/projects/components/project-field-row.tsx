"use client";

import type { ProjectFormValue, ProjectStatus } from "../lib/project-types";

type Field = {
  key: keyof ProjectFormValue;
  label: string;
  required?: boolean;
  kind?: "textarea" | "status" | "checkbox";
};

type Props = {
  field: Field;
  value: ProjectFormValue;
  onChange: (patch: Partial<ProjectFormValue>) => void;
};

export function ProjectFieldRow({ field, value, onChange }: Props) {
  const { key, label, kind } = field;
  if (kind === "checkbox")
    return (
      <label className="project-field project-field--inline">
        <input
          checked={value.featured}
          onChange={(e) => onChange({ featured: e.target.checked })}
          type="checkbox"
        />
        <span>{label}</span>
      </label>
    );
  return (
    <label className="project-field">
      <span>{label}</span>
      {kind === "textarea" ? (
        <textarea
          onChange={(e) => onChange({ summary: e.target.value })}
          value={value.summary}
        />
      ) : kind === "status" ? (
        <select
          onChange={(e) =>
            onChange({ status: e.target.value as ProjectStatus })
          }
          value={value.status}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      ) : (
        <input
          onChange={(e) => onChange({ [key]: e.target.value })}
          required={field.required}
          value={value[key] as string}
        />
      )}
    </label>
  );
}
