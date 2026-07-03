import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { bookletPages } from "@/data/booklet";
import { FlipBook } from "@/components/FlipBook";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booklet" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/booklet"),
  };
}

export default async function BookletPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booklet");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <FlipBook pages={bookletPages} />
    </div>
  );
}
