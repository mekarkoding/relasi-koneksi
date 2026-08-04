"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ARTICLE_SORTS,
  type ArticleSort,
  buildArticleListingHref,
} from "@/lib/articles-listing";

export interface ArticleFilterChip {
  /** Empty string = “all” (no filter). */
  value: string;
  label: string;
}

interface Props {
  basePath: string;
  sort: ArticleSort;
  /** When set, renders an expandable category control for this query param. */
  filterParam?: "category" | "type";
  filterValue?: string;
  filters?: ArticleFilterChip[];
  searchQuery: string;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type OpenMenu = "filter" | "sort" | null;

/**
 * Category + sort + search controls for article listing pages.
 * Category/sort/search live in the URL so listings stay server-paginated.
 */
export function ArticleListingControls({
  basePath,
  sort,
  filterParam,
  filterValue = "",
  filters,
  searchQuery,
}: Props) {
  const t = useTranslations("articles");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const filterListId = useId();
  const sortListId = useId();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const controlsRef = useRef<HTMLDivElement>(null);

  const showFilters = Boolean(filterParam && filters && filters.length > 0);
  const activeFilter =
    filters?.find((chip) => chip.value === (filterValue || "")) ?? filters?.[0];

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const hrefFor = (next: {
    sort?: ArticleSort;
    filter?: string;
    q?: string;
    page?: number;
  }) => {
    const nextSort = next.sort ?? sort;
    const nextFilter = next.filter === undefined ? filterValue : next.filter;
    const nextQ = next.q === undefined ? searchInput : next.q;
    return buildArticleListingHref(basePath, {
      sort: nextSort,
      q: nextQ,
      page: next.page ?? 1,
      category: filterParam === "category" && nextFilter ? nextFilter : undefined,
      type: filterParam === "type" && nextFilter ? nextFilter : undefined,
    });
  };

  const navigate = (href: string) => {
    startTransition(() => {
      router.replace(href);
    });
  };

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (controlsRef.current && target && !controlsRef.current.contains(target)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const triggerClassName =
    "inline-flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm font-medium text-forest shadow-sm outline-none transition-colors hover:border-tamblingan/40 focus:border-tamblingan focus:ring-2 focus:ring-tamblingan/20";

  const menuClassName =
    "absolute left-0 z-20 mt-2 min-w-[14rem] overflow-hidden rounded-xl border border-forest/10 bg-white py-1 shadow-lg";

  const optionClassName = (active: boolean) =>
    `block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
      active
        ? "bg-tamblingan text-white"
        : "text-forest/80 hover:bg-marigold/20 hover:text-tamblingan"
    }`;

  return (
    <div ref={controlsRef} className="mb-8 flex flex-wrap items-center gap-6">
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-forest/70">
            {t("filterLabel")}
          </span>
          <div className="relative">
            <button
              type="button"
              aria-expanded={openMenu === "filter"}
              aria-controls={filterListId}
              aria-label={t("filterLabel")}
              onClick={() =>
                setOpenMenu((prev) => (prev === "filter" ? null : "filter"))
              }
              className={triggerClassName}
            >
              <span>{activeFilter?.label ?? t("filterLabel")}</span>
              <Chevron open={openMenu === "filter"} />
            </button>

            {openMenu === "filter" && (
              <ul
                id={filterListId}
                role="listbox"
                aria-label={t("filterLabel")}
                className={menuClassName}
              >
                {filters!.map((chip) => {
                  const active = (filterValue || "") === chip.value;
                  return (
                    <li key={chip.value || "all"} role="option" aria-selected={active}>
                      <Link
                        href={hrefFor({ filter: chip.value, page: 1 })}
                        onClick={() => setOpenMenu(null)}
                        className={optionClassName(active)}
                      >
                        {chip.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-forest/70">
          {t("sort.label")}
        </span>
        <div className="relative">
          <button
            type="button"
            aria-expanded={openMenu === "sort"}
            aria-controls={sortListId}
            aria-label={t("sort.label")}
            onClick={() =>
              setOpenMenu((prev) => (prev === "sort" ? null : "sort"))
            }
            className={triggerClassName}
          >
            <span>{t(`sort.${sort}`)}</span>
            <Chevron open={openMenu === "sort"} />
          </button>

          {openMenu === "sort" && (
            <ul
              id={sortListId}
              role="listbox"
              aria-label={t("sort.label")}
              className={menuClassName}
            >
              {ARTICLE_SORTS.map((value) => {
                const active = sort === value;
                return (
                  <li key={value} role="option" aria-selected={active}>
                    <button
                      type="button"
                      className={optionClassName(active)}
                      onClick={() => {
                        setOpenMenu(null);
                        navigate(hrefFor({ sort: value, page: 1 }));
                      }}
                    >
                      {t(`sort.${value}`)}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="flex min-w-[12rem] flex-1 flex-wrap items-center gap-3 sm:min-w-[16rem] sm:max-w-xs">
        <label
          htmlFor="article-search"
          className="text-sm font-medium text-forest/70"
        >
          {t("searchLabel")}
        </label>
        <input
          id="article-search"
          type="search"
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            navigate(hrefFor({ q: value, page: 1 }));
          }}
          placeholder={t("searchPlaceholder")}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm font-medium text-forest shadow-sm outline-none transition-colors placeholder:text-forest/40 focus:border-tamblingan focus:ring-2 focus:ring-tamblingan/20"
        />
      </div>
    </div>
  );
}
