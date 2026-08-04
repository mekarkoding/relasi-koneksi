/** Allowed `?sort=` values for article listing pages. */
export const ARTICLE_SORTS = [
  "relevant",
  "oldest",
  "newest",
  "az",
  "za",
] as const;

export type ArticleSort = (typeof ARTICLE_SORTS)[number];

export const DEFAULT_ARTICLE_SORT: ArticleSort = "relevant";

/** Max articles shown per listing page. */
export const ARTICLE_PAGE_SIZE = 12;

export function parseArticleSort(value?: string | null): ArticleSort {
  if (value && (ARTICLE_SORTS as readonly string[]).includes(value)) {
    return value as ArticleSort;
  }
  return DEFAULT_ARTICLE_SORT;
}

export function parseArticlePage(value?: string | null): number {
  const n = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function articlePageSlice(page: number): { start: number; end: number } {
  const start = (page - 1) * ARTICLE_PAGE_SIZE;
  return { start, end: start + ARTICLE_PAGE_SIZE };
}

export function totalArticlePages(total: number): number {
  if (total <= 0) return 1;
  return Math.ceil(total / ARTICLE_PAGE_SIZE);
}

/**
 * GROQ `| order(...)` clause. Only call with a parsed `ArticleSort`
 * (never raw user input) so field names stay allowlisted.
 *
 * `relevant` = CMS drag order (`orderRank`) set by villagers.
 */
export function articleSortOrderClause(sort: ArticleSort): string {
  switch (sort) {
    case "oldest":
      return "order(publishedAt asc)";
    case "newest":
      return "order(publishedAt desc)";
    case "az":
      return "order(title_id asc)";
    case "za":
      return "order(title_id desc)";
    case "relevant":
    default:
      return "order(orderRank asc, _createdAt asc)";
  }
}

/** Strip GROQ `match` wildcards from user search input. */
export function sanitizeArticleSearchQuery(query?: string | null): string {
  return (query ?? "").trim().replace(/[*\\|]/g, "");
}

/** Build listing URL while preserving sort, search, page, and filters. */
export function buildArticleListingHref(
  basePath: string,
  options: {
    sort?: ArticleSort;
    category?: string;
    type?: string;
    q?: string;
    page?: number;
  } = {},
): string {
  const params = new URLSearchParams();
  const sort = options.sort ?? DEFAULT_ARTICLE_SORT;
  if (sort !== DEFAULT_ARTICLE_SORT) {
    params.set("sort", sort);
  }
  if (options.category) params.set("category", options.category);
  if (options.type) params.set("type", options.type);
  const q = sanitizeArticleSearchQuery(options.q);
  if (q) params.set("q", q);
  const page = options.page ?? 1;
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
