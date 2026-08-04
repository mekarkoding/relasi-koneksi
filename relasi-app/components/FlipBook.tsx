"use client";

import { Component, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { BookletPage } from "@/data/booklet";
import { pickLocale } from "@/lib/locale-content";

/**
 * react-pageflip is a client-only interactive library (PRD 4.5).
 * If it fails to load, we gracefully fall back to a sequential viewer.
 */
const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
  loading: () => <FlipBookSkeleton />,
});

function FlipBookSkeleton() {
  return (
    <div className="mx-auto h-[500px] w-full max-w-sm animate-pulse rounded-xl bg-mist-dark" />
  );
}

function PageCard({ page }: { page: BookletPage }) {
  const locale = useLocale() as Locale;
  const caption = pickLocale(locale, page.caption_id ?? "", page.caption_en);
  const hasPhoto = Boolean(page.photo);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-mist-dark bg-white">
      {hasPhoto && page.photo ? (
        <div className="relative h-1/2 shrink-0">
          <Image
            src={page.photo}
            alt={pickLocale(locale, page.title_id, page.title_en)}
            fill
            sizes="(max-width: 640px) 90vw, 400px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div
        className={`flex flex-1 flex-col p-4 ${hasPhoto ? "" : "justify-start overflow-y-auto pt-6"}`}
      >
        <h3 className={`font-bold text-forest ${hasPhoto ? "text-lg" : "text-xl"}`}>
          {pickLocale(locale, page.title_id, page.title_en)}
        </h3>
        {caption ? (
          <p className="text-sm italic text-forest/60">{caption}</p>
        ) : null}
        <p
          className={`mt-2 text-justify leading-relaxed text-forest/80 whitespace-pre-line ${hasPhoto ? "text-sm" : "text-sm sm:text-[0.9rem]"}`}
        >
          {pickLocale(locale, page.description_id, page.description_en)}
        </p>
      </div>
    </div>
  );
}

/** Fallback: simple sequential viewer with prev/next controls. */
function SequentialViewer({ pages }: { pages: BookletPage[] }) {
  const t = useTranslations("media.buklet");
  const [index, setIndex] = useState(0);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="h-[500px]">
        <PageCard page={pages[index]} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-lg bg-tamblingan px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-tamblingan-light disabled:opacity-40"
        >
          ←
        </button>
        <span className="text-sm text-forest/60">
          {t("page")} {index + 1} / {pages.length}
        </span>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(pages.length - 1, i + 1))}
          disabled={index === pages.length - 1}
          className="rounded-lg bg-tamblingan px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-tamblingan-light disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function FlipBook({ pages }: { pages: BookletPage[] }) {
  const t = useTranslations("media.buklet");
  const [flipFailed, setFlipFailed] = useState(false);

  if (flipFailed) {
    return <SequentialViewer pages={pages} />;
  }

  return (
    <div className="animate-fade-in">
      <p className="mb-4 text-center text-sm text-forest/60">{t("instruction")}</p>
      <ErrorBoundaryLite onError={() => setFlipFailed(true)}>
        <div className="flex justify-center">
          {/* react-pageflip types mark every prop required, so all are set */}
          <HTMLFlipBook
            width={350}
            height={500}
            size="stretch"
            minWidth={280}
            maxWidth={450}
            minHeight={400}
            maxHeight={600}
            startPage={0}
            drawShadow
            flippingTime={800}
            usePortrait
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.4}
            showCover={false}
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={30}
            showPageCorners
            disableFlipByClick={false}
            className="mx-auto"
            style={{}}
          >
            {pages.map((page) => (
              <div key={page.id} className="h-full">
                <PageCard page={page} />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </ErrorBoundaryLite>
    </div>
  );
}

class ErrorBoundaryLite extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
