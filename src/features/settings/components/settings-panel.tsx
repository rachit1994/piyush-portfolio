"use client";

import { useSettings } from "../hooks/use-settings";
import { SETTINGS_FIELDS } from "../lib/settings-fields";
import { SettingsFieldRow } from "./settings-field";

const STATUS_TEXT = {
  idle: "",
  saving: "Saving…",
  saved: "Saved.",
  error: "Could not save.",
};

export function SettingsPanel() {
  const { values, status, setField, save } = useSettings();
  return (
    <section className="settings-panel">
      <h1>Settings</h1>
      <form
        className="settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        {SETTINGS_FIELDS.map((field) => (
          <SettingsFieldRow
            key={field.key}
            label={field.label}
            multiline={field.multiline}
            name={field.key}
            onChange={setField}
            value={values[field.key] ?? ""}
          />
        ))}
        <div className="settings-actions">
          <button className="dark-button" type="submit">
            Save settings
          </button>
          <span aria-live="polite" role="status">
            {STATUS_TEXT[status]}
          </span>
        </div>
      </form>
    </section>
  );
}
