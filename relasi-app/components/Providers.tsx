"use client";

import type { ReactNode } from "react";
import { EntranceScrollProvider } from "@/components/home/EntranceScrollProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <EntranceScrollProvider>{children}</EntranceScrollProvider>;
}
