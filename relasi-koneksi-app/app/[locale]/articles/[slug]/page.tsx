import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR: publish latency ≤ 60s (PRD 7.1)
export const dynamicParams = true;

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: pickLocale(locale, article.title_id, article.title_en),
    description: pickLocale(locale, article.excerpt_id, article.excerpt_en),
    alternates: localeAlternates(`/articles/${slug}`),
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const t = await getTranslations("articles");
  const format = await getFormatter();

  // Fallback rule (PRD 4.1): empty English body -> show Indonesian + note
  const hasEnglishBody = Boolean(article.body_en && article.body_en.length > 0);
  const useEnglish = locale === "en" && hasEnglishBody;
  const title = useEnglish && article.title_en ? article.title_en : article.title_id;
  const body = useEnglish ? article.body_en! : article.body_id;
  const showFallbackNote = locale === "en" && !hasEnglishBody;

  const categoryLabel = article.category
    ? pickLocale(locale, article.category.title_id, article.category.title_en)
    : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="animate-slide-up">
        {categoryLabel && (
          <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
            {categoryLabel}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-jungle sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-volcanic/60">
          {t("publishedOn")}{" "}
          <time dateTime={article.publishedAt}>
            {format.dateTime(new Date(article.publishedAt), { dateStyle: "long" })}
          </time>{" "}
          {t("by")} <span className="font-medium">{article.authorName}</span>
        </p>
      </header>

      {showFallbackNote && (
        <p className="mt-6 rounded-lg bg-jungle/5 px-4 py-3 text-sm text-jungle">
          {t("indonesianOnly")}
        </p>
      )}

      <div className="animate-fade-in relative mt-8 aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={urlForImage(article.coverImage).width(1600).height(1067).url()}
          alt={article.coverImage.alt || title}
          fill
          priority
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
