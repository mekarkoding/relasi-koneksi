/**
 * Home-page YouTube carousel (hardcoded — not CMS-managed).
 * KKN URLs below are temporary placeholders — swap for real Mekar Banjar links later.
 */
export interface HomeVideo {
  id: string;
  /** Full youtube.com or youtu.be URL; empty string hides the slide until filled */
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
    id: "kkn-after-movie",
    youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    title_id: "After Movie KKN Mekar Banjar",
    title_en: "KKN Mekar Banjar After Movie",
    description_id:
      "Cuplikan perjalanan KKN-PPM UGM Mekar Banjar bersama warga Munduk dan Gobleg",
    description_en:
      "A glimpse of the UGM KKN-PPM Mekar Banjar journey with the people of Munduk and Gobleg",
  },
  {
    id: "kkn-programs",
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    title_id: "Program Kerja Mekar Banjar",
    title_en: "Mekar Banjar Program Films",
    description_id:
      "Dokumentasi program lintas klaster — dari lapangan, kolaborasi, hingga kehidupan di desa",
    description_en:
      "Documentation of cross-cluster programs — from the field, collaboration, and village life",
  },
];
