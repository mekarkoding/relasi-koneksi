"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, MotionValue, useTransform } from "framer-motion";
import danauBg from "@/public/images/danau-tamblingan-2d.webp";

type LeafTone = "deep" | "moss" | "gold" | "lime";

type FallingLeafSpec = {
  key: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  sway: number;
  rotateStart: number;
  rotateEnd: number;
  tone: LeafTone;
};

const TONES: LeafTone[] = ["deep", "moss", "gold", "lime"];

const TONE_FILL: Record<LeafTone, string> = {
  deep: "#2d4a38",
  moss: "#4a7a52",
  gold: "#a3b56a",
  lime: "#6d9b5e",
};

const LEAF_COUNT = 14;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickTone(): LeafTone {
  return TONES[Math.floor(Math.random() * TONES.length)]!;
}

function createLeaf(key: number, stagger = false): FallingLeafSpec {
  const rotateStart = rand(-40, 40);
  return {
    key,
    left: rand(2, 96),
    size: rand(22, 42),
    duration: rand(9, 16),
    delay: stagger ? rand(0, 10) : 0,
    driftX: rand(-90, 90),
    sway: rand(18, 48),
    rotateStart,
    rotateEnd: rotateStart + rand(120, 320) * (Math.random() > 0.5 ? 1 : -1),
    tone: pickTone(),
  };
}

function LeafShape({ tone, size }: { tone: LeafTone; size: number }) {
  const leafPath =
    "M16 2C16 2 4 10 4 18c0 6 5 10 12 12 7-2 12-6 12-12C28 10 16 2 16 2Z";

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path
        d={leafPath}
        fill={TONE_FILL[tone]}
        stroke="#0a0a0a"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M16 6v20M16 12c-3 2-5 5-6 8M16 14c3 2 5 5 6 7"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  );
}

function FallingLeaf({
  leaf,
  onRespawn,
}: {
  leaf: FallingLeafSpec;
  onRespawn: (key: number) => void;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-0 will-change-transform"
      style={{ left: `${leaf.left}%` }}
      initial={{
        y: "-12vh",
        x: 0,
        opacity: 0,
        rotate: leaf.rotateStart,
      }}
      animate={{
        y: "112vh",
        x: [0, leaf.driftX * 0.45, -leaf.sway, leaf.driftX],
        opacity: [0, 1, 1, 1, 0],
        rotate: leaf.rotateEnd,
      }}
      transition={{
        duration: leaf.duration,
        delay: leaf.delay,
        ease: "linear",
        x: {
          duration: leaf.duration,
          delay: leaf.delay,
          ease: "easeInOut",
          times: [0, 0.35, 0.65, 1],
        },
        opacity: {
          duration: leaf.duration,
          delay: leaf.delay,
          times: [0, 0.08, 0.75, 0.92, 1],
        },
      }}
      onAnimationComplete={() => onRespawn(leaf.key)}
    >
      <LeafShape tone={leaf.tone} size={leaf.size} />
    </motion.div>
  );
}

function FallingLeaves() {
  const [leaves, setLeaves] = useState<FallingLeafSpec[] | null>(null);
  const nextId = useRef(LEAF_COUNT + 1);

  useEffect(() => {
    setLeaves(
      Array.from({ length: LEAF_COUNT }, (_, i) => createLeaf(i + 1, true)),
    );
  }, []);

  const respawn = useCallback((finishedKey: number) => {
    const fresh = createLeaf(nextId.current, false);
    nextId.current += 1;
    setLeaves((prev) =>
      prev
        ? prev.map((leaf) => (leaf.key === finishedKey ? fresh : leaf))
        : prev,
    );
  }, []);

  if (!leaves) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {leaves.map((leaf) => (
        <FallingLeaf key={leaf.key} leaf={leaf} onRespawn={respawn} />
      ))}
    </div>
  );
}

/**
 * Passage behind the gapura: Danau Tamblingan backdrop + continuously falling leaves.
 */
export function ForestPassage({ progress }: { progress: MotionValue<number> }) {
  const mistOpacity = useTransform(progress, [0.15, 0.45, 0.75], [0.35, 0.55, 0]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={danauBg}
        alt=""
        fill
        // Behind the gapura on first paint — do not compete with gate LCP.
        fetchPriority="low"
        sizes="100vw"
        quality={75}
        placeholder="blur"
        className="object-cover object-center select-none"
        draggable={false}
      />

      <motion.div
        style={{ opacity: mistOpacity }}
        className="absolute inset-0 will-change-[opacity]"
        aria-hidden
      >
        <div className="absolute inset-x-0 top-[20%] h-28 bg-gradient-to-b from-transparent via-white/10 to-transparent blur-md" />
        <div className="absolute inset-x-0 top-[50%] h-36 bg-gradient-to-b from-transparent via-[#d9e3e9]/12 to-transparent blur-lg" />
      </motion.div>

      <FallingLeaves />
    </div>
  );
}
