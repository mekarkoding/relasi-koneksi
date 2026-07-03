import Image from "next/image";
import { useLocale, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ArticlePreview } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";
import { pickLocale } from "@/lib/locale-content";

export function ArticleCard({ article }: { article: ArticlePreview }) {
  const locale = useLocale() as Locale;
  const format = useFormatter();

  const title = pickLocale(locale, article.title_id, article.title_en);
  const excerpt = pickLocale(locale, article.excerpt_id, article.excerpt_en);
  const categoryLabel = article.category
    ? pickLocale(locale, article.category.title_id, article.category.title_en)
    : null;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={urlForImage(article.coverImage).width(800).height(600).url()}
            alt={article.coverImage.alt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
          />
          {categoryLabel && (
            <span className="absolute left-3 top-3 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-white">
              {categoryLabel}
            </span>
          )}
        </div>
        <div className="p-5">
          <time className="text-xs text-volcanic/50" dateTime={article.publishedAt}>
            {format.dateTime(new Date(article.publishedAt), {
              dateStyle: "long",
            })}
          </time>
          <h3 className="mt-1 line-clamp-2 text-lg font-bold text-jungle transition-all duration-300 ease-in-out group-hover:text-terracotta">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-volcanic/70">{excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
