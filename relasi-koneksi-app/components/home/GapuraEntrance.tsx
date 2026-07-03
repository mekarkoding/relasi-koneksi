"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/navigation";
import gapura from "@/public/images/gapura.png";
import heroMist from "@/public/images/hero-mist.png";

interface Props {
  title: string;
  subtitle: string;
  ctaLabel: string;
  scrollHint: string;
}

/**
 * Zoom-through entrance: a 300vh scroll track with a sticky viewport.
 * The gapura (split gate, transparent center) scales from 1 to 50 as the
 * user scrolls, so the camera appears to pass through the gate into the
 * misty forest clearing where the hero text lives.
 */
export function GapuraEntrance({ title, subtitle, ctaLabel, scrollHint }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // The gate swallows the viewport as its transparent center expands
  const gateScale = useTransform(scrollYProgress, [0, 0.85], [1, 50]);
  const gateOpacity = useTransform(scrollYProgress, [0.8, 0.95], [1, 0]);

  // The world behind the gate eases forward while the camera moves in
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section ref={trackRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Misty forest clearing backdrop (z-0) */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src={heroMist}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-tamblingan/20 to-mist/30" />
        </motion.div>

        {/* Hero text behind the gate (z-10) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="mx-auto max-w-3xl px-4 text-center text-mist">
            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg sm:text-6xl">
              {title}
            </h1>
            <p className="mt-4 text-base text-mist/85 sm:text-lg">{subtitle}</p>
            <Link
              href="/attractions"
              className="mt-8 inline-block rounded-xl bg-marigold px-6 py-3 font-semibold text-forest transition-all duration-300 ease-in-out hover:bg-marigold-dark hover:shadow-lg"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* The gapura in the foreground (z-50), scaling up massively */}
        <motion.div
          style={{ scale: gateScale, opacity: gateOpacity }}
          className="pointer-events-none absolute inset-0 z-50 origin-center"
        >
          <Image
            src={gapura}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 text-sm font-medium tracking-wide text-mist/90"
        >
          {scrollHint} ↓
        </motion.p>
      </div>
    </section>
  );
}
