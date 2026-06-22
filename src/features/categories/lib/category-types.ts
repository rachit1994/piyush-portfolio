export type CategoryKind = "photography" | "videography" | "both";

export type Category = {
  id: string;
  slug: string;
  title: string;
  kind: CategoryKind;
  accent: string | null;
  sort_order: number;
  created_at: string;
};

export type CategoryInput = {
  title: string;
  kind: CategoryKind;
};
