"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { DesaPreview } from "@/lib/sanity/types";
import { DesaCard } from "@/components/DesaCard";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 48;

interface Props {
  items: DesaPreview[];
}

/**
 * Mobile-only single-slide carousel for Empat Desa.
 * One village card at a time; after 5s idle the current card fades
 * left and the next fades in from the right. Indicator lists all
 * village names with the active one emphasized.
 */
export function FeaturedDesaCarousel({ items }: Props) {
  const tVillages = useTranslations("desa.villages");
  const reduceMotion = useReducedMotion();
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  /** 1 = advance (exit left / enter right), -1 = go back */
  const [direction, setDirection] = useState(1);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (index: number, dir: 1 | -1) => {
      if (items.length < 2) return;
      const next = ((index % items.length) + items.length) % items.length;
      setDirection(dir);
      setActiveIndex(next);
    },
    [items.length],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  const scheduleAutoAdvance = useCallback(() => {
    clearIdleTimer();
    if (items.length < 2 || reduceMotion) return;

    idleTimerRef.current = setTimeout(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % items.length);
    }, AUTO_ADVANCE_MS);
  }, [clearIdleTimer, items.length, reduceMotion]);

  useEffect(() => {
    scheduleAutoAdvance();
    return clearIdleTimer;
  }, [activeIndex, scheduleAutoAdvance, clearIdleTimer]);

  if (items.length === 0) return null;

  const current = items[activeIndex];
  const offset = reduceMotion ? 0 : 64;

  return (
    <div className="md:hidden" role="region" aria-roledescription="carousel">
      <div
        className="relative overflow-hidden touch-pan-y select-none"
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
        onClickCapture={(e) => {
          if (!didSwipe.current) return;
          e.preventDefault();
          e.stopPropagation();
          didSwipe.current = false;
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current._id}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * offset }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -offset }
            }
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-sm"
          >
            <DesaCard desa={current} />
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <nav
          className="mt-5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-1 text-sm"
          aria-label="Desa"
        >
          {items.map((desa, i) => {
            const isActive = i === activeIndex;
            const name = tVillages(desa.villageName);
            return (
              <span key={desa._id} className="inline-flex items-center gap-x-1.5">
                {i > 0 && (
                  <span className="text-forest/30" aria-hidden>
                    –
                  </span>
                )}
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => {
                    if (i === activeIndex) return;
                    goTo(i, i > activeIndex ? 1 : -1);
                  }}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "font-bold text-forest"
                      : "font-medium text-forest/40"
                  }`}
                >
                  {name}
                </button>
              </span>
            );
          })}
        </nav>
      )}
    </div>
  );
}
