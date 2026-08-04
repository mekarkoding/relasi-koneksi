import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllBookletSlugs } from "@/data/booklet";
import {
  getAllWisataSlugs,
  getArticleSlugsByType,
} from "@/lib/sanity/queries";
import {
  ARTICLE_TYPES,
  ARTICLE_DETAIL_TYPES,
  VILLAGES,
} from "@/lib/sanity/types";
import { siteUrl } from "@/lib/seo";

const STATIC_PATHS = [
  "",
  "/wisata",
  "/articles/all",
  ...ARTICLE_TYPES.map((type) => `/articles/${type}`),
  ...VILLAGES.map((village) => `/desa/${village}`),
  "/media/galeri",
  "/media/buklet",
  "/media/peta",
  "/about/adat-dalem-tamblingan",
  "/about/kkn-mekar-banjar-2026",
  "/about/kkn-mekar-banjar-2025",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [wisataSlugs, articleSlugsByType, bookletSlugs] = await Promise.all([
    getAllWisataSlugs(),
    Promise.all(
      ARTICLE_DETAIL_TYPES.map(async (type) => ({
        type,
        slugs: await getArticleSlugsByType(type),
      })),
    ),
    Promise.resolve(getAllBookletSlugs()),
  ]);

  const paths = [
    ...STATIC_PATHS,
    ...wisataSlugs.map((slug) => `/wisata/${slug}`),
    ...articleSlugsByType.flatMap(({ type, slugs }) =>
      slugs.map((slug) => `/articles/${type}/${slug}`),
    ),
    ...bookletSlugs.map((slug) => `/media/buklet/${slug}`),
  ];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
        ),
      },
    })),
  );
}
