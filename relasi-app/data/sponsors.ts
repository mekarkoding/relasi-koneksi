import type { StaticImageData } from "next/image";

import jogloNyahpat from "@/public/images/sponsors/joglo-nyahpat.webp";
import kandangIngkung from "@/public/images/sponsors/kandang-ingkung.webp";
import navilNaturalOrganik from "@/public/images/sponsors/navil-natural-organik.webp";
import nuanuSocialFund from "@/public/images/sponsors/nuanu-social-fund.webp";

/**
 * Sponsor logos shown in the site footer (PRD 4.7).
 * Hardcoded — villagers do not edit these via CMS.
 */
export interface Sponsor {
  id: string;
  name: string;
  logo: StaticImageData;
}

export const sponsors: Sponsor[] = [
  {
    id: "joglo-nyahpat",
    name: "Joglo NyahPat",
    logo: jogloNyahpat,
  },
  {
    id: "kandang-ingkung",
    name: "Kandang Ingkung",
    logo: kandangIngkung,
  },
  {
    id: "navil-natural-organik",
    name: "Navil Natural Organik",
    logo: navilNaturalOrganik,
  },
  {
    id: "nuanu-social-fund",
    name: "Nuanu Social Fund",
    logo: nuanuSocialFund,
  },
];
