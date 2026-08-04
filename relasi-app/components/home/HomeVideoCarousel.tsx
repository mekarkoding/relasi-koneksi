"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { LazyYouTubeEmbed } from "@/components/LazyYouTubeEmbed";
import type { HomeVideo } from "@/data/home-videos";
import { extractYouTubeId } from "@/lib/youtube";
import type { Locale } from "@/i18n/routing";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 48;

interface Slide {
  id: string;
  /** Null when the YouTube URL is not ready yet — show a placeholder. */
  videoId: string | null;
  title: string;
  description: string;
}

interface Props {
  videos: HomeVideo[];
  /** Override carousel region label (defaults to home.videosTitle). */
  ariaLabel?: string;
  /** Override empty-slide label (defaults to home.videoComingSoon). */
  comingSoonLabel?: string;
}

function toSlides(videos: HomeVideo[], locale: Locale): Slide[] {
  return videos.map((video) => ({
    id: video.id,
    videoId: extractYouTubeId(video.youtubeUrl) || null,
    title: locale === "en" ? video.title_en : video.title_id,
    description:
      locale === "en" ? video.description_en : video.description_id,
  }));
}

function VideoSlidePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center bg-mist-dark/80"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.2),transparent_55%),linear-gradient(160deg,#3d5a4a_0%,#2a4035_45%,#1a2a22_100%)]" />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <svg
          className="h-12 w-12 text-mist/40"
          viewBox="0 0 68 48"
          fill="currentColor"
          aria-hidden
        >
          <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" />
          <path d="M 45,24 27,14 27,34" fill="white" fillOpacity="0.55" />
        </svg>
        <span className="rounded-lg bg-mist/10 px-3 py-1.5 text-xs font-medium tracking-wide text-mist/60">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Home landing YouTube carousel — one embed at a time, manual + idle advance.
 * Auto-advance pauses while a facade is opened (iframe playing).
 */
export function HomeVideoCarousel({
  videos,
  ariaLabel,
  comingSoonLabel,
}: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const slides = toSlides(videos, locale);
  const regionLabel = ariaLabel ?? t("videosTitle");
  const placeholderLabel = comingSoonLabel ?? t("videoComingSoon");

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isCurrentPlaying, setIsCurrentPlaying] = useState(false);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (index: number, dir: 1 | -1) => {
      if (slides.length < 2) return;
      const next = ((index % slides.length) + slides.length) % slides.length;
      setDirection(dir);
      setActiveIndex(next);
    },
    [slides.length],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  const current = slides[activeIndex];

  const scheduleAutoAdvance = useCallback(() => {
    clearIdleTimer();
    if (slides.length < 2 || reduceMotion || isCurrentPlaying) return;

    idleTimerRef.current = setTimeout(() => {
      setDirection(1);
      setActiveIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
  }, [clearIdleTimer, slides.length, reduceMotion, isCurrentPlaying]);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    setIsCurrentPlaying(false);
  }, [activeIndex]);

  useEffect(() => {
    scheduleAutoAdvance();
    return clearIdleTimer;
  }, [activeIndex, scheduleAutoAdvance, clearIdleTimer]);

  if (slides.length === 0 || !current) return null;

  const offset = reduceMotion ? 0 : 56;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={regionLabel}>
      <div className="relative mx-auto max-w-3xl">
        <div
          className="overflow-hidden touch-pan-y select-none"
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            pointerStartX.current = e.clientX;
            clearIdleTimer();
          }}
          onPointerUp={(e) => {
            if (pointerStartX.current == null) {
              scheduleAutoAdvance();
              return;
            }
            const delta = e.clientX - pointerStartX.current;
            pointerStartX.current = null;

            if (Math.abs(delta) >= SWIPE_THRESHOLD) {
              if (delta < 0) goNext();
              else goPrev();
            } else {
              scheduleAutoAdvance();
            }
          }}
          onPointerCancel={() => {
            pointerStartX.current = null;
            scheduleAutoAdvance();
          }}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * offset }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -offset }
              }
              transition={{ duration: reduceMotion ? 0.2 : 0.35, ease: "easeOut" }}
            >
              <div className="relative aspect-video overflow-hidden rounded-xl">
                {current.videoId ? (
                  <LazyYouTubeEmbed
                    key={current.id}
                    videoId={current.videoId}
                    title={current.title}
                    onPlay={() => {
                      clearIdleTimer();
                      setIsCurrentPlaying(true);
                    }}
                  />
                ) : (
                  <VideoSlidePlaceholder label={placeholderLabel} />
                )}
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-lg font-bold text-mist sm:text-xl">
                  {current.title}
                </h3>
                <p className="mt-1 text-sm text-mist/70 sm:text-base">
                  {current.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              aria-label={tCommon("prevPhoto")}
              className="rounded-full border border-mist/30 px-3 py-1.5 text-sm text-mist/80 transition hover:border-mist/60 hover:text-mist"
            >
              ←
            </button>
            <div className="flex items-center gap-2" role="tablist">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`${slide.title}`}
                  onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === activeIndex
                      ? "w-7 bg-marigold"
                      : "w-2.5 bg-mist/35 hover:bg-mist/55"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label={tCommon("nextPhoto")}
              className="rounded-full border border-mist/30 px-3 py-1.5 text-sm text-mist/80 transition hover:border-mist/60 hover:text-mist"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
