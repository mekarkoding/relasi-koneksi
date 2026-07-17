import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { maps } from "@/data/maps";
import { SectionHeading } from "@/components/SectionHeading";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "media.peta" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/media/peta"),
  };
}

export default async function PetaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("media.peta");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      {maps.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {maps.map((map) => {
            const title = pickLocale(locale, map.title_id, map.title_en);
            const description = pickLocale(
              locale,
              map.description_id,
              map.description_en,
            );

            return (
              <article
                key={map.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {map.fileType === "image" && map.image ? (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={map.image}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      placeholder="blur"
                    />
                  </div>
                ) : (
                  map.cover && (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={map.cover}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                        placeholder="blur"
                      />
                    </div>
                  )
                )}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-forest">{title}</h2>
                  <p className="mt-2 text-sm text-forest/70">{description}</p>
                  <a
                    href={map.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-xl bg-tamblingan px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-tamblingan-light"
                  >
                    {map.fileType === "pdf" ? t("viewPdf") : t("viewImage")} ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="py-12 text-center text-forest/60">{t("empty")}</p>
      )}
    </div>
  );
}
