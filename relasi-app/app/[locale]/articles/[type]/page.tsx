import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  getArticlesByType,
  getAllCategories,
  getLiputan,
} from "@/lib/sanity/queries";
import { ARTICLE_TYPES, type ArticleType } from "@/lib/sanity/types";
import { ArticleCard } from "@/components/ArticleCard";
import { LiputanCard } from "@/components/LiputanCard";
import { SectionHeading } from "@/components/SectionHeading";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR (PRD 3.2)
export const dynamicParams = false;

interface Props {
  params: Promise<{ locale: Locale; type: string }>;
  searchParams: Promise<{ category?: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLE_TYPES.map((type) => ({ locale, type })),
  );
}

function isArticleType(type: string): type is ArticleType {
  return (ARTICLE_TYPES as readonly string[]).includes(type);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params;
  if (!isArticleType(type)) return {};
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: t(`types.${type}.title`),
    description: t(`types.${type}.subtitle`),
    alternates: localeAlternates(`/articles/${type}`),
  };
}

export default async function ArticleTypeListingPage({ params, searchParams }: Props) {
  const { locale, type } = await params;
  if (!isArticleType(type)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("articles");
  const title = t(`types.${type}.title`);
  const subtitle = t(`types.${type}.subtitle`);

  /* Liputan: external-coverage cards, no category filter, no detail page. */
  if (type === "liputan") {
    const liputan = await getLiputan();
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading title={title} subtitle={subtitle} />
        {liputan.length > 0 ? (
          <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liputan.map((article) => (
              <LiputanCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-forest/60">{t("empty")}</p>
        )}
      </div>
    );
  }

  /* Berita has a category filter; Sejarah/Partnership use a fixed label. */
  const { category } = await searchParams;
  const [articles, categories] =
    type === "berita"
      ? await Promise.all([getArticlesByType("berita", category), getAllCategories()])
      : [await getArticlesByType(type), []];

  const fixedLabel = type === "berita" ? undefined : t(`types.${type}.label`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={title} subtitle={subtitle} />

      {type === "berita" && categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/articles/berita"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out ${
              !category
                ? "bg-tamblingan text-white"
                : "bg-mist-dark text-forest/70 hover:bg-marigold/25"
            }`}
          >
            {t("allCategories")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/articles/berita?category=${c.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                category === c.slug
                  ? "bg-tamblingan text-white"
                  : "bg-mist-dark text-forest/70 hover:bg-marigold/25"
              }`}
            >
              {pickLocale(locale, c.title_id, c.title_en)}
            </Link>
          ))}
        </div>
      )}

      {articles.length > 0 ? (
        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              type={type}
              fixedLabel={fixedLabel}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-forest/60">{t("empty")}</p>
      )}
    </div>
  );
}
