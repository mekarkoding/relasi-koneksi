import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "@/components/SectionHeading";
import { localeAlternates } from "@/lib/seo";

const MAP_QUERY = "Adat Dalem Tamblingan, Buleleng, Bali";
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
    alternates: localeAlternates("/about/kkn-mekar-banjar"),
  };
}

export default async function KknMekarBanjarPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.kkn");
  const tFooter = await getTranslations("footer");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <section className="animate-slide-up space-y-4 leading-relaxed text-forest/80">
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
      </section>

      <section className="animate-slide-up mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-forest">{t("contactTitle")}</h2>
        <p className="mt-3 text-sm text-forest/80">
          <span className="font-semibold">{t("addressLabel")}:</span> {tFooter("address")}
        </p>

        <div className="relative mt-5 aspect-video overflow-hidden rounded-xl">
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
    </div>
  );
}
