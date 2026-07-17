import type { StaticImageData } from "next/image";

import guidebookCover from "@/public/images/gallery/photo-01.png";

/**
 * Media downloads are hardcoded (PRD 4.9 / 6.8): the after-movie YouTube URL and
 * the digital guidebook metadata. The guidebook is featured at the top of
 * `/media/buklet`; the after-movie lives on `/media/galeri` and the home page.
 * Updating the guidebook requires a code commit + redeploy - intentionally
 * NOT CMS-managed.
 */
export interface Downloads {
  afterMovieYoutubeUrl: string;
  guidebookTitle_id: string;
  guidebookTitle_en: string;
  guidebookDescription_id: string;
  guidebookDescription_en: string;
  /** Path under public/, e.g. "/files/guidebook.pdf" */
  guidebookPdfPath: string;
  guidebookCover: StaticImageData;
}

export const downloads: Downloads = {
  afterMovieYoutubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  guidebookTitle_id: "Buku Panduan Wisata Desa",
  guidebookTitle_en: "Village Tourism Guidebook",
  guidebookDescription_id:
    "Panduan lengkap berisi peta, destinasi, dan tips berkunjung ke desa. Unduh dan bawa saat perjalanan Anda.",
  guidebookDescription_en:
    "A complete guide with maps, destinations, and visit tips for the village. Download it and bring it along on your trip.",
  guidebookPdfPath: "/files/guidebook.pdf",
  guidebookCover,
};

/** Home page after-movie uses the same URL as the Galeri page. */
export const afterMovieYoutubeUrl = downloads.afterMovieYoutubeUrl;
