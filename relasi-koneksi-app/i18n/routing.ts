import { defineRouting } from "next-intl/routing";

/**
 * PRD Section 4.1: subpath routing /id and /en.
 * Default locale is Indonesian. NO automatic browser-language detection.
 */
export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
