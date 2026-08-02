import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  getBerandaBackgrounds,
  getFeaturedWisata,
  getAllDesa,
} from "@/lib/sanity/queries";
import { VILLAGES, type BerandaBackgrounds } from "@/lib/sanity/types";
import { afterMovieYoutubeUrl } from "@/data/downloads";
import { WisataCard } from "@/components/WisataCard";
import { DesaCard } from "@/components/DesaCard";
import { InstagramFeed } from "@/components/InstagramFeed";
import { SectionHeading } from "@/components/SectionHeading";
import { LazyYouTubeEmbed } from "@/components/LazyYouTubeEmbed";
import { GapuraEntrance } from "@/components/home/GapuraEntrance";
import { FeaturedWisataCarousel } from "@/components/home/FeaturedWisataCarousel";
import { FeaturedDesaCarousel } from "@/components/home/FeaturedDesaCarousel";
import {
  SectionBackgroundImage,
  berandaBgUrl,
} from "@/components/home/SectionBackgroundImage";
import { Reveal } from "@/components/Reveal";
import { extractYouTubeId } from "@/lib/youtube";
import { localeAlternates } from "@/lib/seo";
import gapura from "@/public/images/gapura.png";
import heroMist from "@/public/images/hero-mist.png";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: {
      absolute: "Tamblingan",
    },
    description: t("heroSubtitle"),
    alternates: localeAlternates(""),
  };
}

/** Vertical offsets that stagger cards like terraced subak slopes */
const SUBAK_OFFSETS = ["md:translate-y-0", "md:translate-y-12", "md:translate-y-24"];

async function FeaturedWisataSection({
  title,
  subtitle,
  emptyLabel,
  ctaLabel,
  background,
}: {
  title: string;
  subtitle: string;
  emptyLabel: string;
  ctaLabel: string;
  background: BerandaBackgrounds["wisataBackground"];
}) {
  const featured = await getFeaturedWisata(3);

  return (
    <section className="relative z-30 -mt-24 overflow-hidden rounded-t-[4rem] bg-mist-dark pb-28 pt-20 md:pb-48">
      <SectionBackgroundImage image={background} />
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading title={title} subtitle={subtitle} />
        </Reveal>
        {featured.length > 0 ? (
          <>
            <Reveal>
              <FeaturedWisataCarousel items={featured} />
            </Reveal>
            <div className="hidden gap-10 md:grid md:grid-cols-3 md:gap-8">
              {featured.map((wisata, i) => (
                <Reveal
                  key={wisata._id}
                  delay={0.12 + i * 0.12}
                  className={SUBAK_OFFSETS[i % 3]}
                >
                  <WisataCard wisata={wisata} arch />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <Reveal>
            <p className="text-forest/60">{emptyLabel}</p>
          </Reveal>
        )}
        <Reveal delay={0.35}>
          <div className="mt-16 text-center md:mt-20">
            <Link
              href="/wisata"
              className="inline-flex items-center gap-2 rounded-xl bg-tamblingan px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-tamblingan-light"
            >
              {ctaLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

async function EmpatDesaSection({
  title,
  subtitle,
  background,
}: {
  title: string;
  subtitle: string;
  background: BerandaBackgrounds["desaBackground"];
}) {
  const allDesa = await getAllDesa();
  const ordered = VILLAGES.map((v) =>
    allDesa.find((d) => d.villageName === v),
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  if (ordered.length === 0) return null;

  return (
    <section className="relative z-40 -mt-24 overflow-hidden rounded-t-[4rem] bg-[#d9e3e9] pb-40 pt-20 md:pb-56">
      <SectionBackgroundImage image={background} />
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading title={title} subtitle={subtitle} />
        </Reveal>
        <Reveal>
          <FeaturedDesaCarousel items={ordered} />
        </Reveal>
        <div className="hidden gap-6 md:grid md:grid-cols-4">
          {ordered.map((desa, i) => (
            <Reveal key={desa._id} delay={0.1 + i * 0.1}>
              <DesaCard desa={desa} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionSkeleton({ variant = "mist" }: { variant?: "mist" | "wisata" | "desa" }) {
  const bg =
    variant === "wisata"
      ? "bg-mist-dark"
      : variant === "desa"
        ? "bg-[#d9e3e9]"
        : "bg-mist";

  return (
    <section className={`relative -mt-24 rounded-t-[4rem] pb-32 pt-20 ${bg}`}>
      <div className="mx-auto max-w-6xl animate-pulse px-4" aria-hidden>
        <div className="mb-3 h-8 w-48 rounded-lg bg-mist-dark" />
        <div className="mb-8 h-4 w-72 max-w-full rounded bg-mist-dark/80" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-mist-dark/70" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tInstagram = await getTranslations("instagram");
  const afterMovieId = extractYouTubeId(afterMovieYoutubeUrl);
  const backgrounds = (await getBerandaBackgrounds()) ?? {};
  const heroSrc = berandaBgUrl(backgrounds.heroBackground);

  return (
    <>
      {/* Preload entrance art so the gapura paints before JS/hydration finishes */}
      <link rel="preload" as="image" href={gapura.src} fetchPriority="high" />
      <link
        rel="preload"
        as="image"
        href={heroSrc || heroMist.src}
        fetchPriority="high"
      />

      <GapuraEntrance
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        ctaLabel={t("heroCta")}
        scrollHint={t("scrollHint")}
        heroBackgroundSrc={heroSrc}
      />

      {/* Instagram feed streams so the Graph API never blocks the gapura paint */}
      <section className="relative z-20 -mt-16 overflow-hidden rounded-t-[4rem] bg-mist pb-40 pt-20 md:-mt-24 md:pb-48">
        <SectionBackgroundImage image={backgrounds.instagramBackground} />
        <div className="relative mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading title={tInstagram("title")} subtitle={tInstagram("subtitle")} />
          </Reveal>
          <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-mist-dark/60" />}>
            <InstagramFeed />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<SectionSkeleton variant="wisata" />}>
        <FeaturedWisataSection
          title={t("wisataTitle")}
          subtitle={t("wisataSubtitle")}
          emptyLabel={t("wisataEmpty")}
          ctaLabel={t("wisataCta")}
          background={backgrounds.wisataBackground}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="desa" />}>
        <EmpatDesaSection
          title={t("desaTitle")}
          subtitle={t("desaSubtitle")}
          background={backgrounds.desaBackground}
        />
      </Suspense>

      {afterMovieId && (
        <section className="relative z-50 -mt-24 overflow-hidden rounded-t-[4rem] bg-tamblingan py-20 text-mist">
          <SectionBackgroundImage image={backgrounds.afterMovieBackground} darken />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <Reveal>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{t("afterMovieTitle")}</h2>
              <p className="mt-2 text-mist/70">{t("afterMovieSubtitle")}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative mt-8 aspect-video">
                <LazyYouTubeEmbed videoId={afterMovieId} title={t("afterMovieTitle")} />
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
