"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { InstagramPost } from "@/lib/instagram-types";
import { InstagramPostCard } from "@/components/home/InstagramPostCard";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 48;
const GAP_PX = 12;
/** Prefer 5 visible; scale down on smaller screens so cards stay readable. */
const VISIBLE_BY_BREAKPOINT = [
  { min: 1024, count: 5 },
  { min: 768, count: 3 },
  { min: 640, count: 2 },
  { min: 0, count: 1 },
] as const;

interface Props {
  posts: InstagramPost[];
}

function visibleCountForWidth(width: number): number {
  for (const bp of VISIBLE_BY_BREAKPOINT) {
    if (width >= bp.min) return bp.count;
  }
  return 1;
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
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
 * Instagram strip carousel: 5 posts visible on desktop, advances one card
 * every 5s (next post enters from the right).
 */
export function InstagramFeedCarousel({ posts }: Props) {
  const t = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [cardWidth, setCardWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const count = visibleCountForWidth(width);
    setVisibleCount(count);
    setCardWidth((width - GAP_PX * (count - 1)) / count);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    setIndex((current) => (posts.length === 0 ? 0 : current % posts.length));
  }, [posts.length, visibleCount]);

  const advance = useCallback(
    (dir: 1 | -1) => {
      if (posts.length <= 1) return;
      if (dir < 0) {
        if (index <= 0) {
          setInstant(true);
          setIndex(posts.length - 1);
        } else {
          setInstant(false);
          setIndex(index - 1);
        }
        return;
      }
      setInstant(false);
      setIndex((current) =>
        current + 1 >= posts.length ? posts.length : current + 1,
      );
    },
    [posts.length, index],
  );

  const scheduleAutoAdvance = useCallback(() => {
    clearIdleTimer();
    // Still auto-advance even if posts.length <= visibleCount so a short
    // feed loops; skip only when there's nothing to move.
    if (posts.length < 2 || reduceMotion) return;

    idleTimerRef.current = setTimeout(() => {
      setInstant(false);
      setIndex((current) => (current + 1 >= posts.length ? posts.length : current + 1));
    }, AUTO_ADVANCE_MS);
  }, [clearIdleTimer, posts.length, reduceMotion]);

  useEffect(() => {
    scheduleAutoAdvance();
    return clearIdleTimer;
  }, [index, scheduleAutoAdvance, clearIdleTimer]);

  // Snap back after sliding onto the duplicated head (seamless loop).
  useEffect(() => {
    if (index < posts.length) return;
    if (reduceMotion) {
      setInstant(true);
      setIndex(0);
      return;
    }
    const t = setTimeout(() => {
      setInstant(true);
      setIndex(0);
    }, 520);
    return () => clearTimeout(t);
  }, [index, posts.length, reduceMotion]);

  useEffect(() => {
    if (!instant) return;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  if (posts.length === 0) return null;

  const trackPosts =
    posts.length > 1
      ? [...posts, ...posts.slice(0, Math.max(visibleCount, 1))]
      : posts;

  const step = cardWidth > 0 ? cardWidth + GAP_PX : 0;
  const x = reduceMotion || step === 0 ? 0 : -(index * step);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Instagram">
      <div
        ref={viewportRef}
        className="relative overflow-hidden select-none"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          pointerStartX.current = e.clientX;
          didSwipe.current = false;
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
            didSwipe.current = true;
            if (delta < 0) advance(1);
            else advance(-1);
          } else {
            scheduleAutoAdvance();
          }
        }}
        onPointerCancel={() => {
          pointerStartX.current = null;
          scheduleAutoAdvance();
        }}
        onClickCapture={(e) => {
          if (!didSwipe.current) return;
          e.preventDefault();
          e.stopPropagation();
          didSwipe.current = false;
        }}
        onMouseEnter={clearIdleTimer}
        onMouseLeave={scheduleAutoAdvance}
      >
        <motion.div
          className="flex"
          style={{ gap: GAP_PX }}
          animate={{ x }}
          transition={
            instant || reduceMotion
              ? { duration: 0 }
              : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {trackPosts.map((post, i) => (
            <div
              key={`${post.id}-${i}`}
              className="min-w-0 shrink-0"
              style={{ width: cardWidth > 0 ? cardWidth : undefined, flexBasis: cardWidth > 0 ? cardWidth : `${100 / visibleCount}%` }}
            >
              <InstagramPostCard
                post={post}
                size={visibleCount <= 2 ? "carousel" : "grid"}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {posts.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              clearIdleTimer();
              advance(-1);
            }}
            aria-label={t("prevPhoto")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/20 bg-white/90 text-forest shadow-sm transition hover:border-forest/40 hover:bg-mist"
          >
            <ChevronLeft />
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            {posts.map((post, i) => {
              const active = i === index % posts.length;
              return (
                <button
                  key={post.id}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    clearIdleTimer();
                    setInstant(false);
                    setIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active ? "w-5 bg-tamblingan" : "w-2 bg-forest/25"
                  }`}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              clearIdleTimer();
              advance(1);
            }}
            aria-label={t("nextPhoto")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-forest/20 bg-white/90 text-forest shadow-sm transition hover:border-forest/40 hover:bg-mist"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
