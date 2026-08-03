"use client";

import type { ReactNode } from "react";
import { EntranceScrollProvider } from "@/components/home/EntranceScrollProvider";
import { LocaleTransitionProvider } from "@/components/LocaleTransition";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EntranceScrollProvider>
      <LocaleTransitionProvider>{children}</LocaleTransitionProvider>
    </EntranceScrollProvider>
  );
}
