"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { StaticImageData } from "next/image";
import hero1 from "@/public/images/hero/tamblingan-1.jpg";
import hero2 from "@/public/images/hero/tamblingan-2.jpg";
import hero3 from "@/public/images/hero/tamblingan-3.jpg";

const SLIDES: StaticImageData[] = [hero1, hero2, hero3];

/** Full opacity hold before crossfade starts */
const HOLD_MS = 5000;
/** Crossfade duration */
const FADE_MS = 1500;

/**
 * Full-bleed hero background: cycles Tamblingan photos with a crossfade.
 * Only the active slide and the outgoing slide (during fade) are mounted,
 * so first paint downloads one image instead of all three.
 */
export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = 0;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(resolve, ms);
      });

    const loop = async () => {
      while (!cancelled) {
        await wait(HOLD_MS);
        if (cancelled) return;

        const from = indexRef.current;
        const next = (from + 1) % SLIDES.length;
        indexRef.current = next;
        setOutgoing(from);
        setIndex(next);

        await wait(FADE_MS);
        if (cancelled) return;
        setOutgoing(null);
      }
    };

    void loop();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const mounted = outgoing === null ? [index] : [outgoing, index];

  return (
    <div className="absolute inset-0" aria-hidden>
      {mounted.map((i) => {
        const isActive = i === index;
        return (
          <motion.div
            key={`${SLIDES[i]!.src}-${i}-${isActive ? "in" : "out"}`}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
          >
            <Image
              src={SLIDES[i]!}
              alt=""
              fill
              priority={i === 0 && outgoing === null}
              fetchPriority={i === 0 && outgoing === null ? "high" : "auto"}
              sizes="100vw"
              quality={75}
              className="object-cover"
              placeholder="blur"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
