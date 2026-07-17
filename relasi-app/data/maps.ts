import type { StaticImageData } from "next/image";

/**
 * Area maps (PRD 4.11) are hardcoded static assets created by other KKN
 * sub-teams. Villagers cannot edit them - updating requires a code commit.
 */
export interface MapEntry {
  id: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  fileType: "image" | "pdf";
  /** For image maps: static import so next/image optimizes at build time (STRICT RULE 3.2). */
  image?: StaticImageData;
  /** Path under public/ used by the view/download button (image or PDF). */
  filePath: string;
  /** Optional preview thumbnail for PDF maps (static import). */
  cover?: StaticImageData;
}

/**
 * Populate this array once the map files exist under public/files/maps/.
 * Static-import image maps (and PDF covers) so next/image can optimize them.
 */
export const maps: MapEntry[] = [];
