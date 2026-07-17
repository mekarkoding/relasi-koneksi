"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

/** Main nav destinations — warmed so the first click isn’t a cold compile. */
const PREFETCH_ROUTES = [
  "/",
  "/wisata",
  "/articles/berita",
  "/desa/gobleg",
  "/media/galeri",
  "/media/buklet",
  "/about/adat-dalem-tamblingan",
] as const;

/**
 * Prefetch primary routes after the app is idle so navigation feels instant
 * in `next dev`, where routes compile on first visit.
 *
 * Skipped in production — full prefetch there would seed the client router
 * cache with RSC payloads that can look stale until a hard refresh.
 */
export function NavPrefetch() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    let cancelled = false;

    const prefetchAll = () => {
      if (cancelled) return;
      for (const href of PREFETCH_ROUTES) {
        try {
          router.prefetch(href);
        } catch {
          /* ignore prefetch errors */
        }
      }
    };

    // Let the current page settle, then warm the rest.
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(prefetchAll, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(prefetchAll, 600);
    }

    // Second pass catches routes that weren’t ready on first idle.
    const secondPass = setTimeout(prefetchAll, 2500);

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(secondPass);
    };
  }, [router]);

  return null;
}
