"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
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

const idleProgress = () => motionValue(0);

export function EntranceScrollProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<MotionValue<number>>(idleProgress);

  const bindScrollProgress = useCallback((source: MotionValue<number> | null) => {
    setProgress(source ?? idleProgress());
  }, []);

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
