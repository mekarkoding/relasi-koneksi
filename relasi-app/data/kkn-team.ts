import type { StaticImageData } from "next/image";

import placeholder from "@/public/images/about/kkn-team/placeholder.png";

/**
 * KKN Mekar Banjar team roster (hardcoded — not CMS-managed).
 * Nickname is rendered in brand accent color within the full name.
 * Replace photo / name parts / majors when the real roster is ready.
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

function placeholderMember(index: number): KknTeamMember {
  const n = String(index).padStart(2, "0");
  return {
    id: `member-${n}`,
    nameBefore: "Nama ",
    nickname: "Panggilan",
    nameAfter: ` ${n}`,
    major_id: "Program studi",
    major_en: "Study program",
    photo: placeholder,
  };
}

/** 27 roster slots — fill with real names, nicknames, majors, and photos later. */
export const kknTeam: KknTeamMember[] = Array.from({ length: 27 }, (_, i) =>
  placeholderMember(i + 1),
);
