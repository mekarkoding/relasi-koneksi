import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

const MAP_LINK = "https://maps.google.com/?q=-8.5,115.2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tFooter = await getTranslations("footer");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <section className="animate-slide-up">
        <h3 className="text-xl font-bold text-jungle">{t("villageProfileTitle")}</h3>
        <p className="mt-3 leading-relaxed text-volcanic/80">{t("villageProfileBody")}</p>
      </section>

      <section className="animate-slide-up mt-10">
        <h3 className="text-xl font-bold text-jungle">{t("kknTitle")}</h3>
        <p className="mt-3 leading-relaxed text-volcanic/80">{t("kknBody")}</p>
      </section>

      <section className="animate-slide-up mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-jungle">{t("contactTitle")}</h3>
        <p className="mt-3 text-sm text-volcanic/80">
          <span className="font-semibold">{t("addressLabel")}:</span> {tFooter("address")}
        </p>
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-xl bg-jungle px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-jungle-light"
        >
          {t("viewMap")} ↗
        </a>
      </section>
    </div>
  );
}
