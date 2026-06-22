import { publicAssetPath } from "@/shared/assets";

const brandAssets = [
  { slug: "mcdowell", label: "McDowell's", file: "McDowel.png" },
  { slug: "pandora", label: "Pandora", file: "pandora.png" },
  { slug: "titan", label: "Titan", file: "titan.webp" },
  { slug: "versace", label: "Versace", file: "versace.png" },
] as const;

export type BrandLogo = {
  slug: (typeof brandAssets)[number]["slug"];
  label: string;
  image: string;
};

export const brandLogos: BrandLogo[] = brandAssets.map((brand) => ({
  slug: brand.slug,
  label: brand.label,
  image: publicAssetPath(`/media/brands/${brand.file}`),
}));

const brandRowCount = 2;

export const brandLogoRows: BrandLogo[][] = Array.from(
  { length: brandRowCount },
  (_, rowIndex) => {
    const perRow = Math.ceil(brandLogos.length / brandRowCount);
    const start = rowIndex * perRow;
    return brandLogos.slice(start, start + perRow);
  },
).filter((row) => row.length > 0);
