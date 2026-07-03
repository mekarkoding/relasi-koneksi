import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { attractions } from "@/data/attractions";
import { AttractionCard } from "@/components/AttractionCard";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "attractions" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/attractions"),
  };
}

export default async function AttractionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("attractions");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {attractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </div>
    </div>
  );
}
