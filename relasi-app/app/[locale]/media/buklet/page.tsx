import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { booklets, getBookletBySlug } from "@/data/booklet";
import { downloads } from "@/data/downloads";
import { SectionHeading } from "@/components/SectionHeading";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

/** Featured digital guidebook — pinned alone above the flip-book grid. */
const FEATURED_GUIDEBOOK_SLUG = "panduan-desa";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "media.buklet" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localeAlternates("/media/buklet"),
  };
}

export default async function BukletListingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("media.buklet");

  const featuredFlipBook = getBookletBySlug(FEATURED_GUIDEBOOK_SLUG);
  const guidebookTitle = pickLocale(
    locale,
    downloads.guidebookTitle_id,
    downloads.guidebookTitle_en,
  );
  const guidebookDescription = pickLocale(
    locale,
    downloads.guidebookDescription_id,
    downloads.guidebookDescription_en,
  );

  const otherBooklets = booklets.filter(
    (book) => book.slug !== FEATURED_GUIDEBOOK_SLUG,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      {/* Featured: Buku Panduan Desa (moved from Galeri) */}
      <section className="animate-slide-up mt-10">
        <h2 className="text-xl font-bold text-forest">{t("guidebookTitle")}</h2>
        <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:p-8">
          <div className="relative mx-auto aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-xl sm:mx-0 sm:w-52">
            <Image
              src={downloads.guidebookCover}
              alt={guidebookTitle}
              fill
              sizes="208px"
              className="object-cover"
              placeholder="blur"
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-extrabold text-forest">{guidebookTitle}</h3>
            <p className="mt-3 text-base leading-relaxed text-forest/70">
              {guidebookDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <a
                href={downloads.guidebookPdfPath}
                download
                className="inline-flex rounded-xl bg-marigold px-5 py-2.5 text-sm font-semibold text-forest transition-all duration-300 hover:bg-marigold-dark"
              >
                {t("downloadGuidebook")}
              </a>
              {featuredFlipBook && (
                <Link
                  href={`/media/buklet/${featuredFlipBook.slug}`}
                  className="inline-flex rounded-xl border border-tamblingan px-5 py-2.5 text-sm font-semibold text-tamblingan transition-all duration-300 hover:bg-tamblingan hover:text-white"
                >
                  {t("openBook")} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Remaining flip-book booklets */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-forest">{t("collectionTitle")}</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherBooklets.map((book) => {
            const title = pickLocale(locale, book.title_id, book.title_en);
            const description = pickLocale(
              locale,
              book.description_id,
              book.description_en,
            );

            return (
              <li key={book.id}>
                <Link
                  href={`/media/buklet/${book.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={book.cover}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-bold text-forest">{title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-forest/70">
                      {description}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-tamblingan">
                      {t("openBook")} →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
