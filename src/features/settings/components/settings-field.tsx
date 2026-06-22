"use client";

import type { SiteSettings } from "../lib/settings-types";

type SettingsFieldProps = {
  name: keyof SiteSettings;
  label: string;
  value: string;
  multiline?: boolean;
  onChange: (name: keyof SiteSettings, value: string) => void;
};

export function SettingsFieldRow({
  name,
  label,
  value,
  multiline = false,
  onChange,
}: SettingsFieldProps) {
  const id = `settings-${name}`;
  return (
    <p className="settings-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          onChange={(event) => onChange(name, event.target.value)}
          value={value}
        />
      ) : (
        <input
          id={id}
          onChange={(event) => onChange(name, event.target.value)}
          value={value}
        />
      )}
    </p>
  );
}
