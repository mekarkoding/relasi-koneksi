"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { InstagramPost } from "@/lib/instagram-types";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 48;

interface Props {
  posts: InstagramPost[];
}

/**
 * Mobile-only single-slide carousel for the Instagram feed.
 * One post at a time; after 5s idle the current fades left and the
 * next fades in from the right. Dot indicators match Destinasi Wisata.
 */
export function InstagramFeedCarousel({ posts }: Props) {
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
      if (posts.length < 2) return;
      const next = ((index % posts.length) + posts.length) % posts.length;
      setDirection(dir);
      setActiveIndex(next);
    },
    [posts.length],
  );

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  const scheduleAutoAdvance = useCallback(() => {
    clearIdleTimer();
    if (posts.length < 2 || reduceMotion) return;

    idleTimerRef.current = setTimeout(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % posts.length);
    }, AUTO_ADVANCE_MS);
  }, [clearIdleTimer, posts.length, reduceMotion]);

  useEffect(() => {
    scheduleAutoAdvance();
    return clearIdleTimer;
  }, [activeIndex, scheduleAutoAdvance, clearIdleTimer]);

  if (posts.length === 0) return null;

  const current = posts[activeIndex];
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
            key={current.id}
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
            <a
              href={current.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={current.mediaUrl}
                alt={current.caption?.slice(0, 120) || "Instagram post"}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 24rem"
                className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
              />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {posts.length > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {posts.map((post, i) => (
            <button
              key={post.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => {
                if (i === activeIndex) return;
                goTo(i, i > activeIndex ? 1 : -1);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-tamblingan" : "w-2 bg-forest/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
