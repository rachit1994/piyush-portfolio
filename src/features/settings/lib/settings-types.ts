export type SiteSettings = {
  agency_name: string;
  tagline: string;
  contact_email: string;
  phone: string;
  whatsapp: string;
  location: string;
  instagram: string;
  youtube: string;
  vimeo: string;
  behance: string;
  seo_title: string;
  seo_description: string;
};

export type SettingsField = {
  key: keyof SiteSettings;
  label: string;
  multiline?: boolean;
};
