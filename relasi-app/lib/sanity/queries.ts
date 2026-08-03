import { groq } from "next-sanity";
import { sanityFetch } from "./client";
import type {
  Article,
  ArticlePreview,
  ArticleType,
  BerandaBackgrounds,
  Category,
  Desa,
  DesaPreview,
  GaleriPhoto,
  LiputanArticle,
  Wisata,
  WisataPreview,
} from "./types";
import { sanityTypeForArticle } from "./types";

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
  authorName
`;

/**
 * Listing for a body-bearing article type (berita, sejarah, partnership).
 * Category filtering only applies to berita.
 */
export async function getArticlesByType(
  type: Exclude<ArticleType, "liputan">,
  categorySlug?: string,
): Promise<ArticlePreview[]> {
  const sanityType = sanityTypeForArticle(type);
  if (type === "berita" && categorySlug) {
    return sanityFetch<ArticlePreview[]>(
      groq`*[_type == $sanityType && category->slug.current == $categorySlug]
        | order(publishedAt desc){${articlePreviewFields}}`,
      { sanityType, categorySlug },
      [],
    );
  }
  return sanityFetch<ArticlePreview[]>(
    groq`*[_type == $sanityType] | order(publishedAt desc){${articlePreviewFields}}`,
    { sanityType },
    [],
  );
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

export async function getLiputan(): Promise<LiputanArticle[]> {
  return sanityFetch<LiputanArticle[]>(
    groq`*[_type == "artikel_liputan"] | order(publishedAt desc){
      _id,
      title_id,
      title_en,
      "slug": slug.current,
      coverImage,
      excerpt_id,
      excerpt_en,
      externalUrl,
      sourceName,
      publishedAt
    }`,
    {},
    [],
  );
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
  publishedAt
`;

export async function getAllWisata(): Promise<WisataPreview[]> {
  return sanityFetch<WisataPreview[]>(
    groq`*[_type == "wisata"]
      | order(publishedAt desc){${wisataPreviewFields}}`,
    {},
    [],
  );
}

export async function getFeaturedWisata(limit = 3): Promise<WisataPreview[]> {
  return sanityFetch<WisataPreview[]>(
    groq`*[_type == "wisata"]
      | order(publishedAt desc)[0...$limit]{${wisataPreviewFields}}`,
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
/* Galeri (Media → Galeri photos)                                     */
/* ------------------------------------------------------------------ */

export async function getGalleryPhotos(): Promise<GaleriPhoto[]> {
  return sanityFetch<GaleriPhoto[]>(
    groq`*[_type == "galeri" && defined(image.asset)]
      | order(publishedAt desc){
        _id,
        image,
        alt_id,
        alt_en,
        publishedAt,
        "width": image.asset->metadata.dimensions.width,
        "height": image.asset->metadata.dimensions.height
      }`,
    {},
    [],
  );
}

/* ------------------------------------------------------------------ */
/* Beranda backgrounds (singleton)                                    */
/* ------------------------------------------------------------------ */

export async function getBerandaBackgrounds(): Promise<BerandaBackgrounds | null> {
  return sanityFetch<BerandaBackgrounds | null>(
    groq`*[_type == "beranda" && _id == "beranda"][0]{
      heroBackground,
      instagramBackground,
      wisataBackground,
      desaBackground,
      afterMovieBackground
    }`,
    {},
    null,
  );
}
