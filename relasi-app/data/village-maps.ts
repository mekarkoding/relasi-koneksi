import type { StaticImageData } from "next/image";
import type { VillageName } from "@/lib/sanity/types";
import goblegMap from "@/public/images/desa/gobleg.webp";
import mundukMap from "@/public/images/desa/munduk.webp";
import gesingMap from "@/public/images/desa/gesing.webp";
import umejeroMap from "@/public/images/desa/umejero.webp";

/** Satellite boundary maps for each Catur Desa village page. */
export const villageMaps: Record<VillageName, StaticImageData> = {
  gobleg: goblegMap,
  munduk: mundukMap,
  gesing: gesingMap,
  umejero: umejeroMap,
};
