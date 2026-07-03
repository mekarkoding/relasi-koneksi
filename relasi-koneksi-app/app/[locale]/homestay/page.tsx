import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { homestays } from "@/data/homestays";
import { HomestayCard } from "@/components/HomestayCard";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homestay" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/homestay"),
  };
}

export default async function HomestayPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("homestay");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {homestays.map((homestay) => (
          <HomestayCard key={homestay.id} homestay={homestay} />
        ))}
      </div>
    </div>
  );
}
