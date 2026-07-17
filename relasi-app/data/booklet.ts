import type { StaticImageData } from "next/image";

import booklet1 from "@/public/images/booklet/booklet-1.png";
import booklet2 from "@/public/images/booklet/booklet-2.png";
import booklet3 from "@/public/images/booklet/booklet-3.png";
import booklet4 from "@/public/images/booklet/booklet-4.png";
import gallery01 from "@/public/images/gallery/photo-01.png";
import gallery02 from "@/public/images/gallery/photo-02.png";
import gallery03 from "@/public/images/gallery/photo-03.png";
import gallery04 from "@/public/images/gallery/photo-04.png";
import gallery05 from "@/public/images/gallery/photo-05.png";
import gallery06 from "@/public/images/gallery/photo-06.png";
import gallery07 from "@/public/images/gallery/photo-07.png";
import gallery08 from "@/public/images/gallery/photo-08.png";
import gallery09 from "@/public/images/gallery/photo-09.png";

/**
 * Booklets are hardcoded static assets (not CMS-managed).
 * Each book has a cover, flip-book pages, and a downloadable PDF.
 */
export interface BookletPage {
  id: string;
  photo: StaticImageData;
  title_id: string;
  title_en: string;
  /** Optional line under the title (e.g. scientific name) */
  caption_id?: string;
  caption_en?: string;
  description_id: string;
  description_en: string;
}

export interface Booklet {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  cover: StaticImageData;
  /** Path under public/, e.g. "/files/booklets/flora-fauna.pdf" */
  pdfPath: string;
  pages: BookletPage[];
}

export const booklets: Booklet[] = [
  {
    id: "flora-fauna",
    slug: "flora-fauna",
    title_id: "Flora & Fauna",
    title_en: "Flora & Fauna",
    description_id:
      "Kenali kekayaan alam desa melalui buklet interaktif flora dan fauna.",
    description_en:
      "Discover the village's natural richness through an interactive flora and fauna booklet.",
    cover: booklet1,
    pdfPath: "/files/booklets/flora-fauna.pdf",
    pages: [
      {
        id: "jalak-bali",
        photo: booklet1,
        title_id: "Jalak Bali",
        title_en: "Bali Myna",
        caption_id: "Leucopsar rothschildi",
        caption_en: "Leucopsar rothschildi",
        description_id:
          "Burung endemik Bali berbulu putih dengan ujung sayap hitam. Termasuk satwa dilindungi yang sangat langka.",
        description_en:
          "A white-plumed bird endemic to Bali with black wing tips. A protected and critically endangered species.",
      },
      {
        id: "kamboja-bali",
        photo: booklet2,
        title_id: "Kamboja Bali",
        title_en: "Frangipani",
        caption_id: "Plumeria alba",
        caption_en: "Plumeria alba",
        description_id:
          "Bunga harum yang banyak ditanam di pura dan pekarangan. Digunakan dalam upacara adat dan persembahyangan.",
        description_en:
          "A fragrant flower commonly planted at temples and home gardens, used in traditional ceremonies and offerings.",
      },
      {
        id: "lutung-jawa",
        photo: booklet3,
        title_id: "Lutung",
        title_en: "Silvery Lutung",
        caption_id: "Trachypithecus cristatus",
        caption_en: "Trachypithecus cristatus",
        description_id:
          "Primata berbulu keperakan yang hidup berkelompok di hutan sekitar desa. Aktif pada pagi dan sore hari.",
        description_en:
          "A silvery-furred primate living in groups in the forests around the village. Most active in the morning and late afternoon.",
      },
      {
        id: "beringin",
        photo: booklet4,
        title_id: "Pohon Beringin",
        title_en: "Banyan Tree",
        caption_id: "Ficus benjamina",
        caption_en: "Ficus benjamina",
        description_id:
          "Pohon besar yang dianggap keramat oleh masyarakat. Akar gantungnya menjadi ciri khas lanskap desa.",
        description_en:
          "A large tree held sacred by the community. Its hanging roots are a signature of the village landscape.",
      },
    ],
  },
  {
    id: "budaya",
    slug: "budaya",
    title_id: "Budaya Desa",
    title_en: "Village Culture",
    description_id:
      "Cuplikan tradisi, upacara, dan kehidupan sehari-hari warga Mekar Banjar.",
    description_en:
      "Glimpses of tradition, ceremonies, and daily life in Mekar Banjar.",
    cover: gallery02,
    pdfPath: "/files/booklets/budaya.pdf",
    pages: [
      {
        id: "upacara",
        photo: gallery02,
        title_id: "Upacara Adat",
        title_en: "Traditional Ceremony",
        description_id:
          "Placeholder: deskripsi upacara adat yang masih dijaga warga desa.",
        description_en:
          "Placeholder: description of traditional ceremonies still kept by villagers.",
      },
      {
        id: "kesenian",
        photo: gallery04,
        title_id: "Kesenian Lokal",
        title_en: "Local Arts",
        description_id:
          "Placeholder: seni pertunjukan dan kerajinan yang hidup di desa.",
        description_en:
          "Placeholder: performing arts and crafts that thrive in the village.",
      },
      {
        id: "gotong-royong",
        photo: gallery06,
        title_id: "Gotong Royong",
        title_en: "Community Cooperation",
        description_id:
          "Placeholder: semangat kebersamaan dalam kegiatan desa.",
        description_en:
          "Placeholder: the spirit of togetherness in village activities.",
      },
    ],
  },
  {
    id: "kuliner",
    slug: "kuliner",
    title_id: "Kuliner Lokal",
    title_en: "Local Cuisine",
    description_id:
      "Jelajahi cita rasa makanan dan minuman khas desa (placeholder).",
    description_en:
      "Explore the flavors of village food and drinks (placeholder).",
    cover: gallery03,
    pdfPath: "/files/booklets/kuliner.pdf",
    pages: [
      {
        id: "jajanan",
        photo: gallery03,
        title_id: "Jajanan Pasar",
        title_en: "Market Snacks",
        description_id:
          "Placeholder: camilan tradisional yang dijual di pasar desa.",
        description_en:
          "Placeholder: traditional snacks sold at the village market.",
      },
      {
        id: "hidangan",
        photo: gallery05,
        title_id: "Hidangan Rumah",
        title_en: "Home Cooking",
        description_id:
          "Placeholder: masakan rumahan yang disajikan untuk tamu homestay.",
        description_en:
          "Placeholder: home-cooked meals served to homestay guests.",
      },
      {
        id: "minuman",
        photo: gallery07,
        title_id: "Minuman Segar",
        title_en: "Fresh Drinks",
        description_id:
          "Placeholder: minuman dari hasil kebun dan rempah lokal.",
        description_en:
          "Placeholder: drinks made from local garden produce and spices.",
      },
    ],
  },
  {
    id: "panduan-desa",
    slug: "panduan-desa",
    title_id: "Panduan Desa",
    title_en: "Village Guide",
    description_id:
      "Tips berkunjung, etika wisata, dan info praktis untuk wisatawan.",
    description_en:
      "Visit tips, traveler etiquette, and practical info for guests.",
    cover: gallery01,
    pdfPath: "/files/booklets/panduan-desa.pdf",
    pages: [
      {
        id: "etika",
        photo: gallery01,
        title_id: "Etika Berkunjung",
        title_en: "Visitor Etiquette",
        description_id:
          "Placeholder: cara bersikap hormat saat berkunjung ke desa.",
        description_en:
          "Placeholder: how to visit the village respectfully.",
      },
      {
        id: "rute",
        photo: gallery08,
        title_id: "Rute Singkat",
        title_en: "Quick Routes",
        description_id:
          "Placeholder: saran jalur singkat menuju destinasi utama.",
        description_en:
          "Placeholder: suggested short routes to main destinations.",
      },
      {
        id: "kontak",
        photo: gallery09,
        title_id: "Kontak Darurat",
        title_en: "Emergency Contacts",
        description_id:
          "Placeholder: nomor penting yang bisa dihubungi wisatawan.",
        description_en:
          "Placeholder: important numbers visitors can contact.",
      },
    ],
  },
];

export function getBookletBySlug(slug: string): Booklet | undefined {
  return booklets.find((book) => book.slug === slug);
}

export function getAllBookletSlugs(): string[] {
  return booklets.map((book) => book.slug);
}
