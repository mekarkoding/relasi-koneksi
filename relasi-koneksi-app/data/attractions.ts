import type { StaticImageData } from "next/image";

import attraction11 from "@/public/images/attractions/attraction-1-1.png";
import attraction12 from "@/public/images/attractions/attraction-1-2.png";
import attraction21 from "@/public/images/attractions/attraction-2-1.png";
import attraction22 from "@/public/images/attractions/attraction-2-2.png";
import attraction31 from "@/public/images/attractions/attraction-3-1.png";
import attraction32 from "@/public/images/attractions/attraction-3-2.png";

/**
 * STRICT RULE (PRD Section 5, row 2): attractions are hardcoded here.
 * No Sanity schema, no relations. Detail pages live at /attractions/[slug].
 */
export interface Attraction {
  id: string;
  slug: string;
  name_id: string;
  name_en: string;
  description_id: string;
  description_en: string;
  photos: StaticImageData[];
  /** Google Maps share link */
  mapLink: string;
}

export const attractions: Attraction[] = [
  {
    id: "air-terjun-mekar",
    slug: "air-terjun-mekar",
    name_id: "Air Terjun Mekar",
    name_en: "Mekar Waterfall",
    description_id:
      "Air terjun setinggi 25 meter yang dikelilingi hutan tropis. Perjalanan menuju lokasi melewati jalur trekking yang mudah diikuti.",
    description_en:
      "A 25-meter waterfall surrounded by tropical forest. The route to the falls follows an easy, well-marked trekking path.",
    photos: [attraction11, attraction12],
    mapLink: "https://maps.google.com/?q=-8.5,115.2",
  },
  {
    id: "sawah-terasering",
    slug: "sawah-terasering",
    name_id: "Sawah Terasering Banjar",
    name_en: "Banjar Rice Terraces",
    description_id:
      "Hamparan sawah terasering hijau dengan sistem irigasi subak tradisional. Waktu terbaik berkunjung adalah pagi hari.",
    description_en:
      "Sweeping green rice terraces irrigated by the traditional subak system. Early morning is the best time to visit.",
    photos: [attraction21, attraction22],
    mapLink: "https://maps.google.com/?q=-8.51,115.21",
  },
  {
    id: "pura-desa",
    slug: "pura-desa",
    name_id: "Pura Desa Mekar Banjar",
    name_en: "Mekar Banjar Village Temple",
    description_id:
      "Pura desa bersejarah dengan ukiran batu khas Bali. Pengunjung wajib mengenakan kain dan selendang yang tersedia di pintu masuk.",
    description_en:
      "A historic village temple with distinctive Balinese stone carvings. Visitors must wear the sarong and sash provided at the entrance.",
    photos: [attraction31, attraction32],
    mapLink: "https://maps.google.com/?q=-8.52,115.22",
  },
];
