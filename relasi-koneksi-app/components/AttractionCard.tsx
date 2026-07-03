import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Attraction } from "@/data/attractions";
import { pickLocale } from "@/lib/locale-content";

export function AttractionCard({ attraction }: { attraction: Attraction }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  const name = pickLocale(locale, attraction.name_id, attraction.name_en);
  const description = pickLocale(
    locale,
    attraction.description_id,
    attraction.description_en,
  );

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/attractions/${attraction.slug}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={attraction.photos[0]}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-jungle transition-all duration-300 ease-in-out group-hover:text-terracotta">
            {name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-volcanic/70">{description}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-terracotta">
            {t("readMore")} →
          </span>
        </div>
      </Link>
    </article>
  );
}
