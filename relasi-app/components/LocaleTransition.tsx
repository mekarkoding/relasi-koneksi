"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const FADE_MS = 320;

type LocaleTransitionContextValue = {
  switchLocale: (next: Locale) => void;
};

const LocaleTransitionContext =
  createContext<LocaleTransitionContextValue | null>(null);

export function useLocaleTransition() {
  return useContext(LocaleTransitionContext);
}

/**
 * Full-viewport mist overlay that survives the [locale] layout remount.
 * Avoids fading the page shell itself (which could get stuck at opacity 0).
 */
function runOverlayFade(navigate: () => void) {
  const existing = document.querySelector("[data-locale-fade]");
  existing?.remove();

  const overlay = document.createElement("div");
  overlay.setAttribute("data-locale-fade", "");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:99999",
    "background:var(--color-mist, #f4f7f5)",
    "opacity:0",
    `transition:opacity ${FADE_MS}ms ease-in-out`,
    "pointer-events:auto",
  ].join(";");
  document.body.appendChild(overlay);

  window.requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  window.setTimeout(() => {
    navigate();
    // Let the new locale paint under the cover, then lift it.
    window.setTimeout(() => {
      overlay.style.opacity = "0";
      window.setTimeout(() => overlay.remove(), FADE_MS);
    }, 40);
  }, FADE_MS);
}

/**
 * Locale switch fade via a persistent overlay (not content opacity).
 * Soft navigations within the same locale are unchanged.
 */
export function LocaleTransitionProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      const navigate = () => {
        router.replace(pathname, { locale: next });
      };

      if (reduceMotion) {
        navigate();
        return;
      }

      runOverlayFade(navigate);
    },
    [locale, pathname, reduceMotion, router],
  );

  return (
    <LocaleTransitionContext.Provider value={{ switchLocale }}>
      {children}
    </LocaleTransitionContext.Provider>
  );
}
