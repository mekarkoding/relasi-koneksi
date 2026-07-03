import type { StaticImageData } from "next/image";

import homestay11 from "@/public/images/homestays/homestay-1-1.png";
import homestay12 from "@/public/images/homestays/homestay-1-2.png";
import homestay21 from "@/public/images/homestays/homestay-2-1.png";
import homestay22 from "@/public/images/homestays/homestay-2-2.png";

/**
 * STRICT RULE (PRD 4.4): homestays are hardcoded here. No Sanity schema,
 * no admin UI, no relations. Editing this file requires a code commit.
 */
export interface Homestay {
  id: string;
  name_id: string;
  name_en: string;
  description_id: string;
  description_en: string;
  /** 1-5 photos, static imports so next/image optimizes at build time */
  photos: StaticImageData[];
  /** Free text, e.g. "Rp 250.000 - 400.000 / malam" */
  priceRange: string;
  facilities: string[];
  /** International format without "+", e.g. "6281234567890" */
  whatsappNumber: string;
}

export const homestays: Homestay[] = [
  {
    id: "homestay-taman-sari",
    name_id: "Homestay Taman Sari",
    name_en: "Taman Sari Homestay",
    description_id:
      "Penginapan asri di tengah sawah dengan arsitektur tradisional Bali. Cocok untuk keluarga yang ingin merasakan suasana pedesaan.",
    description_en:
      "A tranquil stay amid rice fields with traditional Balinese architecture. Ideal for families seeking an authentic village atmosphere.",
    photos: [homestay11, homestay12],
    priceRange: "Rp 250.000 - 400.000 / malam",
    facilities: ["WiFi", "Sarapan", "Parkir", "Air panas"],
    whatsappNumber: "6281234567890",
  },
  {
    id: "homestay-bukit-hijau",
    name_id: "Homestay Bukit Hijau",
    name_en: "Green Hill Homestay",
    description_id:
      "Kamar nyaman dengan pemandangan perbukitan. Tuan rumah ramah dan siap mengantar tamu berkeliling desa.",
    description_en:
      "Comfortable rooms overlooking the hills. Friendly hosts happy to show guests around the village.",
    photos: [homestay21, homestay22],
    priceRange: "Rp 200.000 - 350.000 / malam",
    facilities: ["Sarapan", "Parkir", "Teras", "Sepeda"],
    whatsappNumber: "6289876543210",
  },
];
