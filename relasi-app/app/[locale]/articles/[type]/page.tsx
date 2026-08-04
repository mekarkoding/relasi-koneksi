import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import {
  parseArticlePage,
  parseArticleSort,
  sanitizeArticleSearchQuery,
} from "@/lib/articles-listing";
import {
  getArticlesByType,
  getAllCategories,
  getLiputan,
} from "@/lib/sanity/queries";
import { ARTICLE_TYPES, type ArticleType } from "@/lib/sanity/types";
import {
  ArticleListingSection,
  type ArticleListingEntry,
} from "@/components/ArticleListingSection";
import { SectionHeading } from "@/components/SectionHeading";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR (PRD 3.2)
export const dynamicParams = false;

interface Props {
  params: Promise<{ locale: Locale; type: string }>;
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
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

  const {
    category,
    sort: sortParam,
    q: qParam,
    page: pageParam,
  } = await searchParams;
  const sort = parseArticleSort(sortParam);
  const q = sanitizeArticleSearchQuery(qParam);
  const requestedPage = parseArticlePage(pageParam);

  const t = await getTranslations("articles");
  const title = t(`types.${type}.title`);
  const subtitle = t(`types.${type}.subtitle`);
  const basePath = `/articles/${type}`;

  if (type === "liputan") {
    const { items, total, page, totalPages } = await getLiputan({
      sort,
      q,
      page: requestedPage,
    });
    const entries: ArticleListingEntry[] = items.map((article) => ({
      kind: "liputan",
      article,
    }));

    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading title={title} subtitle={subtitle} />
        <ArticleListingSection
          entries={entries}
          basePath={basePath}
          sort={sort}
          searchQuery={q}
          page={page}
          totalPages={totalPages}
          total={total}
        />
      </div>
    );
  }

  const [result, categories] =
    type === "berita"
      ? await Promise.all([
          getArticlesByType("berita", {
            categorySlug: category,
            sort,
            q,
            page: requestedPage,
          }),
          getAllCategories(),
        ])
      : [
          await getArticlesByType(type, {
            sort,
            q,
            page: requestedPage,
          }),
          [],
        ];

  const { items, total, page, totalPages } = result;
  const fixedLabel = type === "berita" ? undefined : t(`types.${type}.label`);

  const beritaFilters =
    type === "berita" && categories.length > 0
      ? [
          { value: "", label: t("allCategories") },
          ...categories.map((c) => ({
            value: c.slug,
            label: pickLocale(locale, c.title_id, c.title_en),
          })),
        ]
      : undefined;

  const entries: ArticleListingEntry[] = items.map((article) => ({
    kind: "internal",
    article,
    type,
    fixedLabel,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={title} subtitle={subtitle} />
      <ArticleListingSection
        entries={entries}
        basePath={basePath}
        sort={sort}
        searchQuery={q}
        page={page}
        totalPages={totalPages}
        total={total}
        filterParam={beritaFilters ? "category" : undefined}
        filterValue={category ?? ""}
        filters={beritaFilters}
      />
    </div>
  );
}
