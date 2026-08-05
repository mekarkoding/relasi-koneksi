"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import gapuraLeft from "@/public/images/gapura-left.webp";
import gapuraRight from "@/public/images/gapura-right.webp";
import { useEntranceScroll } from "@/components/home/EntranceScrollProvider";
import { ForestPassage } from "@/components/home/ForestPassage";
import { HeroCta } from "@/components/home/HeroCta";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import {
  ENTRANCE_REVEAL_END,
  ENTRANCE_REVEAL_START,
  FOREST_FADE_END,
  FOREST_FADE_START,
  FOREST_ZOOM_END,
  FOREST_ZOOM_START,
  GATE_FADE_END,
  GATE_FADE_START,
  GATE_ZOOM_END,
} from "@/lib/entrance-timing";

interface Props {
  title: string;
  subtitle: string;
  ctaLabel: string;
  scrollHint: string;
}

/** Cleared on remount so React Strict Mode does not mark the entrance as seen. */
let pendingSeenTimer: ReturnType<typeof setTimeout> | null = null;

function HeroLandingCopy({
  title,
  subtitle,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
}) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 text-center text-mist">
      <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg sm:text-6xl">
        {title}
      </h1>
      <p className="mt-4 text-base text-mist/85 sm:text-lg">{subtitle}</p>
      <HeroCta label={ctaLabel} />
    </div>
  );
}

/** Final landing frame — no gapura scroll journey. */
function LandedHero({
  title,
  subtitle,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
}) {
  const entrance = useEntranceScroll();
  const bindScrollProgress = entrance?.bindScrollProgress;
  const completeProgress = useMotionValue(1);

  useEffect(() => {
    if (!bindScrollProgress) return;
    bindScrollProgress(completeProgress);
    return () => bindScrollProgress(null);
  }, [bindScrollProgress, completeProgress]);

  return (
    <section className="relative z-10 h-screen overflow-hidden bg-[#c5d6e0]">
      <div className="absolute inset-0">
        <HeroSlideshow priority />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-tamblingan/20 to-mist/30" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <HeroLandingCopy
          title={title}
          subtitle={subtitle}
          ctaLabel={ctaLabel}
        />
      </div>
    </section>
  );
}

/**
 * Entrance journey: zoom through the gapura → forest passage → landing.
 * Plays once per tab session; soft navigations back to Beranda skip it.
 */
export function GapuraEntrance({ title, subtitle, ctaLabel, scrollHint }: Props) {
  const entrance = useEntranceScroll();
  const entranceReady = entrance?.entranceReady ?? false;
  const entranceSeen = entrance?.entranceSeen ?? false;

  // Paint the gate immediately for LCP. After sessionStorage hydrates, return
  // visitors switch to LandedHero (may flash the gate for one frame).
  if (entranceReady && entranceSeen) {
    return (
      <LandedHero title={title} subtitle={subtitle} ctaLabel={ctaLabel} />
    );
  }

  return (
    <GapuraEntranceJourney
      title={title}
      subtitle={subtitle}
      ctaLabel={ctaLabel}
      scrollHint={scrollHint}
    />
  );
}

function GapuraEntranceJourney({
  title,
  subtitle,
  ctaLabel,
  scrollHint,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const entrance = useEntranceScroll();
  const bindScrollProgress = entrance?.bindScrollProgress;
  const markEntranceSeen = entrance?.markEntranceSeen;
  const [showHeroMedia, setShowHeroMedia] = useState(false);
  const [showForest, setShowForest] = useState(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Let the gapura LCP paint first, then mount the forest layer.
  useEffect(() => {
    const id = window.setTimeout(() => setShowForest(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  // Mount hero photos only as the forest fades out — keeps LCP on the gapura.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!showHeroMedia && value >= ENTRANCE_REVEAL_START - 0.08) {
      setShowHeroMedia(true);
    }
  });

  useEffect(() => {
    if (!bindScrollProgress) return;
    bindScrollProgress(scrollYProgress);
    return () => bindScrollProgress(null);
  }, [bindScrollProgress, scrollYProgress]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Only mark when leaving Beranda for another page — not when scrolling
  // through/back on the same visit. Deferred so Strict Mode remounts cancel it.
  useEffect(() => {
    if (pendingSeenTimer) {
      clearTimeout(pendingSeenTimer);
      pendingSeenTimer = null;
    }
    return () => {
      pendingSeenTimer = setTimeout(() => {
        markEntranceSeen?.();
        pendingSeenTimer = null;
      }, 120);
    };
  }, [markEntranceSeen]);

  const gateScale = useTransform(scrollYProgress, [0, GATE_ZOOM_END], [1, 4.2]);
  const gateOpacity = useTransform(
    scrollYProgress,
    [0, GATE_FADE_START, GATE_FADE_END, 1],
    [1, 1, 0, 0],
  );

  const forestScale = useTransform(
    scrollYProgress,
    [FOREST_ZOOM_START, FOREST_ZOOM_END],
    [1, 2.2],
  );
  const forestOpacity = useTransform(
    scrollYProgress,
    [0, FOREST_FADE_START, FOREST_FADE_END, 1],
    [1, 1, 0, 0],
  );

  const heroScale = useTransform(
    scrollYProgress,
    [ENTRANCE_REVEAL_START, ENTRANCE_REVEAL_END],
    [1.08, 1],
  );
  const heroOpacity = useTransform(
    scrollYProgress,
    [ENTRANCE_REVEAL_START, ENTRANCE_REVEAL_END, 1],
    [0, 1, 1],
  );
  const hintOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, GATE_FADE_START, 1],
    [1, 0, 0, 0],
  );
  const hintPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.1 ? "none" : "auto",
  );

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

  const cta = <HeroCta label={ctaLabel} />;
  const ctaGhost = (
    <div className="pointer-events-none mt-10 opacity-0" aria-hidden>
      <HeroCta label={ctaLabel} />
    </div>
  );

  return (
    <section ref={trackRef} className="relative z-10 h-[240vh]">
      <div className="sticky top-0 isolate h-screen overflow-hidden bg-[#c5d6e0]">
        <motion.div
          style={{ scale: forestScale, opacity: forestOpacity }}
          className="pointer-events-none absolute inset-0 z-10 origin-center will-change-transform"
        >
          {showForest ? (
            <ForestPassage progress={scrollYProgress} />
          ) : (
            <div className="absolute inset-0 bg-[#c5d6e0]" aria-hidden />
          )}
        </motion.div>

        <motion.div
          style={{ scale: gateScale, opacity: gateOpacity }}
          className="pointer-events-none absolute inset-0 z-20 origin-center will-change-transform"
        >
          <div className="absolute inset-0 flex origin-bottom items-end justify-center gap-[14%] scale-[1.75] sm:gap-[12%] sm:scale-[1.35] md:gap-[10%] md:scale-100">
            <div className="relative h-full w-[36%] shrink-0 sm:w-[38%] md:w-[40%]">
              <Image
                src={gapuraLeft}
                alt=""
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 55vw, 40vw"
                quality={70}
                className="object-contain object-bottom"
                draggable={false}
              />
            </div>
            <div className="relative h-full w-[36%] shrink-0 sm:w-[38%] md:w-[40%]">
              <Image
                src={gapuraRight}
                alt=""
                fill
                sizes="(max-width: 768px) 55vw, 40vw"
                quality={70}
                className="object-contain object-bottom"
                draggable={false}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-30 will-change-transform"
        >
          {showHeroMedia ? <HeroSlideshow /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-tamblingan/20 to-mist/30" />
        </motion.div>

        <div className="absolute inset-0 z-40 flex items-center justify-center">
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
          style={{ opacity: hintOpacity, pointerEvents: hintPointerEvents }}
          className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 will-change-[opacity]"
        >
          <motion.button
            type="button"
            onClick={scrollThroughGate}
            className="flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent text-center text-lg font-medium tracking-wide text-yellow-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)] sm:text-xl"
            animate={{ y: [0, 6, 0] }}
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
