import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getAllBookletSlugs, getBookletBySlug } from "@/data/booklet";
import { FlipBook } from "@/components/FlipBook";
import { SectionHeading } from "@/components/SectionHeading";
import { BackLink } from "@/components/BackLink";
import { pickLocale } from "@/lib/locale-content";
import { localeAlternates } from "@/lib/seo";

export const dynamicParams = true;

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllBookletSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const book = getBookletBySlug(slug);
  if (!book) return {};

  const title = pickLocale(locale, book.title_id, book.title_en);
  const description = pickLocale(locale, book.description_id, book.description_en);

  return {
    title,
    description,
    alternates: localeAlternates(`/media/buklet/${slug}`),
  };
}

export default async function BukletDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const book = getBookletBySlug(slug);
  if (!book) notFound();

  const t = await getTranslations("media.buklet");
  const tCommon = await getTranslations("common");
  const title = pickLocale(locale, book.title_id, book.title_en);
  const description = pickLocale(locale, book.description_id, book.description_en);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <BackLink href="/media/buklet" label={tCommon("back")} />

      <div className="mt-4">
        <SectionHeading title={title} subtitle={description} />
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href={book.pdfPath}
          download
          className="inline-flex rounded-xl bg-marigold px-5 py-2.5 text-sm font-semibold text-forest transition-all duration-300 hover:bg-marigold-dark"
        >
          {t("downloadPdf")}
        </a>
      </div>

      <div className="mt-10">
        <FlipBook pages={book.pages} />
      </div>
    </div>
  );
}
