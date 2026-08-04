"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  type ArticleSort,
  buildArticleListingHref,
} from "@/lib/articles-listing";

interface Props {
  basePath: string;
  page: number;
  totalPages: number;
  sort: ArticleSort;
  searchQuery?: string;
  filterParam?: "category" | "type";
  filterValue?: string;
}

function pageHref(
  basePath: string,
  page: number,
  sort: ArticleSort,
  searchQuery: string | undefined,
  filterParam: "category" | "type" | undefined,
  filterValue: string | undefined,
) {
  return buildArticleListingHref(basePath, {
    sort,
    q: searchQuery,
    page,
    category: filterParam === "category" && filterValue ? filterValue : undefined,
    type: filterParam === "type" && filterValue ? filterValue : undefined,
  });
}

/**
 * Bottom pagination for article listings (max 12 items per page).
 */
export function ArticleListingPagination({
  basePath,
  page,
  totalPages,
  sort,
  searchQuery,
  filterParam,
  filterValue,
}: Props) {
  const t = useTranslations("articles");

  if (totalPages <= 1) return null;

  const href = (p: number) =>
    pageHref(basePath, p, sort, searchQuery, filterParam, filterValue);

  const pages = visiblePages(page, totalPages);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label={t("pagination.label")}
    >
      <Link
        href={href(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
          page <= 1
            ? "pointer-events-none bg-mist-dark/50 text-forest/30"
            : "bg-mist-dark text-forest/80 hover:bg-marigold/25"
        }`}
      >
        {t("pagination.prev")}
      </Link>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`e-${i}`}
            className="px-1 text-sm text-forest/40"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`min-w-10 rounded-xl px-3 py-2 text-center text-sm font-medium transition-colors ${
              p === page
                ? "bg-tamblingan text-white"
                : "bg-mist-dark text-forest/80 hover:bg-marigold/25"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={href(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
          page >= totalPages
            ? "pointer-events-none bg-mist-dark/50 text-forest/30"
            : "bg-mist-dark text-forest/80 hover:bg-marigold/25"
        }`}
      >
        {t("pagination.next")}
      </Link>
    </nav>
  );
}

function visiblePages(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}
