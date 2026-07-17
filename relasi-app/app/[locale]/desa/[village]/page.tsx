import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllDesa, getDesaByVillage } from "@/lib/sanity/queries";
import { VILLAGES, pickPortableText, type VillageName } from "@/lib/sanity/types";
import { urlForImage, hasImageAsset } from "@/lib/sanity/image";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { MediaGallery } from "@/components/MediaGallery";
import { DesaCard } from "@/components/DesaCard";
import { BackButton } from "@/components/BackButton";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export const revalidate = 60; // ISR (PRD 3.2)
export const dynamicParams = false;

interface Props {
  params: Promise<{ locale: Locale; village: string }>;
}

function isVillage(village: string): village is VillageName {
  return (VILLAGES as readonly string[]).includes(village);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    VILLAGES.map((village) => ({ locale, village })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, village } = await params;
  if (!isVillage(village)) return {};
  const t = await getTranslations({ locale, namespace: "desa" });
  return {
    title: t(`villages.${village}`),
    alternates: localeAlternates(`/desa/${village}`),
  };
}

export default async function DesaPage({ params }: Props) {
  const { locale, village } = await params;
  if (!isVillage(village)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("desa");
  const tCommon = await getTranslations("common");
  const villageLabel = t(`villages.${village}`);

  const [desa, allDesa] = await Promise.all([
    getDesaByVillage(village),
    getAllDesa(),
  ]);

  const otherVillages = VILLAGES.filter((v) => v !== village)
    .map((v) => allDesa.find((d) => d.villageName === v))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const backButton = <BackButton label={tCommon("back")} fallbackHref="/" />;

  if (!desa) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6">{backButton}</div>
        <h1 className="text-3xl font-extrabold text-forest">{villageLabel}</h1>
        <p className="mt-6 text-forest/60">{t("empty")}</p>
      </div>
    );
  }

  const description = pickPortableText(
    desa.description_id,
    desa.description_en,
    locale,
  );
  const galleryImages = (desa.gallery ?? [])
    .filter(hasImageAsset)
    .map((image) => ({
      url: urlForImage(image).width(800).height(600).url(),
      alt: ("alt" in image && typeof image.alt === "string" && image.alt) || villageLabel,
    }));

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6">{backButton}</div>

      <h1 className="text-3xl font-extrabold text-forest sm:text-4xl">{villageLabel}</h1>

      <div className="animate-fade-in relative mt-6 aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={urlForImage(desa.mainImage).width(1600).height(1067).url()}
          alt={desa.mainImage.alt || villageLabel}
          fill
          priority
          unoptimized
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      <div className="mt-8">
        <PortableTextRenderer value={description} />
      </div>

      {desa.dataFields && desa.dataFields.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-forest">{t("dataTitle")}</h2>
          <dl className="overflow-hidden rounded-2xl border border-mist-dark">
            {desa.dataFields.map((field, i) => (
              <div
                key={field._key}
                className={`flex flex-col gap-1 px-5 py-3 sm:flex-row sm:justify-between ${
                  i % 2 === 0 ? "bg-white" : "bg-mist/40"
                }`}
              >
                <dt className="text-sm font-semibold text-forest">
                  {pickLocale(locale, field.label_id, field.label_en)}
                </dt>
                <dd className="text-sm text-forest/80">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-forest">{t("galleryTitle")}</h2>
          <MediaGallery images={galleryImages} label={`${t("galleryTitle")} — ${villageLabel}`} />
        </section>
      )}

      {otherVillages.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-forest">{t("otherVillages")}</h2>
          <div className="grid grid-cols-3 gap-4">
            {otherVillages.map((d) => (
              <DesaCard key={d._id} desa={d} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
