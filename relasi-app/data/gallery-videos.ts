/**
 * @deprecated Gallery page videos are CMS-managed (`galeri_video` in KONEKSI).
 * Kept only so existing imports/types do not break; do not use on Media → Galeri.
 * Home-page carousel remains in `data/home-videos.ts`.
 */
import type { HomeVideo } from "@/data/home-videos";

export type GalleryVideo = HomeVideo;

/** @deprecated Use Sanity `galeri_video` with party="adat". */
export const adatGalleryVideos: GalleryVideo[] = [];

/** @deprecated Use Sanity `galeri_video` with party="kkn". */
export const kknGalleryVideos: GalleryVideo[] = [];
