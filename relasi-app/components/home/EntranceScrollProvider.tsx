"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motionValue, type MotionValue } from "framer-motion";
import {
  readEntranceSeen,
  writeEntranceSeen,
} from "@/lib/entrance-timing";

type EntranceScrollContextValue = {
  progress: MotionValue<number>;
  /** Register the home entrance scroll value so navbar can read it directly. */
  bindScrollProgress: (source: MotionValue<number> | null) => void;
  /**
   * True once the gapura journey has played in this tab session.
   * Soft navigations back to Beranda skip the animation.
   * New tab / new link → sessionStorage is empty → plays again.
   */
  entranceSeen: boolean;
  /** Storage hydrated — false only on the first paint before sessionStorage is read. */
  entranceReady: boolean;
  markEntranceSeen: () => void;
};

const EntranceScrollContext = createContext<EntranceScrollContextValue | null>(
  null,
);

export function EntranceScrollProvider({ children }: { children: ReactNode }) {
  // Stable idle value — never recreate on unbind (that caused a re-render loop).
  const idleProgress = useRef(motionValue(0)).current;
  const [progress, setProgress] = useState<MotionValue<number>>(idleProgress);
  const [entranceSeen, setEntranceSeen] = useState(false);
  const [entranceReady, setEntranceReady] = useState(false);

  useEffect(() => {
    setEntranceSeen(readEntranceSeen());
    setEntranceReady(true);
  }, []);

  const markEntranceSeen = useCallback(() => {
    writeEntranceSeen();
    setEntranceSeen(true);
  }, []);

  const bindScrollProgress = useCallback(
    (source: MotionValue<number> | null) => {
      const next = source ?? idleProgress;
      setProgress((current) => (current === next ? current : next));
    },
    [idleProgress],
  );

  const value = useMemo(
    () => ({
      progress,
      bindScrollProgress,
      entranceSeen,
      entranceReady,
      markEntranceSeen,
    }),
    [
      progress,
      bindScrollProgress,
      entranceSeen,
      entranceReady,
      markEntranceSeen,
    ],
  );

  return (
    <EntranceScrollContext.Provider value={value}>
      {children}
    </EntranceScrollContext.Provider>
  );
}

export function useEntranceScroll() {
  return useContext(EntranceScrollContext);
}
