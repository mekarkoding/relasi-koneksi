import type { Metadata } from "next";
import Image from "next/image";
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
import { extractYouTubeId } from "@/lib/youtube";
import { localeAlternates } from "@/lib/seo";
import heroImage from "@/public/images/hero.png";

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
      {/* Hero — above-the-fold image uses priority (STRICT RULE 3.2 #3) */}
      <section className="relative flex h-[70vh] min-h-[420px] items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt={t("heroTitle")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-volcanic/70 via-volcanic/30 to-transparent" />
        <div className="animate-fade-in relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-base text-white/85 sm:text-lg">{t("heroSubtitle")}</p>
          <Link
            href="/attractions"
            className="mt-8 inline-block rounded-xl bg-terracotta px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-terracotta-dark hover:shadow-lg"
          >
            {t("heroCta")}
          </Link>
        </div>
      </section>

      {/* Attraction highlights */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading title={t("attractionsTitle")} subtitle={t("attractionsSubtitle")} />
        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {attractions.slice(0, 3).map((attraction) => (
            <AttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>
      </section>

      {/* Latest 3 articles (Sanity) */}
      <section className="bg-sand-dark/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading title={t("articlesTitle")} subtitle={t("articlesSubtitle")} />
          {latestArticles.length > 0 ? (
            <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-volcanic/60">{tArticles("empty")}</p>
          )}
          <div className="mt-8">
            <Link
              href="/articles"
              className="font-semibold text-terracotta transition-all duration-300 ease-in-out hover:text-terracotta-dark"
            >
              {tCommon("viewAll")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Homestay teaser */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading title={t("homestayTitle")} subtitle={t("homestaySubtitle")} />
        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homestays.slice(0, 2).map((homestay) => (
            <HomestayCard key={homestay.id} homestay={homestay} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/homestay"
            className="font-semibold text-terracotta transition-all duration-300 ease-in-out hover:text-terracotta-dark"
          >
            {t("homestayCta")} →
          </Link>
        </div>
      </section>

      {/* After-movie teaser (lazy facade embed) */}
      {afterMovieId && (
        <section className="bg-jungle py-16 text-sand">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{t("afterMovieTitle")}</h2>
            <p className="mt-2 text-sand/70">{t("afterMovieSubtitle")}</p>
            <div className="relative mt-8 aspect-video">
              <LazyYouTubeEmbed videoId={afterMovieId} title={t("afterMovieTitle")} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
