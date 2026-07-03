import type { Locale } from "@/i18n/routing";

/**
 * Bilingual field helper for hardcoded data (PRD 4.1).
 * Picks the _en variant for English, otherwise the _id variant.
 */
export function pickLocale(locale: Locale, id: string, en: string | undefined): string {
  return locale === "en" && en ? en : id;
}
