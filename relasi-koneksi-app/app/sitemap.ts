import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { attractions } from "@/data/attractions";
import { getAllArticleSlugs } from "@/lib/sanity/queries";
import { siteUrl } from "@/lib/seo";

const STATIC_PATHS = [
  "",
  "/attractions",
  "/homestay",
  "/articles",
  "/booklet",
  "/downloads",
  "/about",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleSlugs = await getAllArticleSlugs();

  const paths = [
    ...STATIC_PATHS,
    ...attractions.map((a) => `/attractions/${a.slug}`),
    ...articleSlugs.map((slug) => `/articles/${slug}`),
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
