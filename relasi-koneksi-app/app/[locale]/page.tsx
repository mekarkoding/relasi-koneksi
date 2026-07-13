import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { attractions } from "@/data/attractions";
import { homestays } from "@/data/homestays";
import { downloads } from "@/data/downloads";
import { getLatestArticles } from "@/lib/sanity/queries";
import { AttractionCard } from "@/components/AttractionCard";
import { ArticleCard } from "@/components/ArticleCard";
import { HomestayCard } from "@/components/HomestayCard";
import { SectionHeading } from "@/components/SectionHeading";
import { LazyYouTubeEmbed } from "@/components/LazyYouTubeEmbed";
import { GapuraEntrance } from "@/components/home/GapuraEntrance";
import { Reveal } from "@/components/Reveal";
import { extractYouTubeId } from "@/lib/youtube";
import { localeAlternates } from "@/lib/seo";
import gapura from "@/public/images/gapura.png";
import heroMist from "@/public/images/hero-mist.png";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: {
      absolute: "RELASI",
    },
    description: t("heroSubtitle"),
    alternates: localeAlternates(""),
  };
}

/** Vertical offsets that stagger cards like terraced subak slopes */
const SUBAK_OFFSETS = ["md:translate-y-0", "md:translate-y-12", "md:translate-y-24"];

async function LatestArticlesSection({
  title,
  subtitle,
  emptyLabel,
  viewAllLabel,
}: {
  title: string;
  subtitle: string;
  emptyLabel: string;
  viewAllLabel: string;
}) {
  const latestArticles = await getLatestArticles(3);

  return (
    <section className="relative z-30 -mt-16 rounded-t-[4rem] bg-tamblingan/10 pb-32 pt-20 md:-mt-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading title={title} subtitle={subtitle} />
        </Reveal>
        {latestArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article, i) => (
              <Reveal key={article._id} delay={0.1 + i * 0.1}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <p className="text-forest/60">{emptyLabel}</p>
          </Reveal>
        )}
        <Reveal delay={0.35}>
          <div className="mt-8">
            <Link
              href="/articles"
              className="font-semibold text-tamblingan transition-colors duration-300 hover:text-tamblingan-dark"
            >
              {viewAllLabel} →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArticlesSectionFallback() {
  return (
    <section className="relative z-30 -mt-16 rounded-t-[4rem] bg-tamblingan/10 pb-32 pt-20 md:-mt-24">
      <div className="mx-auto max-w-6xl animate-pulse px-4" aria-hidden>
        <div className="mb-3 h-8 w-48 rounded-lg bg-mist-dark" />
        <div className="mb-8 h-4 w-72 max-w-full rounded bg-mist-dark/80" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-mist-dark/70" />
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
  const tArticles = await getTranslations("articles");
  const tCommon = await getTranslations("common");
  const afterMovieId = extractYouTubeId(downloads.afterMovieYoutubeUrl);

  return (
    <>
      {/* Preload entrance art so the gapura paints before JS/hydration finishes */}
      <link rel="preload" as="image" href={gapura.src} fetchPriority="high" />
      <link rel="preload" as="image" href={heroMist.src} fetchPriority="high" />

      <GapuraEntrance
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        ctaLabel={t("heroCta")}
        scrollHint={t("scrollHint")}
      />

      {/* Featured Destinations */}
      <section className="relative z-20 -mt-24 rounded-t-[4rem] bg-mist pb-32 pt-20 md:pb-72">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading
              title={t("attractionsTitle")}
              subtitle={t("attractionsSubtitle")}
            />
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {attractions.slice(0, 3).map((attraction, i) => (
              <Reveal
                key={attraction.id}
                delay={0.12 + i * 0.12}
                className={SUBAK_OFFSETS[i % 3]}
              >
                <AttractionCard attraction={attraction} arch />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Articles stream separately so Sanity never blocks the gapura paint */}
      <Suspense fallback={<ArticlesSectionFallback />}>
        <LatestArticlesSection
          title={t("articlesTitle")}
          subtitle={t("articlesSubtitle")}
          emptyLabel={tArticles("empty")}
          viewAllLabel={tCommon("viewAll")}
        />
      </Suspense>

      {/* Homestay */}
      <section className="relative z-40 -mt-24 rounded-t-[4rem] bg-mist pb-40 pt-20 md:pb-64">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading title={t("homestayTitle")} subtitle={t("homestaySubtitle")} />
          </Reveal>
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:px-16">
            {homestays.slice(0, 2).map((homestay, i) => (
              <Reveal
                key={homestay.id}
                delay={0.12 + i * 0.12}
                className={i % 2 === 1 ? "md:translate-y-20" : ""}
              >
                <HomestayCard homestay={homestay} arch />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.35}>
            <div className="mt-16 text-center md:mt-32">
              <Link
                href="/homestay"
                className="font-semibold text-tamblingan transition-colors duration-300 hover:text-tamblingan-dark"
              >
                {t("homestayCta")} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* After-movie */}
      {afterMovieId && (
        <section className="relative z-50 -mt-24 rounded-t-[4rem] bg-tamblingan py-20 text-mist">
          <div className="mx-auto max-w-4xl px-4 text-center">
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
