"use client";

import type { HomeCategory } from "@/features/home";

type WorkCategorySelectProps = {
  categories: HomeCategory[];
  value: string;
  onChange: (slug: string) => void;
};

export function WorkCategorySelect({
  categories,
  value,
  onChange,
}: WorkCategorySelectProps) {
  return (
    <div className="work-category-select">
      <label className="work-category-select__label" htmlFor="work-cat">
        Category
      </label>
      <select
        className="work-category-select__control"
        id="work-cat"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        <option value="all">All</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
