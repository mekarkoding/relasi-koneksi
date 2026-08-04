"use client";

import { useTranslations } from "next-intl";
import type { ArticleSort } from "@/lib/articles-listing";
import type {
  ArticleDetailType,
  ArticlePreview,
  LiputanArticle,
} from "@/lib/sanity/types";
import { ArticleCard } from "@/components/ArticleCard";
import {
  ArticleListingControls,
  type ArticleFilterChip,
} from "@/components/ArticleListingControls";
import { ArticleListingPagination } from "@/components/ArticleListingPagination";
import { LiputanCard } from "@/components/LiputanCard";

export type ArticleListingEntry =
  | {
      kind: "internal";
      article: ArticlePreview;
      type: ArticleDetailType;
      fixedLabel?: string;
    }
  | {
      kind: "liputan";
      article: LiputanArticle;
    };

interface Props {
  entries: ArticleListingEntry[];
  basePath: string;
  sort: ArticleSort;
  searchQuery?: string;
  page: number;
  totalPages: number;
  total: number;
  filterParam?: "category" | "type";
  filterValue?: string;
  filters?: ArticleFilterChip[];
}

/**
 * Client listing shell: controls + card grid + pagination.
 * Filtering/sorting/search/page are resolved on the server via URL params.
 */
export function ArticleListingSection({
  entries,
  basePath,
  sort,
  searchQuery = "",
  page,
  totalPages,
  total,
  filterParam,
  filterValue,
  filters,
}: Props) {
  const t = useTranslations("articles");

  return (
    <>
      <ArticleListingControls
        basePath={basePath}
        sort={sort}
        filterParam={filterParam}
        filterValue={filterValue}
        filters={filters}
        searchQuery={searchQuery}
      />

      {entries.length > 0 ? (
        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) =>
            entry.kind === "liputan" ? (
              <LiputanCard key={entry.article._id} article={entry.article} />
            ) : (
              <ArticleCard
                key={entry.article._id}
                article={entry.article}
                type={entry.type}
                fixedLabel={entry.fixedLabel}
              />
            ),
          )}
        </div>
      ) : (
        <p className="py-12 text-center text-forest/60">
          {searchQuery.trim() ? t("searchEmpty") : t("empty")}
        </p>
      )}

      <ArticleListingPagination
        basePath={basePath}
        page={page}
        totalPages={totalPages}
        sort={sort}
        searchQuery={searchQuery}
        filterParam={filterParam}
        filterValue={filterValue}
      />

      {total > 0 && totalPages > 1 && (
        <p className="mt-3 text-center text-xs text-forest/45">
          {t("pagination.summary", { page, totalPages, total })}
        </p>
      )}
    </>
  );
}
