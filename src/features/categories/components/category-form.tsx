"use client";

import { useState } from "react";

import type { CategoryInput, CategoryKind } from "../lib/category-types";

const KINDS: CategoryKind[] = ["photography", "videography", "both"];

type Props = {
  initial?: CategoryInput;
  submitLabel: string;
  onSubmit: (input: CategoryInput) => void;
  onCancel?: () => void;
};

export function CategoryForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [kind, setKind] = useState<CategoryKind>(
    initial?.kind ?? "photography",
  );

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit({ title: trimmed, kind });
    if (!initial) setTitle("");
  }

  return (
    <form className="cat-form" onSubmit={submit}>
      <label className="cat-form__label" htmlFor="cat-title">
        Title
      </label>
      <input
        id="cat-title"
        className="cat-form__input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <label className="cat-form__label" htmlFor="cat-kind">
        Kind
      </label>
      <select
        id="cat-kind"
        className="cat-form__input"
        value={kind}
        onChange={(event) => setKind(event.target.value as CategoryKind)}
      >
        {KINDS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="cat-form__actions">
        <button type="submit" className="dark-button">
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            className="admin-link-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
