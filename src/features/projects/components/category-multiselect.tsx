"use client";

import type { CategoryOption } from "../lib/project-types";

type Props = {
  options: CategoryOption[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function CategoryMultiselect({ options, selected, onChange }: Props) {
  if (options.length === 0)
    return <p className="project-cats__empty">No categories yet.</p>;
  const toggle = (id: string) =>
    onChange(
      selected.includes(id)
        ? selected.filter((c) => c !== id)
        : [...selected, id],
    );
  return (
    <fieldset className="project-cats">
      <legend className="project-cats__legend">Categories</legend>
      <div className="project-cats__list">
        {options.map((option) => (
          <label className="project-cats__item" key={option.id}>
            <input
              checked={selected.includes(option.id)}
              onChange={() => toggle(option.id)}
              type="checkbox"
            />
            {option.title}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
