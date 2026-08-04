import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  GalleryPhotoMasonry,
  type GalleryLightboxItem,
} from "@/components/GalleryPhotoMasonry";
import { HomeVideoCarousel } from "@/components/home/HomeVideoCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import type { HomeVideo } from "@/data/home-videos";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";
import {
  getGalleryPhotos,
  getGalleryVideos,
} from "@/lib/sanity/queries";
import { hasImageAsset, urlForImage } from "@/lib/sanity/image";
import type { GaleriParty, GaleriPhoto, GaleriVideo } from "@/lib/sanity/types";

export const revalidate = 60;

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

function mapPhotos(
  docs: GaleriPhoto[],
  locale: Locale,
): GalleryLightboxItem[] {
  return docs
    .filter((photo) => hasImageAsset(photo.image))
    .map((photo) => {
      const width = photo.width || 1200;
      const height = photo.height || 800;
      return {
        id: photo._id,
        src: urlForImage(photo.image).width(1600).url(),
        alt: pickLocale(locale, photo.alt_id, photo.alt_en),
        width,
        height,
      };
    });
}

function mapVideos(docs: GaleriVideo[]): HomeVideo[] {
  return docs.map((video) => ({
    id: video._id,
    youtubeUrl: video.youtubeUrl,
    title_id: video.title_id,
    title_en: video.title_en || video.title_id,
    description_id: video.description_id,
    description_en: video.description_en || video.description_id,
  }));
}

export default async function GaleriPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("media.galeri");

  const parties: GaleriParty[] = ["adat", "kkn"];
  const [adatPhotos, kknPhotos, adatVideos, kknVideos] = await Promise.all([
    getGalleryPhotos("adat"),
    getGalleryPhotos("kkn"),
    getGalleryVideos("adat"),
    getGalleryVideos("kkn"),
  ]);

  const photosByParty: Record<GaleriParty, GalleryLightboxItem[]> = {
    adat: mapPhotos(adatPhotos, locale),
    kkn: mapPhotos(kknPhotos, locale),
  };
  const videosByParty: Record<GaleriParty, HomeVideo[]> = {
    adat: mapVideos(adatVideos),
    kkn: mapVideos(kknVideos),
  };

  const sections: {
    key: GaleriParty;
    title: string;
    subtitle: string;
    videos: HomeVideo[];
    photos: GalleryLightboxItem[];
  }[] = parties.map((key) => ({
    key,
    title: key === "adat" ? t("adatTitle") : t("kknTitle"),
    subtitle: key === "adat" ? t("adatSubtitle") : t("kknSubtitle"),
    videos: videosByParty[key],
    photos: photosByParty[key],
  }));

  return (
    <div className="pb-16 pt-12">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      </div>

      <div className="mt-10 space-y-16">
        {sections.map((section) => (
          <section key={section.key} className="animate-slide-up">
            <div className="mx-auto max-w-6xl px-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-forest">
                {section.title}
              </h2>
              <p className="mt-2 text-sm text-forest/70">{section.subtitle}</p>
              <div className="mt-2 h-1 w-14 rounded-full bg-marigold" />
            </div>

            <div className="mx-auto mt-8 max-w-6xl px-4">
              <h3 className="text-lg font-bold text-forest">{t("photosTitle")}</h3>
              <p className="mt-1 text-sm text-forest/60">{t("photosSubtitle")}</p>
              {section.photos.length > 0 ? (
                <div className="mt-4">
                  <GalleryPhotoMasonry
                    photos={section.photos}
                    closeLabel={t("closeLightbox")}
                    prevLabel={t("prevPhoto")}
                    nextLabel={t("nextPhoto")}
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-forest/60">{t("empty")}</p>
              )}
            </div>

            <div className="mt-10 bg-tamblingan py-12 text-mist">
              <div className="mx-auto max-w-4xl px-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold sm:text-2xl">{t("videosTitle")}</h3>
                  <p className="mt-2 text-sm text-mist/70 sm:text-base">
                    {t("videosSubtitle")}
                  </p>
                </div>
                <div className="mt-8">
                  {section.videos.length > 0 ? (
                    <HomeVideoCarousel
                      videos={section.videos}
                      ariaLabel={`${section.title} — ${t("videosTitle")}`}
                      comingSoonLabel={t("videoPlaceholder")}
                    />
                  ) : (
                    <p className="mt-4 text-center text-sm text-mist/70">
                      {t("empty")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
