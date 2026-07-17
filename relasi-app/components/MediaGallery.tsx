"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface GalleryImage {
  url: string;
  alt: string;
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Horizontal scroll-snap gallery with prev/next buttons.
 * Used for wisata and desa photo carousels (PRD 5.2 / 5.3).
 */
export function MediaGallery({
  images,
  label,
}: {
  images: GalleryImage[];
  label?: string;
}) {
  const t = useTranslations("common");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateScrollState) : null;
    ro?.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      ro?.disconnect();
    };
  }, [images.length, updateScrollState]);

  const scrollByPage = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-gallery-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (images.length === 0) return null;

  const showControls = images.length > 1;

  return (
    <div className="relative" role="region" aria-label={label}>
      {showControls && (
        <>
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canPrev}
            aria-label={t("prevPhoto")}
            className="absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-mist-dark bg-white/95 text-forest shadow-md transition hover:bg-mist disabled:pointer-events-none disabled:opacity-30 sm:-left-3"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canNext}
            aria-label={t("nextPhoto")}
            className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-mist-dark bg-white/95 text-forest shadow-md transition hover:bg-mist disabled:pointer-events-none disabled:opacity-30 sm:-right-3"
          >
            <ChevronRight />
          </button>
        </>
      )}

      <div
        ref={scrollerRef}
        className="-mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:mx-0 sm:px-0"
      >
        <div className="flex snap-x snap-mandatory gap-4">
          {images.map((image, i) => (
            <div
              key={i}
              data-gallery-card
              className="relative aspect-[4/3] w-72 shrink-0 snap-start overflow-hidden rounded-xl sm:w-96"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                unoptimized
                sizes="(max-width: 640px) 18rem, 24rem"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
