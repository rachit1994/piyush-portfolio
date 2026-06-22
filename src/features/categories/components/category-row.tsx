"use client";

import { useState } from "react";

import type { Category, CategoryInput } from "../lib/category-types";
import { CategoryForm } from "./category-form";

type Props = {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (patch: CategoryInput) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function CategoryRow(props: Props) {
  const { category, isFirst, isLast } = props;
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const name = category.title;

  if (editing)
    return (
      <li className="cat-row">
        <CategoryForm
          initial={{ title: name, kind: category.kind }}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={(patch) => {
            props.onUpdate(patch);
            setEditing(false);
          }}
        />
      </li>
    );

  return (
    <li className="cat-row">
      <span className="cat-row__title">{name}</span>
      <span className="cat-row__kind">{category.kind}</span>
      <div className="cat-row__actions">
        <button
          className="admin-link-button"
          type="button"
          onClick={props.onMoveUp}
          disabled={isFirst}
          aria-label={`Move ${name} up`}
        >
          Up
        </button>
        <button
          className="admin-link-button"
          type="button"
          onClick={props.onMoveDown}
          disabled={isLast}
          aria-label={`Move ${name} down`}
        >
          Down
        </button>
        <button
          className="admin-link-button"
          type="button"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          className={confirming ? "dark-button" : "admin-link-button"}
          type="button"
          onClick={() => (confirming ? props.onRemove() : setConfirming(true))}
        >
          {confirming ? "Confirm delete" : "Delete"}
        </button>
      </div>
    </li>
  );
}
