import Image from "next/image";
import type { KknTeamMember } from "@/data/kkn-team";

interface Props {
  member: KknTeamMember;
  major: string;
  photoAlt: string;
}

export function KknMemberCard({ member, major, photoAlt }: Props) {
  return (
    <article className="group flex flex-col items-center text-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-mist-dark">
        <Image
          src={member.photo}
          alt={photoAlt}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 160px"
        />
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-snug text-forest sm:text-base">
        {member.nameBefore}
        <span className="text-tamblingan">{member.nickname}</span>
        {member.nameAfter}
      </h3>
      <p className="mt-1 text-xs leading-snug text-forest/55 sm:text-sm">{major}</p>
    </article>
  );
}
