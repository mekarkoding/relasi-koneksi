"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { StaticImageData } from "next/image";

export interface GalleryLightboxItem {
  id: string;
  image: StaticImageData;
  alt: string;
}

interface Props {
  photos: GalleryLightboxItem[];
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}

/**
 * Pinterest-style masonry grid with Drive-like lightbox (zoom + arrows).
 * Lightbox portals to document.body so it covers the full viewport (navbar included).
 */
export function GalleryPhotoMasonry({
  photos,
  closeLabel,
  prevLabel,
  nextLabel,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? i : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, goPrev, goNext]);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  const lightbox =
    active && activeIndex !== null
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            className="fixed inset-0 z-[100] flex h-[100dvh] w-screen items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              {closeLabel}
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              aria-label={prevLabel}
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 sm:left-6"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              aria-label={nextLabel}
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 sm:right-6"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className="relative flex max-h-[90dvh] w-full max-w-6xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={active.image}
                alt={active.alt}
                sizes="100vw"
                className="h-auto max-h-[85dvh] w-auto max-w-full object-contain shadow-2xl"
                placeholder="blur"
                priority
              />
              <p className="mt-3 text-center text-sm text-white/80">
                {activeIndex + 1} / {photos.length}
              </p>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tamblingan sm:mb-4"
            aria-label={photo.alt}
          >
            <Image
              src={photo.image}
              alt={photo.alt}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-auto w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-110"
              placeholder="blur"
            />
          </button>
        ))}
      </div>

      {lightbox}
    </>
  );
}
