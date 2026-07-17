import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

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
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <section className="animate-slide-up space-y-4 leading-relaxed text-forest/80">
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
      </section>
    </div>
  );
}
