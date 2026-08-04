import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo";

/** Previous cohort site (KKN Mekar Banjar UGM 2025). */
const LEGACY_SITE_URL = "https://github.com/antoniusbayu76/Website-Catur-Desa";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.kkn2025" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/about/kkn-mekar-banjar-2025"),
  };
}

export default async function KknMekarBanjar2025Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.kkn2025");

  const themes = [
    { title: t("themeCulture"), body: t("themeCultureBody") },
    { title: t("themeEnvironment"), body: t("themeEnvironmentBody") },
    { title: t("themeSocial"), body: t("themeSocialBody") },
    { title: t("themeGlimpse"), body: t("themeGlimpseBody") },
  ] as const;

  const villages = [
    t("villageGobleg"),
    t("villageMunduk"),
    t("villageGesing"),
    t("villageUmejero"),
  ] as const;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-tamblingan/10 bg-gradient-to-br from-lake via-mist to-mist-dark">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-tamblingan/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-marigold/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <p className="animate-fade-in text-xs font-semibold uppercase tracking-[0.2em] text-tamblingan">
            {t("badge")}
          </p>
          <h1 className="animate-slide-up mt-4 text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            {t("title")}
          </h1>
          <p className="animate-slide-up mt-4 max-w-2xl text-justify text-lg leading-relaxed text-forest/70 sm:text-xl">
            {t("hook")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
        <Reveal>
          <section className="space-y-5 text-justify text-base leading-relaxed text-forest/80 sm:text-lg">
            <p>{t("why1")}</p>
            <p>{t("why2")}</p>
          </section>
        </Reveal>

        <Reveal className="mt-14" delay={0.05}>
          <h2 className="text-xl font-bold text-forest sm:text-2xl">
            {t("legacyTitle")}
          </h2>
          <p className="mt-3 text-justify text-base leading-relaxed text-forest/80 sm:text-lg">
            {t("legacyBody")}
          </p>
          <a
            href={LEGACY_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-xl bg-tamblingan px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-tamblingan-light"
          >
            {t("viewRepo")} ↗
          </a>
        </Reveal>

        <Reveal className="mt-14" delay={0.05}>
          <h2 className="text-xl font-bold text-forest sm:text-2xl">
            {t("themesTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-justify text-sm text-forest/60 sm:text-base">
            {t("themesSubtitle")}
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {themes.map((theme, i) => (
              <div key={theme.title}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-marigold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-base font-bold text-forest">
                  {theme.title}
                </h3>
                <p className="mt-2 text-justify text-sm leading-relaxed text-forest/70">
                  {theme.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14" delay={0.05}>
          <h2 className="text-xl font-bold text-forest sm:text-2xl">
            {t("villagesTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-justify text-sm text-forest/60 sm:text-base">
            {t("villagesSubtitle")}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {villages.map((village) => (
              <li
                key={village}
                className="border-l-2 border-tamblingan/40 pl-4 text-base font-semibold text-tamblingan"
              >
                {village}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14" delay={0.05}>
          <blockquote className="border-l-4 border-marigold pl-5 sm:pl-6">
            <p className="text-justify text-base leading-relaxed text-forest/80 sm:text-lg">
              {t("credit")}
            </p>
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}
