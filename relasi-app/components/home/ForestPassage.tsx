"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";
import danauBg from "@/public/images/hero/tamblingan-1.jpg";

/** Sun hotspot after horizontal flip of tamblingan-1.jpg (measured peak). */
const SUN_X = "31.0%";
const SUN_Y = "24.3%";

/**
 * Passage behind the gapura: Tamblingan dawn backdrop, with animated
 * god rays locked to the sun already in the photo.
 */
export function ForestPassage({
  progress: _progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={danauBg}
        alt=""
        fill
        // Behind the gate — do not compete with gapura LCP.
        fetchPriority="low"
        sizes="100vw"
        quality={75}
        className="object-cover object-[center_40%] select-none -scale-x-100"
        draggable={false}
      />

      {/* Soft darken so text/gate stay readable without killing the dawn light */}
      <div aria-hidden className="absolute inset-0 bg-[#1a1c18]/10" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(12,14,16,0.28)_100%)]"
      />
      {/* Ground shadow the gapura bases stand in */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0a0c0e]/40 via-[#0a0c0e]/12 to-transparent"
      />

      {/* Animated god rays originating from the photo's sun (left after flip) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 mix-blend-screen will-change-[opacity]"
          animate={{ opacity: [0.55, 0.9, 0.6, 0.9] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: `radial-gradient(ellipse at ${SUN_X} ${SUN_Y}, rgba(255,220,150,0.45) 0%, rgba(255,200,120,0.16) 22%, transparent 52%)`,
          }}
        />
        <motion.div
          className="absolute inset-0 mix-blend-screen blur-[2px] will-change-transform"
          style={{
            backgroundImage: `repeating-conic-gradient(from 335deg at ${SUN_X} ${SUN_Y}, rgba(255,230,180,0.18) 0deg, transparent 3.5deg, transparent 9deg)`,
            maskImage: `radial-gradient(ellipse at ${SUN_X} ${SUN_Y}, black 0%, transparent 58%)`,
            WebkitMaskImage: `radial-gradient(ellipse at ${SUN_X} ${SUN_Y}, black 0%, transparent 58%)`,
            transformOrigin: `${SUN_X} ${SUN_Y}`,
          }}
          animate={{
            rotate: [0, 4, -2, 3, 0],
            opacity: [0.18, 0.34, 0.22, 0.3, 0.18],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 mix-blend-screen blur-[3px] will-change-transform"
          style={{
            backgroundImage: `repeating-conic-gradient(from 342deg at ${SUN_X} ${SUN_Y}, rgba(255,236,200,0.12) 0deg, transparent 2.5deg, transparent 11deg)`,
            maskImage: `radial-gradient(ellipse at ${SUN_X} ${SUN_Y}, black 0%, transparent 50%)`,
            WebkitMaskImage: `radial-gradient(ellipse at ${SUN_X} ${SUN_Y}, black 0%, transparent 50%)`,
            transformOrigin: `${SUN_X} ${SUN_Y}`,
          }}
          animate={{
            rotate: [0, -3, 2, -1, 0],
            opacity: [0.14, 0.26, 0.16, 0.24, 0.14],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      {/* Low ground mist — soft banks around the gapura bases */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#e8ebe8]/55 via-[#dfe4e0]/22 to-transparent" />

        <motion.div
          className="absolute -left-[20%] bottom-[8%] h-36 w-[70%] rounded-[100%] bg-[#f2f4f1]/45 blur-2xl will-change-transform"
          animate={{ x: ["0%", "18%", "-8%", "0%"], opacity: [0.45, 0.7, 0.5, 0.45] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[15%] bottom-[4%] h-40 w-[65%] rounded-[100%] bg-[#eef1ee]/40 blur-3xl will-change-transform"
          animate={{ x: ["0%", "-22%", "10%", "0%"], opacity: [0.4, 0.65, 0.45, 0.4] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
        <motion.div
          className="absolute left-[15%] bottom-[-6%] h-28 w-[80%] rounded-[100%] bg-white/35 blur-3xl will-change-transform"
          animate={{ x: ["0%", "12%", "-14%", "0%"], opacity: [0.35, 0.55, 0.4, 0.35] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
        <motion.div
          className="absolute left-[30%] bottom-[18%] h-24 w-[50%] rounded-[100%] bg-[#f7f5ef]/30 blur-2xl will-change-transform"
          animate={{ x: ["0%", "-16%", "10%", "0%"], y: [0, -8, 4, 0], opacity: [0.25, 0.45, 0.3, 0.25] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      </div>
    </div>
  );
}
