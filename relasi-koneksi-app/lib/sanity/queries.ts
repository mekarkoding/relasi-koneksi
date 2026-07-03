import { groq } from "next-sanity";
import { sanityFetch } from "./client";
import type { Article, ArticlePreview, Category } from "./types";

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
  authorName
`;

export async function getLatestArticles(limit = 3): Promise<ArticlePreview[]> {
  return sanityFetch<ArticlePreview[]>(
    groq`*[_type == "article"] | order(publishedAt desc)[0...$limit]{${articlePreviewFields}}`,
    { limit },
    [],
  );
}

export async function getAllArticles(categorySlug?: string): Promise<ArticlePreview[]> {
  if (categorySlug) {
    return sanityFetch<ArticlePreview[]>(
      groq`*[_type == "article" && category->slug.current == $categorySlug]
        | order(publishedAt desc){${articlePreviewFields}}`,
      { categorySlug },
      [],
    );
  }
  return sanityFetch<ArticlePreview[]>(
    groq`*[_type == "article"] | order(publishedAt desc){${articlePreviewFields}}`,
    {},
    [],
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return sanityFetch<Article | null>(
    groq`*[_type == "article" && slug.current == $slug][0]{
      ${articlePreviewFields},
      body_id,
      body_en
    }`,
    { slug },
    null,
  );
}

export async function getAllArticleSlugs(): Promise<string[]> {
  return sanityFetch<string[]>(
    groq`*[_type == "article" && defined(slug.current)].slug.current`,
    {},
    [],
  );
}

export async function getAllCategories(): Promise<Category[]> {
  return sanityFetch<Category[]>(
    groq`*[_type == "category"] | order(title_id asc){
      _id, title_id, title_en, "slug": slug.current
    }`,
    {},
    [],
  );
}
