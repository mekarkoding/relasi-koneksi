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

export interface Article {
  _id: string;
  title_id: string;
  title_en?: string;
  slug: string;
  coverImage: SanityImageWithAlt & SanityImageSource;
  category: Category | null;
  excerpt_id: string;
  excerpt_en?: string;
  body_id: PortableTextBlock[];
  body_en?: PortableTextBlock[];
  publishedAt: string;
  authorName: string;
}

/** Listing shape (no body) used on index pages and the home page */
export type ArticlePreview = Omit<Article, "body_id" | "body_en">;
