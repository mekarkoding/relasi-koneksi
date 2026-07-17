import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllWisataSlugs, getWisataBySlug } from "@/lib/sanity/queries";
import { urlForImage, hasImageAsset } from "@/lib/sanity/image";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { MediaGallery } from "@/components/MediaGallery";
import { BackLink } from "@/components/BackLink";
import { pickLocale } from "@/lib/locale-content";
import { pickPortableText } from "@/lib/sanity/types";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR: publish latency ≤ 60s (PRD 7.1)
export const dynamicParams = true;

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllWisataSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const wisata = await getWisataBySlug(slug);
  if (!wisata) return {};
  return {
    title: pickLocale(locale, wisata.name_id, wisata.name_en),
    alternates: localeAlternates(`/wisata/${slug}`),
  };
}

export default async function WisataDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const wisata = await getWisataBySlug(slug);
  if (!wisata) notFound();

  const t = await getTranslations("wisata");
  const tCommon = await getTranslations("common");
  const name = pickLocale(locale, wisata.name_id, wisata.name_en);
  const description = pickPortableText(
    wisata.description_id,
    wisata.description_en,
    locale,
  );

  const galleryImages = (wisata.gallery ?? [])
    .filter(hasImageAsset)
    .map((image) => ({
      url: urlForImage(image).width(800).height(600).url(),
      alt: ("alt" in image && typeof image.alt === "string" && image.alt) || name,
    }));

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6">
        <BackLink href="/wisata" label={tCommon("back")} />
      </div>

      <div className="animate-fade-in relative aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={urlForImage(wisata.mainImage).width(1600).height(1067).url()}
          alt={wisata.mainImage.alt || name}
          fill
          priority
          unoptimized
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      <h1 className="animate-slide-up mt-8 text-3xl font-extrabold text-forest">{name}</h1>

      <div className="mt-6">
        <PortableTextRenderer value={description} />
      </div>

      {galleryImages.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-forest">{t("galleryTitle")}</h2>
          <MediaGallery images={galleryImages} label={`${t("galleryTitle")} — ${name}`} />
        </div>
      )}
    </article>
  );
}
