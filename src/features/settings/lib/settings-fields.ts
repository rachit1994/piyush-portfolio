import type { SettingsField } from "./settings-types";

export const SETTINGS_FIELDS: SettingsField[] = [
  { key: "agency_name", label: "Agency name" },
  { key: "tagline", label: "Tagline", multiline: true },
  { key: "contact_email", label: "Contact email" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "location", label: "Location" },
  { key: "instagram", label: "Instagram URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "vimeo", label: "Vimeo URL" },
  { key: "behance", label: "Behance URL" },
  { key: "seo_title", label: "SEO title" },
  { key: "seo_description", label: "SEO description", multiline: true },
];
