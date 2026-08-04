import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  parseArticlePage,
  parseArticleSort,
  sanitizeArticleSearchQuery,
} from "@/lib/articles-listing";
import { getAllArticles } from "@/lib/sanity/queries";
import {
  ARTICLE_TYPES,
  isLiputanListingItem,
  type ArticleType,
} from "@/lib/sanity/types";
import {
  ArticleListingSection,
  type ArticleListingEntry,
} from "@/components/ArticleListingSection";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60;

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string; sort?: string; q?: string; page?: string }>;
}

function parseTypeFilter(value?: string): ArticleType | undefined {
  if (value && (ARTICLE_TYPES as readonly string[]).includes(value)) {
    return value as ArticleType;
  }
  return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: t("all.title"),
    description: t("all.subtitle"),
    alternates: localeAlternates("/articles/all"),
  };
}

export default async function AllArticlesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const {
    type: typeParam,
    sort: sortParam,
    q: qParam,
    page: pageParam,
  } = await searchParams;
  const typeFilter = parseTypeFilter(typeParam);
  const sort = parseArticleSort(sortParam);
  const q = sanitizeArticleSearchQuery(qParam);
  const requestedPage = parseArticlePage(pageParam);

  const t = await getTranslations("articles");
  const { items, total, page, totalPages } = await getAllArticles({
    type: typeFilter,
    sort,
    q,
    page: requestedPage,
  });

  const typeFilters = [
    { value: "", label: t("allTypes") },
    ...ARTICLE_TYPES.map((type) => ({
      value: type,
      label: t(`types.${type}.label`),
    })),
  ];

  const entries: ArticleListingEntry[] = items.map((item) => {
    if (isLiputanListingItem(item)) {
      return { kind: "liputan", article: item };
    }
    return {
      kind: "internal",
      article: item,
      type: item.articleType,
      fixedLabel:
        item.articleType === "berita"
          ? undefined
          : t(`types.${item.articleType}.label`),
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("all.title")} subtitle={t("all.subtitle")} />
      <ArticleListingSection
        entries={entries}
        basePath="/articles/all"
        sort={sort}
        searchQuery={q}
        page={page}
        totalPages={totalPages}
        total={total}
        filterParam="type"
        filterValue={typeFilter ?? ""}
        filters={typeFilters}
      />
    </div>
  );
}
