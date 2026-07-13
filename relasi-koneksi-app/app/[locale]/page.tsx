import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
import { extractYouTubeId } from "@/lib/youtube";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    alternates: localeAlternates(""),
  };
}

/** Vertical offsets that stagger cards like terraced subak slopes */
const SUBAK_OFFSETS = ["md:translate-y-0", "md:translate-y-16", "md:translate-y-32"];

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
  const latestArticles = await getLatestArticles(3);
  const afterMovieId = extractYouTubeId(downloads.afterMovieYoutubeUrl);

  return (
    <>
      {/* Zoom-through gapura entrance (client, framer-motion) */}
      <GapuraEntrance
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        ctaLabel={t("heroCta")}
        scrollHint={t("scrollHint")}
      />

      {/* Featured Destinations — staggered subak terraces */}
      <section className="relative z-20 -mt-24 rounded-t-[4rem] bg-mist pb-40 pt-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title={t("attractionsTitle")}
            subtitle={t("attractionsSubtitle")}
          />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {attractions.slice(0, 3).map((attraction, i) => (
              <div key={attraction.id} className={SUBAK_OFFSETS[i % 3]}>
                <AttractionCard attraction={attraction} arch />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest articles — blue-grey terrace bleeding over the previous layer */}
      <section className="relative z-30 -mt-24 rounded-t-[4rem] bg-tamblingan/10 pb-32 pt-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading title={t("articlesTitle")} subtitle={t("articlesSubtitle")} />
          {latestArticles.length > 0 ? (
            <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-forest/60">{tArticles("empty")}</p>
          )}
          <div className="mt-8">
            <Link
              href="/articles"
              className="font-semibold text-tamblingan transition-all duration-300 ease-in-out hover:text-tamblingan-dark"
            >
              {tCommon("viewAll")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Stay in the Village — staggered archway homestays */}
      <section className="relative z-40 -mt-24 rounded-t-[4rem] bg-mist pb-40 pt-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading title={t("homestayTitle")} subtitle={t("homestaySubtitle")} />
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:px-16">
            {homestays.slice(0, 2).map((homestay, i) => (
              <div key={homestay.id} className={i % 2 === 1 ? "md:translate-y-20" : ""}>
                <HomestayCard homestay={homestay} arch />
              </div>
            ))}
          </div>
          <div className="mt-16 text-center md:mt-32">
            <Link
              href="/homestay"
              className="font-semibold text-tamblingan transition-all duration-300 ease-in-out hover:text-tamblingan-dark"
            >
              {t("homestayCta")} →
            </Link>
          </div>
        </div>
      </section>

      {/* After-movie — deep lake layer closing the page */}
      {afterMovieId && (
        <section className="relative z-50 -mt-24 rounded-t-[4rem] bg-tamblingan py-20 text-mist">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{t("afterMovieTitle")}</h2>
            <p className="mt-2 text-mist/70">{t("afterMovieSubtitle")}</p>
            <div className="relative mt-8 aspect-video">
              <LazyYouTubeEmbed videoId={afterMovieId} title={t("afterMovieTitle")} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
