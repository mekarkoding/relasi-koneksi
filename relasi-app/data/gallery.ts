import type { StaticImageData } from "next/image";

import photo01 from "@/public/images/gallery/photo-01.png";
import photo02 from "@/public/images/gallery/photo-02.png";
import photo03 from "@/public/images/gallery/photo-03.png";
import photo04 from "@/public/images/gallery/photo-04.png";
import photo05 from "@/public/images/gallery/photo-05.png";
import photo06 from "@/public/images/gallery/photo-06.png";
import photo07 from "@/public/images/gallery/photo-07.png";
import photo08 from "@/public/images/gallery/photo-08.png";
import photo09 from "@/public/images/gallery/photo-09.png";

/**
 * @deprecated Gallery photos are CMS-managed via the Sanity `galeri` document
 * type (KONEKSI → Galeri). The Media > Galeri page reads from Sanity, not here.
 * These placeholders remain only so existing local image imports keep building;
 * safe to delete once public/images/gallery placeholders are no longer needed
 * (guidebook cover still uses photo-01 via data/downloads.ts).
 */
export interface GalleryPhoto {
  id: string;
  image: StaticImageData;
  alt_id: string;
  alt_en: string;
}

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "photo-01",
    image: photo01,
    alt_id: "Placeholder pemandangan desa 1",
    alt_en: "Village scenery placeholder 1",
  },
  {
    id: "photo-02",
    image: photo02,
    alt_id: "Placeholder pemandangan desa 2",
    alt_en: "Village scenery placeholder 2",
  },
  {
    id: "photo-03",
    image: photo03,
    alt_id: "Placeholder pemandangan desa 3",
    alt_en: "Village scenery placeholder 3",
  },
  {
    id: "photo-04",
    image: photo04,
    alt_id: "Placeholder pemandangan desa 4",
    alt_en: "Village scenery placeholder 4",
  },
  {
    id: "photo-05",
    image: photo05,
    alt_id: "Placeholder pemandangan desa 5",
    alt_en: "Village scenery placeholder 5",
  },
  {
    id: "photo-06",
    image: photo06,
    alt_id: "Placeholder pemandangan desa 6",
    alt_en: "Village scenery placeholder 6",
  },
  {
    id: "photo-07",
    image: photo07,
    alt_id: "Placeholder pemandangan desa 7",
    alt_en: "Village scenery placeholder 7",
  },
  {
    id: "photo-08",
    image: photo08,
    alt_id: "Placeholder pemandangan desa 8",
    alt_en: "Village scenery placeholder 8",
  },
  {
    id: "photo-09",
    image: photo09,
    alt_id: "Placeholder pemandangan desa 9",
    alt_en: "Village scenery placeholder 9",
  },
];
