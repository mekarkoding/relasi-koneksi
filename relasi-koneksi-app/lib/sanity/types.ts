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
