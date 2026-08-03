import type { StaticImageData } from "next/image";

import photo01 from "@/public/images/about/kkn-team/member-01.jpg";
import photo02 from "@/public/images/about/kkn-team/member-02.jpg";
import photo03 from "@/public/images/about/kkn-team/member-03.jpg";
import photo04 from "@/public/images/about/kkn-team/member-04.jpg";
import photo05 from "@/public/images/about/kkn-team/member-05.jpg";
import photo06 from "@/public/images/about/kkn-team/member-06.jpg";
import photo07 from "@/public/images/about/kkn-team/member-07.jpg";
import photo08 from "@/public/images/about/kkn-team/member-08.jpg";
import photo09 from "@/public/images/about/kkn-team/member-09.jpg";
import photo10 from "@/public/images/about/kkn-team/member-10.jpg";
import photo11 from "@/public/images/about/kkn-team/member-11.jpg";
import photo12 from "@/public/images/about/kkn-team/member-12.jpg";
import photo13 from "@/public/images/about/kkn-team/member-13.jpg";
import photo14 from "@/public/images/about/kkn-team/member-14.jpg";
import photo15 from "@/public/images/about/kkn-team/member-15.jpg";
import photo16 from "@/public/images/about/kkn-team/member-16.jpg";
import photo17 from "@/public/images/about/kkn-team/member-17.jpg";
import photo18 from "@/public/images/about/kkn-team/member-18.jpg";
import photo19 from "@/public/images/about/kkn-team/member-19.jpg";
import photo20 from "@/public/images/about/kkn-team/member-20.jpg";
import photo21 from "@/public/images/about/kkn-team/member-21.jpg";
import photo22 from "@/public/images/about/kkn-team/member-22.jpg";
import photo23 from "@/public/images/about/kkn-team/member-23.jpg";
import photo24 from "@/public/images/about/kkn-team/member-24.jpg";
import photo25 from "@/public/images/about/kkn-team/member-25.jpg";
import photo26 from "@/public/images/about/kkn-team/member-26.jpg";
import photo27 from "@/public/images/about/kkn-team/member-27.jpg";

/**
 * KKN Mekar Banjar team roster (hardcoded — not CMS-managed).
 * Nickname is rendered in brand accent color within the full name.
 */
export interface KknTeamMember {
  id: string;
  /** Text before the nickname (include trailing space if needed) */
  nameBefore: string;
  /** Highlighted nickname */
  nickname: string;
  /** Text after the nickname (include leading space if needed) */
  nameAfter: string;
  major_id: string;
  major_en: string;
  photo: StaticImageData;
}

/** 27 roster slots — Saintek (10), Soshum (8), Agro (6), Medika (3). */
export const kknTeam: KknTeamMember[] = [
  // Saintek — 10
  {
    id: "member-01",
    nameBefore: "Raden Nur Muhammad Abyaz Fayyaza",
    nickname: "",
    nameAfter: "",
    major_id: "Teknik Sipil",
    major_en: "Civil Engineering",
    photo: photo01,
  },
  {
    id: "member-02",
    nameBefore: "Gde Thio Roland Ananda Setiawan",
    nickname: "",
    nameAfter: "",
    major_id: "Teknik Sipil",
    major_en: "Civil Engineering",
    photo: photo02,
  },
  {
    id: "member-03",
    nameBefore: "Alvinendra Triaji Wibowo",
    nickname: "",
    nameAfter: "",
    major_id: "Teknik Sipil",
    major_en: "Civil Engineering",
    photo: photo03,
  },
  {
    id: "member-04",
    nameBefore: "Deco Rio Palung",
    nickname: "",
    nameAfter: "",
    major_id: "Teknik Mesin",
    major_en: "Mechanical Engineering",
    photo: photo04,
  },
  {
    id: "member-05",
    nameBefore: "Nawwal Farras Abiyyu",
    nickname: "",
    nameAfter: "",
    major_id: "Teknik Mesin",
    major_en: "Mechanical Engineering",
    photo: photo05,
  },
  {
    id: "member-06",
    nameBefore: "Hikmat Sejati",
    nickname: "",
    nameAfter: "",
    major_id: "Elektronika dan Instrumentasi",
    major_en: "Electronics and Instrumentation",
    photo: photo06,
  },
  {
    id: "member-07",
    nameBefore: "Rama Andhika Pratama",
    nickname: "",
    nameAfter: "",
    major_id: "Ilmu Komputer",
    major_en: "Computer Science",
    photo: photo07,
  },
  {
    id: "member-08",
    nameBefore: "Michael Satpelin Williamtu",
    nickname: "",
    nameAfter: "",
    major_id: "Ilmu Komputer",
    major_en: "Computer Science",
    photo: photo08,
  },
  {
    id: "member-09",
    nameBefore: "Sintya Cindyani Fatika",
    nickname: "",
    nameAfter: "",
    major_id: "Geografi Lingkungan",
    major_en: "Environmental Geography",
    photo: photo09,
  },
  {
    id: "member-10",
    nameBefore: "Soen Eliora Valerie Natania",
    nickname: "",
    nameAfter: "",
    major_id: "Biologi",
    major_en: "Biology",
    photo: photo10,
  },
  // Soshum — 8
  {
    id: "member-11",
    nameBefore: "Arasty Lyla Ramadhani",
    nickname: "",
    nameAfter: "",
    major_id: "Akuntansi",
    major_en: "Accounting",
    photo: photo11,
  },
  {
    id: "member-12",
    nameBefore: "Edward Christiano Purba",
    nickname: "",
    nameAfter: "",
    major_id: "Hukum",
    major_en: "Law",
    photo: photo12,
  },
  {
    id: "member-13",
    nameBefore: "Muhammad Faiz Wildan",
    nickname: "",
    nameAfter: "",
    major_id: "Politik dan Pemerintahan",
    major_en: "Politics and Government",
    photo: photo13,
  },
  {
    id: "member-14",
    nameBefore: "Pratita Amaranggana Dharmesthi",
    nickname: "",
    nameAfter: "",
    major_id: "Manajemen",
    major_en: "Management",
    photo: photo14,
  },
  {
    id: "member-15",
    nameBefore: "Tiffany Trisha Pasaribu",
    nickname: "",
    nameAfter: "",
    major_id: "Hukum",
    major_en: "Law",
    photo: photo15,
  },
  {
    id: "member-16",
    nameBefore: "Atha Bintang Wahyu Mawardi",
    nickname: "",
    nameAfter: "",
    major_id: "Ilmu Ekonomi",
    major_en: "Economics",
    photo: photo16,
  },
  {
    id: "member-17",
    nameBefore: "Maytri Gestart Ignatius",
    nickname: "",
    nameAfter: "",
    major_id: "Hukum",
    major_en: "Law",
    photo: photo17,
  },
  {
    id: "member-18",
    nameBefore: "Peter Gabriel Taiyoo Karnodipuro",
    nickname: "",
    nameAfter: "",
    major_id: "Politik dan Pemerintahan",
    major_en: "Politics and Government",
    photo: photo18,
  },
  // Agro — 6
  {
    id: "member-19",
    nameBefore: "Erina Widiya",
    nickname: "",
    nameAfter: "",
    major_id: "Teknik Pertanian",
    major_en: "Agricultural Engineering",
    photo: photo19,
  },
  {
    id: "member-20",
    nameBefore: "Khansa Nabilla Adha",
    nickname: "",
    nameAfter: "",
    major_id: "Proteksi Tanaman",
    major_en: "Plant Protection",
    photo: photo20,
  },
  {
    id: "member-21",
    nameBefore: "Shofiya Putri Azzahra",
    nickname: "",
    nameAfter: "",
    major_id: "Ilmu Tanah",
    major_en: "Soil Science",
    photo: photo21,
  },
  {
    id: "member-22",
    nameBefore: "Felicia Jeanete Adelyn",
    nickname: "",
    nameAfter: "",
    major_id: "Teknologi Pangan dan Hasil Pertanian",
    major_en: "Food and Agricultural Product Technology",
    photo: photo22,
  },
  {
    id: "member-23",
    nameBefore: "Keisa Nabila Anwar",
    nickname: "",
    nameAfter: "",
    major_id: "Kehutanan",
    major_en: "Forestry",
    photo: photo23,
  },
  {
    id: "member-24",
    nameBefore: "Paramita Dyah Sekar Dewanti Pramodawardani",
    nickname: "",
    nameAfter: "",
    major_id: "Kedokteran Hewan",
    major_en: "Veterinary Medicine",
    photo: photo24,
  },
  // Medika — 3
  {
    id: "member-25",
    nameBefore: "Alya Fadhillah",
    nickname: "",
    nameAfter: "",
    major_id: "Ilmu Keperawatan",
    major_en: "Nursing Science",
    photo: photo25,
  },
  {
    id: "member-26",
    nameBefore: "Angelie Nadia Chantika",
    nickname: "",
    nameAfter: "",
    major_id: "Farmasi",
    major_en: "Pharmacy",
    photo: photo26,
  },
  {
    id: "member-27",
    nameBefore: "Pratistha Puspa Rasmi",
    nickname: "",
    nameAfter: "",
    major_id: "Farmasi",
    major_en: "Pharmacy",
    photo: photo27,
  },
];
