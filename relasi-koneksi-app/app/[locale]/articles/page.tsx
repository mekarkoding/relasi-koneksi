import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAllArticles, getAllCategories } from "@/lib/sanity/queries";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR (PRD 3.2)

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/articles"),
  };
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("articles");
  const [articles, categories] = await Promise.all([
    getAllArticles(category),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/articles"
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
              href={`/articles?category=${c.slug}`}
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
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-forest/60">{t("empty")}</p>
      )}
    </div>
  );
}
