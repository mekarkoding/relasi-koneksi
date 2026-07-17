import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import {
  getArticleByTypeAndSlug,
  getArticleSlugsByType,
} from "@/lib/sanity/queries";
import {
  ARTICLE_DETAIL_TYPES,
  resolveArticleBody,
  type ArticleDetailType,
} from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { BackLink } from "@/components/BackLink";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR: publish latency ≤ 60s (PRD 7.1)
export const dynamicParams = true;

interface Props {
  params: Promise<{ locale: Locale; type: string; slug: string }>;
}

function isDetailType(type: string): type is ArticleDetailType {
  return (ARTICLE_DETAIL_TYPES as readonly string[]).includes(type);
}

export async function generateStaticParams() {
  const perType = await Promise.all(
    ARTICLE_DETAIL_TYPES.map(async (type) => {
      const slugs = await getArticleSlugsByType(type);
      return { type, slugs };
    }),
  );
  return routing.locales.flatMap((locale) =>
    perType.flatMap(({ type, slugs }) =>
      slugs.map((slug) => ({ locale, type, slug })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type, slug } = await params;
  if (!isDetailType(type)) return {};
  const article = await getArticleByTypeAndSlug(type, slug);
  if (!article) return {};
  return {
    title: pickLocale(locale, article.title_id, article.title_en),
    description: pickLocale(locale, article.excerpt_id, article.excerpt_en),
    alternates: localeAlternates(`/articles/${type}/${slug}`),
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, type, slug } = await params;
  if (!isDetailType(type)) notFound();
  setRequestLocale(locale);

  const article = await getArticleByTypeAndSlug(type, slug);
  if (!article) notFound();

  const t = await getTranslations("articles");
  const tCommon = await getTranslations("common");
  const format = await getFormatter();

  // Indonesian-only flag drives EN-locale fallback + warning (PRD 4.1)
  const { body, showIndonesianOnlyNote } = resolveArticleBody(article, locale);
  const title =
    article.indonesianOnly !== false
      ? article.title_id
      : pickLocale(locale, article.title_id, article.title_en);

  const label =
    type === "berita" && article.category
      ? pickLocale(locale, article.category.title_id, article.category.title_en)
      : t(`types.${type}.label`);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6">
        <BackLink href={`/articles/${type}`} label={tCommon("back")} />
      </div>

      <header className="animate-slide-up">
        {label && (
          <span className="rounded-full bg-marigold/20 px-3 py-1 text-xs font-semibold text-forest">
            {label}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-forest sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-forest/60">
          {t("publishedOn")}{" "}
          <time dateTime={article.publishedAt}>
            {format.dateTime(new Date(article.publishedAt), { dateStyle: "long" })}
          </time>{" "}
          {t("by")} <span className="font-medium">{article.authorName}</span>
        </p>
      </header>

      {showIndonesianOnlyNote && (
        <p className="mt-6 rounded-lg bg-tamblingan/10 px-4 py-3 text-sm text-tamblingan">
          {t("indonesianOnly")}
        </p>
      )}

      <div className="animate-fade-in relative mt-8 aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={urlForImage(article.coverImage).width(1600).height(1067).url()}
          alt={article.coverImage.alt || title}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="mt-10">
        <PortableTextRenderer value={body} />
      </div>
    </article>
  );
}
