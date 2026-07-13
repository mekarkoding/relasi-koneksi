"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  motion,
  motionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import gapura from "@/public/images/gapura.png";
import heroMist from "@/public/images/hero-mist.png";
import { useEntranceScroll } from "@/components/home/EntranceScrollProvider";
import { HeroCta } from "@/components/home/HeroCta";
import {
  ENTRANCE_REVEAL_END,
  ENTRANCE_REVEAL_START,
} from "@/lib/entrance-timing";
import {
  hasCompletedEntrance,
  markEntranceCompleted,
} from "@/lib/entrance-session";

interface Props {
  title: string;
  subtitle: string;
  ctaLabel: string;
  scrollHint: string;
}

function subscribeNoop() {
  return () => {};
}

/**
 * Zoom-through entrance: sticky viewport + scroll-linked transforms.
 * After the first complete pass (per tab session), home opens already revealed.
 */
export function GapuraEntrance({ title, subtitle, ctaLabel, scrollHint }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const entrance = useEntranceScroll();
  const skipEntrance = useSyncExternalStore(
    subscribeNoop,
    hasCompletedEntrance,
    () => false,
  );
  const showCompleted = skipEntrance || Boolean(reduceMotion);

  const completedProgress = useRef(motionValue(1)).current;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useEffect(() => {
    if (showCompleted) {
      completedProgress.set(1);
      entrance?.bindScrollProgress(completedProgress);
      return () => entrance?.bindScrollProgress(null);
    }
    entrance?.bindScrollProgress(scrollYProgress);
    return () => entrance?.bindScrollProgress(null);
  }, [entrance, scrollYProgress, showCompleted, completedProgress]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (showCompleted) return;
    if (value >= 0.9) markEntranceCompleted();
  });

  const gateScale = useTransform(scrollYProgress, [0, 0.7], [1, 18]);
  const gateOpacity = useTransform(scrollYProgress, [0.65, 0.85], [1, 0]);
  const gateVisibility = useTransform(scrollYProgress, (p) =>
    p > 0.88 ? "hidden" : "visible",
  );

  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1.08, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const textOpacity = useTransform(
    scrollYProgress,
    [ENTRANCE_REVEAL_START, ENTRANCE_REVEAL_END, 1],
    [0, 1, 1],
  );
  const ghostOpacity = useTransform(
    scrollYProgress,
    [ENTRANCE_REVEAL_START, ENTRANCE_REVEAL_END],
    [1, 0],
  );

  const scrollThroughGate = () => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.offsetTop + track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const copy = (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg sm:text-6xl">
        {title}
      </h1>
      <p className="mt-4 text-base text-mist/85 sm:text-lg">{subtitle}</p>
    </>
  );

  const copyGlowing = (
    <>
      <h1 className="animate-hero-glow text-3xl font-extrabold tracking-tight sm:text-6xl">
        {title}
      </h1>
      <p className="mt-4 text-base text-mist/85 sm:text-lg">{subtitle}</p>
    </>
  );

  const cta = <HeroCta label={ctaLabel} />;
  const ctaGhost = (
    <div className="pointer-events-none mt-10 opacity-0" aria-hidden>
      <HeroCta label={ctaLabel} />
    </div>
  );

  /* Already seen this session — open on the fully revealed home */
  if (showCompleted) {
    return (
      <section ref={trackRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroMist}
            alt=""
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-tamblingan/20 to-mist/30" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="mx-auto max-w-3xl px-4 text-center text-mist">
            {copyGlowing}
            {cta}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={trackRef} className="relative h-[160vh]">
      <div className="sticky top-0 h-screen overflow-hidden [contain:paint]">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src={heroMist}
            alt=""
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-tamblingan/20 to-mist/30" />
        </motion.div>

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative mx-auto max-w-3xl px-4 text-center text-mist">
            <motion.div style={{ opacity: textOpacity }} className="will-change-[opacity]">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 blur-[14px]"
                style={{ opacity: ghostOpacity }}
              >
                {copy}
                {ctaGhost}
              </motion.div>
              <div className="relative">
                {copy}
                {cta}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          style={{
            scale: gateScale,
            opacity: gateOpacity,
            visibility: gateVisibility,
          }}
          className="pointer-events-none absolute inset-0 z-50 origin-center will-change-transform"
        >
          <Image
            src={gapura}
            alt=""
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="object-cover"
            draggable={false}
          />
        </motion.div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 will-change-[opacity]"
        >
          <motion.button
            type="button"
            onClick={scrollThroughGate}
            className="flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent text-center text-lg font-medium tracking-wide text-mist/45 sm:text-xl"
            animate={{ opacity: [0.55, 1, 0.55], y: [0, 6, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            aria-label={scrollHint}
          >
            <span>{scrollHint}</span>
            <span aria-hidden className="text-2xl leading-none sm:text-3xl">
              ↓
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
