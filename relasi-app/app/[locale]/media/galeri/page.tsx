import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { downloads } from "@/data/downloads";
import { galleryPhotos } from "@/data/gallery";
import { LazyYouTubeEmbed } from "@/components/LazyYouTubeEmbed";
import { GalleryPhotoMasonry } from "@/components/GalleryPhotoMasonry";
import { SectionHeading } from "@/components/SectionHeading";
import { extractYouTubeId } from "@/lib/youtube";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "media.galeri" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/media/galeri"),
  };
}

export default async function GaleriPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("media.galeri");

  const afterMovieId = extractYouTubeId(downloads.afterMovieYoutubeUrl);

  const photos = galleryPhotos.map((photo) => ({
    id: photo.id,
    image: photo.image,
    alt: pickLocale(locale, photo.alt_id, photo.alt_en),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      {afterMovieId && (
        <section className="animate-slide-up mt-10">
          <h2 className="text-xl font-bold text-forest">{t("afterMovieTitle")}</h2>
          <p className="mt-2 text-sm text-forest/70">{t("afterMovieSubtitle")}</p>
          <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl">
            <LazyYouTubeEmbed videoId={afterMovieId} title={t("afterMovieTitle")} />
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="animate-slide-up mt-14">
          <h2 className="text-xl font-bold text-forest">{t("photosTitle")}</h2>
          <p className="mt-2 text-sm text-forest/70">{t("photosSubtitle")}</p>
          <div className="mt-6">
            <GalleryPhotoMasonry
              photos={photos}
              closeLabel={t("closeLightbox")}
              prevLabel={t("prevPhoto")}
              nextLabel={t("nextPhoto")}
            />
          </div>
        </section>
      )}
    </div>
  );
}
