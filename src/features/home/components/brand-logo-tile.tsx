import Image from "next/image";

import type { BrandLogo } from "@/features/home/brands-data";

type BrandLogoTileProps = {
  brand: BrandLogo;
};

export function BrandLogoTile({ brand }: BrandLogoTileProps) {
  return (
    <Image
      alt={brand.label}
      className="brand-logo__image"
      height={72}
      src={brand.image}
      width={72}
    />
  );
}
