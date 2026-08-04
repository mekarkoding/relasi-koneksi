"use client";

import Image from "next/image";
import { useLocale, useFormatter, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { LiputanArticle } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";
import { pickLocale } from "@/lib/locale-content";

/**
 * External coverage card (PRD 6.4). Clicking opens the external source in a
 * new tab - there is no internal detail page.
 */
export function LiputanCard({ article }: { article: LiputanArticle }) {
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const t = useTranslations("articles");

  const title = pickLocale(locale, article.title_id, article.title_en);
  const excerpt = pickLocale(locale, article.excerpt_id, article.excerpt_en);
  const imageUrl = urlForImage(article.coverImage).width(800).height(600).url();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <a
        href={article.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.coverImage.alt || title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-marigold px-3 py-1 text-xs font-semibold text-forest">
            {t("types.liputan.label")}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-tamblingan">
            {t("source")}: {article.sourceName}
          </p>
          <time className="mt-1 text-xs text-forest/50" dateTime={article.publishedAt}>
            {format.dateTime(new Date(article.publishedAt), { dateStyle: "long" })}
          </time>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-forest transition-all duration-300 ease-in-out group-hover:text-tamblingan">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-forest/70">{excerpt}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-tamblingan">
            {t("readArticle")} ↗
          </span>
        </div>
      </a>
    </article>
  );
}
