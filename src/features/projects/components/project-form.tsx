"use client";

import type { CategoryOption, ProjectFormValue } from "../lib/project-types";
import { CategoryMultiselect } from "./category-multiselect";
import { ProjectFieldRow } from "./project-field-row";

type Props = {
  value: ProjectFormValue;
  options: CategoryOption[];
  submitLabel: string;
  onChange: (patch: Partial<ProjectFormValue>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

const FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "client", label: "Client" },
  { key: "year", label: "Year" },
  { key: "cover_asset_id", label: "Cover R2 key" },
  { key: "summary", label: "Summary", kind: "textarea" },
  { key: "status", label: "Status", kind: "status" },
  { key: "featured", label: "Featured", kind: "checkbox" },
] as const;

export function ProjectForm({
  value,
  options,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form
      className="project-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {FIELDS.map((field) => (
        <ProjectFieldRow
          field={field}
          key={field.key}
          onChange={onChange}
          value={value}
        />
      ))}
      <CategoryMultiselect
        onChange={(categoryIds) => onChange({ categoryIds })}
        options={options}
        selected={value.categoryIds}
      />
      <div className="project-form__actions">
        <button className="dark-button" type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            className="admin-link-button"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
