"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { WisataPreview } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";
import { pickLocale } from "@/lib/locale-content";

interface Props {
  wisata: WisataPreview;
  /** Balinese archway variant used by the home "Destinasi Wisata" layout */
  arch?: boolean;
}

export function WisataCard({ wisata, arch = false }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  const name = pickLocale(locale, wisata.name_id, wisata.name_en);
  const excerpt = pickLocale(locale, wisata.excerpt_id, wisata.excerpt_en);
  const imageUrl = urlForImage(wisata.mainImage).width(800).height(600).quality(75).url();
  const alt = wisata.mainImage.alt || name;

  if (arch) {
    return (
      <article className="group">
        <Link href={`/wisata/${wisata.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-none">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
          <div className="px-2 pt-5 text-center">
            <h3 className="text-lg font-bold text-forest transition-all duration-300 ease-in-out group-hover:text-tamblingan">
              {name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-forest/70">{excerpt}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-tamblingan">
              {t("readMore")} →
            </span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/wisata/${wisata.slug}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-forest transition-all duration-300 ease-in-out group-hover:text-tamblingan">
            {name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-forest/70">{excerpt}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-tamblingan">
            {t("readMore")} →
          </span>
        </div>
      </Link>
    </article>
  );
}
