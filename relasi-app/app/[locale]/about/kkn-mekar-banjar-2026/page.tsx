import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";
import { KknMemberCard } from "@/components/about/KknMemberCard";
import { KknProgramList } from "@/components/about/KknProgramList";
import { kknTeam } from "@/data/kkn-team";
import { localeAlternates } from "@/lib/seo";

const MAP_QUERY = "Desa Munduk, Banjar, Buleleng, Bali";
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAP_QUERY,
)}&output=embed`;
const MAP_LINK = `https://maps.google.com/?q=${encodeURIComponent(MAP_QUERY)}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.kkn" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/about/kkn-mekar-banjar-2026"),
  };
}

export default async function KknMekarBanjar2026Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.kkn");
  const tFooter = await getTranslations("footer");

  const pillars = [
    { title: t("pillar1Title"), body: t("pillar1Body") },
    { title: t("pillar2Title"), body: t("pillar2Body") },
    { title: t("pillar3Title"), body: t("pillar3Body") },
  ] as const;

  const clusters = [
    { key: "saintek", label: t("clusterSaintek"), hint: t("clusterSaintekHint") },
    { key: "soshum", label: t("clusterSoshum"), hint: t("clusterSoshumHint") },
    { key: "agro", label: t("clusterAgro"), hint: t("clusterAgroHint") },
    { key: "medika", label: t("clusterMedika"), hint: t("clusterMedikaHint") },
  ] as const;

  const programs = [
    { name: t("progRelasiName"), meaning: t("progRelasiMeaning"), blurb: t("progRelasiBlurb") },
    { name: t("progRakitName"), meaning: t("progRakitMeaning"), blurb: t("progRakitBlurb") },
    { name: t("progSaehName"), meaning: t("progSaehMeaning"), blurb: t("progSaehBlurb") },
    { name: t("progSparkName"), meaning: t("progSparkMeaning"), blurb: t("progSparkBlurb") },
    { name: t("progGemparName"), meaning: t("progGemparMeaning"), blurb: t("progGemparBlurb") },
    { name: t("progGaraName"), meaning: t("progGaraMeaning"), blurb: t("progGaraBlurb") },
    { name: t("progSigapName"), meaning: t("progSigapMeaning"), blurb: t("progSigapBlurb") },
    { name: t("progCakraName"), meaning: t("progCakraMeaning"), blurb: t("progCakraBlurb") },
  ];

  return (
    <div>
      {/* Opening band */}
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
          <blockquote className="border-l-4 border-marigold pl-5 sm:pl-6">
            <p className="text-justify text-xl font-bold leading-snug text-forest sm:text-2xl">
              {t("theme")}
            </p>
            <p className="mt-3 text-justify text-sm text-forest/55">{t("themeNote")}</p>
          </blockquote>
        </Reveal>

        <Reveal className="mt-14" delay={0.05}>
          <h2 className="text-xl font-bold text-forest sm:text-2xl">
            {t("pillarsTitle")}
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <div key={pillar.title}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-marigold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-base font-bold text-forest">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-justify text-sm leading-relaxed text-forest/70">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16" delay={0.05}>
          <KknProgramList
            title={t("programsTitle")}
            subtitle={t("programsSubtitle")}
            programs={programs}
          />
        </Reveal>

        <Reveal className="mt-16" delay={0.05}>
          <h2 className="text-xl font-bold text-forest sm:text-2xl">
            {t("clustersTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-justify text-sm text-forest/60 sm:text-base">
            {t("clustersSubtitle")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {clusters.map((cluster) => (
              <div
                key={cluster.key}
                className="border-l-2 border-tamblingan/40 pl-4"
              >
                <h3 className="font-bold text-tamblingan">{cluster.label}</h3>
                <p className="mt-1 text-justify text-sm leading-relaxed text-forest/70">
                  {cluster.hint}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Team */}
      <section className="border-y border-tamblingan/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <Reveal>
            <h2 className="text-xl font-bold text-forest sm:text-2xl">
              {t("teamTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-justify text-sm text-forest/60 sm:text-base">
              {t("teamSubtitle")}
            </p>
          </Reveal>
          <Reveal className="mt-10" delay={0.08}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {kknTeam.map((member) => {
                const major =
                  locale === "en" ? member.major_en : member.major_id;
                const displayName = `${member.nameBefore}${member.nickname}${member.nameAfter}`;
                return (
                  <KknMemberCard
                    key={member.id}
                    member={member}
                    major={major}
                    photoAlt={t("memberPhotoAlt", { name: displayName })}
                  />
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <div className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
        <Reveal>
          <section>
            <h2 className="text-xl font-bold text-forest sm:text-2xl">
              {t("contactTitle")}
            </h2>
            <p className="mt-3 text-justify text-sm text-forest/80">
              <span className="font-semibold">{t("addressLabel")}:</span>{" "}
              {tFooter("address")}
            </p>
            <p className="mt-2 text-justify text-sm text-forest/70">{t("locus")}</p>

            <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl">
              <iframe
                src={MAP_EMBED_SRC}
                title={t("mapTitle")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
                allowFullScreen
              />
            </div>

            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-tamblingan px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-tamblingan-light"
            >
              {t("viewMap")} ↗
            </a>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
