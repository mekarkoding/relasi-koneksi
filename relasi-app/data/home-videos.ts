/**
 * Home-page YouTube carousel (hardcoded — not CMS-managed).
 * Leave youtubeUrl empty to show a placeholder slide until the video is ready.
 */
export interface HomeVideo {
  id: string;
  /** Full youtube.com or youtu.be URL; empty string shows a placeholder slide */
  youtubeUrl: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
}

export const homeVideos: HomeVideo[] = [
  {
    id: "adat-profile",
    youtubeUrl: "https://www.youtube.com/watch?v=xNOvLLW8-Wc",
    title_id: "Video Profil Adat Dalem Tamblingan",
    title_en: "Adat Dalem Tamblingan Profile Video",
    description_id: "Kenali Adat Dalem Tamblingan lebih dekat",
    description_en: "Get to know Adat Dalem Tamblingan",
  },
  {
    id: "kkn-journey",
    youtubeUrl: "https://youtu.be/yONBOAKm-HM",
    title_id: "Video Perjalanan KKN-PPM UGM Mekar Banjar 2026",
    title_en: "Video Perjalanan KKN-PPM UGM Mekar Banjar 2026",
    description_id:
      "Dokumentasi perjalanan KKN-PPM UGM Mekar Banjar 2026 bersama warga Munduk dan Gobleg",
    description_en:
      "Journey documentation of UGM KKN-PPM Mekar Banjar 2026 with the people of Munduk and Gobleg",
  },
  {
    id: "kkn-after-movie",
    youtubeUrl: "",
    title_id: "After Movie KKN Mekar Banjar",
    title_en: "KKN Mekar Banjar After Movie",
    description_id: "After movie sedang dalam proses pembuatan — nantikan segera",
    description_en: "The after movie is still in production — coming soon",
  },
];
