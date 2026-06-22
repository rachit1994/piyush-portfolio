import type { CSSProperties } from "react";

import type { BrandLogo } from "@/features/home/brands-data";

import { BrandLogoTile } from "./brand-logo-tile";

type BrandsRowProps = {
  brands: BrandLogo[];
};

export function BrandsRow({ brands }: BrandsRowProps) {
  const style = { "--brand-cols": brands.length } as CSSProperties;

  return (
    <ul className="brands-row" style={style}>
      {brands.map((brand) => (
        <li className="brand-logo" key={brand.slug}>
          <BrandLogoTile brand={brand} />
        </li>
      ))}
    </ul>
  );
}
