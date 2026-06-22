"use client";

import { useCategories } from "../hooks/use-categories";
import { CategoryForm } from "./category-form";
import { CategoryRow } from "./category-row";

export function CategoriesPanel() {
  const state = useCategories();
  const { categories, loading, error } = state;

  return (
    <section className="cat-panel" aria-labelledby="cat-heading">
      <h1 id="cat-heading" className="cat-panel__title">
        Categories
      </h1>
      <CategoryForm submitLabel="Add category" onSubmit={state.create} />
      {error ? (
        <p className="cat-panel__error" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="admin-status" role="status">
          Loading categories…
        </p>
      ) : categories.length === 0 ? (
        <p className="cat-panel__empty">No categories yet.</p>
      ) : (
        <ul className="cat-list">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
              onUpdate={(patch) => state.update(category.id, patch)}
              onRemove={() => state.remove(category.id)}
              onMoveUp={() => state.moveUp(category.id)}
              onMoveDown={() => state.moveDown(category.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
