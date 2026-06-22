"use client";

import { useCallback, useEffect, useState } from "react";

import { getSettings, saveSettings } from "../lib/settings-repo";
import type { SiteSettings } from "../lib/settings-types";

type Status = "idle" | "saving" | "saved" | "error";

export function useSettings() {
  const [values, setValues] = useState<Partial<SiteSettings>>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    getSettings()
      .then(setValues)
      .catch(() => setStatus("error"));
  }, []);

  const setField = useCallback((key: keyof SiteSettings, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }, []);

  const save = useCallback(async () => {
    setStatus("saving");
    try {
      await saveSettings(values);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [values]);

  return { values, status, setField, save };
}
