"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motionValue, type MotionValue } from "framer-motion";

type EntranceScrollContextValue = {
  progress: MotionValue<number>;
  /** Register the home entrance scroll value so navbar can read it directly. */
  bindScrollProgress: (source: MotionValue<number> | null) => void;
};

const EntranceScrollContext = createContext<EntranceScrollContextValue | null>(null);

export function EntranceScrollProvider({ children }: { children: ReactNode }) {
  // Stable idle value — never recreate on unbind (that caused a re-render loop).
  const idleProgress = useRef(motionValue(0)).current;
  const [progress, setProgress] = useState<MotionValue<number>>(idleProgress);

  const bindScrollProgress = useCallback(
    (source: MotionValue<number> | null) => {
      const next = source ?? idleProgress;
      setProgress((current) => (current === next ? current : next));
    },
    [idleProgress],
  );

  const value = useMemo(
    () => ({ progress, bindScrollProgress }),
    [progress, bindScrollProgress],
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
