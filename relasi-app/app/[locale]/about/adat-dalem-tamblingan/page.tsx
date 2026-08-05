import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/SectionHeading";
import { LazyYouTubeEmbed } from "@/components/LazyYouTubeEmbed";
import { Reveal } from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo";

/** Video ID from the old landing-page Culture slider (Website-Catur-Desa). */
const LEGEND_VIDEO_ID = "xNOvLLW8-Wc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.adat" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/about/adat-dalem-tamblingan"),
  };
}

export default async function AdatDalemTamblinganPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.adat");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Reveal>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <p className="-mt-4 mb-8 text-sm font-medium tracking-wide text-tamblingan">
          {t("villagesLabel")}
        </p>
      </Reveal>

      <Reveal className="space-y-4 text-justify leading-relaxed text-forest/80" delay={0.08}>
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
      </Reveal>

      <Reveal className="mt-12 space-y-6" delay={0.05}>
        <div>
          <h2 className="text-xl font-bold text-forest">{t("videosTitle")}</h2>
          <p className="mt-1 text-justify text-sm text-forest/60">{t("videosSubtitle")}</p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-forest">
            {t("videoLegendTitle")}
          </h3>
          <p className="mt-1 text-justify text-sm text-forest/70">{t("videoLegendDesc")}</p>
          <div className="relative mt-3 aspect-video overflow-hidden rounded-xl">
            <LazyYouTubeEmbed
              videoId={LEGEND_VIDEO_ID}
              title={t("videoLegendTitle")}
            />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10" delay={0.08} distance={48}>
        <figure>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-sm sm:aspect-square">
            <Image
              src="/images/about/peta-tamblingan.webp"
              alt={t("mapAlt")}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
          <figcaption className="mt-3 text-center text-sm text-forest/60">
            {t("mapCaption")}
          </figcaption>
        </figure>
      </Reveal>

      <Reveal className="mt-12 space-y-4" delay={0.05}>
        <h2 className="text-xl font-bold text-forest">{t("caturTitle")}</h2>
        <p className="text-justify leading-relaxed text-forest/80">{t("caturBody")}</p>
      </Reveal>

      <Reveal className="mt-10 space-y-4" delay={0.08}>
        <h2 className="text-xl font-bold text-forest">{t("valuesTitle")}</h2>
        <p className="text-justify leading-relaxed text-forest/80">{t("valuesBody")}</p>
      </Reveal>
    </div>
  );
}
