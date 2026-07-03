import type { StaticImageData } from "next/image";

import booklet1 from "@/public/images/booklet/booklet-1.png";
import booklet2 from "@/public/images/booklet/booklet-2.png";
import booklet3 from "@/public/images/booklet/booklet-3.png";
import booklet4 from "@/public/images/booklet/booklet-4.png";

/**
 * STRICT RULE (PRD 4.5): booklet content is hardcoded here as static assets.
 * Villagers cannot edit it. Rendered as an interactive flip-book.
 */
export interface BookletPage {
  id: string;
  photo: StaticImageData;
  commonName_id: string;
  commonName_en: string;
  scientificName: string;
  description_id: string;
  description_en: string;
}

export const bookletPages: BookletPage[] = [
  {
    id: "jalak-bali",
    photo: booklet1,
    commonName_id: "Jalak Bali",
    commonName_en: "Bali Myna",
    scientificName: "Leucopsar rothschildi",
    description_id:
      "Burung endemik Bali berbulu putih dengan ujung sayap hitam. Termasuk satwa dilindungi yang sangat langka.",
    description_en:
      "A white-plumed bird endemic to Bali with black wing tips. A protected and critically endangered species.",
  },
  {
    id: "kamboja-bali",
    photo: booklet2,
    commonName_id: "Kamboja Bali",
    commonName_en: "Frangipani",
    scientificName: "Plumeria alba",
    description_id:
      "Bunga harum yang banyak ditanam di pura dan pekarangan. Digunakan dalam upacara adat dan persembahyangan.",
    description_en:
      "A fragrant flower commonly planted at temples and home gardens, used in traditional ceremonies and offerings.",
  },
  {
    id: "lutung-jawa",
    photo: booklet3,
    commonName_id: "Lutung",
    commonName_en: "Silvery Lutung",
    scientificName: "Trachypithecus cristatus",
    description_id:
      "Primata berbulu keperakan yang hidup berkelompok di hutan sekitar desa. Aktif pada pagi dan sore hari.",
    description_en:
      "A silvery-furred primate living in groups in the forests around the village. Most active in the morning and late afternoon.",
  },
  {
    id: "beringin",
    photo: booklet4,
    commonName_id: "Pohon Beringin",
    commonName_en: "Banyan Tree",
    scientificName: "Ficus benjamina",
    description_id:
      "Pohon besar yang dianggap keramat oleh masyarakat. Akar gantungnya menjadi ciri khas lanskap desa.",
    description_en:
      "A large tree held sacred by the community. Its hanging roots are a signature of the village landscape.",
  },
];
