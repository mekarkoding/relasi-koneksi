import { groq } from "next-sanity";
import { sanityFetch } from "./client";
import {
  articlePageSlice,
  articleSortOrderClause,
  DEFAULT_ARTICLE_SORT,
  parseArticlePage,
  sanitizeArticleSearchQuery,
  totalArticlePages,
  type ArticleSort,
} from "@/lib/articles-listing";
import type {
  AllArticlesItem,
  Article,
  ArticlePreview,
  ArticleType,
  Category,
  Desa,
  DesaPreview,
  GaleriParty,
  GaleriPhoto,
  GaleriVideo,
  LiputanArticle,
  Wisata,
  WisataPreview,
} from "./types";
import { sanityTypeForArticle } from "./types";

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
};

function titleSearchClause(query?: string | null): {
  clause: string;
  params: { titlePattern?: string };
} {
  const safe = sanitizeArticleSearchQuery(query);
  if (!safe) return { clause: "", params: {} };
  return {
    clause:
      ' && (title_id match $titlePattern || coalesce(title_en, "") match $titlePattern)',
    params: { titlePattern: `*${safe}*` },
  };
}

function clampPage(page: number, total: number): number {
  const totalPages = totalArticlePages(total);
  return Math.min(Math.max(1, page), totalPages);
}

/* ------------------------------------------------------------------ */
/* Articles (Berita / Sejarah / Partnership)                          */
/* ------------------------------------------------------------------ */

const articlePreviewFields = groq`
  _id,
  title_id,
  title_en,
  "slug": slug.current,
  coverImage,
  category->{_id, title_id, title_en, "slug": slug.current},
  excerpt_id,
  excerpt_en,
  publishedAt,
  authorName,
  orderRank
`;

/**
 * Listing for a body-bearing article type (berita, sejarah, partnership).
 * Category filtering only applies to berita. Paginated (12 per page).
 */
export async function getArticlesByType(
  type: Exclude<ArticleType, "liputan">,
  options?: {
    categorySlug?: string;
    sort?: ArticleSort;
    q?: string;
    page?: number;
  },
): Promise<PaginatedResult<ArticlePreview>> {
  const sanityType = sanityTypeForArticle(type);
  const sort = options?.sort ?? DEFAULT_ARTICLE_SORT;
  const order = articleSortOrderClause(sort);
  const categorySlug = options?.categorySlug;
  const search = titleSearchClause(options?.q);
  const requestedPage = parseArticlePage(String(options?.page ?? 1));

  const categoryClause =
    type === "berita" && categorySlug
      ? " && category->slug.current == $categorySlug"
      : "";

  const filter = `_type == $sanityType${categoryClause}${search.clause}`;
  const params = {
    sanityType,
    ...(categorySlug ? { categorySlug } : {}),
    ...search.params,
  };

  const total = await sanityFetch<number>(
    groq`count(*[${filter}])`,
    params,
    0,
  );
  const page = clampPage(requestedPage, total);
  const { start, end } = articlePageSlice(page);

  const items = await sanityFetch<ArticlePreview[]>(
    groq`*[${filter}] | ${order} [${start}...${end}]{${articlePreviewFields}}`,
    params,
    [],
  );

  return { items, total, page, totalPages: totalArticlePages(total) };
}

export async function getArticleByTypeAndSlug(
  type: Exclude<ArticleType, "liputan">,
  slug: string,
): Promise<Article | null> {
  const sanityType = sanityTypeForArticle(type);
  return sanityFetch<Article | null>(
    groq`*[_type == $sanityType && slug.current == $slug][0]{
      ${articlePreviewFields},
      indonesianOnly,
      blocks[]{
        _key,
        body_id,
        body_en
      },
      body_id,
      body_en
    }`,
    { sanityType, slug },
    null,
  );
}

export async function getArticleSlugsByType(
  type: Exclude<ArticleType, "liputan">,
): Promise<string[]> {
  const sanityType = sanityTypeForArticle(type);
  return sanityFetch<string[]>(
    groq`*[_type == $sanityType && defined(slug.current)].slug.current`,
    { sanityType },
    [],
  );
}

/* ------------------------------------------------------------------ */
/* Liputan (external coverage - no detail page)                       */
/* ------------------------------------------------------------------ */

export async function getLiputan(options?: {
  sort?: ArticleSort;
  q?: string;
  page?: number;
}): Promise<PaginatedResult<LiputanArticle>> {
  const sort = options?.sort ?? DEFAULT_ARTICLE_SORT;
  const order = articleSortOrderClause(sort);
  const search = titleSearchClause(options?.q);
  const requestedPage = parseArticlePage(String(options?.page ?? 1));
  const filter = `_type == "artikel_liputan"${search.clause}`;
  const params = { ...search.params };

  const total = await sanityFetch<number>(
    groq`count(*[${filter}])`,
    params,
    0,
  );
  const page = clampPage(requestedPage, total);
  const { start, end } = articlePageSlice(page);

  const items = await sanityFetch<LiputanArticle[]>(
    groq`*[${filter}] | ${order} [${start}...${end}]{
      _id,
      title_id,
      title_en,
      "slug": slug.current,
      coverImage,
      excerpt_id,
      excerpt_en,
      externalUrl,
      sourceName,
      publishedAt,
      orderRank
    }`,
    params,
    [],
  );

  return { items, total, page, totalPages: totalArticlePages(total) };
}

const allArticlesProjection = groq`
  _id,
  title_id,
  title_en,
  "slug": slug.current,
  coverImage,
  category->{_id, title_id, title_en, "slug": slug.current},
  excerpt_id,
  excerpt_en,
  publishedAt,
  authorName,
  externalUrl,
  sourceName,
  orderRank,
  "articleType": select(
    _type == "artikel_berita" => "berita",
    _type == "artikel_sejarah" => "sejarah",
    _type == "artikel_partnership" => "partnership",
    _type == "artikel_liputan" => "liputan"
  )
`;

/**
 * Semua Artikel — mixed listing of all four article types.
 * Optional `type` filters to one article route segment. Paginated (12 per page).
 */
export async function getAllArticles(options?: {
  type?: ArticleType;
  sort?: ArticleSort;
  q?: string;
  page?: number;
}): Promise<PaginatedResult<AllArticlesItem>> {
  const sort = options?.sort ?? DEFAULT_ARTICLE_SORT;
  const order = articleSortOrderClause(sort);
  const search = titleSearchClause(options?.q);
  const requestedPage = parseArticlePage(String(options?.page ?? 1));
  const typeFilter = options?.type;
  const sanityType = typeFilter ? sanityTypeForArticle(typeFilter) : null;

  const filter = sanityType
    ? `_type == $sanityType${search.clause}`
    : `_type in ["artikel_berita","artikel_sejarah","artikel_partnership","artikel_liputan"]${search.clause}`;

  const params = {
    ...(sanityType ? { sanityType } : {}),
    ...search.params,
  };

  const total = await sanityFetch<number>(
    groq`count(*[${filter}])`,
    params,
    0,
  );
  const page = clampPage(requestedPage, total);
  const { start, end } = articlePageSlice(page);

  const items = await sanityFetch<AllArticlesItem[]>(
    groq`*[${filter}] | ${order} [${start}...${end}]{${allArticlesProjection}}`,
    params,
    [],
  );

  return { items, total, page, totalPages: totalArticlePages(total) };
}

/* ------------------------------------------------------------------ */
/* Categories (used only by berita)                                   */
/* ------------------------------------------------------------------ */

export async function getAllCategories(): Promise<Category[]> {
  return sanityFetch<Category[]>(
    groq`*[_type == "category"] | order(title_id asc){
      _id, title_id, title_en, "slug": slug.current
    }`,
    {},
    [],
  );
}

/* ------------------------------------------------------------------ */
/* Wisata (attractions)                                               */
/* ------------------------------------------------------------------ */

const wisataPreviewFields = groq`
  _id,
  name_id,
  name_en,
  "slug": slug.current,
  mainImage,
  "excerpt_id": pt::text(description_id),
  "excerpt_en": pt::text(description_en),
  publishedAt,
  orderRank
`;

export async function getAllWisata(): Promise<WisataPreview[]> {
  return sanityFetch<WisataPreview[]>(
    groq`*[_type == "wisata"]
      | order(orderRank asc, _createdAt asc){${wisataPreviewFields}}`,
    {},
    [],
  );
}

export async function getFeaturedWisata(limit = 3): Promise<WisataPreview[]> {
  return sanityFetch<WisataPreview[]>(
    groq`*[_type == "wisata"]
      | order(orderRank asc, _createdAt asc)[0...$limit]{${wisataPreviewFields}}`,
    { limit },
    [],
  );
}

export async function getWisataBySlug(slug: string): Promise<Wisata | null> {
  return sanityFetch<Wisata | null>(
    groq`*[_type == "wisata" && slug.current == $slug][0]{
      _id,
      name_id,
      name_en,
      "slug": slug.current,
      mainImage,
      description_id,
      description_en,
      gallery,
      publishedAt
    }`,
    { slug },
    null,
  );
}

export async function getAllWisataSlugs(): Promise<string[]> {
  return sanityFetch<string[]>(
    groq`*[_type == "wisata" && defined(slug.current)].slug.current`,
    {},
    [],
  );
}

/* ------------------------------------------------------------------ */
/* Desa (villages)                                                    */
/* ------------------------------------------------------------------ */

export async function getAllDesa(): Promise<DesaPreview[]> {
  return sanityFetch<DesaPreview[]>(
    groq`*[_type == "desa" && defined(villageName)]{
      _id, villageName, mainImage
    }`,
    {},
    [],
  );
}

export async function getDesaByVillage(village: string): Promise<Desa | null> {
  return sanityFetch<Desa | null>(
    groq`*[_type == "desa" && villageName == $village][0]{
      _id,
      villageName,
      mainImage,
      description_id,
      description_en,
      dataFields[]{ _key, label_id, label_en, value },
      gallery
    }`,
    { village },
    null,
  );
}

/* ------------------------------------------------------------------ */
/* Galeri (Media → Galeri photos + YouTube videos)                    */
/* ------------------------------------------------------------------ */

export async function getGalleryPhotos(
  party: GaleriParty,
): Promise<GaleriPhoto[]> {
  return sanityFetch<GaleriPhoto[]>(
    groq`*[_type == "galeri" && party == $party && defined(image.asset)]
      | order(publishedAt desc){
        _id,
        party,
        image,
        alt_id,
        alt_en,
        publishedAt,
        "width": image.asset->metadata.dimensions.width,
        "height": image.asset->metadata.dimensions.height
      }`,
    { party },
    [],
  );
}

export async function getGalleryVideos(
  party: GaleriParty,
): Promise<GaleriVideo[]> {
  return sanityFetch<GaleriVideo[]>(
    groq`*[_type == "galeri_video" && party == $party && defined(youtubeUrl)]
      | order(publishedAt desc){
        _id,
        party,
        title_id,
        title_en,
        description_id,
        description_en,
        youtubeUrl,
        publishedAt
      }`,
    { party },
    [],
  );
}
