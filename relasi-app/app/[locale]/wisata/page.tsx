import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAllWisata } from "@/lib/sanity/queries";
import { WisataCard } from "@/components/WisataCard";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR (PRD 3.2)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wisata" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/wisata"),
  };
}

export default async function WisataPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("wisata");
  const wisata = await getAllWisata();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      {wisata.length > 0 ? (
        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wisata.map((w) => (
            <WisataCard key={w._id} wisata={w} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-forest/60">{t("empty")}</p>
      )}
    </div>
  );
}
