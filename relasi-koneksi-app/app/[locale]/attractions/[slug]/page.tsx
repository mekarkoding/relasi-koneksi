import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { attractions } from "@/data/attractions";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    attractions.map((attraction) => ({ locale, slug: attraction.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const attraction = attractions.find((a) => a.slug === slug);
  if (!attraction) return {};
  return {
    title: pickLocale(locale, attraction.name_id, attraction.name_en),
    description: pickLocale(locale, attraction.description_id, attraction.description_en),
    alternates: localeAlternates(`/attractions/${slug}`),
  };
}

export default async function AttractionDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const attraction = attractions.find((a) => a.slug === slug);
  if (!attraction) notFound();

  const t = await getTranslations("attractions");
  const name = pickLocale(locale, attraction.name_id, attraction.name_en);
  const description = pickLocale(
    locale,
    attraction.description_id,
    attraction.description_en,
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <div className="animate-fade-in relative aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={attraction.photos[0]}
          alt={name}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
          placeholder="blur"
        />
      </div>

      <h1 className="animate-slide-up mt-8 text-3xl font-extrabold text-jungle">{name}</h1>
      <p className="mt-4 leading-relaxed text-volcanic/80">{description}</p>

      <a
        href={attraction.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-xl bg-jungle px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-jungle-light"
      >
        {t("viewOnMap")} ↗
      </a>

      {attraction.photos.length > 1 && (
        <div className="stagger mt-10 grid grid-cols-2 gap-4">
          {attraction.photos.slice(1).map((photo, i) => (
            <div key={i} className="relative aspect-[3/2] overflow-hidden rounded-xl">
              <Image
                src={photo}
                alt={`${name} — ${i + 2}`}
                fill
                sizes="(max-width: 896px) 50vw, 440px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
