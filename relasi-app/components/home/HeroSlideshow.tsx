"use client";

import { useEffect, useState } from "react";
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
 */
export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

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
        setIndex((current) => (current + 1) % SLIDES.length);
        await wait(FADE_MS);
      }
    };

    void loop();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden>
      {SLIDES.map((src, i) => (
        <motion.div
          key={src.src}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : "auto"}
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
          />
        </motion.div>
      ))}
    </div>
  );
}
