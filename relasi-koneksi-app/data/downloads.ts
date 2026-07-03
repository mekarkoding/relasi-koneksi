import type { StaticImageData } from "next/image";

import guidebookCover from "@/public/images/guidebook-cover.png";

/**
 * STRICT RULE (PRD 4.6): KKN outputs are hardcoded here.
 * The guidebook PDF lives in public/files/ and updating it requires a
 * code commit + redeploy — this is intentional, it is not CMS-managed.
 */
export interface Downloads {
  afterMovieYoutubeUrl: string;
  /** Path under public/, e.g. "/files/guidebook.pdf" */
  guidebookPdfPath: string;
  guidebookCover: StaticImageData;
}

export const downloads: Downloads = {
  afterMovieYoutubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  guidebookPdfPath: "/files/guidebook.pdf",
  guidebookCover,
};
