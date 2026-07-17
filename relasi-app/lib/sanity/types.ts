import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";

export interface SanityImageWithAlt {
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
}

export interface Category {
  _id: string;
  title_id: string;
  title_en: string;
  slug: string;
}

/** One paired Indonesian + English content section */
export interface ArticleBlock {
  _key: string;
  /** Optional CMS display name in Isi Artikel list */
  label?: string;
  body_id: PortableTextBlock[];
  body_en?: PortableTextBlock[];
}

export interface Article {
  _id: string;
  title_id: string;
  title_en?: string;
  slug: string;
  coverImage: SanityImageWithAlt & SanityImageSource;
  category: Category | null;
  excerpt_id: string;
  excerpt_en?: string;
  /** true = Indonesian-only; false = bilingual (EN required in CMS) */
  indonesianOnly: boolean;
  blocks: ArticleBlock[];
  /** @deprecated Legacy single-body fields; kept for unmigrated docs */
  body_id?: PortableTextBlock[];
  body_en?: PortableTextBlock[];
  publishedAt: string;
  authorName: string;
}

/** Listing shape (no body) used on index pages and the home page */
export type ArticlePreview = Omit<Article, "blocks" | "body_id" | "body_en">;

/** The four article route segments (PRD 5.1 / 5.2). */
export const ARTICLE_TYPES = ["berita", "sejarah", "partnership", "liputan"] as const;
export type ArticleType = (typeof ARTICLE_TYPES)[number];

/** Article types that have an internal detail page (Liputan links out instead). */
export const ARTICLE_DETAIL_TYPES = ["berita", "sejarah", "partnership"] as const;
export type ArticleDetailType = (typeof ARTICLE_DETAIL_TYPES)[number];

/** Map a route segment to its Sanity document `_type`. */
export function sanityTypeForArticle(type: ArticleType): string {
  return `artikel_${type}`;
}

/** External-coverage article: links out, no internal body/detail page (PRD 6.4). */
export interface LiputanArticle {
  _id: string;
  title_id: string;
  title_en?: string;
  slug: string;
  coverImage: SanityImageWithAlt & SanityImageSource;
  excerpt_id: string;
  excerpt_en?: string;
  externalUrl: string;
  sourceName: string;
  publishedAt: string;
}

/** Wisata (attraction), CMS-managed in v2.0 (PRD 6.6). Bilingual required. */
export interface Wisata {
  _id: string;
  name_id: string;
  name_en: string;
  slug: string;
  mainImage: SanityImageWithAlt & SanityImageSource;
  description_id: PortableTextBlock[];
  description_en: PortableTextBlock[];
  gallery?: (SanityImageWithAlt & SanityImageSource)[];
  publishedAt: string;
}

/** Listing shape for wisata: derived plain-text excerpt, no full description/gallery. */
export interface WisataPreview {
  _id: string;
  name_id: string;
  name_en: string;
  slug: string;
  mainImage: SanityImageWithAlt & SanityImageSource;
  excerpt_id: string;
  excerpt_en: string;
  publishedAt: string;
}

/** The four fixed villages (PRD 6.7). */
export const VILLAGES = ["gobleg", "munduk", "gesing", "umejero"] as const;
export type VillageName = (typeof VILLAGES)[number];

export interface DesaDataField {
  _key: string;
  label_id: string;
  label_en: string;
  value: string;
}

/** Desa (village), CMS-managed but with a fixed set of four (PRD 6.7). */
export interface Desa {
  _id: string;
  villageName: VillageName;
  mainImage: SanityImageWithAlt & SanityImageSource;
  description_id: PortableTextBlock[];
  description_en: PortableTextBlock[];
  dataFields?: DesaDataField[];
  gallery?: (SanityImageWithAlt & SanityImageSource)[];
}

/** Listing/card shape for desa (used by home "Empat Desa" + cross-links). */
export type DesaPreview = Pick<Desa, "_id" | "villageName" | "mainImage">;

/**
 * Pick the locale-appropriate Portable Text body for wisata/desa, where both
 * languages are always required (no Indonesian-only fallback).
 */
export function pickPortableText(
  id: PortableTextBlock[],
  en: PortableTextBlock[] | undefined,
  locale: string,
): PortableTextBlock[] {
  if (locale === "en" && en && en.length > 0) return en;
  return id ?? [];
}

/**
 * Resolve continuous article body from blocks (or legacy single fields).
 * Indonesian-only articles always use Indonesian body on both locales.
 */
export function resolveArticleBody(
  article: Pick<Article, "blocks" | "body_id" | "body_en" | "indonesianOnly">,
  locale: string,
): { body: PortableTextBlock[]; showIndonesianOnlyNote: boolean } {
  const indonesianOnly = article.indonesianOnly !== false;

  const blocks =
    article.blocks && article.blocks.length > 0
      ? article.blocks
      : article.body_id || article.body_en
        ? [
            {
              _key: "legacy",
              body_id: article.body_id ?? [],
              body_en: article.body_en,
            },
          ]
        : [];

  const body = blocks.flatMap((block) => {
    if (
      !indonesianOnly &&
      locale === "en" &&
      block.body_en &&
      block.body_en.length > 0
    ) {
      return block.body_en;
    }
    return block.body_id ?? [];
  });

  return {
    body,
    showIndonesianOnlyNote: locale === "en" && indonesianOnly,
  };
}
