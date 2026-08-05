"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DesaPreview } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";

/** Village card: main picture + name, linking to the desa page (PRD 5.3 / 4.6). */
export function DesaCard({ desa }: { desa: DesaPreview }) {
  const tVillages = useTranslations("desa.villages");
  const name = tVillages(desa.villageName);
  const imageUrl = urlForImage(desa.mainImage)
    .width(600)
    .height(600)
    .format("webp")
    .quality(70)
    .url();

  return (
    <Link href={`/desa/${desa.villageName}`} className="group block">
      <article className="relative aspect-square overflow-hidden rounded-2xl shadow-sm">
        <Image
          src={imageUrl}
          alt={desa.mainImage.alt || name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/10 to-transparent" />
        <h3 className="absolute inset-x-0 bottom-0 p-4 text-lg font-bold text-white">
          {name}
        </h3>
      </article>
    </Link>
  );
}
