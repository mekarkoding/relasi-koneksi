"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
  /** Slightly stronger rise for feature cards */
  distance?: number;
  /**
   * When false, stays hidden at the initial offset.
   * Flip to true after a gate (e.g. home entrance) so whileInView can play for real.
   */
  enabled?: boolean;
}

/**
 * Scroll-triggered fade/rise entrance. Plays once when entering the viewport.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 36,
  enabled = true,
}: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (!enabled) {
    return (
      <div
        className={className}
        style={{ opacity: 0, transform: `translateY(${distance}px)` }}
        aria-hidden
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
