import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { downloads } from "@/data/downloads";
import { LazyYouTubeEmbed } from "@/components/LazyYouTubeEmbed";
import { extractYouTubeId } from "@/lib/youtube";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "downloads" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/downloads"),
  };
}

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("downloads");
  const afterMovieId = extractYouTubeId(downloads.afterMovieYoutubeUrl);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* After-movie (lazy facade embed, PRD 4.6) */}
        <section className="animate-slide-up">
          <h3 className="text-xl font-bold text-forest">{t("afterMovieTitle")}</h3>
          <p className="mt-2 text-sm text-forest/70">{t("afterMovieDescription")}</p>
          {afterMovieId && (
            <div className="relative mt-5 aspect-video">
              <LazyYouTubeEmbed videoId={afterMovieId} title={t("afterMovieTitle")} />
            </div>
          )}
        </section>

        {/* Digital guidebook (static PDF in the repo, PRD 4.6) */}
        <section className="animate-slide-up">
          <h3 className="text-xl font-bold text-forest">{t("guidebookTitle")}</h3>
          <p className="mt-2 text-sm text-forest/70">{t("guidebookDescription")}</p>
          <div className="mt-5 flex items-start gap-6 rounded-2xl bg-white p-6 shadow-sm">
            <Image
              src={downloads.guidebookCover}
              alt={t("guidebookTitle")}
              width={160}
              height={226}
              sizes="160px"
              className="rounded-lg shadow"
            />
            <div>
              <a
                href={downloads.guidebookPdfPath}
                download
                className="inline-block rounded-xl bg-marigold px-5 py-2.5 text-sm font-semibold text-forest transition-all duration-300 ease-in-out hover:bg-marigold-dark"
              >
                {t("downloadGuidebook")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
