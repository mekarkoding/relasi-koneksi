"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useEntranceScroll } from "@/components/home/EntranceScrollProvider";
import { ENTRANCE_COMPLETE_AT } from "@/lib/entrance-timing";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

/**
 * Same float-in as Reveal, but waits until the gapura entrance has finished
 * so sticky coverage does not fire (and consume) the animation early.
 */
export function HomeReveal({
  children,
  className,
  delay = 0,
  distance = 36,
}: Props) {
  const entrance = useEntranceScroll();
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(() => Boolean(entrance?.entranceSeen));

  useEffect(() => {
    if (entrance?.entranceSeen) {
      setReady(true);
      return;
    }

    const progress = entrance?.progress;
    if (!progress) {
      setReady(true);
      return;
    }

    const tryEnable = (value: number) => {
      if (value >= ENTRANCE_COMPLETE_AT) setReady(true);
    };

    tryEnable(progress.get());
    return progress.on("change", tryEnable);
  }, [entrance?.entranceSeen, entrance?.progress]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (!ready) {
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
